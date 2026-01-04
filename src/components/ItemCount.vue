<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="item-count">
    {{ count }} items found
  </div>
</template>
