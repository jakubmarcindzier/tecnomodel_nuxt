<template>
  <span v-if="date">{{ getFormattedDate }}</span>
</template>

<script>
import moment from 'moment'

export default {
  name: 'FormatDate',
  props: {
    date: {
      type: String,
      default: null,
    },
    format: {
      type: String,
      default: 'DD/MM/YYYY hh:mm',
    },
    countryId: {
      type: String,
      default: null,
    },
  },
  computed: {
    getFormattedDate() {
      return moment(this.date).format(this.format)
    },
  },
}
</script>
