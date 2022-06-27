<script lang="ts" setup>
import { BlogLabel } from '@data/types'
import { isDarkColor } from '@/utils'

defineProps<{
  label: BlogLabel
}>()
</script>

<template>
  <a
    :href="`/label/${label.id.replace(': ', '-')}/`"
    :style="
      label.type === 'series'
        ? { 'border-color': `#${label.color}`, color: `#${label.color}` }
        : { 'background-color': `#${label.color}` }
    "
    class="post-label px-1 mx-1 my-0.5 text-xs shadow-sm"
    :class="{
      'text-gray-100': isDarkColor(label.color),
      'text-gray-900': !isDarkColor(label.color),
      'rounded-full': ['tag', 'series'].includes(label.type),
      'rounded-md': ['blog'].includes(label.type),
      'border-1': ['series'].includes(label.type),
    }"
  >
    <div
      :class="{
        'i-carbon-assembly-cluster': label.type === 'blog',
        'i-carbon-tag': label.type === 'tag',
        'i-carbon-bookmark': label.type === 'series',
      }"
    ></div>
    <div class="px-1 py-0.5">{{ label.name }}</div>
  </a>
</template>

<style>
.post-label {
  display: inline-flex;
  position: relative;
  color: current;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  align-items: center;
}
/* Making a slight color change on hover, inspired by Vuetify */
.post-label::before {
  background-color: currentColor;
  border-radius: inherit;
  bottom: 0;
  content: '';
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
}
.post-label:hover::before {
  opacity: 0.1;
}
</style>
