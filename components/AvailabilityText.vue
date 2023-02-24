<template>
  <span
    v-if="type"
    :class="[type, { small: small, 'font-weight-bold': strong }]"
    >{{ $t('availability.' + type) }}</span
  >
</template>

<script>
export default {
  name: 'AvailabilityText',
  props: {
    type: {
      type: String,
      default: null,
    },
    strong: {
      type: Boolean,
      default: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.outOfStock {
  color: #d9534f;
}

.inStock {
  color: #5cb85c;
}

.preorder {
  color: #0275d8;
}

.discontinued {
  color: #495057;
}
</style>
