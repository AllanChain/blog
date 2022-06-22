<script lang="ts" setup>
defineProps<{
  lazySrc: string
  src: string
  width: number
  height: number
  alt?: string
}>()
</script>

<template>
  <div class="lqip blur" :style="{ 'background-image': `url(${lazySrc})` }">
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      onload="this.parentNode.classList.remove('blur')"
    />
  </div>
</template>

<style>
.lqip {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-size: 0 0;
  background-repeat: no-repeat;
  display: inline-block;
  transition: opacity 1s ease-in-out;
}

.lqip::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: inherit;
  z-index: 1;
  background-image: inherit;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(10px);
}

.lqip.blur::after {
  opacity: 1;
}

.lqip.blur img {
  opacity: 0;
}

.lqip img {
  transition: inherit;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
