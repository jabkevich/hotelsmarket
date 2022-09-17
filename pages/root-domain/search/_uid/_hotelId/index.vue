<template>
  <div class="rooms-page hotels-list-page">
    <div class="search-form">
      <booking-form-short/>
      <div class="rooms-list relative" v-if="roomsList.length">
        <div class="container">
          <div class="title">
            <span class="name">Выберите номер</span>
          </div>
          <div class="rooms-wrapper">
            <hotel-room :roomFull="room" :room="room" :withPrice="true" :key="`${room.id} + ${index}`"
                        v-for="(room,index) of roomsList"/>
          </div>
        </div>
        <transition name="fade">
          <loader class="local-preloader-container" v-if="this.localLoading" object="#133361" color1="#1F5299"
                  color2="#1F5299" size="10" speed="2" bg="#343a40" objectbg="#999793" opacity="30"
                  name="dots"></loader>
        </transition>
      </div>
      <div class="hotels-list no-hotels relative" v-else-if="this.isMounted">
        <transition name="fade">
          <loader class="local-preloader-container" v-if="this.localLoading" object="#133361" color1="#1F5299"
                  color2="#1F5299" size="10" speed="2" bg="#343a40" objectbg="#999793" opacity="30"
                  name="dots"></loader>
        </transition>
        <div class="container">
          <div class="top-block">
          <span class="pre-title">На выбранные даты нет доступных номеров</span>
            <p>Вы можете оставить заявку на выбранные даты, и мы сообщим, когда появятся свободные номера.</p>
          </div>
          <div class="form">
            <span class="form-title">Заполните заявку</span>
<!--            <div class="dates">
              <span class="icon-calendar"></span>
              <span>{{startDate | date}}</span>
              <span class="divider">-</span>
              <span>{{endDate | date}}</span>
            </div>-->
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
  </div>
</template>

<script>
import {fetchData} from "@/mixins/fetchData";
import {mapState} from "vuex";

const HotelRoom = () => import ("@/components/HotelRoom")
const BookingFormShort = () => import ("@/components/BookingFormShort")
export default {
  name: "rooms",
  layout: 'MainLayout',
  mixins: [fetchData],
  components: {BookingFormShort, HotelRoom},
  async asyncData({store}) {
  },
  data() {
    return {
      // roomsList: [],
      hotelIdFromURL: this.$route.params.hotelId,
      hasError: '',
      name: '',
      email: '',
      policy: false,
      modal: false,
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
    ...mapState(['localLoading', 'localSearchResult', 'selectedHotel']),
    isEmailValid () {
      return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(this.email);
    },
    roomsList () {
      let list = []
      if (this.localSearchResult && this.localSearchResult.length) {
        console.log('1')
        this.localSearchResult.forEach(item => {
          if (item.id == this.hotelIdFromURL) {
            item.results.forEach(room => list.push(room))
          }
        })
      } else if (this.selectedHotel){
        console.log('2')
        this.selectedHotel.results.forEach(room =>  list.push(room))
      }
      return list

    }
  },
  watch: {
    localSearchResult(value, oldValue) {
      console.log('watcher', value)
      let hotel = null
      value.forEach(item => {
        if (item.id === this.hotelIdFromURL) hotel = item
      })
      if (hotel) this.roomsListUpdate(hotel)
    }
  },
  methods: {
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    roomsListUpdate(hotel) {
      let rooms = []
      if (hotel) {
        hotel.results.forEach(item => rooms.push(item))
      }
      this.roomsList = rooms
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
    }
  },

  mounted() {
    this.$store.commit('SET_LOCAL_UID', null)
  }
}
</script>

<style scoped lang="less">
.local-preloader-container > div{
  position: absolute !important;
}
.rooms-list {
  background: #FFFFFF;
  .title {
    border: none;
    font-size: 64px;
    line-height: 64px;
    text-align: left;
    justify-content: flex-start;
    padding: 40px 0 50px;
  }
}

.search-form {
  background: #F4F6FC;
}
@media(max-width:991px) {
  .rooms-list{
    .title{
      font-size:34px;
      padding:20px 0;
    }
  }
}
</style>
