<script setup>
import {logEvent} from "firebase/analytics";
import {analytics} from "@/firebase.js";

const props = defineProps({
  video: {
    type: Object,
    required: false,
  },
});

defineEmits(['close']);
const logevent = () =>{
  logEvent(analytics, 'file_download', {
    file_name: props.video.name
  });
}
</script>

<template>
  <div v-if="video" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h3>Lien de téléchargement</h3>
      <p>
        Pour télécharger, faites un <strong>clic droit</strong> sur le lien ci-dessous et choisissez
        "<strong>Enregistrer le lien sous...</strong>". Les liens en HTTP peuvent générer des alertes de sécurité
        liées à votre navigateur.
      </p>
      <div class="link-container">
        <a :href="video.url" target="_blank"  @contextmenu="logevent()" rel="noopener">{{ video.name }}</a>
      </div>
      <button @click="$emit('close')" class="close-btn">Fermer</button>
    </div>
  </div>
</template>
