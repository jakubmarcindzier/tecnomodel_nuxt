<template>
  <section class="pt-4 px-0 px-md-4">
    <b-container fluid>
      <b-breadcrumb class="bg-white border">
        <b-breadcrumb-item to="/">
          <font-awesome-icon class="main-color" icon="home" size="lg" />
        </b-breadcrumb-item>
        <b-breadcrumb-item active>Contatti</b-breadcrumb-item>
      </b-breadcrumb>
      <b-row>
        <b-col md="6" class="mb-4">
          <b-card>
            <div class="d-flex flex-column">
              <font-awesome-icon
                icon="store"
                size="5x"
                class="main-color pb-4 align-self-center"
              />
              <h4 class="align-self-center">Negozio</h4>
            </div>
            <div class="p-md-4">
              <vue-slick-carousel
                ref="sliderFor"
                :as-nav-for="$refs.sliderNav"
                v-bind="slickCarouselSettings.for"
              >
                <b-img
                  v-for="(imagePath, id) in imagePathShop"
                  :key="id"
                  :src="$config.oldBaseUrl + imagePath"
                />
              </vue-slick-carousel>
              <div class="mx-auto d-none d-lg-block">
                <vue-slick-carousel
                  ref="sliderNav"
                  :as-nav-for="$refs.sliderFor"
                  v-bind="slickCarouselSettings.nav"
                >
                  <div
                    v-for="(imagePath, id) in imagePathShop"
                    :key="id"
                    class="mx-2 p-1 bg-white"
                  >
                    <b-img
                      alt="Negozio"
                      :src="$config.oldBaseUrl + imagePath"
                      class="img-top-alt"
                    />
                  </div>
                </vue-slick-carousel>
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col md="6" class="mb-4">
          <b-row>
            <b-col md="6" class="mb-4 text-center text-md-left">
              <b-card class="h-100">
                <font-awesome-icon
                  icon="map-location-dot"
                  size="5x"
                  class="main-color pb-4"
                />
                <h4>Indirizzo</h4>
                <p class="text-muted">
                  Tecnomodel<br />
                  Via Pian di Rota, 25 int. 1<br />
                  57121 Livorno LI
                </p>
              </b-card>
            </b-col>
            <b-col md="6" class="mb-4 text-center text-md-left">
              <b-card>
                <font-awesome-icon
                  :icon="['far', 'clock']"
                  size="5x"
                  class="main-color pb-4"
                />
                <h4>Orari</h4>
                <p class="text-muted">
                  <strong>Lunedì:</strong> chiuso al pubblico
                  <br />
                  <strong>Dal Martedì al Venerdì:</strong> 15.30 - 19.00
                </p>
                <b-alert :show="!!shopMessage" variant="danger">
                  <strong
                    ><font-awesome-icon
                      icon="exclamation-triangle"
                      class="mr-1"
                    />
                    {{ shopMessage }}</strong
                  >
                </b-alert>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12" class="text-center text-md-left">
              <b-card>
                <font-awesome-icon
                  icon="headset"
                  size="5x"
                  class="main-color pb-4"
                />
                <h4>Contatti</h4>
                <p class="mt-4">
                  Consulta la pagina
                  <b-link :href="$config.supportWebsite + 'it'"
                    >Assistenza clienti</b-link
                  >
                  per trovare subito tutte le risposte alle tue domande o
                  scriverci.
                </p>
                <p class="mt-4">
                  <span class="h4">Serve aiuto? Clicca qui</span>
                  <font-awesome-icon
                    icon="hand-point-right"
                    size="lg"
                    class="main-color ml-2 mr-2"
                  />
                  <b-button :href="$config.supportWebsite + 'it'"
                    >Assistenza clienti <font-awesome-icon icon="headset"
                  /></b-button>
                </p>
                <p>
                  <strong>
                    <font-awesome-icon icon="envelope" class="main-color" />
                    Scrivici</strong
                  ><br />info@tecnomodel-treni.it
                </p>
                <p>
                  <strong
                    ><font-awesome-icon icon="phone" class="main-color" />
                    Telefona</strong
                  ><br />+39 0586 407558 <br />Lunedì - Venerdì, 10.00 - 12.00 /
                  16.00 - 18.00
                  <br />
                  <span class="small"
                    ><strong>Supported languages:</strong> Italian, English and
                    French.</span
                  >
                </p>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12" class="mb-4 text-center text-md-left">
          <b-card>
            <font-awesome-icon
              icon="map-location-dot"
              size="5x"
              class="main-color pb-4"
            />
            <h4>Come raggiungerci</h4>
            <p class="text-muted">
              Dalla variante Aurelia uscita LIVORNO ZONA INDUSTRIALE.
            </p>
            <iframe
              width="600"
              height="450"
              style="border: 0"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBs5nHOFMC48FCcO9X07BhTQ_vl-aDrRfE&q=Tecnomodel%20Modellismo%20Ferroviario"
              allowfullscreen=""
            >
            </iframe>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { urlMixin } from '@/mixins/urlMixin'

export default {
  name: 'ContactsPage',
  components: {
    VueSlickCarousel,
  },
  mixins: [urlMixin],
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
          dots: this.immagini > 1,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                dots: false,
              },
            },
            {
              breakpoint: 376,
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
          responsive: [
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 376,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        },
      },
      imagePathShop: [
        'image_shop/001.jpg',
        'image_shop/002.jpg',
        'image_shop/003.jpg',
        'image_shop/004.jpg',
        'image_shop/005.jpg',
        'image_shop/006.jpg',
      ],
      shopMessage: null,
      env: process.env,
    }
  },
  head() {
    return {
      title: this.$t('title.contacts'),
      titleTemplate: '%s - ' + this.$t('titleTemplate'),
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.getUrl(),
        },
      ],
    }
  },
  mounted() {
    this.getOpeningHoursException()
  },
  methods: {
    getOpeningHoursException() {
      this.$axios
        .get('shop-message/hours-exception')
        .then((res) => {
          if (res.data.message) this.shopMessage = res.data.message
        })
        .catch((err) => {
          this.error = err
        })
    },
  },
}
</script>

<style>
.img-top-alt {
  width: 100%;
  height: 75px;
  object-fit: contain;
}
</style>
