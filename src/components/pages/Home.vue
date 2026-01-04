<script setup>
import {computed, onMounted, shallowRef} from 'vue'
import {useToast} from 'vue-toastification'
import SeriesDetail from '@/components/SeriesDetail.vue'
import {ContentType} from "@/utils/constants.js";
import {XtreamService} from "@/services/xtream.js";
import {useLoadingStore} from "@/stores/loading.js";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from 'pinia'
import VideoGlobal from "@/components/VideoGlobal.vue";

const toast = useToast()
const loadingStore = useLoadingStore()
const contentStore = useContentStore()

const {activeTab, selectedSeries} = storeToRefs(contentStore)

// Données
const movies = shallowRef([])
const series = shallowRef([])
const movieCategories = shallowRef([])
const seriesCategories = shallowRef([])

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

// - est ce qu'on est sur le panel detail d'une serie
const isDetail = computed(() => {
  return selectedSeries.value !== null && activeTab.value === ContentType.SERIES
})

const selectSeries = (item) => {
  selectedSeries.value = item
}
</script>

<template>
  <div class="content-area">
    <template v-if="isDetail">
      <SeriesDetail
          :series="selectedSeries"
          @back="selectedSeries = null"
      />
    </template>
    <template v-else>
      <VideoGlobal
          :movie-categories="movieCategories"
          :series-categories="seriesCategories"
          :movies="movies"
          :series="series"
          @select-series="selectSeries"
      />
    </template>

  </div>
</template>
