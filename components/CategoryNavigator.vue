<template>
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1 main-background" role="tab">
        <b-button
          v-b-toggle.category
          block
          variant="link"
          class="text-decoration-none text-white text-left"
          >Categorie
          <font-awesome-icon icon="chevron-down" class="ml-2 text-right"
        /></b-button>
      </b-card-header>
      <b-collapse id="category" :visible="categoryId > 0" role="tabpanel">
        <b-card-body>
          <category-list
            :category-list="category"
            :category-id="categoryId"
          ></category-list>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'CategoryNavigator',
  props: {
    categoryId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      category: [],
    }
  },
  async fetch() {
    await this.getCategory()
  },
  watch: {
    categoryId(newValue) {
      // eslint-disable-next-line vue/no-mutating-props
      this.categoryId = newValue
      this.getCategory()
    },
  },
  methods: {
    async getCategory() {
      let endpoint = 'category'
      if (this.categoryId) endpoint += `/${this.categoryId}`
      await this.$axios.get(endpoint).then((response) => {
        this.category = response.data
      })
    },
  },
}
</script>
