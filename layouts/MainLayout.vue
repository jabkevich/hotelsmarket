<template>
  <div class="app-wrapper">
    <transition name="fade">
      <loader class="preloader-container" v-if="preloader" object="#133361" color1="#1F5299" color2="#1F5299" size="10" speed="2" bg="#343a40" objectbg="#999793" opacity="60" name="dots"></loader>
    </transition>
    <page-header class="main-header"/>
    <div class="main-content">
      <nuxt/>
    </div>
    <page-footer/>
  </div>
</template>



<script>
const PageHeader = () => import ("../components/PageHeader")
const PageFooter = () => import ("../components/PageFooter")

export default {
  name: "MainLayout",
  transition: 'main',
  components: {
    PageHeader, PageFooter
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

<style scoped lang="less">
.app-wrapper{
  display:flex;
  flex-direction: column;
  min-height:100%;
  .main-content{
    flex-grow: 1;
  }
}
.main-header{
  position: sticky !important;
  left: 0;
  top: 0;
  z-index: 99999;
}
</style>
