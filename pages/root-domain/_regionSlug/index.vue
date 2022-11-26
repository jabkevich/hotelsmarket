<template>
  <div class="dynamic-page-content">
    <div v-if="staticPage" class="static-page-content">
      <div class="container">
        <div class="title"><div class="title-text">{{staticPage.meta_title}}</div></div>
        <div v-html="staticPage.text"></div>
      </div>
    </div>
    <div v-else class="main-page flex-grow hotels-list-page">
      <div class="hotels-list" v-if="hotels && hotels.length">
        <div class="hotel-block" :key="hotel.id" v-for="hotel of hotels">
          <div class="container">
            <div class="title" @click="toHotelPage(hotel)">
              <span class="title-text">{{hotel.name}}</span>
            </div>
            <div class="rating">
              <span class="icon-star" v-for="star of hotel.stars"></span>
            </div>
          </div>
          <div v-if="hotel.photos.length">
            <hotel-slick :imgList="toPlainArray(hotel.photos)" :id="hotel.id"></hotel-slick>
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
  </div>


</template>

<script>

const BookingForm = () => import ("@/components/BookingForm")
const HotelSlick = () => import ("@/components/HotelSlick")
export default {
  name: "SearchResultsRegion",
  layout: 'MainLayout',
  components: {BookingForm, HotelSlick},
  async asyncData({store, route}) {
    let staticPage = null,
        regionPage = null
    let result = await store.dispatch('staticPageCheck', route.params.regionSlug)
    if (result) {
      staticPage = result.success ? result.page : null
    }
    let hotelPageResult = await store.dispatch('regionCheck', route.params.regionSlug)
    if (hotelPageResult) {
      regionPage = hotelPageResult.success ? hotelPageResult.region : null
    }
    return {staticPage, regionPage}
  },

  data() {
    return {
    }
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
      return this.staticPage ? this.staticPage.meta_title  || '' : this.regionPage.meta_title || `${this.regionPage.name || ''} . Бронирование по низким ценам.`
    },
    pageDescription () {
      return this.staticPage ? this.staticPage.meta_description || '' : this.regionPage.meta_description ||  this.regionPage.name ? `Забронируйте проживание в ${this.regionPage.name} по самым низким ценам` : 'Забронируйте проживание по самым низким ценам'
    },
    hotels() {
      return this.$store.state.hotelsList
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
      // console.log(this.$router)
      // this.$router.push(`${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}`)
      window.location.href = (`https://${hotel.slug}.hotelsmarket.ru/hotel/${hotel.slug}`)
    },
    toRoomsPage(hotel) {
      this.$store.commit('SET_SELECTED_HOTEL', hotel)
      // this.$router.push(`${hotel.slug}.hotelsmarket.ru/${hotel.slug}/rooms`)
      window.location.href = (`https://${hotel.slug}.hotelsmarket.ru/${hotel.slug}/rooms`)
    },
    async fetchHotels(searchParams) {
      try{
        await this.$store.dispatch('fetchHotelsByLocationSlug', searchParams)
      } catch (e) {
        this.$store.commit('PRELOADER_TOGGLE', false)
        console.log(e)
      }
    },
  },
  async mounted() {
    console.log(this.regionPage)
    this.$store.commit('PRELOADER_TOGGLE', true)
    if ( !this.staticPage && this.regionPage) {
      let searchParams = {region_slug: this.$route.params.regionSlug}
      if (this.$route.params.citySlug) searchParams.city_slug = this.$route.params.citySlug
      await this.fetchHotels(searchParams)
    }
    this.$store.commit('PRELOADER_TOGGLE', false)

  }
}
</script>
<style lang="less">
.main-page{
  background: #F4F6FC;
}
.static-page-content {;
  padding: 20px 0 40px;
  font-family: 'intro', serif !important;
  font-size:15px;
  span, p, li, a {
    font-family: 'intro', serif !important;
  }
}
.title {
  background: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  border: none;
  justify-content: space-between;

  .title-text {
    text-align: left;
  }
  .title-text {
    display: flex;
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 64px;
    color: #333333;
    margin-bottom: 10px;
    span {
      margin-right: 10px;
    }
  }
}
@media(max-width:1024px){
  .static-page-content{
    .title{
      .title-text{
        font-size:32px !important;
        line-height: 34px !important;
      }
    }
  }
}
@media(max-width:767px){
  .static-page-content{
    padding-bottom:20px;
    padding-top:0;
    .title{
      .title-text{
        font-size:22px !important;
        line-height: 22px !important;
      }
    }
  }
}
</style>
