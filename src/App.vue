<script setup>
import Home from "@/components/pages/Home.vue";
import {useAuthStore} from "@/stores/auth.js";
import {ref} from "vue";
import LoginForm from "@/components/LoginForm.vue";
import AppHeader from "@/components/AppHeader.vue";
import DownloadModal from "@/components/modals/DownloadModal.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import {storeToRefs} from "pinia";

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const downloadVideo = ref()

</script>
<template>

  <div class="app-container">
    <LoadingOverlay/>

    <DownloadModal
        :video="downloadVideo"
        @close="downloadVideo = null"/>

    <AppHeader/>

    <main>
      <Home
          v-if="isAuthenticated"
          @download-video="downloadVideo = $event">
      </Home>
      <LoginForm
          v-else/>
    </main>
  </div>


</template>
