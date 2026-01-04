<script setup>
import {ref, onMounted} from 'vue'
import {XtreamService} from '../services/xtream'
import {useLoadingStore} from '../stores/loading'
import {useToast} from 'vue-toastification'
import DownloadModal from '@/components/modals/DownloadModal.vue'

const props = defineProps({
  series: {
    type: Object,
    required: true
  }
})

const loadingStore = useLoadingStore()
const toast = useToast()
defineEmits(['back'])

const episodes = ref({})
const error = ref(null)
const videoToDownload = ref(null)

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

const downloadEpisode = (episode) => {
  const extension = episode.container_extension || 'mp4'
  const url =  XtreamService.getInstance().getEpisodeDownloadUrl(episode.id, extension)
  videoToDownload.value = { url, name: episode.title };
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
            <button @click="downloadEpisode(episode)" class="download-btn">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- modal de telechargement series -->
  <DownloadModal :video="videoToDownload" @close="videoToDownload = null" />
</template>
