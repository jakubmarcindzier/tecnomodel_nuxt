<template>
  <div>
    <b-list-group v-for="(item, key) in categoryList" :key="key" flush>
      <b-list-group-item
        class="py-2"
        :active="parseInt(categoryId) === parseInt(item.id)"
        :to="'/b/' + url(item.name) + '/' + item.id"
        >{{ item.name }}</b-list-group-item
      >
      <category-list
        class="px-3"
        :category-list="item.children"
        :category-id="categoryId"
        :prefix-url="url(item.name)"
      ></category-list>
    </b-list-group>
  </div>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'CategoryList',
  mixins: [urlMixin],
  props: {
    categoryList: {
      type: Array,
      default: null,
    },
    categoryId: {
      type: String,
      default: null,
    },
    prefixUrl: {
      type: String,
      default: null,
    },
  },
  methods: {
    url(name) {
      let prefix = ''
      if (this.prefixUrl) prefix = this.prefixUrl + '/'
      return prefix + this.toSeoUrl(name)
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
