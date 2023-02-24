<template>
  <div class="highlight box">
    <content-loader v-show="!itemId" width="292" height="410">
      <rect x="17" y="0" rx="3" ry="3" width="258" height="250" />
      <rect x="17" y="258" rx="3" ry="3" width="130" height="12" />
      <rect x="17" y="281" rx="3" ry="3" width="250" height="10" />
      <rect x="17" y="301" rx="3" ry="3" width="200" height="10" />
      <rect x="17" y="323" rx="3" ry="3" width="98" height="17" />
      <rect x="148" y="323" rx="3" ry="3" width="64" height="17" />
      <rect x="238" y="323" rx="3" ry="3" width="37" height="17" />
      <rect x="17" y="346" rx="3" ry="3" width="24" height="20" />
      <rect x="183" y="346" rx="3" ry="3" width="92" height="20" />
      <rect x="251" y="386" rx="3" ry="3" width="24" height="20" />
      <rect x="17" y="386" rx="3" ry="3" width="70" height="11" />
    </content-loader>
    <span v-show="itemId">
      <b-link
        class="text-decoration-none text-dark"
        :to="'/i/' + toSeoUrl(brand + ' ' + code + ' ' + name) + '/' + itemId"
      >
        <div class="mb-2 ml-3 mr-3">
          <nuxt-img
            :src="image"
            background="white"
            quality="75"
            fit="cover"
            width="250"
            height="150"
            loading="lazy"
            :alt="brand + ' ' + code + ' ' + name"
            :placeholder="
              require(`~/assets/img/product/image_not_available.png`)
            "
            format="webp"
          />
          <div class="text-left">{{ brand }} {{ code }}</div>
          <div
            class="text-justify d-none d-lg-block text-muted small"
            style="height: 40px; overflow: hidden"
          >
            {{ name }}
          </div>
          <b-row class="discount-time-row">
            <b-col class="text-left" lg="6">
              <client-only>
                <countdown-timer :thru-date="discountThruDate" />
              </client-only>
            </b-col>
            <b-col class="text-right" lg="6" style="white-space: nowrap">
              <price
                v-if="listPrice > sellPrice"
                :hide-zero="true"
                :strike="true"
                :amount="listPrice"
                class="small"
              />
              <badge-discount
                v-if="discount"
                :discount="discount"
                :promo="!!discountThruDate"
              />
            </b-col>
          </b-row>
        </div>
      </b-link>
      <div class="mb-2 ml-3 mr-3">
        <div class="d-flex justify-content-between" style="height: 28px">
          <div>
            <b-link v-if="isAuthenticated" @click="toggleWishlist(itemId)">
              <font-awesome-icon size="lg" :icon="wishlistIcon()"
            /></b-link>
          </div>
          <div>
            <span class="h4 align-middle"><price :amount="sellPrice" /></span>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div>
            <availability-text
              :type="availability"
              strong
              small
            ></availability-text>
          </div>
          <div>
            <b-link
              v-if="sellPrice !== null"
              class="align-middle"
              @click="addItemToCart(itemId)"
            >
              <font-awesome-icon
                size="lg"
                icon="shopping-cart"
              ></font-awesome-icon>
            </b-link>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
import { urlMixin } from '@/mixins/urlMixin'
import { cartMixin } from '~/mixins/cartMixin.js'
import { wishlistMixin } from '~/mixins/wishlistMixin'

export default {
  name: 'ShowcaseProduct',
  components: {
    ContentLoader,
  },
  mixins: [urlMixin, cartMixin, wishlistMixin],
  props: {
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
    imagePath: {
      type: String,
      default: null,
    },
    discountThruDate: {
      type: String,
      default: null,
    },
    availability: {
      type: String,
      default: null,
    },
  },
  computed: {
    image() {
      return (
        this.imagePath || '/product/image_not_available.png' // http://www.tecnomodel-treni.test/images/800x800/59680-0.jpg
      )
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  methods: {
    wishlistIcon() {
      if (this.wishlist(this.itemId)) return 'heart'
      else return ['far', 'heart']
    },
  },
}
</script>

<style scoped>
.box {
  width: 292px;
  height: 410px;
}

.discount-time-row {
  height: 26px;
}

@media screen and (max-width: 992px) {
  .box {
    width: 192px;
    height: 290px;
  }

  .discount-time-row {
    height: 50px;
  }
}

.highlight {
  border: 1px solid #ffffff !important;
  position: relative;
  top: 0;
  transition: top ease 0.5s;
}

.highlight:hover {
  border: 1px solid #dee2e6 !important;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border-radius: 0.25rem !important;
  top: -10px;
}
</style>
