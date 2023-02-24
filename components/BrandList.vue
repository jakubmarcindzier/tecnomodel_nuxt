<template>
  <div style="display: flex">
    <div v-for="item in element" :key="item.id" class="p-4">
      <b-card
        class="border-0 rounded-0 py-0 p-2 bg-light"
        body-class="p-1 text-center"
        style="width: 200px"
      >
        <content-loader v-show="!item.name" width="144" height="50">
          <rect x="0" y="0" rx="3" ry="3" width="144" height="50" />
        </content-loader>
        <b-link
          v-show="item.name"
          class="text-dark text-decoration-none text-center"
          :to="'/p?brand' + item.name + '&id=' + item.id"
          :aria-label="item.name"
        >
          <nuxt-img
            v-if="!!item.logoImagePath"
            :src="item.logoImagePath"
            fit="contain"
            format="webp"
            quality="70"
            background="white"
            width="180"
            height="50"
            loading="lazy"
            :placeholder="
              require(`~/assets/img/product/image_not_available.png`)
            "
          />
        </b-link>
      </b-card>
    </div>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  name: 'BrandList',
  components: {
    ContentLoader,
  },
  data() {
    return {
      element: [{}, {}, {}, {}, {}, {}],
    }
  },
  mounted() {
    this.getBrand()
  },
  methods: {
    getBrand() {
      this.$axios
        .get('brand')
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
