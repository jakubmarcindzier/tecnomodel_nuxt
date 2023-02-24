<template>
  <span :class="{ strike: strike, 'font-weight-bold': bold }"
    >{{ getFormattedCurrency() }}
    <span
      v-if="amount === 0 && showTextAtZero"
      class="text-success font-weight-bold"
    >
      {{ text }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'PriceComponent',
  props: {
    amount: {
      type: [Number, String],
      default: 0,
    },
    hideZero: {
      type: Boolean,
      default: false,
    },
    showTextAtZero: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'GRATIS',
    },
    strike: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lang: null,
      currency: null,
    }
  },
  beforeMount() {
    this.lang = 'IT'
    this.currency = 'EUR'
  },
  methods: {
    // TODO take lang and currency dynamically
    getFormattedCurrency() {
      if (this.amount === null) return ''
      let amount = this.amount
      if (typeof amount === 'string' || amount instanceof String)
        amount = parseFloat(amount)
      if (amount === 0 && this.hideZero) return ''
      return amount.toLocaleString('IT', {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
      })
    },
  },
}
</script>

<style>
.strike {
  text-decoration: line-through;
}
</style>
