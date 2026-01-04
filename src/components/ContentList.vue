<script setup>
import { ref, computed, watch } from 'vue'
import { useContentStore } from '../stores/content'
import {ContentType} from "@/utils/constants.js";
import {storeToRefs} from "pinia";

// Définition des propriétés (props) attendues par le composant
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true // 'movie' ou 'series'
  }
})

// Définition des événements émis par le composant
const emit = defineEmits(['download-movie', 'select-series'])

// Store pour l'état des filtres
const contentStore = useContentStore()
const { selectedCategory, searchQuery, activeTab } = storeToRefs(contentStore)

// --- LOGIQUE DE PAGINATION ---
const currentPage = ref(1)
const itemsPerPage = 50

// 1. D'abord, on filtre la liste complète selon la recherche et la catégorie
const filteredItems = computed(() => {
  if (!Array.isArray(props.items)) return []

  let result = props.items

  // Filtre par catégorie
  if (selectedCategory.value) {
    result = result.filter(item => item.category_id === selectedCategory.value)
  }

  // Filtre par recherche (texte)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.title && item.title.toLowerCase().includes(query))
    )
  }

  return result
})

// 2. On calcule le nombre total de pages nécessaires
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

// 3. On extrait seulement les items de la page courante pour l'affichage
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

// Si on change de filtre ou d'onglet, on revient à la première page
watch([searchQuery, selectedCategory, activeTab], () => {
  currentPage.value = 1
})

// Gestion du clic sur un élément
const handleAction = (item) => {
  if (props.type === ContentType.MOVIES) {
    emit('download-movie', item)
  } else {
    emit('select-series', item)
  }
}

// Utilitaires pour le template
const getTitle = (item) => item ? (item.name || item.title) : ''
const getIcon = (item) => item ? (item.stream_icon || item.cover) : ''

// Exposer les éléments filtrés pour que le parent puisse les compter
defineExpose({
  filteredItemCount: computed(() => filteredItems.value.length)
})

</script>

<template>
  <div class="content-list">
    <!-- Grille des éléments -->
    <div class="items-container">
      <div
        v-for="item in paginatedItems"
        :key="item.stream_id || item.series_id"
        class="item-card"
        @click="handleAction(item)"
      >
        <div class="poster-container">
          <img
            v-if="getIcon(item)"
            :src="getIcon(item)"
            :alt="getTitle(item)"
            loading="lazy"
            @error="$event.target.style.display='none'"
          />
          <div v-else class="no-poster">
            <span>{{ getTitle(item) }}</span>
          </div>
          <div class="overlay">
            <span class="action-icon">{{ type === ContentType.MOVIES ? '⬇️' : '📺' }}</span>
          </div>
        </div>
        <div class="item-title" :title="getTitle(item)">
          {{ getTitle(item) }}
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
      >Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >Next</button>
    </div>
  </div>
</template>
