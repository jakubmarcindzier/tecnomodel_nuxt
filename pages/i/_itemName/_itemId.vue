<template>
  <section class="pt-4 px-0 px-xl-4 bg-light">
    <b-container fluid>
      <breadcrumb
        v-if="item.categoryId"
        :category-id="item.categoryId"
        :add-active-link="item.brand + ' ' + item.code"
      ></breadcrumb>
      <b-row>
        <b-col cols="12" lg="6" class="my-auto">
          <client-only>
            <cool-light-box
              :items="itemMedia.light_box"
              :index="index"
              loop
              @close="index = null"
            />
          </client-only>
          <vue-slick-carousel
            ref="sliderFor"
            :as-nav-for="$refs.sliderNav"
            v-bind="slickCarouselSettings.for"
            class="slick-slider-for"
          >
            <div v-if="item.images.thumb.length === 0" class="text-center">
              <b-spinner
                style="width: 3rem; height: 3rem"
                variant="secondary"
              />
            </div>
            <b-img
              v-for="(srcImage, key) in itemMedia.photo"
              v-else
              :key="key"
              :src="srcImage"
              :alt="item.brand + ' ' + item.code + ' ' + item.name"
              @click="setIndex(key)"
            />
          </vue-slick-carousel>
          <vue-slick-carousel
            v-if="itemMedia.gallery.length > 1"
            ref="sliderNav"
            :as-nav-for="$refs.sliderFor"
            v-bind="slickCarouselSettings.nav"
            class="slick-slider-nav d-none d-lg-block"
          >
            <b-img
              v-for="(srcImage, key) in itemMedia.gallery"
              :key="key"
              :alt="item.brand + ' ' + item.code + ' ' + item.name"
              :src="srcImage"
              class="m-1 p-1"
            />
          </vue-slick-carousel>
        </b-col>
        <b-col cols="12" lg="6" class="mt-4 mt-lg-0">
          <b-row class="d-lg-flex align-items-lg-center pb-0 pb-lg-2">
            <b-col
              cols="12"
              lg="9"
              class="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-start mt-lg-0 mb-lg-0"
            >
              <h3
                class="m-0 d-none d-lg-block align-self-center align-self-lg-baseline mr-2"
              >
                <strong>{{ item.brand }} {{ item.code }}</strong>
              </h3>
              <h6
                class="mb-2 d-block d-lg-none align-self-center align-self-lg-baseline text-justify"
              >
                <strong>
                  {{ item.name }}
                </strong>
              </h6>
              <div class="d-flex flex-row">
                <b-badge
                  v-if="item.sellPrice > 99"
                  variant="success"
                  class="d-lg-block align-self-center mb-2"
                  >Spedizione gratuita</b-badge
                >
              </div>
            </b-col>
            <b-col
              cols="6"
              lg="3"
              class="d-none d-lg-flex justify-content-lg-end mb-lg-0"
            >
              <b-img :alt="item.brand" :src="item.brandLogoImagePath" />
            </b-col>
          </b-row>
          <b-row
            class="text-center text-lg-left d-none d-lg-block"
            style="height: 50px; overflow-y: hidden"
          >
            <b-col cols="12">
              <h5 class="text-muted m-0">
                {{ item.name }}
              </h5>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" lg="12" xl="6" class="px-2">
              <b-card>
                <b-card-body class="p-1">
                  <div class="d-flex flex-row">
                    <div class="flex-grow-1"></div>
                    <div class="text-right">
                      <label-discount v-if="item.discountThruDate" />
                      <countdown-timer
                        v-if="item.discountThruDate"
                        :thru-date="item.discountThruDate"
                        size="h4"
                        description-label
                        @endCallBack="updateItem()"
                      ></countdown-timer>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="flex-grow-1">
                      <p>
                        Condizione:
                        <b-badge
                          v-if="item.condition === 'new'"
                          variant="success"
                          >Nuovo</b-badge
                        >
                        <b-badge
                          v-if="item.condition === 'used'"
                          variant="warning"
                          >Usato</b-badge
                        >
                      </p>
                    </div>
                    <div>
                      <p>
                        <price
                          v-if="item.listPrice > item.sellPrice"
                          :hide-zero="true"
                          :strike="true"
                          :amount="item.listPrice"
                        />
                        <badge-discount
                          v-if="item.discount"
                          :discount="item.discount"
                          :promo="!!item.discountThruDate"
                        />
                      </p>
                    </div>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="flex-grow-1 align-self-center">
                      <h5 class="m-0">
                        <availability-text
                          :type="item.availability"
                        ></availability-text>
                      </h5>
                    </div>
                    <div class="align-self-center">
                      <h4 class="m-0">
                        <strong v-if="item.sellPrice !== null"
                          ><price :amount="item.sellPrice"
                        /></strong>
                      </h4>
                    </div>
                  </div>
                  <div
                    v-if="item.sellPrice !== null"
                    class="d-flex flex-row pt-3"
                  >
                    <div
                      class="d-none d-lg-block flex-shrink-1 align-self-center w-25"
                    >
                      <b-form-input
                        v-model="quantityToAddToCart"
                        name="qty"
                        type="text"
                        placeholder=""
                        :value="quantityToAddToCart"
                        aria-label="Quantity"
                        class="text-center"
                      ></b-form-input>
                    </div>
                    <div class="w-100 align-self-center ml-0 ml-lg-2">
                      <b-button
                        block
                        @click="addItemToCart(item.itemId, quantityToAddToCart)"
                      >
                        <font-awesome-icon
                          icon="shopping-cart"
                        ></font-awesome-icon>
                        Aggiungi al carrello
                      </b-button>
                    </div>
                  </div>
                  <div class="d-flex flex-row pt-2 pb-2">
                    <span class="text-right w-100">
                      <credit-card-icon name="mastercard" class="m-1" />
                      <credit-card-icon name="visa" class="m-1" />
                      <credit-card-icon name="amex" class="m-1" />
                      <credit-card-icon name="diners" class="m-1" />
                      <credit-card-icon name="paypal" class="m-1" />
                    </span>
                  </div>
                  <div
                    v-if="item.availability === 'preorder'"
                    class="d-flex flex-row pb-2"
                  >
                    <div class="text-center w-100">
                      <font-awesome-icon
                        icon="piggy-bank"
                        size="lg"
                        class="main-color mr-1"
                      ></font-awesome-icon>
                      <span class="text-secondary"
                        >Prezzo minimo garantito</span
                      >
                    </div>
                  </div>
                  <div class="d-flex flex-row pb-2">
                    <small class="text-justify w-100">
                      <delivery-message
                        :delivery-date="item.delivery.date"
                        :thru-date="item.delivery.orderLimit"
                      />
                      <span>{{ availabilityMessage }}</span>
                    </small>
                  </div>
                  <b-button
                    v-if="isAuthenticated"
                    size="sm"
                    variant="outline-secondary"
                    block
                    @click="toggleWishlist(item.itemId)"
                  >
                    <font-awesome-icon icon="heart"></font-awesome-icon>
                    {{ wishlistButtonName() }} lista dei desideri
                  </b-button>
                </b-card-body>
              </b-card>
            </b-col>
            <b-col cols="12" md="6" lg="12" xl="6">
              <b-card class="bg-light border-0">
                <b-card-body class="px-0 py-3">
                  <p
                    v-if="
                      item.barcode.length > 0 && !item.barcode.includes('888')
                    "
                    class="mb-1"
                  >
                    EAN : {{ item.barcode }}
                  </p>
                  <p class="m-0">Codice: {{ item.code }}</p>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="py-0 py-lg-5">
        <b-col cols="12">
          <b-tabs
            active-nav-item-class="font-weight-bold text-black"
            active-tab-class="nav-link"
            content-class="mt-3"
          >
            <b-tab title="Descrizione">
              <p v-if="!item.description && !item.detail" class="text-muted">
                {{ item.name }}
              </p>
              <p class="text-muted text-justify text-pre-line">
                {{ item.description }}
              </p>
              <p class="text-muted text-justify text-pre-line">
                {{ item.detail }}
              </p>
            </b-tab>
            <b-tab v-if="item.pdfFiles" title="Download">
              <b-link :href="item.pdfFiles.pdf" target="_blank">
                <b-img class="pdf-thumbnail" :src="item.pdfFiles.thumb" />
              </b-link>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { cartMixin } from '~/mixins/cartMixin.js'
import { wishlistMixin } from '~/mixins/wishlistMixin'
import getSiteMeta from '~/utils/getSiteMeta'
import { urlMixin } from '~/mixins/urlMixin'

const facebookItemConditionStatus = {
  new: 'NewCondition',
  // RefurbishedCondition',
  used: 'UsedCondition',
}

const facebookAvailabilityStatus = {
  outOfStock: 'SoldOut',
  // : 'PreSale',
  preorder: 'PreOrder',
  discontinued: 'Discontinued',
  inStock: 'InStock',
}

export default {
  name: 'ItemPage',
  components: {
    CoolLightBox,
    VueSlickCarousel,
  },
  mixins: [cartMixin, wishlistMixin, urlMixin],
  validate({ params }) {
    return /^\d+$/.test(params.itemId)
  },
  async asyncData({ $axios, error, params }) {
    const response = await $axios.get(`item/${params.itemId}`)
    if (response.data === false)
      error({ statusCode: 404, message: 'Not found' })
    return { item: response.data }
  },
  /* TODO TCNMDL-30
  asyncData({ $axios, params, error }) {
    return $axios
      .get(`item/${params.itemId}`)
      .then((response) => {
        return { item: response.data }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Not found' })
      })
  }, */
  data() {
    return {
      slickCarouselSettings: {
        for: {
          lazyLoad: 'ondemand',
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          focusOnSelect: true,
          dots: false,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                dots: true,
              },
            },
          ],
        },
        nav: {
          lazyLoad: 'ondemand',
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: false,
          focusOnSelect: true,
          centerMode: true,
        },
      },
      index: null,
      itemMedia: {
        gallery: [],
        photo: [],
        light_box: [],
      },
      item: {
        itemId: this.$route.params.itemId,
        categoryId: null,
        brand: null,
        code: null,
        barcode: 0,
        name: null,
        description: null,
        detail: null,
        sellPrice: null,
        listPrice: null,
        condition: null,
        discount: null,
        discountThruDate: null,
        availability: null,
        images: {
          thumb: [],
          normal: [],
          zoom: [],
        },
        video: {
          thumbPreview: [],
          preview: [],
          url: [],
        },
        delivery: {
          date: null,
          orderLimit: null,
        },
      },
      errors: [],
      quantityToAddToCart: 1,
    }
  },
  head() {
    return {
      title: this.title,
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.getUrl(),
        },
      ],
      script: [{ type: 'application/ld+json', json: this.facebookData }],
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    availabilityMessage() {
      return this.item.availability
        ? this.$t('availabilityMessage.' + this.item.availability)
        : ''
    },
    title() {
      return this.item.brand + ' ' + this.item.code + ' ' + this.item.name
    },
    meta() {
      const metaData = {
        type: 'product',
        title: this.title,
        description: this.getMetaDescription(),
        url: this.getUrl(),
        mainImage: this.itemMedia.gallery[0],
      }
      return getSiteMeta(metaData)
    },
    facebookData() {
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        productID: this.item.itemId,
        name: this.item.name,
        description: this.item.description,
        url: this.getUrl(),
        image: this.item.images.normal[0],
        brand: this.item.brand,
        offers: [
          {
            '@type': 'Offer',
            price: this.item.sellPrice,
            priceCurrency: 'EUR',
            itemCondition:
              'https://schema.org/' +
              facebookItemConditionStatus[this.item.condition],
            availability:
              'https://schema.org/' +
              facebookAvailabilityStatus[this.item.availability],
          },
        ],
      }
    },
  },
  watch: {
    item() {
      this.setImages()
    },
  },
  created() {
    this.setImages()
  },
  mounted() {
    setTimeout(() => this.addItemToChronology(), 5000)
  },
  methods: {
    setMedia() {
      this.itemMedia.gallery = this.item.images.thumb.concat(
        this.item.video.thumbPreview
      )
      this.itemMedia.photo = this.item.images.zoom.concat(
        this.item.video.preview
      )
      this.itemMedia.light_box = this.item.images.zoom.concat(
        this.item.video.url
      )
    },
    getProductDefaultImage() {
      Object.keys(this.item.images).forEach((key) => {
        this.item.images[key].push(
          require(`~/assets/img/product/image_not_available.png`)
        )
      })
    },
    updateItem() {
      setTimeout(() => {
        this.$nuxt.refresh()
      }, 1000)
    },
    setImages() {
      if (this.item.images.thumb.length === 0) this.getProductDefaultImage()
      this.setMedia()
    },
    setIndex(index) {
      this.index = index
    },
    addItemToChronology() {
      if (!this.isAuthenticated) return true
      this.$axios
        .post('siv', {
          itemId: this.item.itemId,
        })
        .catch((err) => {
          this.errors = err
        })
    },
    wishlistButtonName() {
      if (this.wishlist(this.item.itemId)) return 'Rimuovi alla'
      else return 'Aggiungi dalla'
    },
    getMetaDescription() {
      // TODO add category name
      return this.title + ' - ' + this.$t('titleTemplate')
    },
  },
}
</script>
<style>
.slick-prev:before,
.slick-next:before {
  color: rgba(255, 153, 0, 1);
}

.slick-slider-for img {
  max-height: 500px;
  object-fit: contain;
}

.slick-slider-nav img {
  max-height: 100px;
  object-fit: contain;
}

.pdf-thumbnail {
  max-width: 200px;
  height: 200px;
}

.text-pre-line {
  white-space: pre-line;
}
</style>
