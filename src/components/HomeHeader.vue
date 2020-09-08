<template>
  <h2 class="home-header my-3 text-center indigo--text text--darken-2">
    <span class="home-header-text">
      <v-icon large class="home-header-swing-left">
        mdi-chevron-double-right
      </v-icon>
      <slot />
      <v-icon large class="home-header-swing-right">
        mdi-chevron-double-left
      </v-icon>
    </span>
  </h2>
</template>

<style lang="sass">
.home-header
  overflow: hidden

  &::before, &::after
    content: ""
    vertical-align: middle
    width: 50%
    display: inline-block
    border-bottom: 3px dotted slategray

  &::before
    margin-left: -50%

  &::after
    margin-right: -50%

$swing-distance-out : 9px
$swing-distance-in : 1px

@keyframes swing-left
  0%, 100%
    left: -$swing-distance-out
    color: slategray
  50%
    left: $swing-distance-in
    color: #303F9F

@keyframes swing-right
  0%, 100%
    right: -$swing-distance-out
    color: slategray
  50%
    right: $swing-distance-in
    color: #303F9F

.home-header-swing-left
  animation: swing-left 1.5s ease-in infinite
.home-header-swing-right
  animation: swing-right 1.5s ease-in infinite
</style>
