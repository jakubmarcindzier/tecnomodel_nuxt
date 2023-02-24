<template>
  <b-link
    v-if="slideBarToggle"
    v-b-toggle="cartSidebarId"
    v-b-popover.hover.bottomleft="cartPopoverText"
    @click="resetCartResult"
  >
    <icon-cart-status />
  </b-link>
  <b-link v-else to="/cart">
    <icon-cart-status />
  </b-link>
</template>

<script>
export default {
  name: 'CartSidebarLink',
  props: {
    slideBarToggle: Boolean,
  },
  computed: {
    cartSidebarId() {
      if (this.$store.getters['cart/getCartItemsTotalQuantity'] > 0)
        return 'cart-sidebar'
      return ''
    },
    cartPopoverText() {
      if (this.$store.getters['cart/getCartItemsTotalQuantity'] > 0) return ''
      return 'Il tuo carrello è vuoto'
    },
  },
  methods: {
    resetCartResult() {
      this.$root.$emit('cart')
    },
  },
}
</script>
