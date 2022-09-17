<template>
  <div class="main-page main-page-search flex-grow hotels-list-page">
    <div class="booking-form">
      <div class="container">
        <booking-form @run="runPusher"/>
      </div>
    </div>
    <div class="hotels-list" v-if="hotels && hotels.length && !this.isLoading">
      <div class="hotel-block" :key="hotel.id" v-for="hotel of hotels">
        <div class="container">

          <nuxt-link v-if="hotel.hotel" class="title" :to="`/hotel/${hotel.hotel.slug}`">
            <span class="title-text">{{hotel.hotel.name}}</span>
          </nuxt-link>
          <div class="rating" v-if="hotel.hotel">
            <span class="icon-star" v-for="star of hotel.hotel.stars"></span>
          </div>
        </div>
        <div v-if="hotel.hotel">
          <hotel-slick :imgList="toPlainArray(hotel.hotel.photos)" :id="hotel.id"></hotel-slick>
        </div>

        <div class="container">
          <div class="bottom-part">
            <p v-if="hotel.hotel">{{hotel.hotel.description}}</p>
            <div class="price-container">
              <span class="price">от {{formatPrice(hotel.min_price / getDaysInTimeRange()) }} Р / сутки</span>
              <button class="btn" @click="toRoomsPage(hotel)">Варианты размещения</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotels-list no-hotels" v-else-if="!this.isLoading">
      <div class="container">
        <div class="top-block">
          <span class="pre-title">На
            <span>{{startDate | moment("DD MMMM YYYY") }}</span> -
            <span>{{endDate | moment("DD MMMM YYYY") }}</span> нет доступных номеров
          </span>
          <p>На календаре показана доступность на другие даты.</p>
          <p>Также ниже вы можете оставить заявку на выбранные даты, и мы сообщим, когда появятся свободные номера.</p>
        </div>
        <div class="form">
          <span class="form-title">Заполните заявку</span>
          <div class="dates">
            <span class="icon-calendar"></span>
            <span>{{startDate | moment("DD MMMM YYYY") }}</span>
            <span class="divider">-</span>
            <span>{{endDate | moment("DD MMMM YYYY") }}</span>
          </div>
          <p>Мы сообщим вам, когда появятся свободные номера</p>
          <div class="input-line flex w-full">
            <div class="input-group" :class="{'hasError': !this.name && this.hasError}">
              <label>Имя</label>
              <input type="text" v-model="name">
            </div>
            <div class="input-group" :class="{'hasError': !this.isEmailValid && this.hasError}">
              <label>Электронная почта</label>
              <input type="text" v-model="email">
            </div>
          </div>
          <div class="input-group checkboxes" :class="{'hasError': !this.policy && this.hasError}">
            <div class="checkbox-line">
              <input type="checkbox" id="extraInfo" v-model="policy">
              <label for="extraInfo">Я согласен с <nuxt-link to="/">обработкой персональных данных</nuxt-link> и <nuxt-link to="/">политикой конфиденциальности</nuxt-link></label>
            </div>
            <button class="btn" @click="formSubmit">Оставить заявку</button>
          </div>
        </div>
      </div>
    </div>
    <div class="hotels-list empty" v-else style="min-height:350px;"></div>
    <transition name="fade">
      <div class="modal modal-review-accept" v-if="modal">
        <div class="modal-overlay" @click="modal = !modal"></div>
        <div class="modal-container">
          <div class="modal-header">Ваш запрос получен!</div>
          <div class="modal-body">Мы уведомим вас, при наличии свободных номеров на эти даты</div>
          <div class="modal-footer"><button class="btn" @click="modal = !modal">Закрыть</button></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

const BookingForm = () => import ("@/components/BookingForm")
const HotelSlick = () => import ("@/components/HotelSlick")
export default {
  name: "SearchResults",
  layout: 'MainLayout',
  components: {BookingForm, HotelSlick},
  async asyncData({store}) {
  },
  data() {
    return {
      hasError: '',
      name: '',
      email: '',
      policy: false,
      modal: false
    }
  },
  head() {
    return {
      title: 'Поиск вариантов размещения',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Поиск дешевых вариантов размещения'
        }
      ],
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.preloader
    },
    isEmailValid () {
      return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(this.email);
    },
    hotels() {
      return this.$store.state.hotelsList
    },
    startDate(){
      return this.$store.state.formData.startDate
    },
    endDate(){
      return this.$store.state.formData.endDate
    }
  },

  methods: {
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    async formSubmit() {
      !this.isEmailValid || !this.name || !this.policy ? this.hasError = true : this.hasError = false
      if (!this.hasError) {
        try {
          let formData = {...this.$store.state.formData}
          formData.name = this.name
          formData.email = this.email
          await this.$store.dispatch('sendFeedback', formData)
          this.modal = true
        } catch (e) {
          console.log(e)
        }
      }
    },
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
      this.$router.push({
        path: `/hotel/${hotel.hotel.slug}`
      })
    },
    toRoomsPage(hotel) {
      console.log(hotel)
      this.$store.commit('SET_SELECTED_HOTEL', hotel)
      this.$router.push({
        path: `/search/${this.$route.params.uid}/${hotel.id}`
      })
    },
    async fetchHotels(UID) {
      this.$store.commit('PRELOADER_TOGGLE', true)
      try{
        await this.$store.dispatch('fetchHotels',UID)
        this.$store.commit('PRELOADER_TOGGLE', false)
      } catch (e) {
        this.$store.commit('PRELOADER_TOGGLE', false)
        console.log(e)
      }
    },
    async runPusher(UID) {
      await this.$store.dispatch('runPusher', UID)
    }
  },
  async mounted() {
    let UID = this.$route.params.uid
    let searchInProgress = this.$store.state.hotelsSearchInProgress
    if (searchInProgress) await this.runPusher(UID)
                     else await this.fetchHotels(UID)
  }
}
</script>
<style lang="less">
.main-page{
  background: #F4F6FC;
}
@media (max-width: 767px) {
  .main-page-search{
    .slick-container {
      padding-left: 0 !important;
    }
  }

}
</style>
