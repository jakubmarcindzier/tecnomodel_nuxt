export const state = () => ({
  cartItemsTotalQuantity: null,
  cartItemsList: [],
  cartTotalAmount: null,
})

export const getters = {
  getCartItemsTotalQuantity(state) {
    return state.cartItemsTotalQuantity
  },
  getCartItemsList(state) {
    return state.cartItemsList
  },
  getCartTotalAmount(state) {
    return state.cartTotalAmount
  },
}

export const mutations = {
  setCartItemsList(state, value) {
    state.cartItemsList = value
  },
  setCartItemsTotalQuantity(state, value) {
    state.cartItemsTotalQuantity = value
  },
  setCartTotalAmount(state, value) {
    state.cartTotalAmount = value
  },
}
