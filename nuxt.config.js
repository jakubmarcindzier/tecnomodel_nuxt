import axios from 'axios'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tecnomodel',
    htmlAttrs: {
      lang: 'it',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  googleFonts: {
    families: {
      Ubuntu: true,
      Raleway: {
        wght: [100, 400],
        ital: [100],
      },
    },
    display: 'swap',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/custom.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/countdownTimer.client.js', '@/plugins/device.server.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
    '@nuxtjs/google-fonts',
    '@nuxtjs/pwa',
    'nuxt-purgecss',
  ],

  purgeCSS: {
    paths: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js'
    ],
    styleExtensions: ['.css'],
    whitelist: ['body', 'html', 'nuxt-progress'],
    extractors: [
      {
        extractor: content => content.match(/[A-z0-9-:\\/]+/g) || [],
        extensions: ['html', 'vue', 'js']
      }
    ]
  },

  fontawesome: {
    icons: {
      solid: [
        'faPhone',
        'faExclamationTriangle',
        'faArrowUp',
        'faHome',
        'faAngleRight',
        'faSearch',
        'faCheck',
        'faArrowAltCircleRight',
        'faArrowAltCircleLeft',
        'faShoppingCart',
        'faStopwatch',
        'faTimes',
        'faInfoCircle',
        'faPercentage',
        'faCalendarCheck',
        'faFire',
        'faSyncAlt',
        'faClock',
        'faUser',
        'faBoxOpen',
        'faHeart',
        'faCreditCard',
        'faHeadset',
        'faSignOutAlt',
        'faPen',
        'faTh',
        'faList',
        'faMinus',
        'faPlus',
        'faTrash',
        'faAngleLeft',
        'faClipboardCheck',
        'faStore',
        'faMapLocationDot',
        'faHandPointRight',
        'faEnvelope',
        'faPiggyBank',
        'faSignInAlt',
        'faSync',
        'faTruck',
        'faWrench',
        'faGift',
        'faChevronDown',
      ],
      brands: ['faFacebookSquare', 'faYoutubeSquare'],
      regular: ['faClock', 'faHeart'],
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    // 'nuxt-ssr-cache',
    '@nuxtjs/sitemap',
    'nuxt-facebook-pixel-module',
    '@nuxt/image',
  ],

  facebook: {
    track: 'PageView',
    pixelId: process.env.FACEBOOK_PIXEL_ID,
    autoPageView: true,
    disabled: false,
  },

  image: {
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1536,
      '2xl': 1536,
    },
    domains: [
      'www.tecnomodel-treni.it',
      'www.tecnomodel-treni.com',
      'www.tecnomodel-treni.test',
    ],
    dir: 'assets/img',
  },

  cache: {
    useHostPrefix: false,
    pages: [''],
    /* pages: [
      /^\/$/,
      /^\/i\/[a-zA-Z0-9-]*\/\d+$/,
      /^\/b\/[a-zA-Z0-9-/]*\/\d+$/,
    ], */
    key(route, context) {
      // custom function to return cache key, when used previous
      // properties (useHostPrefix, pages) are ignored. return
      // falsy value to bypass the cache
      if (route === '/') {
        return 'page:home:string'
      }
      const pages = ['i', 'b']
      let page = route.substr(1).split('/')
      if (!pages.includes(page[0])) return false
      page = page.join('.')
      return `page:${page}:string`
    },
    store: {
      type: 'memory',
      max: 100,
      ttl: 60,
    },
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  pwa: {
    manifest: {
      name: 'TecnoModel',
      short_name: 'TecnoModel',
      theme_color: '#FF9900',
      lang: 'it',
    },
  },

  bootstrapVue: {
    bootstrapCSS: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.API_URL,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: true,
    extractCSS: true,
    optimization: {
      minimize: true,
      // splitChunks: {
      //   chunks: 'all',
      //   automaticNameDelimiter: '.',
      //   name: true,
      //   maxSize: 244000,
      //   cacheGroups: {
      //     vendor: {
      //       name: 'node_vendors',
      //       test: /[\\/]node_modules[\\/]/,
      //       chunks: 'all',
      //       maxSize: 244000
      //     }
      //   }
      // }
      // splitChunks: {
      //   chunks: 'all',
      //   automaticNameDelimiter: '/',
      //   cacheGroups: {
      //     commons: {
      //       test: /node_modules[\\/](vue|vue-loader|vue-router|vuex|vue-meta|core-js|@babel\/runtime|axios|webpack|setimmediate|timers-browserify|process|regenerator-runtime|cookie|js-cookie|is-buffer|dotprop|url-polyfill|@nuxt[\\/]ufo|ufo|nuxt\.js)[\\/]/,
      //       chunks: 'all',
      //       name: true,
      //       priority: 10
      //     }
      //   }
      // }
    },
    babel: {
      compact: true,
    },
    postcss: {
      plugins: {
        "@fullhuman/postcss-purgecss": {
          extractors: [
            {
              extractor: content =>
                content
                  .replace(/<style[\s\S]*>[\s\S]*<\/style>/gi, "")
                  .match(/[\w-/:]+/g) || [],

              extensions: ["vue"]
            }
          ]
        }
      }
    }
  },

  auth: {
    strategies: {
      local: {
        // scheme: "refresh",
        token: {
          property: 'token', // property name that the Back-end sends for you as a access token for saving on localStorage and cookie of user browser
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: {
          property: '',
          autoFetch: true,
        },
        // refreshToken: {  // it sends request automatically when the access token expires, and its expire time has set on the Back-end and does not need to we set it here, because is useless
        // property: "refresh_token", // property name that the Back-end sends for you as a refresh token for saving on localStorage and cookie of user browser
        // data: "refresh_token", // data can be used to set the name of the property you want to send in the request.
        // },
        endpoints: {
          login: { url: 'login', method: 'post' },
          // refresh: { url: "/api/auth/refresh-token", method: "post" },
          logout: false, // we don't have an endpoint for our logout in our API and we just remove the token from localstorage
          user: { url: 'user/account', method: 'get' },
        },
      },
    },
  },

  i18n: {
    lazy: true,
    langDir: 'locales/',
    locales: [
      /* {
        name: 'English',
        code: 'en',
        iso: 'en',
        file: 'en',
        domain: 'tecnomodel.com',
      }, */
      {
        name: 'Italiano',
        code: 'it',
        iso: 'it',
        file: 'it',
        domain: 'tecnomodel.it',
      },
    ],
    differentDomains: true,
    defaultLocale: 'it',
  },

  sitemap: {
    routes: async () => {
      const { data } = await axios.get(`${process.env.API_URL}sitemap`)
      return data.map((item) => `/i/${item.url}`)
    },
    exclude: [
      '/cart',
      '/checkout',
      '/dashboard',
      '/order',
      '/payments',
      '/profile',
      '/register',
      '/s',
      '/wishlist',
    ],
    // i18n: true, header xml not works and not add language to routes
  },

  publicRuntimeConfig: {
    companyBrand: 'Tecnomodel',
    companyName: 'Tecnomodel S.r.l.',
    companyAddress: 'Via Pian di Rota, 25 int. 1',
    companyZipcode: '57121',
    companyTown: 'Livorno',
    companyProvince: 'LI',
    companyCountry: 'Italia',
    companyTaxCode: 'IT01816530495',
    companyEmail: 'info@tecnomodel-treni.it',
    promoKey: '',
    companyPrivacyPolicyUrl: process.env.BASE_URL + '#privacy',
    baseUrl: process.env.BASE_URL,
    oldBaseUrl: process.env.OLD_BASE_URL,
    clsBaseUrl: process.env.CLS_BASE_URL,
    supportWebsite: process.env.SUPPORT_WEBSITE,
    axios: {
      baseURL: process.env.API_URL,
    },
  },
}
