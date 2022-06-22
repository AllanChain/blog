<script setup lang="ts">
import { formatDate, formatLocalDate } from '@/utils'
defineProps<{
  createdAt: Date
  lastEditedAt: Date
}>()
</script>

<template>
  <div my-1 text-gray-800 select-none>
    <div
      :title="formatLocalDate(createdAt)"
      inline-flex
      items-center
      text-center
      mx-1
    >
      <div i-carbon-calendar mx-1></div>
      <div>{{ formatDate(createdAt) }}</div>
    </div>
    <div
      :title="formatLocalDate(lastEditedAt)"
      inline-flex
      items-center
      text-center
      mx-1
    >
      <div i-carbon-edit mx-1></div>
      <div>{{ formatDate(lastEditedAt) }}</div>
    </div>
  </div>
</template>
