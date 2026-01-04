<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  userInfo: Object
})

const emit = defineEmits(['close'])

const formattedUserInfo = computed(() => {
  const info = props.userInfo
  const formatted = {
    'Username': info.username,
    'Status': info.status,
    'Expiration Date': info.exp_date ? new Date(info.exp_date * 1000).toLocaleDateString() : 'N/A',
    'Active Connections': `${info.active_cons}/${info.max_connections}`,
    'Is Trial': info.is_trial === '1' ? 'Yes' : 'No',
    'Created At': info.created_at ? new Date(info.created_at * 1000).toLocaleDateString() : 'N/A',
  }
  return Object.entries(formatted)
})
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content account-info-modal">
      <h3>Account Information</h3>
      <table>
        <tbody>
          <tr v-for="[key, value] in formattedUserInfo" :key="key">
            <th>{{ key }}</th>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>

      <button @click="emit('close')" class="close-btn">Close</button>
    </div>
  </div>
</template>
