<script setup>
import { ref } from 'vue'
import { XtreamService } from '@/services/xtream.js'
import AccountInfoModal from './modals/AccountInfoModal.vue'
import { useLoadingStore } from '@/stores/loading'

const isModalOpen = ref(false)
const userInfo = ref(null)
const loadingStore = useLoadingStore()

const openModal = async () => {
  loadingStore.startLoading('Fetching account info...')
  userInfo.value = null

  try {
    const data = await XtreamService.getInstance().authenticate() // Re-authenticate to get fresh info
    userInfo.value = data.user_info
  }  finally {
    loadingStore.stopLoading()
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div>
    <button @click="openModal" class="account-info-btn" title="Account Information">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </button>

    <AccountInfoModal
      :is-open="isModalOpen"
      :user-info="userInfo"
      @close="closeModal"
    />
  </div>
</template>
