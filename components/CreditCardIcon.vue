<template>
  <img style="height: 25px" :src="imageSource" :alt="name" />
</template>

<script>
export default {
  name: 'CreditCardIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  computed: {
    imageSource() {
      try {
        return require(`~/assets/img/credit_card_type_logo/${this.name}.svg`)
      } catch (e) {
        return require(`~/assets/img/credit_card_type_logo/generic.svg`)
      }
    },
  },
}
</script>
