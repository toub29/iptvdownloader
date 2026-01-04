<script setup>
import AppLogo from './AppLogo.vue'
import InstallPwa from './InstallPwa.vue'
import LogoutButton from './LogoutButton.vue'
import AccountInfoButton from './AccountInfoButton.vue'
import { useAuthStore } from '../stores/auth'
import {ContentType} from "@/utils/constants.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";

const contentStore = useContentStore()
const { activeTab } = storeToRefs(contentStore)

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<template>
  <header>
    <div class="header-left">
      <AppLogo />
      <InstallPwa />
      <div v-if="isAuthenticated" class="mobile-only">
        <AccountInfoButton />
        <LogoutButton />
      </div>
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
    <div class="header-right desktop-only" v-if="isAuthenticated">
      <AccountInfoButton />
      <LogoutButton />
    </div>
  </header>
</template>
