<template>
  <client-only>
    <b-alert
      :show="!accepting"
      class="position-fixed fixed-bottom m-0 rounded-0 border-0 black-transparent"
      fade
      style="z-index: 1800"
    >
      <span class="text-white"
        >Questo sito utilizza i cookies per garantire la migliore esperienza di
        navigazione.
      </span>
      <b-link v-b-modal.privacy>Cookie Policy</b-link>
      <b-button class="fa-pull-right" @click="accepted">Accetta</b-button>
    </b-alert>
  </client-only>
</template>

<script>
export default {
  name: 'CookiePolicyBar',
  data() {
    return {
      accepting: true,
    }
  },
  beforeMount() {
    if (!localStorage.cookiePolicyAccepted) this.accepting = false
  },
  methods: {
    accepted() {
      this.accepting = true
      localStorage.cookiePolicyAccepted = true
    },
  },
}
</script>

<style>
.black-transparent {
  background-color: rgba(40, 40, 40, 0.8) !important;
}
</style>
