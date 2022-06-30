<script lang="ts">
  import { onMount } from 'svelte'

  export let src: string
  export let lazySrc: string
  export let width: number
  export let height: number
  export let alt: string = undefined

  let image: HTMLImageElement
  let blur = true

  onMount(() => {
    if (image.complete) {
      blur = false
    } else {
      // The blur removal works fine when serve from local
      // even if setting network throttles.
      // But it doesn't work fine in production page.
      // Let's double check it here.
      setTimeout(() => {
        if (image.complete) blur = false
      }, 1000)
    }
  })

  if (import.meta.env.DEV) {
    setInterval(() => {
      if (image && image.complete) {
        image.parentElement.classList.remove('blur')
      }
    }, 5000)
  }
</script>

<div
  class:lqip={true}
  class:blur
  style:background-image={`url(${lazySrc})`}
  style:aspect-ratio={`${width} / ${height}`}
  {...$$props}
>
  <img
    {src}
    {alt}
    {width}
    {height}
    bind:this={image}
    onload={() => {
      blur = false
    }}
  />
</div>

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
