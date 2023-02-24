<template>
  <div>
    <!--<banner-slider />-->
    <b-container fluid>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Vetrina">
              <showcase-product-list
                filter="showcase"
                :shown-products-number="24"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Produttori" url="/brand">
              <brand-list />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Offerte" url="/f/promo">
              <showcase-product-list
                filter="promo"
                :shown-products-number="12"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Categorie">
              <service-card-list
                :element="categoryList"
                cover
                text-cover="Scopri tutti le categorie"
                cover-class="main-background"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Nuovi arrivi" url="/f/news">
              <!-- TODO CORREGGERE CON news -->
              <showcase-product-list
                filter="preorder"
                :shown-products-number="9"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <exchange-second-hand />
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Usato" url="/f/used">
              <showcase-product-list filter="used" :shown-products-number="9" />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <lazy-hydrate when-visible>
          <b-col cols="12" lg="4" class="p-4">
            <b-card
              class="overflow-hidden main-background border-0 rounded-0 h-100 p-lg-5 p-3"
              img-bottom
              body-class="text-white"
            >
              <b-card-title class="h2"> Dietro le quinte </b-card-title>
              <b-card-text class="h5">
                Vieni a scoprire cosa seccede nei magazzini Tecnomodel ogni
                volta che effettui un ordine sul nostro sito
              </b-card-text>
            </b-card>
          </b-col>
        </lazy-hydrate>
        <b-col cols="12" lg="8" class="p-4">
          <lazy-hydrate when-visible>
            <youtube-embed
              lazy
              youtube-id="rJYvfCIAR0c"
              alt-preview="Tecnomodel - Dietro le quinte"
            />
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element :title="$t('filter.preorder')" url="/f/preorder">
              <showcase-product-list
                filter="preorder"
                :shown-products-number="9"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-4">
          <lazy-hydrate when-visible>
            <scroller-element title="Servizi">
              <service-card-list
                :element="serviceList"
                body-class="bg-light"
                cover
                text-cover="Scopri tutti i servizi"
                cover-class="main-background"
                button-variant="outline-secondary"
              />
            </scroller-element>
          </lazy-hydrate>
        </b-col>
      </b-row>
    </b-container>
    <client-only>
      <section id="infiniteProducts" class="my-4">
        <b-container fluid>
          <b-row>
            <b-col
              v-for="(item, $index) in infiniteSuggestedItemList"
              :key="$index"
              cols="6"
              md="3"
              class="mt-2 mb-2"
            >
              <b-card class="border-0 py-0 px-2" body-class="p-1 text-center">
                <showcase-product
                  :item-id="item.itemId"
                  :brand="item.brand"
                  :code="item.code"
                  :name="item.name"
                  :sell-price="item.sellPrice"
                  :list-price="item.listPrice"
                  :discount="item.discount"
                  :discount-thru-date="item.discountThruDate"
                  :availability="item.availability"
                  :image-path="item.thumbImagePath"
                />
              </b-card>
            </b-col>
          </b-row>
          <infinite-loading
            v-if="triggerInfiniteLoading"
            spinner="spiral"
            @infinite="getInfiniteSuggestedItemList"
          >
            <div slot="no-more">No more products</div>
            <div slot="no-results"></div>
          </infinite-loading>
          <b-button
            v-else
            style="outline: none; box-shadow: none"
            block
            variant="outline-secondary"
            @click="triggerByButtonInfiniteLoading = true"
            >VEDI ALTRI ARTICOLI</b-button
          >
        </b-container>
      </section>
    </client-only>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'HomePage',
  components: {
    LazyHydrate,
    ScrollerElement: () => import('@/components/ScrollerElement'),
    ShowcaseProductList: () => import('@/components/ShowcaseProductList'),
    BrandList: () => import('@/components/BrandList'),
    YoutubeEmbed: () => import('@/components/YoutubeEmbed'),
    InfiniteLoading: () => import('vue-infinite-loading'),
    ExchangeSecondHand: () => import('@/components/ExchangeSecondHand'),
  },
  mixins: [urlMixin],
  data() {
    return {
      triggerByButtonInfiniteLoading: false,
      infiniteSuggestedItemList: [],
      infiniteSuggestedPageSize: 30,
      error: null,
      pageCurrent: null,
      pageTotal: null,
      itemNumber: null,
      serviceList: [
        {
          href:
            this.$config.supportWebsite +
            'it/browse/spedizioni/3/quando-sara-consegnato-il-mio-ordine/36',
          icon: 'truck',
          text: 'Consegna in 24/48h',
        },
        {
          href:
            this.$config.supportWebsite +
            'it/browse/problemi-tecnici/10/vorrei-inviare-un-articolo-in-assistenza/99',
          icon: 'wrench',
          text: 'Assistenza tecnica e riparazioni',
        },
        {
          href: this.$config.supportWebsite + 'it',
          icon: 'headset',
          text: 'Help Desk',
        },
        {
          href:
            this.$config.supportWebsite +
            'it/browse/disponibilita/8/acquistate-e-permutate-articoli-usati/58',
          icon: 'sync-alt',
          text: 'Valutazione usato e permuta',
        },
        {
          to: '/b/altro/buoni-regalo/258',
          icon: 'gift',
          text: 'Buoni regalo',
        },
      ],
      categoryList: [
        {
          to: '/b/scala-h0/106',
          text: 'Modellismo ferroviario',
          imageUrl: '/category_image/2.jpg',
        },
        {
          to: '/b/scenografia-plastici/115',
          text: 'Scenografia',
          imageUrl: '/category_image/3.jpg',
        },
        {
          to: '/b/utensili/111',
          text: 'Utensili',
          imageUrl: '/category_image/4.jpg',
        },
        {
          to: '/b/sistemi-digitali/112',
          text: 'Sistemi digitali',
          imageUrl: '/category_image/5.jpg',
        },
        {
          to: '/b/editoria/110',
          text: 'Editoria',
          imageUrl: '/category_image/7.jpg',
        },
      ],
    }
  },
  head() {
    return {
      title: this.$t('title.home'),
      titleTemplate: this.$t('titleTemplate') + ': %s',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('description.home'),
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.getUrl(),
        },
      ],
    }
  },
  computed: {
    triggerInfiniteLoading() {
      return (
        this.pageCurrent === null ||
        this.pageCurrent % 2 === 1 ||
        this.triggerByButtonInfiniteLoading
      )
    },
  },
  methods: {
    getInfiniteSuggestedItemList($state) {
      if (this.pageCurrent && this.pageCurrent === this.pageTotal)
        $state.complete()
      else
        this.$axios
          .get(this.getInfiniteSuggestedItemEndpoint())
          .then((response) => {
            this.infiniteSuggestedItemList.push(...response.data.item)
            this.pageCurrent = response.data.page.current
            this.pageTotal = response.data.page.total
            this.itemNumber = response.data.itemNumber
            $state.loaded()
            this.triggerByButtonInfiniteLoading = false
          })
    },
    getInfiniteSuggestedItemEndpoint() {
      let result = `item/suggested/items`
      result += `?pageSize=${this.infiniteSuggestedPageSize}`
      if (this.pageCurrent >= 1) result += `&pageNum=${this.pageCurrent + 1}`
      return result
    },
  },
}
</script>

<style>
.disabled {
  cursor: default !important;
}

.text-darkgreen {
  color: #347571;
}
</style>
