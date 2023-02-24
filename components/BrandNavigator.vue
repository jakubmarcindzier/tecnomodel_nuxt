<template>
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1 main-background" role="tab">
        <b-button
          v-b-toggle.brand
          block
          variant="link"
          class="text-decoration-none text-white text-left"
          >Produttori
          <font-awesome-icon icon="chevron-down" class="ml-2 text-right"
        /></b-button>
      </b-card-header>
      <b-collapse id="brand" visible role="tabpanel">
        <b-card-body>
          <b-list-group v-for="(item, key) in brandList" :key="key" flush>
            <b-list-group-item
              :active="brandId === item.id"
              :to="getUrl(item.id, item.name)"
              class="d-flex justify-content-between align-items-center py-1"
              >{{ item.name }}
              <b-badge variant="primary" pill>{{ item.itemsNumber }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'BrandNavigator',
  mixins: [urlMixin],
  props: {
    brandId: {
      type: String,
      default: null,
    },
    categoryId: {
      type: String,
      default: null,
    },
    search: {
      type: String,
      default: null,
    },
    filter: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      brandList: [],
    }
  },
  async fetch() {
    await this.getBrand()
  },
  watch: {
    categoryId(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.categoryId = newValue
      this.getBrand()
    },
    search(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.search = newValue
      this.getBrand()
    },
    filter(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.filter = newValue
      this.getBrand()
    },
    brandId(value) {
      this.emitBrandName(value)
    },
  },
  methods: {
    url(name) {
      let prefix = ''
      if (this.prefixUrl) prefix = this.toSeoUrl(this.prefixUrl) + '/'
      return prefix + this.toSeoUrl(name)
    },
    async getBrand() {
      let endpoint = 'brand'
      if (this.categoryId) endpoint += `?categoryId=${this.categoryId}`
      if (this.search) endpoint += `?search=${this.search}`
      if (this.filter) endpoint += `?filter=${this.filter}`
      await this.$axios.get(endpoint).then((response) => {
        this.brandList = response.data
        if (this.brandId) this.emitBrandName(this.brandId)
      })
    },
    getUrl(id, name) {
      let result = '?'
      if (this.search) result += 'search=' + this.search + '&'
      result += 'brand=' + name + '&id=' + id
      return result
    },
    emitBrandName(brandId) {
      this.brandList.forEach(
        function (element) {
          if (element.id === brandId)
            return this.$emit('brandName', element.name)
        }.bind(this)
      )
    },
  },
}
</script>

<style>
.list-group .active {
  background-color: rgba(255, 153, 0, 1);
  text-decoration: none;
  border-color: rgba(255, 153, 0, 1);
}
</style>
