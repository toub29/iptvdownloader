<script setup>
import {useLoadingStore} from '../stores/loading'
import {useAuthStore} from '../stores/auth'
import {storeToRefs} from 'pinia'
import {useToast} from 'vue-toastification'
import {XtreamService} from "@/services/xtream.js";


const loadingStore = useLoadingStore()
const {isLoading} = storeToRefs(loadingStore)
const authStore = useAuthStore()
const {credentials, isAuthenticated} = storeToRefs(authStore)
const toast = useToast()

const handleSubmit = async () => {
  loadingStore.startLoading('Connecting...')
  await XtreamService.getInstance().authenticate()
      .then(_ => isAuthenticated.value = true)
      .catch(e => {
        toast.error(e.message)
        loadingStore.stopLoading()
      })
}
</script>

<template>
  <div class="login-container">
    <div class="intro-text">
      <h2>Bieservicenvenue sur IPTV Downloader</h2>
      <p>
        Cet outil vous permet de vous connecter à votre abonnement IPTV (via l'API Xtream Codes)
        pour parcourir et télécharger facilement vos films et séries.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label>URL</label>
        <input v-model="credentials.url" type="text" placeholder="http://iptv-provider.com:80" required
               autocomplete="url"/>
      </div>

      <div class="form-group">
        <label>Username</label>
        <input v-model="credentials.username" type="text" required autocomplete="username"/>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="credentials.password" type="password" required autocomplete="current-password"/>
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Connecting...' : 'Connect' }}
      </button>
    </form>

    <div class="privacy-note">
      <p>
        🔒 <strong>Confidentialité & Sécurité :</strong> Vos identifiants transitent de manière sécurisée via un serveur
        relais uniquement pour établir la connexion technique avec votre fournisseur IPTV.
      </p>
      <p class="tech-details">
        Ce relais est nécessaire car les navigateurs modernes bloquent les requêtes depuis un site sécurisé (HTTPS) vers
        un service non sécurisé (HTTP), ce qui est fréquent chez les fournisseurs IPTV.
        <br>
        <a href="https://developer.mozilla.org/fr/docs/Web/Security/Mixed_content" target="_blank"
           rel="noopener noreferrer">
          En savoir plus sur le contenu mixte (MDN Web Docs)
        </a>
      </p>
      <p>
        Aucune donnée personnelle n'est stockée ou conservée sur nos serveurs.
      </p>
    </div>

    <p class="legal-warning">
      IPTVdownloader est destiné à un usage personnel avec des abonnements IPTV légaux. Le téléchargement de contenu
      protégé par des droits d'auteur sans autorisation est illégal. Assurez-vous de respecter les lois en vigueur dans
      votre pays.
    </p>
  </div>
</template>
