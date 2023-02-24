<template>
  <b-breadcrumb class="bg-white border main-color">
    <b-breadcrumb-item v-if="home" to="/">
      <font-awesome-icon icon="home" class="main-color"></font-awesome-icon>
    </b-breadcrumb-item>
    <b-breadcrumb-item
      v-for="(row, id) in category"
      :key="id"
      :to="'/b/' + row.path + '/' + row.id"
      :active="!addActiveLink && id === Object.keys(category).length - 1"
      >{{ row.name }}</b-breadcrumb-item
    >
    <template v-if="customItems">
      <b-breadcrumb-item
        v-for="(row, id) in customItems"
        :key="id"
        :to="row.to"
        :active="!addActiveLink && id === Object.keys(customItems).length - 1"
        >{{ row.text }}</b-breadcrumb-item
      >
    </template>
    <b-breadcrumb-item v-if="addActiveLink" active>
      {{ addActiveLink }}
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'BreadcrumbComponent',
  mixins: [urlMixin],
  props: {
    home: {
      type: Boolean,
      default: true,
    },
    categoryId: {
      type: String,
      default: null,
    },
    addActiveLink: {
      type: String,
      default: '',
    },
    customItems: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      category: [],
    }
  },
  async fetch() {
    if (this.categoryId) await this.getBreadcrumb()
  },
  watch: {
    categoryId(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.categoryId = newValue
      this.getBreadcrumb()
    },
  },
  methods: {
    async getBreadcrumb() {
      await this.$axios
        .get(`breadcrumb/${this.categoryId}`)
        .then((response) => {
          this.category = this.addPathName(response.data)
          this.emitCategoryList(this.category)
        })
    },
    addPathName(category) {
      const result = []
      let path = ''
      for (const row of category) {
        path += this.toSeoUrl(row.name)
        result.push({
          id: row.id,
          name: row.name,
          path,
        })
        path += '/'
      }
      return result
    },
    emitCategoryList(list) {
      this.$emit('categoryList', list)
    },
  },
}
</script>

<style>
a {
  color: rgba(255, 153, 0, 1);
}

a:hover {
  text-decoration: none !important;
  color: grey;
}
</style>
