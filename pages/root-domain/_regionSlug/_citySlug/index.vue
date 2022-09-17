<template>
  <div class="main-page flex-grow hotels-list-page">
    <div class="hotels-list" v-if="isReadyToShow">
      <div class="hotel-block" :key="hotel.id" v-for="hotel of hotels">
        <div class="container">
          <div class="title" @click="toHotelPage(hotel)">
            <span class="title-text">{{hotel.name}}</span>
          </div>
          <div class="rating">
            <span class="icon-star" v-for="star of hotel.stars"></span>
          </div>
        </div>
        <div v-if="hotel.photos">
          <hotel-slick v-if="hotel.photos.length" :imgList="toPlainArray(hotel.photos)" :id="hotel.id"></hotel-slick>
        </div>
        <div class="container">
          <div class="bottom-part">
            <p>{{hotel.description}}</p>
            <div class="price-container">
              <!--              <span class="price">от {{Math.floor(hotel.min_price / getDaysInTimeRange())}} / сутки</span>-->
              <button class="btn" @click="toHotelPage(hotel)">Смотреть отель</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotels-list" v-else>
      <div class="container">
        <p style="padding-bottom:80px;"></p>
      </div>
    </div>
  </div>


</template>

<script>

const BookingForm = () => import ("@/components/BookingForm")
const HotelSlick = () => import ("@/components/HotelSlick")
export default {
  name: "SearchResultsRegionAndCity",
  layout: 'MainLayout',
  components: {BookingForm, HotelSlick},
  async asyncData({store, route}) {

    let regionPageResult = await store.dispatch('regionCheck', route.params.regionSlug)
    let regionPage = regionPageResult.success ? regionPageResult.region : null

    let cityPageResult = await store.dispatch('cityCheck', route.params.citySlug)
    let cityPage = cityPageResult.success ? cityPageResult.city : null

    return {regionPage, cityPage}
  },

  data() {
    return {}
  },
  head() {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.pageDescription
        }
      ],
    }
  },
  computed: {
    pageTitle (){
      return  this.cityPage ? this.cityPage.meta_title || `${this.cityPage.name}. Бронирование по низким ценам.` : 'Бронирование по низким ценам.'
    },
    pageDescription () {
      return  this.cityPage ? this.cityPage.meta_description ||  `Забронируйте проживание в ${this.regionPage.name} / ${this.cityPage.name} по самым низким ценам` : 'Бронирование по низким ценам.'
    },
    hotels() {
      return this.$store.state.hotelsList
    },
    isReadyToShow () {
      return this.hotels ? this.hotels.length ? true : false : false
    }
  },

  methods: {
    toPlainArray(array) {
      return array.map(item => item.url)
    },
    getDaysInTimeRange() {
      let start = new Date(this.$store.state.formData.startDate)
      let end = new Date(this.$store.state.formData.endDate)
      let timeDif = end.getTime() - start.getTime()
      return timeDif / (1000 * 3600 * 24)
    },
    toHotelPage(hotel) {
      console.log(this.$router)
      console.log(hotel.slug)
      // this.$router.push(`${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}`)
      window.location.href = (`https://${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}`)
    },
    toRoomsPage(hotel) {
      this.$store.commit('SET_SELECTED_HOTEL', hotel)
      // this.$router.push(`${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}/rooms`)
      console.log(hotel.slug)
      window.location.href = (`https://${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}/rooms`)
    },
    async fetchHotels(searchParams) {
      try{
        await this.$store.dispatch('fetchHotelsByLocationSlug', searchParams)
        this.$store.commit('PRELOADER_TOGGLE', false)
      } catch (e) {
        this.$store.commit('PRELOADER_TOGGLE', false)
        console.log(e)
      }
    },
    addHashToLocation(params) {
      history.pushState(
        {},
        null,
        "/"
      )
    }

  },
  async mounted() {
    this.$store.commit('PRELOADER_TOGGLE', true)
    if (this.regionPage && this.cityPage) {
      let searchParams = {region_slug: this.$route.params.regionSlug}
      if (this.$route.params.citySlug) searchParams.city_slug = this.$route.params.citySlug
      await this.fetchHotels(searchParams)
    }
    this.$store.commit('PRELOADER_TOGGLE', false)
    this.addHashToLocation('')
  },

}
</script>
<style lang="less">
.main-page{
  background: #F4F6FC;
}
</style>
