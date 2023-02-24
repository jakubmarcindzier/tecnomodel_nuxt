<template>
  <b-badge
    class="text-white ml-2"
    :class="{
      'badge-dark': campaignName === 'BLACK FRIDAY',
      'badge-danger': promo && !campaignName,
      'main-background': !promo,
    }"
    >{{ discount }}%</b-badge
  >
</template>

<script>
export default {
  name: 'BadgeDiscount',
  props: {
    discount: {
      type: Number,
      default: null,
    },
    promo: {
      type: Boolean,
      default: false,
    },
    campaignName: {
      type: String,
      default: null,
    },
  },
}
</script>
