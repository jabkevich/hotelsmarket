<template>
  <div class="main-page flex-grow">
    <span class="title-border">
        <div class="container ">
          Бронирование отелей по всей России
        </div>
    </span>
    <div class="booking-form">
      <div class="container">
        <booking-form/>
      </div>
    </div>
    <tour-directions id="directions" :popularDirections="popularLocations" :allDirections="allLocations"/>
    <tour-comfort/>
    <hotels-info id="about" :text="meta.page.text"/>
    <feedback-block id="reviews" @dialog="reviewModal = !reviewModal"/>
    <transition name="fade">
      <div class="modal modal-review-accept" v-if="reviewModal">
      <div class="modal-overlay" @click="reviewModal = !reviewModal"></div>
      <div class="modal-container">
        <div class="modal-header">Спасибо!</div>
        <div class="modal-body">Отзыв успешно отправлен и будет опубликован после модерации</div>
        <div class="modal-footer"><button class="btn" @click="reviewModal = !reviewModal">Закрыть</button></div>
      </div>
    </div>
    </transition>
  </div>

</template>

<script>
import {mapActions} from "vuex";

const BookingForm = () => import ("../components/BookingForm")
const TourDirections = () => import ("../components/TourDirections")
const TourComfort = () => import ("../components/TourComfort")
const HotelsInfo = () => import ("../components/HotelsInfo")
const FeedbackBlock = () => import ("../components/FeedbackBlock")
export default {
  name: "MainPage",
  layout: 'MainLayout',
  components: { BookingForm, TourDirections, TourComfort, HotelsInfo, FeedbackBlock },
  async asyncData({store}) {
    const meta = await store.dispatch('mainPageMeta')
    const popularLocations = await store.dispatch('getPopularLocations')
    const allLocations = await store.dispatch('getAllLocations')
    return {popularLocations, allLocations, meta}
  },
  data () {
    return {
      reviewModal:false
    }
  },
  head() {
    return {
      title: this.meta.page ? this.meta.page.meta_title || '' : '',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.meta.page ? this.meta.page.meta_description || '': ''
        }
      ],
    }
  },
  methods: {
    ...mapActions([
        'getReviews'
    ])
  },
  mounted() {
    if (this.$route.params.scroll === 'directions') this.$scrollTo(document.querySelector('#directions'))
    if (this.$route.params.scroll === 'about') this.$scrollTo(document.querySelector('#about'))
    if (this.$route.params.scroll === 'reviews') this.$scrollTo(document.querySelector('#reviews'))
    this.getReviews()


  }
}
</script>
<style lang="less">
  .main-page{
    background: #F4F6FC;
  }
</style>
