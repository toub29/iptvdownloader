import {defineStore} from 'pinia'
import {ref} from 'vue'
import {ContentType} from "@/utils/constants.js";

export const useContentStore = defineStore('content', () => {
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const activeTab = ref(ContentType.MOVIES)
    const selectedSeries = ref(null)

    // Action pour réinitialiser les filtres
    const resetFilters = () => {
        selectedSeries.value = null
        searchQuery.value = ''
        selectedCategory.value = ''
    }

    return {
        searchQuery: searchQuery,
        selectedCategory: selectedCategory,
        activeTab: activeTab,
        selectedSeries: selectedSeries,
        resetFilters: resetFilters
    }
})
