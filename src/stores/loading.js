import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingMessage = ref('Loading...')

  function startLoading(message = 'Loading...') {
    isLoading.value = true
    loadingMessage.value = message
  }

  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  return { isLoading, loadingMessage, startLoading, stopLoading }
})
