<script setup>
import Home from "@/components/pages/Home.vue";
import {useAuthStore} from "@/stores/auth.js";
import LoginForm from "@/components/LoginForm.vue";
import AppHeader from "@/components/AppHeader.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import {storeToRefs} from "pinia";

const authStore = useAuthStore()
const {isAuthenticated} = storeToRefs(authStore)

</script>
<template>

  <div class="app-container">
    <LoadingOverlay/>
    <AppHeader/>
    <main>
      <LoginForm
          v-if="!isAuthenticated"/>
      <Home
          v-if="isAuthenticated">
      </Home>
    </main>
  </div>


</template>
