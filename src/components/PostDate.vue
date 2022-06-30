<script setup lang="ts">
import { formatDate, formatLocalDate } from '@/utils'
defineProps<{
  createdAt: Date
  lastEditedAt: Date
}>()
</script>

<template>
  <div my-1 text-gray-800 dark:text-gray-300 select-none>
    <div
      :title="formatLocalDate(createdAt)"
      inline-flex
      items-center
      text-center
    >
      <div i-mdi-calendar-month mr-1></div>
      <div>{{ formatDate(createdAt) }}</div>
    </div>
    <div inline-block w-3></div>
    <div
      :title="formatLocalDate(lastEditedAt)"
      inline-flex
      items-center
      text-center
    >
      <div i-mdi-calendar-edit mr-1></div>
      <div>{{ formatDate(lastEditedAt) }}</div>
    </div>
  </div>
</template>
