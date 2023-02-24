export const cartMixin = {
  methods: {
    setCartItemsList() {
      if (
        !this.$store.state.auth.loggedIn &&
        !localStorage.getItem('cartGuestKey')
      ) {
        this.$store.commit('cart/setCartItemsList', [])
        this.calculateCartItemsTotalQuantity()
        this.calculateCartTotalAmount()
      } else {
        let endPoint = 'cart'
        if (localStorage.getItem('cartGuestKey'))
          endPoint += '?guestKey=' + localStorage.getItem('cartGuestKey')
        return this.$axios
          .get(endPoint)
          .then((res) => {
            this.$store.commit('cart/setCartItemsList', res.data)
            this.calculateCartItemsTotalQuantity()
            this.calculateCartTotalAmount()
          })
          .catch((err) => {
            this.error = err
          })
      }
    },
    getCartItemsList() {
      return this.$store.getters['cart/getCartItemsList']
    },
    calculateCartItemsTotalQuantity() {
      let itemCount = 0
      for (const item of this.getCartItemsList()) {
        itemCount += parseInt(item.quantity)
      }
      this.$store.commit('cart/setCartItemsTotalQuantity', itemCount)
    },
    getCartItemsTotalQuantity() {
      return this.$store.getters['cart/getCartItemsTotalQuantity']
    },
    calculateCartTotalAmount() {
      let amount = 0
      for (const item of this.getCartItemsList()) {
        amount += item.quantity * item.sellPrice
      }
      this.$store.commit('cart/setCartTotalAmount', amount)
    },
    getCartTotalAmount() {
      return this.$store.getters['cart/getCartTotalAmount']
    },
    addItemToCart(itemId, quantity = 1) {
      const requestPayload = {
        itemId,
        quantity,
      }
      if (localStorage.getItem('cartGuestKey'))
        requestPayload.guestKey = localStorage.getItem('cartGuestKey')
      this.$axios
        .post('cart', requestPayload)
        .then((res) => {
          if (res.data.success) {
            if (res.data.guestKey)
              localStorage.setItem('cartGuestKey', res.data.guestKey)
            if (!res.data.guestKey && localStorage.getItem('cartGuestKey'))
              localStorage.removeItem('cartGuestKey')
            this.setCartItemsList()
          }
          this.emitCartResult(res.data.success, requestPayload)
          this.showConfirm()
        })
        .catch((err) => {
          this.error = err
        })
    },
    setEmptyStoreCart() {
      this.$store.commit('cart/setCartItemsList', [])
      this.$store.commit('cart/setCartItemsTotalQuantity', 0)
      this.$store.commit('cart/setCartTotalAmount', 0)
    },
    thumbImagePath(path) {
      return path || require(`~/assets/img/product/image_not_available.png`)
    },
    showConfirm() {
      if (this.mobile()) this.$root.$emit('bv::toggle::modal', 'cart-modal')
      else this.$root.$emit('bv::toggle::collapse', 'cart-sidebar')
    },
    mobile() {
      return window.innerWidth < 992
    },
    emitCartResult(success, request) {
      this.$root.$emit('cart', {
        success,
        request,
      })
    },
  },
}
