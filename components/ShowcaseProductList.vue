<template>
  <div style="display: flex">
    <div v-for="item in element" :key="item.itemId">
      <b-card class="border-0 py-0 px-2 mt-2 mb-2" body-class="p-1 text-center">
        <showcase-product
          :item-id="item.itemId"
          :brand="item.brand"
          :code="item.code"
          :name="item.name"
          :sell-price="item.sellPrice"
          :list-price="item.listPrice"
          :discount="item.discount"
          :discount-thru-date="item.discountThruDate"
          :availability="item.availability"
          :image-path="item.thumbImagePath"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowcaseProductList',
  props: {
    shownProductsNumber: {
      type: Number,
      default: 6,
    },
    filter: {
      type: String,
      default: 'showcase',
    },
    endPoint: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      element: [{}, {}, {}, {}, {}, {}],
    }
  },
  computed: {
    getEndPoint() {
      if (this.endPoint) return this.endPoint
      return `item?filter=${this.filter}&limit=${this.shownProductsNumber}`
    },
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    getProducts() {
      this.$axios
        .get(this.getEndPoint)
        .then((res) => {
          this.element = res.data
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>
