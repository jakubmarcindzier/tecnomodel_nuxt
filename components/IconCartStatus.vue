<template>
  <font-awesome-layers full-width class="fa-2x">
    <font-awesome-icon icon="shopping-cart" />
    <font-awesome-layers-text
      v-if="cartItemsTotalQuantity > 0"
      counter
      :value="cartItemsTotalQuantity"
      class="bg-primary border border-light font-weight-bold"
      style="font-size: 45px"
    />
  </font-awesome-layers>
</template>

<script>
export default {
  name: 'IconCartStatus',
  computed: {
    cartItemsTotalQuantity() {
      if (this.$store.getters['cart/getCartItemsTotalQuantity'] > 0)
        return this.$store.getters['cart/getCartItemsTotalQuantity']
      return 0
    },
  },
}
</script>
