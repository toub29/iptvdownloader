<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useContentStore } from '../stores/content'
import {ContentType} from "@/utils/constants.js";
import { storeToRefs } from 'pinia'

defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    required: true
  }
})

const contentStore = useContentStore()
const { selectedCategory, searchQuery } = storeToRefs(contentStore)
const searchInput = ref(null)

const focusSearch = () => {
  nextTick(() => {
    searchInput.value?.focus()
  })
}

onMounted(focusSearch)
</script>

<template>
  <div class="search-bar-inputs">
    <select v-model="selectedCategory" class="category-select">
      <option value="">All Categories</option>
      <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
        {{ cat.category_name }}
      </option>
    </select>
    <input
      ref="searchInput"
      v-model="searchQuery"
      type="text"
      :placeholder="`Search ${type === ContentType.MOVIES ? 'Movies' : 'Series'}...`"
    />
  </div>
</template>
