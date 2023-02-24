<template>
  <h6>
    <b-badge v-if="campaignName" variant="warning">
      <span class="text-dark">{{ campaignName }}</span>
    </b-badge>
  </h6>
</template>

<script>
export default {
  name: 'LabelDiscount',
  props: {
    campaignName: {
      type: String,
      default: null,
    },
  },
}
</script>
