<script setup>
import {ref, watch} from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import ItemCount from '@/components/ItemCount.vue'
import ContentList from '@/components/ContentList.vue'
import { ContentType } from "@/utils/constants.js";
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";

defineProps({
  movieCategories: Array,
  seriesCategories: Array,
  movies: Array,
  series: Array,
})

const emit = defineEmits(['select-series'])

const contentStore = useContentStore()
const { activeTab } = storeToRefs(contentStore)

const contentListRef = ref(null)
const showFilters = ref(true)

watch(activeTab, () => {
  contentStore.resetFilters()
})

const handleScroll = (event) => {
  // On affiche les filtres uniquement si on est à moins de 50px du haut
  showFilters.value = event.target.scrollTop < 50
}
</script>

<template>
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
        @select-series="emit('select-series', $event)"
    />
  </div>
</template>
