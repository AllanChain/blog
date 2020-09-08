<template>
  <h2 class="home-header my-3 text-center indigo--text text--darken-2">
    <span class="home-header-text">
      <v-icon large>
        mdi-chevron-double-right
      </v-icon>
      <slot />
      <v-icon large>
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

</style>
