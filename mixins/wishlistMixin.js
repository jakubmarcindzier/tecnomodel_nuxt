export const wishlistMixin = {
  data() {
    return {
      wishlistError: null,
    }
  },
  methods: {
    getWishlistItem() {
      return this.$store.getters['wishlist/getWishlistItem']
    },
    setWishlistItem() {
      return this.$axios
        .get('wishlist')
        .then((res) => {
          this.$store.commit('wishlist/setWishlistItem', res.data)
        })
        .catch((err) => {
          this.wishlistError = err
        })
    },
    addWishlist(itemId) {
      return this.$axios
        .post('wishlist', {
          itemId,
        })
        .then((res) => {
          if (res.data.success) this.setWishlistItem()
        })
        .catch((err) => {
          this.wishlistError = err
        })
    },
    deleteWishlist(itemId) {
      return this.$axios
        .delete(`wishlist/${itemId}`)
        .then((res) => {
          if (res.data.success) this.setWishlistItem()
        })
        .catch((err) => {
          this.wishlistError = err
        })
    },
    toggleWishlist(itemId) {
      if (this.wishlist(itemId)) this.deleteWishlist(itemId)
      else this.addWishlist(itemId)
    },
    wishlist(itemId) {
      return (
        this.$store.getters.isAuthenticated &&
        this.getWishlistItem() &&
        this.getWishlistItem().find((x) => x.itemId === itemId)
      )
    },
  },
}
