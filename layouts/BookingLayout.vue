<template>
  <div class="app-wrapper booking-app-wrapper">
    <transition name="fade">
      <loader class="preloader-container" v-if="preloader" object="#133361" color1="#1F5299" color2="#1F5299" size="10" speed="2" bg="#343a40" objectbg="#999793" opacity="60" name="dots"></loader>
    </transition>
    <page-header class="main-header"/>
    <div class="main-content">
      <div class="search-form">
        <booking-form-short :disabled="true"/>
      </div>
      <nuxt/>
    </div>
    <page-footer/>
  </div>
</template>



<script>
const PageHeader = () => import ("../components/PageHeader")
const BookingFormShort = () => import ("@/components/BookingFormShort")
const PageFooter = () => import ("../components/PageFooter")

export default {
  name: "MainLayout",
  components: {
    PageHeader, PageFooter, BookingFormShort
  },
  computed: {
    preloader() {
      return this.$store.state.preloader
    }
  },
  watch: {
    '$route': function(to,from){
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },
  beforeMount() {
    console.log("hotel.slug")
    console.log(window.location.href)
    history.pushState(
      {},
      null,
      window.location.href.replace(/\/hotel\/(.+\/|.+$)/, '/')
    )
  }
}
</script>

<style lang="less">
.booking-app-wrapper{
  display:flex;
  flex-direction: column;
  height:100%;
  .disabled{
    .booking-main-form input,
    .icon-calendar,
    .vs__selected,
    .icon-lock,
    .promo-toggle,
    .vs__open-indicator{
      color:#CCCCCC !important;
    }
    .vs--disabled .vs__clear, .vs--disabled .vs__dropdown-toggle, .vs--disabled .vs__open-indicator, .vs--disabled .vs__search, .vs--disabled .vs__selected{
      background:#FFFFFF!important;

    }
  }

}
@media(max-width:767px){
}

</style>
