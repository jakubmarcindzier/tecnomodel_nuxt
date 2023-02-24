<template>
  <section class="pt-4 px-4">
    <b-container fluid>
      <b-breadcrumb class="bg-white border m-0">
        <b-breadcrumb-item to="/">
          <font-awesome-icon class="main-color" icon="home" size="lg" />
        </b-breadcrumb-item>
        <b-breadcrumb-item active>Lista dei desideri</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row class="py-0 py-md-4">
        <template v-if="wishlistItem === null">
          <b-col class="text-center">
            <b-spinner style="width: 6rem; height: 6rem"></b-spinner>
          </b-col>
        </template>
        <template v-else-if="wishlistItem.length === 0">
          <b-col class="text-center"> Lista vuota </b-col>
        </template>
        <b-col
          v-if="wishlistItem !== null && wishlistItem.length > 0"
          cols="12"
          class="mb-4 mb-lg-0"
        >
          <div
            class="d-none d-md-block main-color w-100 p-3 border-top border-bottom"
          >
            <b-row>
              <b-col cols="6">
                <strong>Prodotto</strong>
              </b-col>
              <b-col cols="2" class="text-center">
                <strong>Disponibilità</strong>
              </b-col>
              <b-col cols="2" class="text-center">
                <span><strong>Prezzo</strong></span>
              </b-col>
              <b-col cols="2" class="text-center">
                <span><strong>Aggiungi al carrello</strong></span>
              </b-col>
            </b-row>
          </div>
          <div v-for="(item, key) in wishlistItem" :key="key" class="p-2">
            <b-row class="align-items-center mt-3">
              <b-col cols="12" md="6">
                <b-row>
                  <b-col cols="12" md="4" class="mb-2 mb-md-0">
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
                        fluid-grow
                        :src="thumbImagePath(item.thumbImagePath)"
                        :alt="item.brand + ' ' + item.code + ' ' + item.name"
                      />
                    </b-link>
                  </b-col>
                  <b-col
                    cols="12"
                    md="8"
                    class="d-column d-md-block"
                    style="max-height: 25vh; overflow: hidden"
                  >
                    <b-row class="mt-1 pl-md-5 text-center">
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
                    <b-row class="mt-3 pl-md-5"
                      ><b-link
                        :to="
                          '/i/' +
                          toSeoUrl(
                            item.brand + ' ' + item.code + ' ' + item.name
                          ) +
                          '/' +
                          item.itemId
                        "
                      >
                        <strong>{{ item.name }}</strong>
                      </b-link>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="12" md="2" class="text-center">
                <availability-text :type="item.availability" />
              </b-col>
              <b-col cols="12" md="2">
                <div class="text-center">
                  <countdown-timer :thru-date="item.discountThruDate" />
                </div>
                <div class="text-center">
                  <div v-if="item.listPrice > item.sellPrice">
                    <strong class="text-muted"
                      ><s><price :amount="item.listPrice" /></s></strong
                    ><badge-discount
                      v-if="item.discount"
                      :discount="item.discount"
                      :promo="!!item.discountThruDate"
                    />
                  </div>
                </div>
                <div class="text-center">
                  <strong class="text-dark">
                    <price :amount="item.sellPrice"></price>
                  </strong>
                </div>
              </b-col>
              <b-col cols="12" md="2" class="mt-3 mt-md-0">
                <b-button block @click="addItemToCart(item.itemId)">
                  <font-awesome-icon icon="shopping-cart" />
                  Aggiungi al carrello
                </b-button>
              </b-col>
            </b-row>
            <b-col cols="12" class="p-0 py-2 mb-3 border-top-0 border-bottom">
              <div class="d-flex">
                <div class="flex-fill"></div>
                <div>
                  <b-button variant="link" @click="deleteWishlist(item.itemId)">
                    <font-awesome-icon class="text-muted" icon="trash" />
                  </b-button>
                </div>
              </div>
            </b-col>
          </div>
          <div>
            <b-row>
              <b-col>
                <b-button @click="getWishlistItem()">
                  <font-awesome-icon class="mr-1" icon="sync" /> Aggiorna
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { cartMixin } from '@/mixins/cartMixin'
import { urlMixin } from '@/mixins/urlMixin'
import { wishlistMixin } from '@/mixins/wishlistMixin'

export default {
  name: 'WishlistPage',
  mixins: [urlMixin, cartMixin, wishlistMixin],
  middleware: 'isAuthenticated',
  head() {
    return {
      title: this.$t('title.wishlist'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
    }
  },
  computed: {
    wishlistItem() {
      return this.getWishlistItem()
    },
  },
  beforeMount() {
    if (this.$route.params.itemId) this.addWishlist(this.$route.params.itemId)
  },
}
</script>
