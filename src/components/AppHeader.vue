<script setup>
import AppLogo from './AppLogo.vue'
import InstallPwa from './InstallPwa.vue'
import { useAuthStore } from '../stores/auth'
import {ContentType} from "@/utils/constants.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";

const contentStore = useContentStore()
const { activeTab } = storeToRefs(contentStore)

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const handleLogout = () => {
  // On demande confirmation avant de déconnecter
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
  }
}
</script>

<template>
  <header>
    <div class="header-left">
      <AppLogo
        @click="isAuthenticated && handleLogout()"
        :class="{ 'logout-logo': isAuthenticated }"
      />
      <InstallPwa />
    </div>
    <nav v-if="isAuthenticated">
      <button
        :class="{ active: activeTab === ContentType.MOVIES }"
        @click="activeTab = ContentType.MOVIES"
      >Movies</button>
      <button
        :class="{ active: activeTab === ContentType.SERIES }"
        @click="activeTab = ContentType.SERIES"
      >Series</button>
    </nav>
  </header>
</template>

<style scoped>
</style>
