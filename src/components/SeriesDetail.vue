<script setup>
import {ref, onMounted} from 'vue'
import {XtreamService} from '../services/xtream'
import {useLoadingStore} from '../stores/loading'
import {useToast} from 'vue-toastification'


const props = defineProps({
  series: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'download-episode'])
const episodes = ref({})
const error = ref(null)
const loadingStore = useLoadingStore()
const toast = useToast()

onMounted(async () => {
  loadingStore.startLoading('Loading episodes...')
  await XtreamService.getInstance().getSeriesInfo(props.series.series_id)
      .then(data => {
        error.value = null
        episodes.value = data.episodes || {}
      })
      .catch(_ => {
        error.value = 'Failed to load episodes'
        toast.error(error.value)
      })
      .finally(() => loadingStore.stopLoading())
})

const handleDownload = (episode) => {
  emit('download-episode', episode)
}
</script>

<template>
  <div class="series-detail">
    <div class="header">
      <button @click="$emit('back')" class="back-btn">&larr; Back to Series</button>
      <h2>{{ series.name }}</h2>
    </div>

    <div v-if="!error" class="seasons-container">
      <div v-for="(seasonEpisodes, seasonNum) in episodes" :key="seasonNum" class="season">
        <h3>Season {{ seasonNum }}</h3>
        <div class="episodes-list">
          <div v-for="episode in seasonEpisodes" :key="episode.id" class="episode-card">
            <div class="episode-info">
              <span class="episode-num">E{{ episode.episode_num }}</span>
              <span class="episode-title">{{ episode.title }}</span>
            </div>
            <button @click="handleDownload(episode)" class="download-btn">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
