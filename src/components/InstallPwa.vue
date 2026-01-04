<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)
const showInstallButton = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e
    // Update UI to notify the user they can add to home screen
    showInstallButton.value = true
  })

  window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt.value = null
    showInstallButton.value = false
    console.log('PWA was installed')
  })
})

const installPwa = async () => {
  if (!deferredPrompt.value) {
    return
  }
  // Show the prompt
  deferredPrompt.value.prompt()
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice
  console.log(`User response to the install prompt: ${outcome}`)
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt.value = null
  showInstallButton.value = false
}
</script>

<template>
  <button
    v-if="showInstallButton"
    @click="installPwa"
    class="install-button"
    title="Install App"
  >
    <span class="icon">📱</span>
    <span class="text">Install App</span>
  </button>
</template>
