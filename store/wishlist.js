export const state = () => ({
  wishlistItem: null,
})

export const getters = {
  getWishlistItem(state) {
    return state.wishlistItem
  },
}

export const mutations = {
  setWishlistItem(state, value) {
    state.wishlistItem = value
  },
}

/* export const actions = {
  async nuxtServerInit({ commit }) {
    const data = await this.$axios.$get('wishlist')
    commit('setWishlistItem', data.data)
  }
} */
