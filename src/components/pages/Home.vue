<script setup>
import {computed, onMounted, ref, shallowRef, watch} from 'vue'
import {useToast} from 'vue-toastification'
import ItemCount from '@/components/ItemCount.vue'
import ContentList from '@/components/ContentList.vue'
import SeriesDetail from '@/components/SeriesDetail.vue'
import {ContentType} from "@/utils/constants.js";
import {XtreamService} from "@/services/xtream.js";
import {useLoadingStore} from "@/stores/loading.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from 'pinia'
import SearchBar from "@/components/SearchBar.vue";

const toast = useToast()
const loadingStore = useLoadingStore()
const contentStore = useContentStore()

const {activeTab, selectedSeries} = storeToRefs(contentStore)
const emit = defineEmits(['download-video'])

// Données
const movies = shallowRef([])
const series = shallowRef([])
const movieCategories = shallowRef([])
const seriesCategories = shallowRef([])
const contentListRef = ref(null)
const showFilters = ref(true)

// Chargement des données (films, séries, catégories)
onMounted(async () => {
  loadingStore.startLoading('Loading content...')
  try {
    const service = XtreamService.getInstance()
    const results = await Promise.allSettled([
      service.getMovies(),
      service.getSeries(),
      service.getMovieCategories(),
      service.getSeriesCategories()
    ])

    const resourceNames = ['Movies', 'Series', 'Movie Categories', 'Series Categories'];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        switch (index) {
          case 0:
            movies.value = result.value;
            break;
          case 1:
            series.value = result.value;
            break;
          case 2:
            movieCategories.value = result.value;
            break;
          case 3:
            seriesCategories.value = result.value;
            break;
        }
      } else {
        toast.error(`Failed to load ${resourceNames[index]}`)
      }
    })
  } catch (e) {
    toast.error('A critical error occurred while loading content.')
  } finally {
    loadingStore.stopLoading()
  }
})

// Réinitialise les filtres et la sélection de série quand on change d'onglet
watch(activeTab, () => {
  contentStore.resetFilters()
})

// - est ce qu'on est sur le detail d'une serie
const isSerieDetailPanel = computed(() => {
  return selectedSeries.value !== null && activeTab.value === ContentType.SERIES
})

const downloadMovie = (movie) => {
  const extension = movie.container_extension || 'mp4'
  const url =  XtreamService.getInstance().getMovieDownloadUrl(movie.stream_id, extension)
  triggerDownload(url, movie.name)
}

const downloadEpisode = (episode) => {
  const extension = episode.container_extension || 'mp4'
  const url =  XtreamService.getInstance().getEpisodeDownloadUrl(episode.id, extension)
  triggerDownload(url, episode.title)
}

// Affiche la modale avec l'URL de téléchargement
const triggerDownload = (url, name = '') => {
  emit("download-video", {'url': url, 'name': name});
}

const selectSeries = (item) => {
  selectedSeries.value = item
}

const handleScroll = (event) => {
  // On affiche les filtres uniquement si on est à moins de 50px du haut
  showFilters.value = event.target.scrollTop < 50
}

</script>

<template>
  <div class="content-area">
    <template v-if="isSerieDetailPanel">
      <SeriesDetail
          :series="selectedSeries"
          @back="selectedSeries = null"
          @download-episode="downloadEpisode"
      />
    </template>
    <template v-else>
      <div class="search-bar-container" :class="{ 'hidden': !showFilters }">
        <div class="search-bar">
          <SearchBar
              :type="activeTab"
              :categories="activeTab === ContentType.MOVIES ? movieCategories : seriesCategories"
          />
          <ItemCount :count="contentListRef?.filteredItemCount || 0"/>
        </div>
      </div>
      <div class="scroll-container" @scroll="handleScroll">
        <ContentList
            ref="contentListRef"
            :type="activeTab"
            :items="activeTab === ContentType.MOVIES ? movies : series"
            @download-movie="downloadMovie"
            @select-series="selectSeries"
        />
      </div>
    </template>

  </div>
</template>
