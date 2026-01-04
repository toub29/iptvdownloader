<script setup>
import { useLoadingStore } from '../stores/loading'
import { storeToRefs } from 'pinia'

const loadingStore = useLoadingStore()
const { isLoading, loadingMessage } = storeToRefs(loadingStore)
</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <div class="message">{{ loadingMessage }}</div>
  </div>
</template>

<style scoped>
</style>
