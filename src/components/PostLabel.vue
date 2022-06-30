<script lang="ts" setup>
import { BlogLabel } from '@data/types'
import { isDarkColor, prefixLink } from '@/utils'

defineProps<{
  label: BlogLabel
  size?: number
  showRef?: boolean
}>()
</script>

<template>
  <a
    :href="prefixLink(`label/${label.id.replace(': ', '-')}/`)"
    :style="[
      { 'background-color': `#${label.color}` },
      {
        'font-size': `${size ?? 0.75}rem`,
        'line-height': '1.5em',
      },
    ]"
    class="post-label px-0.3em mx-0.3em my-0.3em text-xs shadow-sm rounded-md"
    :class="{
      'text-gray-100': isDarkColor(label.color),
      'text-gray-900': !isDarkColor(label.color),
      // 'rounded-full': ['tag', 'series'].includes(label.type),
      // 'rounded-md': ['blog'].includes(label.type),
      // 'border-1': ['series'].includes(label.type),
    }"
  >
    <div
      :class="{
        'i-carbon-assembly-cluster': label.type === 'blog',
        'i-carbon-tag': label.type === 'tag',
        'i-carbon-bookmark': label.type === 'series',
      }"
    ></div>
    <div class="px-1 py-0.5">
      <span>{{ label.name }}</span>
    </div>
    <div
      v-if="showRef"
      position="absolute top--0.7em right--0.7em"
      class="min-w-1.5em h-1.5em"
      border="rounded-full 2 gray-100 dark:gray-900"
      flex
      items-center
      justify-evenly
      :style="{ 'background-color': `#${label.color}`, 'font-size': `0.75em` }"
    >
      {{ label.reference }}
    </div>
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
