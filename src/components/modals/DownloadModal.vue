<script setup>
defineProps({
  video: {
    type: Object,
    required: false,
  },
});

defineEmits(['close']);
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
        <a :href="video.url" target="_blank"  rel="noopener">{{ video.name }}</a>
      </div>
      <button @click="$emit('close')" class="close-btn">Fermer</button>
    </div>
  </div>
</template>
