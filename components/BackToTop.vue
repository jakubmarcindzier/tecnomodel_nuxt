<template>
  <b-button
    id="back-to-top"
    size="lg"
    :class="{ 'hidden-element': !hasScrolled }"
    class="main-background-transparent border-0 back-to-top"
    title="Click to return on the top page"
    data-toggle="tooltip"
    data-placement="left"
    @click="scrollToTop"
  >
    <font-awesome-icon icon="arrow-up" />
  </b-button>
</template>

<script>
export default {
  name: 'BackToTop',
  components: {},
  data() {
    return {}
  },
  computed: {
    hasScrolled() {
      return this.$store.getters['scroll/hasPageScrolled']
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style>
/* Back to Top */
.back-to-top {
  z-index: 1019;
  position: fixed;
  bottom: 15px;
  right: 15px;
}
</style>
