<script lang="ts" setup>
import { BlogLabel } from '@data'

defineProps<{
  label: BlogLabel
}>()
</script>

<template>
  <div
    :style="{ 'background-color': `#${label.color}` }"
    class="inline-flex items-center px-1 mx-1"
    cursor="pointer"
    select="none"
    text="sm"
    hover="opacity-90"
    border="rounded-full"
    shadow="sm"
  >
    <div
      :class="{
        'i-carbon-assembly-cluster': label.type === 'blog',
        'i-carbon-tag': label.type === 'tag',
        'i-carbon-bookmark': label.type === 'series',
      }"
    ></div>
    <div class="px-1 pb-0.5 pt-0.2">{{ label.name }}</div>
  </div>
</template>
