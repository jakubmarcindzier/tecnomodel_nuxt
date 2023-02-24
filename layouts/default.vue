<template>
  <div>
    <lazy-hydrate when-visible>
      <main-navbar :categories="categories" />
    </lazy-hydrate>
    <lazy-hydrate when-visible>
      <main-header />
    </lazy-hydrate>
    <lazy-hydrate when-visible>
      <category-navbar
        v-if="$store.state.device.isDesktop"
        style="z-index: 1025"
        :categories="categories"
      />
    </lazy-hydrate>
    <nuxt />
    <back-to-top />
    <lazy-hydrate when-visible>
      <footer-custom />
    </lazy-hydrate>
    <cookie-policy-bar />
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { wishlistMixin } from '~/mixins/wishlistMixin'
import { cartMixin } from '~/mixins/cartMixin'

export default {
  name: 'DefaultLayout',
  components: {
    LazyHydrate,
    FooterCustom: () => import('@/components/FooterCustom'),
    MainNavbar: () => import('@/components/MainNavbar'),
    MainHeader: () => import('@/components/MainHeader'),
    CategoryNavbar: () => import('@/components/CategoryNavbar'),
  },
  mixins: [cartMixin, wishlistMixin],
  data() {
    return {
      categories: [],
    }
  },
  async fetch() {
    await this.getMegaMenu()
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted() {
    if (this.getCartItemsTotalQuantity() === null) this.setCartItemsList()
    if (this.$store.getters.isAuthenticated && this.getWishlistItem() === null)
      this.setWishlistItem()
  },
  methods: {
    async getMegaMenu() {
      await this.$axios
        .get('megamenu')
        .then((res) => {
          this.categories = res.data.categories
          // this.saveFile()
        })
        .catch((err) => {
          this.error = err
        })
    },
    async getStaticMegaMenu() {
      await this.$axios
        .get('http://localhost:3000/megamenu.json')
        .then((res) => {
          this.categories = res.data.categories
        })
        .catch((err) => {
          this.error = err
          return this.getMegaMenu()
        })
    },
    saveFile() {
      if (process.server)
        require('fs').writeFile(
          'static/megamenu.json',
          JSON.stringify({ categories: this.categories }),
          null
        )
    },
    handleScroll() {
      this.$store.commit('scroll/SET_PAGE_SCROLLED', window.scrollY > 0)
    },
  },
}
</script>
