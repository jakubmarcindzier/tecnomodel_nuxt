<template>
  <span>
    <b-modal id="cart-modal" hide-header hide-footer>
      <b-container class="px-3 py-2 w-100">
        <b-row class="mb-2">
          <b-link @click="$bvModal.hide('cart-modal')"
            ><font-awesome-icon icon="times" class="main-color"
          /></b-link>
        </b-row>
        <b-row v-if="cartResult && !cartResult.success" class="mb-3">
          <b-alert variant="warning" show
            >La quantità massima che puoi acquistare è di
            {{ getMaxQuantity }} pezzi</b-alert
          >
        </b-row>
        <b-row v-if="cartResult && cartResult.success" class="mb-3">
          <span class="font-weight-bold h5"
            ><font-awesome-icon
              icon="check"
              class="mr-1 text-success"
            />Articolo aggiunto al carrello!</span
          >
        </b-row>
        <b-row class="mb-3">
          <b-button to="/checkout" block
            >Procedi all'acquisto<font-awesome-icon
              icon="arrow-alt-circle-right"
              class="ml-2"
              size="lg"
          /></b-button>
        </b-row>
        <b-row class="h6 mb-2">
          <b-col class="p-0">
            Totale ({{ cartItemsTotalQuantity }}
            {{ $tc('item', cartItemsTotalQuantity) }})
          </b-col>
          <b-col class="text-right p-0">
            <strong class="text-dark"
              ><price :amount="cartAmount"></price
            ></strong>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-button
            variant="outline-secondary"
            block
            to="/cart"
            @click="$bvModal.hide('cart-modal')"
            >Vai al Carrello <font-awesome-icon icon="shopping-cart"
          /></b-button>
        </b-row>
      </b-container>
    </b-modal>
    <b-sidebar :id="sidebarId" right backdrop>
      <template #header="{ hide }">
        <b-container class="px-3 py-2 w-100">
          <b-row class="mb-2">
            <b-link @click="hide"
              ><font-awesome-icon icon="times" class="main-color"
            /></b-link>
          </b-row>
          <b-row v-if="cartResult && cartResult.success" class="mb-2">
            <span class="font-weight-bold h5"
              ><font-awesome-icon
                icon="check"
                class="mr-1 text-success"
              />Articolo aggiunto al carrello!</span
            >
          </b-row>
          <b-row class="mb-3">
            <b-button to="/checkout" block
              >Procedi all'acquisto<font-awesome-icon
                icon="arrow-alt-circle-right"
                class="ml-2"
                size="lg"
            /></b-button>
          </b-row>
          <b-row class="h6">
            <b-col class="p-0">
              Totale ({{ cartItemsTotalQuantity }}
              {{ $tc('item', cartItemsTotalQuantity) }})
            </b-col>
            <b-col class="text-right p-0">
              <strong class="text-dark"
                ><price :amount="cartAmount"></price
              ></strong>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <template>
        <!-- TODO add #default="{ hide }" -->
        <div class="px-3 py-2">
          <div v-if="cartResult && !cartResult.success" class="mb-3">
            <b-alert variant="warning" show
              >La quantità massima che puoi acquistare è di
              {{ getMaxQuantity }} pezzi</b-alert
            >
          </div>
          <div class="mb-3">
            <b-button variant="outline-secondary" block to="/cart"
              >Vai al Carrello <font-awesome-icon icon="shopping-cart"
            /></b-button>
          </div>
          <div class="mb-3">
            <b-list-group flush class="overflow-auto">
              <b-list-group-item
                v-for="(item, key) in cartItemsList"
                :key="key"
              >
                <b-row>
                  <b-col cols="5">
                    <b-img
                      fluid
                      rounded
                      :alt="item.brand + ' ' + item.code"
                      :src="thumbImagePath(item.thumbImagePath)"
                    />
                  </b-col>
                  <b-col cols="7" style="font-size: 14px">
                    <p class="m-0">
                      <strong class="text-dark"
                        >{{ item.brand }} {{ item.code }}
                        <span v-if="item.quantity > 1" class="text-secondary"
                          >(x{{ item.quantity }})</span
                        ></strong
                      >
                    </p>
                    <p class="m-0">
                      <strong class="text-dark"
                        ><price :amount="item.sellPrice"></price
                      ></strong>
                    </p>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </template>
    </b-sidebar>
  </span>
</template>

<script>
import { cartMixin } from '@/mixins/cartMixin'

export default {
  name: 'ConfirmAddToCart',
  mixins: [cartMixin],
  data() {
    return {
      sidebarId: 'cart-sidebar',
      cartResult: null,
    }
  },
  computed: {
    getMaxQuantity() {
      const that = this
      let result
      if (this.cartResult)
        this.cartItemsList.forEach(function (element) {
          if (element.itemId === that.cartResult.request.itemId)
            result = element.quantity
        })
      return result
    },
    cartItemsTotalQuantity() {
      if (this.$store.getters['cart/getCartItemsTotalQuantity'] === null)
        return 0
      return this.$store.getters['cart/getCartItemsTotalQuantity']
    },
    cartItemsList() {
      return this.$store.getters['cart/getCartItemsList']
    },
    cartAmount() {
      if (this.$store.getters['cart/getCartTotalAmount'] === null) return 0
      return this.$store.getters['cart/getCartTotalAmount']
    },
  },
  mounted() {
    this.setCartResult()
  },
  methods: {
    setCartResult() {
      this.$root.$on('cart', (payload) => {
        this.cartResult = payload
      })
    },
  },
}
</script>
