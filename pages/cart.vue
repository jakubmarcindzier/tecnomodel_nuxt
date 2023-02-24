<template>
  <section class="pt-4 px-0 px-xl-4">
    <b-container fluid>
      <b-breadcrumb class="bg-white border m-0">
        <b-breadcrumb-item to="/">
          <font-awesome-icon class="main-color" icon="home" size="lg" />
        </b-breadcrumb-item>
        <b-breadcrumb-item active>Carrello</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row class="py-4">
        <template v-if="getCartItemsList() === null">
          <b-col class="text-center">
            <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
          </b-col>
        </template>
        <template v-else-if="getCartItemsList().length === 0">
          <b-col class="text-center"> carrello vuoto </b-col>
        </template>
        <template
          v-if="getCartItemsList() !== null && getCartItemsList().length > 0"
        >
          <b-col lg="3">
            <b-card class="sticky-top sticky-offset">
              <b-card-sub-title class="mb-3">
                Totale ({{ getCartItemsTotalQuantity() }} articolo/i):
              </b-card-sub-title>
              <b-card-text class="text-right">
                <h4>
                  <strong
                    ><price
                      :strike="getCouponTotal > 0 && promoCoupon"
                      :amount="getCartTotalAmount()"
                    ></price
                  ></strong>
                </h4>
              </b-card-text>
              <b-card-text
                v-if="getCouponTotal > 0 && promoCoupon"
                class="text-right"
                ><price
                  class="text-success"
                  :amount="0 - getCouponTotal / 10"
                />
                <h4>
                  <strong
                    ><price
                      :amount="getCartTotalAmount() - getCouponTotal / 10"
                  /></strong>
                </h4>
              </b-card-text>
              <b-button block size="lg" to="/checkout"
                >Procedi all'acquisto<font-awesome-icon
                  icon="arrow-alt-circle-right"
                  class="ml-2"
                  size="lg"
              /></b-button>
            </b-card>
          </b-col>
          <b-col lg="9" order-lg="first" class="mb-4 mb-lg-0">
            <div
              class="d-none d-md-block bg-white main-color w-100 p-3 border-bottom"
            >
              <b-row>
                <b-col cols="8">
                  <span><strong>Prodotto</strong></span>
                </b-col>
                <b-col cols="2" class="d-flex justify-content-center">
                  <span><strong>Quantità</strong></span>
                </b-col>
                <b-col cols="2" class="d-flex justify-content-center">
                  <span><strong>Prezzo</strong></span>
                </b-col>
              </b-row>
            </div>
            <div
              v-for="(item, key) in getCartItemsList()"
              :key="key"
              class="p-0"
            >
              <b-row class="d-flex text-muted align-items-center mt-3">
                <b-col md="8">
                  <b-row>
                    <b-col
                      cols="6"
                      class="mb-2 mb-md-0 d-flex justify-content-start"
                    >
                      <b-link
                        :to="
                          '/i/' +
                          toSeoUrl(
                            item.brand + ' ' + item.code + ' ' + item.name
                          ) +
                          '/' +
                          item.itemId
                        "
                      >
                        <b-img
                          class="image-cart"
                          :src="thumbImagePath(item.thumbImagePath)"
                          :alt="item.brand + ' ' + item.code + ' ' + item.name"
                        />
                      </b-link>
                    </b-col>
                    <b-col cols="6">
                      <b-row
                        class="mt-1 d-flex align-items-center justify-content-start"
                      >
                        <b-link
                          :to="
                            '/i/' +
                            toSeoUrl(
                              item.brand + ' ' + item.code + ' ' + item.name
                            ) +
                            '/' +
                            item.itemId
                          "
                        >
                          <strong class="text-dark"
                            >{{ item.brand }} {{ item.code }}</strong
                          >
                        </b-link>
                      </b-row>
                      <b-row
                        class="mt-1 mt-lg-3 pr-2 d-flex align-items-center justify-content-start"
                      >
                        <strong style="text-align: justify">{{
                          item.name
                        }}</strong>
                      </b-row>
                      <b-row
                        class="mt-1 mt-lg-3 d-flex align-items-center justify-content-start"
                      >
                        <AvailabilityText
                          :type="item.availability"
                        ></AvailabilityText>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col
                  cols="6"
                  md="2"
                  class="d-flex justify-content-center border-0 mt-3 mt-md-0"
                >
                  <b-input-group size="sm">
                    <b-input-group-prepend>
                      <b-button
                        class="bg-white border"
                        @click="addItemToCart(item.itemId, -1)"
                      >
                        <font-awesome-icon
                          class="main-color"
                          :icon="item.quantity > 1 ? 'minus' : 'trash'"
                          size="lg"
                        />
                      </b-button>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      class="border text-center font-weight-bold"
                      :value="item.quantity"
                      aria-label="Quantity"
                      disabled
                    />
                    <b-input-group-append>
                      <b-button
                        class="bg-white border"
                        @click="addItemToCart(item.itemId)"
                      >
                        <font-awesome-icon
                          class="main-color"
                          icon="plus"
                          size="lg"
                        />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
                <b-col
                  cols="6"
                  md="2"
                  class="justify-content-center border-0 mt-3 mt-md-0"
                >
                  <b-row>
                    <countdown-timer :thru-date="item.discountThruDate" />
                  </b-row>
                  <b-row>
                    <p v-if="item.listPrice > item.sellPrice">
                      <strong class="text-muted"
                        ><s><price :amount="item.listPrice" /></s></strong
                      ><badge-discount
                        v-if="item.discount"
                        :discount="item.discount"
                        :promo="!!item.discountThruDate"
                      />
                    </p>
                  </b-row>
                  <b-row>
                    <strong class="text-dark">
                      <price :amount="item.sellPrice"></price>
                    </strong>
                  </b-row>
                </b-col>
              </b-row>
              <b-col class="p-0 py-2 border-top-0 border-bottom">
                <div class="d-flex">
                  <div class="flex-fill"></div>
                  <b-button variant="link" @click="deleteCartItem(item.itemId)">
                    <font-awesome-icon class="text-muted" icon="trash" />
                  </b-button>
                </div>
              </b-col>
            </div>
            <div class="d-flex mt-3">
              <b-col class="px-0">
                <div class="d-flex">
                  <div>
                    <b-button
                      size="sm"
                      class="d-none d-md-block"
                      @click="backToShopping"
                    >
                      <font-awesome-icon class="mr-1" icon="angle-left" />
                      Continua a comprare
                    </b-button>
                  </div>
                  <div class="flex-fill d-flex justify-content-end mr-2">
                    <b-button size="sm" @click="emptyCart">
                      <font-awesome-icon class="mr-1" icon="times" />
                      Svuota il carrello
                    </b-button>
                  </div>
                  <!--<div>
                    <b-button size="sm" @click="setCartItemsList">
                      <font-awesome-icon class="mr-1" icon="sync" />
                      Aggiorna il carrello
                    </b-button>
                  </div>-->
                </div>
              </b-col>
            </div>
          </b-col>
        </template>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import AvailabilityText from '@/components/AvailabilityText'
import Price from '@/components/Price'
import { cartMixin } from '@/mixins/cartMixin.js'
import CountdownTimer from '@/components/CountdownTimer'
import { urlMixin } from '@/mixins/urlMixin'
import BadgeDiscount from '@/components/BadgeDiscount'

export default {
  name: 'CartPage',
  components: { BadgeDiscount, CountdownTimer, Price, AvailabilityText },
  mixins: [cartMixin, urlMixin],
  data() {
    return {
      promoCoupon: false,
    }
  },
  head() {
    return {
      title: this.$t('title.cart'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  computed: {
    spinner() {
      return this.getCartItemsList() === null
    },
    getCouponTotal() {
      let result = 0
      if (this.getCartItemsList() === null) return result
      this.getCartItemsList().forEach((element) => {
        if (element.availability === 'inStock' && element.comboCoupon)
          result += element.sellPrice * element.quantity
      })
      return result
    },
  },
  watch: {
    getCouponTotal(value) {
      if (value > 0) this.checkCoupon()
    },
  },
  beforeMount() {
    if (this.$route.params.itemId) this.addItemToCart(this.$route.params.itemId)
    this.updateCart()
  },
  methods: {
    deleteCartItem(itemId) {
      let endPoint = `cart/${itemId}`
      if (localStorage.getItem('cartGuestKey'))
        endPoint += '?guestKey=' + localStorage.getItem('cartGuestKey')
      this.$axios
        .delete(endPoint)
        .then((res) => {
          if (res.data.success) this.setCartItemsList()
        })
        .catch((err) => {
          this.error = err
        })
    },
    updateCart() {
      let endPoint = `cart/update`
      if (localStorage.getItem('cartGuestKey'))
        endPoint += '?guestKey=' + localStorage.getItem('cartGuestKey')
      this.$axios
        .get(endPoint)
        .then((res) => {
          if (res.data.success) this.setCartItemsList()
        })
        .catch((err) => {
          this.error = err
        })
    },
    emptyCart() {
      let endPoint = `cart`
      if (localStorage.getItem('cartGuestKey'))
        endPoint += '?guestKey=' + localStorage.getItem('cartGuestKey')
      this.$axios
        .delete(endPoint)
        .then((res) => {
          if (res.data.success) this.setCartItemsList()
        })
        .catch((err) => {
          this.error = err
        })
    },
    backToShopping() {
      if (this.$route.query.r)
        window.location.replace(atob(this.$route.query.r))
      else this.$router.go(-1)
    },
    checkCoupon() {
      if (process.env.VUE_APP_PROMO_KEY === '') return true
      this.$axios
        .get(
          `coupon?key=${process.env.VUE_APP_PROMO_KEY}&amount=${this.getCouponTotal}`
        )
        .then((res) => {
          this.promoCoupon = res.data.valid === true
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>

<style>
.image-cart {
  height: 15vh;
  object-fit: contain;
  max-width: 200px;
}
</style>
