const axios = require('axios')
require('dotenv').config()


export default {
  publicRuntimeConfig: {
    API_URL: process.env.API_URL
  },
  loading: {
    color: 'white',
    height: '5px'
  },
  // Target: https://go.nuxtjs.dev/config-target

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'hotelsi-new',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'normalize.css/normalize.css',
    '@/assets/less/main-styles.less',
    '@/assets/css/icomoon.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/vue-select.js'},
    {src: '~/plugins/vue-scroll-to.js'},
    {src: '~/plugins/filters.js'},
    {src: '~/plugins/vue-datepicker.js'},
    {src: '~/plugins/vue-moment.js'},
    {src: '~/plugins/vue-slick.js'},
    {src: '~/plugins/vue-preloader.js',  mode: 'client'},
    {src: '~/plugins/vue-instantsearch.js', mode: 'client'},
    {src: '~/plugins/vue-star-rating.js', mode: 'client'},
    {src: '~/plugins/perfect-scrollbar.js'},
    {src: '~/plugins/vue-tooltip.js'},
    {src: '~/plugins/vue-collapse.js', mode: 'client'},
    //{src: '~/plugins/vkAuth.js', mode: 'client'},
    {src: '~/plugins/vue-lightbox.js', mode: 'client'},
    {src: '~/plugins/ymapPlugin.js',  mode: 'client' },
    {src: '~/plugins/vue-the-mask.js', mode: 'client'},
    {src: '~/plugins/vuelidate.js',  mode: 'all'},

  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/laravel-echo',
    '@nuxtjs/date-fns',
    '@nuxtjs/dotenv',
    ['@nuxtjs/router', { keepDefaultRouter: true }]
  ],
  dateFns: {
    defaultLocale: 'ru'
  },
  echo: {
    broadcaster: 'pusher',
    key: process.env.PUSHER_KEY,
    cluster: process.env.PUSHER_CLUSTER,
    forceTLS: true,
    logToConsole: true
  },
  ssr: true,
  target: 'server',

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/sentry'
  ],
  axios: {
    API_URL: process.env.API_URL
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-instantsearch', 'instantsearch.js/es']
  },
  render: {
    gzip: false
  },
  scrollBehavior: function (to, from, savedPosition) {
    return {x: 0, y: 0}
  },
}
