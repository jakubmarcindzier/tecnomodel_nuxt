<template>
  <b-card class="w-100 p-3 mb-4">
    <b-row v-if="type === 'list'" no-gutters>
      <b-col lg="4" class="p-2" style="height: 210px">
        <b-link
          class="text-decoration-none text-dark"
          :to="'/i/' + toSeoUrl(brand + ' ' + code + ' ' + name) + '/' + itemId"
          ><b-img-lazy
            :src="image"
            class="card-img-list p-3 p-lg-0"
            :alt="brand + ' ' + code + ' ' + name"
        /></b-link>
      </b-col>
      <b-col lg="8">
        <b-card-body class="text-center text-lg-left p-0">
          <b-row class="d-flex align-items-center">
            <b-col
              lg="8"
              class="pb-2"
              style="max-height: 150px; overflow: hidden"
            >
              <b-card-title>
                <strong
                  ><b-link
                    class="text-decoration-none text-dark"
                    :to="
                      '/i/' +
                      toSeoUrl(brand + ' ' + code + ' ' + name) +
                      '/' +
                      itemId
                    "
                    ><span class="mr-1">{{ brand }}</span> {{ code }}</b-link
                  ></strong
                >
              </b-card-title>
              <b-card-sub-title class="text-muted">
                <b-link
                  class="text-decoration-none text-muted"
                  :to="
                    '/i/' +
                    toSeoUrl(brand + ' ' + code + ' ' + name) +
                    '/' +
                    itemId
                  "
                  >{{ name }}</b-link
                >
              </b-card-sub-title>
              <b-card-text class="text-muted mt-2">
                <b-link
                  class="text-decoration-none text-muted"
                  :to="
                    '/' +
                    toSeoUrl(brand + ' ' + code + ' ' + name) +
                    '/' +
                    itemId
                  "
                  >{{ description }}</b-link
                >
              </b-card-text>
              <div class="product-description-fade"></div>
            </b-col>
            <b-col lg="4" class="py-2">
              <div class="h-100 mb-2">
                <b-img v-if="logoPath" :alt="brand" :src="logoPath" />
              </div>
              <label-discount v-if="discountThruDate" />
              <countdown-timer :thru-date="discountThruDate" />
              <p v-if="listPrice > sellPrice" class="p-0 m-0">
                <strong class="text-muted"
                  ><s><price hide-zero :amount="listPrice" /></s
                ></strong>
                <badge-discount
                  v-if="discount"
                  :discount="discount"
                  :promo="!!discountThruDate"
                />
              </p>
              <p class="h4 p-0">
                <strong><price hide-zero :amount="sellPrice" /></strong>
              </p>
              <div>
                <availability-text :type="availability" />
                <div>
                  <b-button
                    v-if="sellPrice !== null"
                    size="sm"
                    class="mt-2 text-white"
                    @click="addItemToCart(itemId)"
                  >
                    <font-awesome-icon icon="shopping-cart"></font-awesome-icon>
                    Aggiungi al carrello
                  </b-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-col>
    </b-row>
    <b-card-body v-if="type === 'grid'" class="text-center p-2">
      <b-link
        class="text-decoration-none text-dark"
        :to="'/i/' + toSeoUrl(brand + ' ' + code + ' ' + name) + '/' + itemId"
        ><b-img-lazy
          :src="image"
          class="card-img-list p-3 p-lg-0"
          :alt="brand + ' ' + code + ' ' + name"
      /></b-link>
      <div class="h-100 my-2">
        <b-img v-if="logoPath" :alt="brand" :src="logoPath" />
      </div>
      <b-card-title
        ><h5>{{ brand }} {{ code }}</h5></b-card-title
      >
      <b-card-sub-title style="height: 60px; overflow: hidden">
        <strong>{{ name }}</strong>
      </b-card-sub-title>
      <b-card-sub-title class="m-0">
        <label-discount v-if="discountThruDate" />
        <countdown-timer :thru-date="discountThruDate" />
        <div class="mt-1">
          <s class="text-muted"
            ><strong v-if="listPrice > sellPrice" class="text-muted"
              ><price hide-zero :amount="listPrice" /></strong></s
          ><badge-discount
            v-if="discount"
            :discount="discount"
            :promo="!!discountThruDate"
          />
        </div>
        <h4 class="text-dark">
          <strong><price hide-zero :amount="sellPrice" /></strong>
        </h4>
      </b-card-sub-title>
      <b-card-text>
        <availability-text :type="availability" />
      </b-card-text>
      <b-button
        v-if="sellPrice !== null"
        size="sm"
        class="mt-2 text-white"
        @click="addItemToCart(itemId)"
      >
        <font-awesome-icon icon="shopping-cart"></font-awesome-icon>
        Aggiungi al carrello
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
import { urlMixin } from '@/mixins/urlMixin'
import { cartMixin } from '@/mixins/cartMixin'

export default {
  name: 'ProductComponent',
  mixins: [urlMixin, cartMixin],
  props: {
    type: {
      type: String,
      default: 'list',
    },
    itemId: {
      type: String,
      default: null,
    },
    sellPrice: {
      type: Number,
      default: null,
    },
    listPrice: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    availability: {
      type: String,
      default: null,
    },
    brand: {
      type: String,
      default: null,
    },
    code: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    imagePath: {
      type: String,
      default: null,
    },
    logoPath: {
      type: String,
      default: null,
    },
    discountThruDate: {
      type: String,
      default: null,
    },
  },
  computed: {
    image() {
      return (
        this.imagePath ||
        require(`~/assets/img/product/image_not_available.png`)
      )
    },
  },
}
</script>

<style scoped>
.card-img-list {
  width: 100%;
  height: 20vh;
  object-fit: contain;
}

.product-description-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 5px 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
}
</style>
