<template>
  <div class="hotel-page flex-grow">
    <transition name="fade-in">
      <div class="darken-layout guests" v-if="guestBlock" @click="guestBlock = false"></div>
    </transition>
    <div class="top-block" :style="this.hotel.photos.length ? `background-image: url('${this.hotel.photos[0].url}')` : 'background: #ececec'">
        <div class="container">
          <div class="slider-controls">
            <span @click="previousSlide($refs.topSlick)" class="icon-arrow-left"></span>
            <span @click="nextSlide($refs.topSlick)" class="icon-arrow-right"></span>
          </div>
        </div>
        <div class="slick-container" v-if="hotelSlider">
          <VueSlickCarousel v-bind="settings" ref="topSlick" class="top-slick">
            <div class="slide" v-for="slide of comfortList">
              <div class="capture">
              <span class="title"><span class="title-text"><span
                  :class="slide.icon"></span> {{ slide.title }}</span></span>
                <span class="quantity">{{ slide.description }}</span>
              </div>
            </div>
          </VueSlickCarousel>
        </div>
      </div>
    <div class="hotel-description">
      <div class="container">
        <div class="title">
          <span class="name">{{this.hotel.name}}</span>
        </div>
        <p>{{this.hotel.description}}</p>
        <button class="learn-more-btn btn">Узнать больше об отеле</button>
      </div>
      </div>
    <div class="book-block">
      <div class="container">
        <span class="sub-title">Бронирование номеров</span>
        <p>Получите гарантированное заселение <span>прямо сейчас</span>!</p>
        <booking-form-short :nobg="true" :withLabels="true" :hotelId="this.hotel.id" :startOnMounted="true"/>
      </div>
    </div>
    <div class="rooms-list relative hotels-list-page">
      <transition name="fade">
        <loader class="local-preloader-container" v-if="this.localLoading" object="#133361" color1="#1F5299"
                color2="#1F5299" size="10" speed="2" bg="#343a40" objectbg="#999793" opacity="30"
                name="dots"></loader>
      </transition>
      <div v-if="roomsListFirst.length" class="container">
        <div class="title">
          <span class="name">Выберите номер</span>
          <nuxt-link :to="`${$route.fullPath}/rooms`" class="learn-more-btn btn mobile-hidden">Смотреть номера отеля</nuxt-link>
          <nuxt-link :to="`${$route.fullPath}/rooms`" class="learn-more-btn btn-mobile btn-link">Смотреть номера<span class="icon-arrow-right"></span></nuxt-link>
        </div>
        <div class="rooms-wrapper">
          <hotel-room :room="room" :withPrice="true" :key="room.id" :services="services" v-for="room of roomsListFirst"/>
        </div>
<!--        <div class="others">
          <div class="others-blocks">
            <div class="block" :key="roomMini.id" v-for="roomMini of roomsList" :style="{ 'background-image' : 'url(/imgs/' + roomMini.imgs[0] + ')'}"></div>
          </div>
          <button class="btn">Смотреть все номера</button>
        </div>-->
      </div>
      <div v-else-if="this.isMounted && !this.localLoading" class="container no-hotels">
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
    <div class="hotel-features" v-if="this.hotel.opportunities && this.hotel.opportunities.length">
      <div class="container">
        <div class="title">
          <span class="title-text">Возможности отеля</span>
          <div class="slider-controls">
            <span @click="previousSlide($refs.featureSlick)" class="icon-arrow-left"></span>
            <span @click="nextSlide($refs.featureSlick)" class="icon-arrow-right"></span>
            <button class="btn">Смотреть все</button>
          </div>
          <button class="btn-link btn-mobile">Смотреть все<span class="icon-arrow-right"></span></button>
        </div>
      </div>
      <div class="slick-container">
        <VueSlickCarousel v-bind="settings" ref="featureSlick">
          <div class="slide" :key="slide.id" v-for="slide of this.hotel.opportunities">
            <div class="img-wrapper" :style="{ 'background-image' : 'url(' + slide.img_url + ')' }">
            </div>
            <div class="capture">
              <span class="title"><span class="title-text">{{slide.name}}</span><span class="icon-arrow-right"></span></span>
              <p>{{slide.description}}</p>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
<!--    <div class="spec-offer">
      <div class="container">
        <div class="title">
          <span class="title-text">Специальные предложения</span>
        </div>
        <div class="spec-wrapper">
          <div class="block">
            <div class="top">
              <div class="icon-wrapper">
                <span class="icon-cashback"></span>
              </div>
              <span class="name">20% Кешбэк<br>на проживание осенью 2021</span>
            </div>
            <p>На проживание с 01 октября по 24 декабря и оплате на сайте с 16 июня по 31 августа картой «МИР»</p>
            <span class="more">Подробнее</span>
          </div>
          <div class="block">
            <div class="top">
              <div class="icon-wrapper">
                <span class="icon-car"></span>
              </div>
              <span class="name">Трансфер <br>из любой точки</span>
            </div>
            <p>Автомобили бизнес-класса к вашим услугам</p>
            <span class="more">Подробнее</span>
          </div>
          <div class="block">
            <div class="top">
              <div class="icon-wrapper">
                <span class="icon-yacht"></span>
              </div>
              <span class="name">Экскурсии весной <br>2021</span>
            </div>
            <p>Более 20 вариантов незабываемых приключений</p>
            <span class="more">Подробнее</span>
          </div>
          <div class="block">
            <div class="top">
              <div class="icon-wrapper">
                <span class="icon-golf"></span>
              </div>
              <span class="name">Геленджик Гольф <br>Резорт</span>
            </div>
            <p>Гольф-клуб мирового уровня</p>
            <span class="more">Подробнее</span>
          </div>
        </div>
      </div>
    </div>-->
    <div class="gallery">
      <div class="container">
        <div class="title"><span class="title-text">Галерея</span></div>
        <div class="gallery-container">
          <grid-gallery :gallery-array="this.hotel.photos" :mobile="mobileCheck"/>
        </div>
      </div>

    </div>
    <div class="feedback-block">
      <hotel-feedback :reviews="this.hotel.reviews"/>
    </div>
    <div id="contactBlock" class="contact-block">
      <hotels-contacts :hotel="this.hotel"/>
    </div>
    <div class="similar-block" v-if="hotelSimilar">
      <div class="container">
        <div class="title">
          <span class="title-text">Похожие отели</span>
          <div class="slider-controls mobile-hidden">
            <span @click="previousSlide($refs.similarSlick)" class="icon-arrow-left"></span>
            <span @click="nextSlide($refs.similarSlick)" class="icon-arrow-right"></span>
          </div>
        </div>
      </div>
      <div class="slick-container">
        <VueSlickCarousel v-bind="settings" ref="similarSlick">
          <div class="slide" v-for="slide of this.hotel.similar.filter(item=>item.id !== this.hotel.id)" @click="toHotelPage(slide.slug)">
            <div class="img-wrapper" :style="slide.photos.length ? `background-image: url('${slide.photos[0].url}')` : 'background-image: url(/imgs/noimg.png)'">
            </div>
            <div class="capture">
              <span class="title"><span class="title-text">{{slide.name}}</span><span class="icon-arrow-right"></span></span>
              <div class="rating">
                <span v-for="star of slide.stars" class="icon-star"></span>
              </div>
            </div>
          </div>
        </VueSlickCarousel>
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
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import {mapState} from "vuex";
const HotelRoom = () => import ("@/components/HotelRoom")
const GridGallery = () => import ("@/components/GridGallery")
const HotelFeedback = () => import ("@/components/HotelFeedback")
const HotelsContacts = () => import ("@/components/HotelsContacts")
const BookingFormShort = () => import ("@/components/BookingFormShort")
export default {
  name: "HotelInfo",
  layout: 'MainLayout',
  scrollToTop: true,
  components: { VueSlickCarousel, HotelRoom, GridGallery, HotelFeedback, HotelsContacts, BookingFormShort },
  data () {
    return {
      isMounted: false,
      settings: {
        "dots": false,
        "arrows": false,
        "edgeFriction": 0.35,
        "infinite": false,
        "speed": 500,
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "variableWidth": true
      },
      modal: false,
      guests: '',
      comfortList: [
        {
          id: 1,
          icon: 'icon-images',
          title: 'Удобный поиск отелей',
          description: 'В поиске выберите город или отель, даты проживания, количество гостей, и мы найдем для вас самые лучшие предложения'
        },
        {
          id: 2,
          icon: 'icon-guaranteed',
          title: 'Гарантия лучших тарифов',
          description: 'Найдете дешевле - мы предоставим такую же цену и сделаем дополнительную скидку для вашей лучшей выгоды'
        },
        {
          id: 3,
          icon: 'icon-star',
          title: 'Безопасность бронирования',
          description: 'Сервис работает с партнерами напрямую, это позволяет гостям не беспокоится о достоверности их цен и услуг'
        },
        {
          id: 4,
          icon: 'icon-card',
          title: 'Бесплатная отмена',
          description: 'Во многих отелях действует бесплатная отмена бронирования, ищите эту информацию в описании места отдыха'
        },
      ],
      dateRangeOpen: false,
      datepickerTooltip: false,
      windowWidth: 0,
      guestBlock: false,
      activeIndex: 0,
      hasError: '',
      name: '',
      email: '',
      policy: false
    }
  },
  head() {
    return {
      title: this.hotel.meta_title || `Отель ${this.hotel.name}. Бронирование по низким ценам.`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.hotel.meta_description || `Забронируйте проживание в отеле ${this.hotel.name} по самым низким ценам.`
        }
      ],
    }
  },
  async asyncData({store, params}) {
    console.log("ALOOOOOOOOOO, ",  params.slug);
    const hotel = await store.dispatch('getHotelBySlug', params.slug)
    const region = (hotel.city.region.name).replace(' ', '+')
    const services = await store.dispatch('getServices') || []
    const address = `${hotel.zip_code}+${region}+${hotel.city.name}+${hotel.street_name}+${hotel.street_number}`
    store.commit('SET_LOCAL_SEARCH_DATA', null)
    return {hotel, services}
  },
  computed: {
    ...mapState(['formData', 'localLoading', 'localSearchResult']),
    dates: {
      get () {
        let array = []
        if (this.$store.state.formData.startDate && this.$store.state.formData.endDate) {
          array.push(this.$store.state.formData.startDate)
          array.push(this.$store.state.formData.endDate)
        }
        return array
      },
      set (value) {
        this.$store.commit('SET_FORM_DATE', value)
      }
    },
    hotelSlider() {
      return  this.windowWidth > 767 ? true : +process.env.SHOW_HOTEL_SLIDER
    },
    isEmailValid () {
      return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(this.email);
    },
    hotelSimilar() {
      return this.hotel.similar.filter(item=>item.id !== this.hotel.id).length && +process.env.SHOW_HOTEL_SIMILAR ? true : false;
    },
    rooms () {
      return this.formData.accommodation
    },
    totalAdults() {
      let array = [...this.formData.accommodation]
      let result = 0
      array.forEach(item => result = item.adults + result)
      return result === 1 ? `${result} взрослый` : `${result} взрослых`
    },
    totalChildren(){
      let array = [...this.formData.accommodation]
      let result = 0
      array.forEach(item => {
        if (item.children) result = item.children.length + result
      })
      return result === 1 ? `${result} ребёнок` : result < 5 && result > 0 ? `${result} ребёнка` : `${result} детей`
    },
    totalRooms() {
      let array = [...this.formData.accommodation]
      return array.length === 1 ? `${array.length} номер` : array.length < 5 ? `${array.length} номера` : `${array.length} номеров`
    },
    roomsListFirst () {
      let list = []
      console.log(this.localSearchResult)
      if (this.localSearchResult) {
        console.log('1')
        this.localSearchResult.forEach(item => {
          console.log(item)
          console.log(item.id)
          console.log(this.hotel)
          if (item.id == this.hotel.api_id) {
            item.results.forEach(room => list.push(room))
          }
        })
      }
      return list
    },
    datePickerPositionStyle () {
      return this.windowWidth > 991 ? {'transform': 'translate(300px, 50px)'} : this.windowWidth > 768 ? {'transform': `translate(${this.windowWidth / 2 - 160}px, 50px)`} : {'transform': `translate(${this.windowWidth / 2 - 160}px, 50px)`}
    },
    valueFormattedFrom () {
      return this.dates ? this.dates[0] : ''
    },
    valueFormattedTo () {
      return this.dates ? this.dates[1] : ''
    },
    mobileCheck () {
      return this.windowWidth < 768
    }
  },
  methods: {
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
    removeYear(index){
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].children[index] > 1 ){
        let newValue = --array[this.activeIndex].children[index]
        this.$set(array[this.activeIndex].children, index, newValue)
      }
      this.$store.commit('SET_FORM_ROOMS', array)
    },
    addYear(index){
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].children[index] < 17){
        let newValue = ++array[this.activeIndex].children[index]
        this.$set(array[this.activeIndex].children, index, newValue)
        this.$store.commit('SET_FORM_ROOMS', array)
      }
    },
    removeChild() {
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].children){
        array[this.activeIndex].children.length > 1 ? array[this.activeIndex].children.splice(-1, 1) : this.$delete(array[this.activeIndex], 'children')
        this.$store.commit('SET_FORM_ROOMS', array)
      }

    },
    addChild() {
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].children) {
        array[this.activeIndex].children.push(1)
        //this.$set(this.rooms[this.activeIndex].children, this.rooms[this.activeIndex].children.length - 1, 1)
      } else {
        this.$set(array[this.activeIndex], 'children', [1])
      }
      this.$store.commit('SET_FORM_ROOMS', array)
    },
    removeAdult() {
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].adults > 1) --array[this.activeIndex].adults
      this.$store.commit('SET_FORM_ROOMS', array)
    },
    addAdult(){
      let array = JSON.parse(JSON.stringify(this.$store.state.formData.accommodation))
      if (array[this.activeIndex].adults < 8) ++array[this.activeIndex].adults
      this.$store.commit('SET_FORM_ROOMS', array)
    },
    addRoom() {
      let array = [...this.$store.state.formData.accommodation]
      array.push({ adults:2 })
      this.$store.commit('SET_FORM_ROOMS', array)
    },
    activeRoom (index) {
      this.activeIndex = index
    },
    guestBlockToggle () {
      this.guestBlock = !this.guestBlock
    },
    toHotelPage(slug) {
      this.$router.push({
        path: `/hotel/${slug}`
      })
    },
    previousSlide (ref) {
      ref.prev()
    },
    nextSlide (ref) {
      ref.next()
    }
  },
  mounted() {
    if (this.$route.params.scroll === 'contactBlock') this.$scrollTo(document.querySelector('#contactBlock'))
    this.$store.commit('SET_LOCAL_UID', null)
    this.$store.commit('SET_SELECTED_HOTEL', this.hotel)
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
    this.isMounted = true
  }
}
</script>

<style lang="less">

.hotel-page{
  background:#F4F6FC;
  .darken-layout{
    left:0;
    top:0;
    position: fixed;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
  }
  .title{
    background: none;
    display:flex;
    align-items: center;
    flex-direction: row;
    border:none;
    justify-content: space-between;
    .btn{
      margin:0 0 0 30px;
    }
    .slider-controls{
      display:flex;
      span{
        display:flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width:42px;
        height:42px;
        background: #1F5299;
        color:#FFFFFF;
        font-size:14px;
        cursor: pointer;
        transition: 0.3s;
        box-sizing: border-box;
        &:hover{
          background: #3f78c7;
        }
        &:first-child{
          padding-right:1px;
        }
        &:nth-child(2){
          margin-left:30px;
          padding-left:3px;
        }
      }
    }
    .title-text{
      font-style: normal;
      font-weight: bold;
      font-size: 64px;
      line-height: 64px;
      color: #333333;
    }
  }
  & > .top-block{
    height:850px;
    max-height:850px;
    padding-bottom:70px;
    box-sizing: border-box;
    display:flex;
    flex-direction: column;
    justify-content: flex-end;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% auto ;
    .slide{
      width:400px !important;
      background:#1F5299;
      .title{
        background: none;
        display:flex;
        justify-content: flex-start;
        border:none;
        align-items: center;
        margin-bottom:10px;
        span{
          margin-right:5px;
        }
      }
    }
    .slider-controls {
      display: flex;
      justify-content: flex-end;
      margin-bottom:40px;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        background: #1F5299;
        color: #FFFFFF;
        font-size: 14px;
        cursor: pointer;
        transition: 0.3s;
        box-sizing: border-box;

        &:hover {
          background: #3f78c7;
        }

        &:first-child {
          padding-right: 1px;
        }

        &:last-child {
          margin-left: 20px;
          padding-left: 3px;
        }
      }
    }
  }
  .hotel-description{
    padding-bottom:40px;
    background: #FFFFFF;
    .title{
      border:none;
      display:flex;
      align-items: center;
      justify-content: space-between;
      width:100%;
      .name{
        font-weight: bold;
        font-size: 64px;
        line-height: 64px;
        color: #333333;
      }
      .learn-more-btn{
        margin:0;
      }
    }
    p{
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 20px;
      color: #666666;
      width:100%;
      white-space: pre-wrap;
    }
    .container{
      & >.btn {
        display: none;
      }
    }
  }
  .book-block{
    background: #1F5299;
    padding:35px 0;
    color:#FFFFFF;
    .sub-title{
      font-weight:bold;
      font-size: 18px;
      color: #FFFFFF;
    }
    p{
      font-size: 18px;
      margin:5px 0 30px;
      span{
        text-transform: uppercase;
      }
    }
    .form{
      display:flex;
      align-items: flex-end;
      .form-block{
        width:25%;
        margin-right:10px;
        position: relative;
        &:last-child{
          margin-right: 0;
        }
        label{
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          color: #FFFFFF;
          padding:0 15px;
          margin-bottom:10px;
        }
        input{
          background:#FFFFFF;
          height:47px;
          border-radius: 15px;
          border:none;
          padding:0 15px;
          margin:0;
        }
        .v-select{
          background:#FFFFFF;
          border-radius: 15px;
          height:47px;
          .icon-user{
            color:#1F5299 !important;
            transform: none !important;
            position: relative;
            right:10px;
            bottom:3px;
            z-index: 1;
          }
          .vs__selected{
            margin: 0;
            padding-left:10px;
          }
          .vs__dropdown-menu{
            border-radius: 15px;
            transform: translateY(10px);
          }
          input{
            height:46px;
            border:none;
          }
        }
        .btn{
          background:#FFFFFF;;
          color:#1F5299;
          margin:0;
          width:100%;
        }
        .icon-calendar{
          position: absolute;
          right:15px;
          bottom:15px;
          color:#1F5299;
          font-size:18px;
        }
      }
    }
    .mx-datepicker{
      display:none;
    }
    .room-block{
      color:#000;
      margin-right:10px;
      width:350px;
      background:white;
      height:48px;
      border-radius: 15px 15px 0 0;
      position: relative;
      z-index: 999999;
      &.closed{
        z-index: 10000;
        border-radius: 15px;
        .hidden-part{
          max-height:0;
          opacity: 0;
        }
      }
      .guests-preview{
        display:flex;
        height:100%;
        width:100%;
        min-width:100%;
        align-items: center;
        padding:0 15px;
        box-sizing: border-box;
        cursor: pointer;
        margin-bottom:0 !important;
        .content{
          flex-grow:1;
          display:flex;

          .icon-user{
            color:#CCCCCC;
            margin-right:10px;
          }
          .content-inner{
            flex-grow:1;
          }
          .number{
            font-weight: 700;
          }
        }
        .icon-arrow-down{

        }
      }
      .hidden-part{
        transition: 0.2s ease-in-out;
        max-height:800px;
        opacity: 1;
        overflow:hidden;
        z-index: 9;
        position: absolute;
        width:100%;
        background:#fff;
        top:48px;
        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.15);
        border-radius: 0 0 15px 15px;
        .rooms-info{
          display:flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          padding:0 0 0 15px;
          .plus{
            margin:0 5px;
          }
          .btn{
            background:#E0E6F8;
            color:#000;
            font-weight: normal;
            width:auto;
            display:flex;
            margin:0 10px 10px 0;
            padding:0 19px;
            border:1px solid #E0E6F8;
            height:45px;
            &.room-active{
              background: #E0E6F8;
              border:1px solid #1F5299;
              color:#000;
            }
            .btn-plus{
              margin:0 5px 0 0;
              font-size:24px;
              color:#1F5299;
            }
          }
        }
        .guests-control{
          margin:10px 0;
          .inner-line{
            display:flex;
            align-items: center;
            box-sizing: border-box;
            height:40px;
            .quantity{
              border:none;
              padding:0;
              width:20px;
              background: none;
              display:flex;
              justify-content: center;
              text-align: center;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;

            }
            &:hover{
              background: #ECEFF6;
            }
            padding:0 20px;
            .icon{
              font-size:24px;
              width:25px;
              display:flex;
              align-items: center;
              justify-content: center;
              color:#1F5299;
              cursor: pointer;
              user-select: none;
              &.icon-arrow-left,
              &.icon-arrow-right{
                font-size:14px;
              }
            }
            label{
              font-weight: normal;
              display:flex;
              flex-direction: column;
              flex-grow:1;
            }
          }
        }
      }
    }
  }
  .rooms-list{
    background: #FFFFFF;
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    padding-bottom:50px;
    min-height:300px;
    .title{
      border:none;
      display:flex;
      align-items: center;
      justify-content: space-between;
      width:100%;
      margin-bottom:30px;
      .name{
        font-weight: bold;
        font-size: 64px;
        line-height: 64px;
        color: #333333;
      }
      .learn-more-btn{
        margin:0;
        align-items: center;
      }
    }
    .rooms-wrapper{
      .hotel-room:last-child{
        .info{
          border:none;
        }
      }
      margin-top:10px;
    }
    .others{
      display:flex;
      width:100%;
      align-items: center;
      justify-content: center;
      margin-top:50px;
      .btn{
        margin:0 0 0 100px;
      }
    }
    .others-blocks{
      display:flex;
      align-items: center;
      .block{
        width:95px;
        height:95px;
        display:block;
        background-size: auto 100%;
        background-position: center;
        border-radius: 50%;
        margin-right:-50px;
        border:5px solid #FFFFFF;
      }
    }
  }
  .hotel-features{
    .capture {
      height: 110px;
      overflow: hidden;
    }
  }
  .similar-block{
    .capture {
      height: 60px;
      overflow: hidden;
    }
  }
  .hotel-features,
  .similar-block{
    background: #FFFFFF;
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    .slick-container{
      padding-top:10px;
      padding-bottom:50px;
      .slide{
        width:400px !important;
        .rating{
          span{
            margin-right:5px;
          }
        }
      }
      .img-wrapper{
        width:400px;
        height:436px;
      }
    }
  }
  .spec-offer{
    background: #FFFFFF;
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    padding-bottom:50px;
    .title {
      background: none;
      display: flex;
      align-items: center;
      flex-direction: row;
      border: none;
      justify-content: space-between;
      .title-text {
        font-style: normal;
        font-weight: bold;
        font-size: 64px;
        line-height: 64px;
        color: #333333;
      }
    }
    .spec-wrapper{
      display:flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .block{
        width:49.5%;
        padding:30px 30px 20px;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        border-radius: 25px;
        margin-bottom:15px;
        .top{
          display:flex;
          align-items: center;
          .name{
            font-weight: bold;
            font-size: 18px;
            line-height: 18px;
            color: #333333;

          }
        }
        .icon-wrapper{
          background: #F4F6FC;
          border-radius: 15px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1F5299;
          margin-right:15px;
          span{
            font-size:20px;
          }
        }
        p{
          font-size: 15px;
          line-height: 15px;
          color: #333333;
          margin: 30px 0;
        }
        .more{
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          color: #1F5299;
          display:flex;
          justify-content: flex-end;
        }
      }
    }
  }
  .gallery{
    padding: 0 0 50px;
    .title{
      margin-bottom:15px;
    }
    .gallery-container{
      margin: 0 -10px;
    }
  }
  .feedback-block{
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  }
  .contact-block{
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  }
  .similar-block{
    margin-bottom:0;
    box-shadow: none;
  }
}
@media(max-width:1920px){
  .hotel-page{
    & > .top-block {
      background-size: 100% auto ;
      height: 50vw;
      padding-bottom:3vw;
    }
    .rooms-list{
      .info{
        .bottom{
          .btn{
            width:200px;
          }
        }
      }
    }
  }
}
@media(max-width:1199px){
  .container > .title{
    font-size: 48px !important;
    line-height: 48px !important;
    .name{
      font-size: 48px !important;
      line-height: 48px !important;
    }
    .title-text{
      font-size: 48px !important;
      line-height: 48px !important;
    }
  }
}
@media(max-width:991px){
  .slick-container {
    .slide {
      .capture{
        .title{
          .title-text{
            font-size:18px !important;
          }
        }
      }
    }
  }
  .container > .title{
    font-size: 28px !important;
    line-height: 28px !important;
    .name{
      font-size: 28px !important;
      line-height: 28px !important;
    }
    .title-text{
      font-size: 28px !important;
      line-height: 28px !important;
    }
  }
}
@media(max-width:767px){
  .container > .title{
    font-size: 24px !important;
    line-height: 24px !important;
    align-items: baseline !important;
    .name{
      font-size: 24px !important;
      line-height: 24px !important;
    }
    .title-text{
      font-size: 24px !important;
      line-height: 24px !important;
    }
    .btn-link span{
      margin-left:5px;
      position: relative;
      top:1px;
    }
  }
  .hotel-page {
    & > .top-block {
      background-size: auto 100%;
      height: 80vw;
      padding-bottom: 15px;
      .slick-container{
        padding-left:15px !important;
      }
      .slider-controls{
        display:none;
      }
      .slide{
        width:260px !important;
        .capture{
          padding:10px 10px 10px 15px;
          .title {
            margin-bottom:5px;
            height:40px;
            .title-text {
              line-height: 16px !important;
              display: flex;
              align-items: center;
              span{
                margin-right:10px;
              }
            }
          }
          .quantity {
            font-size: 12px;
          }
        }
      }
    }
    .hotel-description{
      padding-bottom:20px;
      .title{
        padding-bottom:0;
        .btn{
          display:none;
        }
      }
      .container{
        & >.btn{
          display:flex;
          max-width:none;
          width:100%;
        }
      }
    }
    .book-block{
      background:none;
      padding:10px 0 0;
      .container{
        & > span,
        & > p {
          display:none;
        }
        .form{
          display:flex;
          flex-direction: column;
          .form-block{
            width:100%;
            margin:0 0 10px;
            .vs__dropdown-toggle{
              outline: none;
              border:none;
            }
            label{
              display:none;
            }
          }
        }
      }
    }
    .hotel-features{
      padding-bottom:0;
      .slider-controls{
        display:none;
      }
      .slick-container{
        padding-bottom:20px;
        .slide{
          width:250px !important;
          .img-wrapper{
            width:100%;
            height:270px;
          }
          .capture{
            padding:10px 10px 10px 15px;
            .title{
              .title-text{
                font-size:16px;
              }
              .icon-arrow-right{
                font-size: 12px;
              }
            }
            p{
              font-size:12px;
            }
          }
        }
      }
    }
    .gallery{
      padding-bottom:0;
    }
    .spec-offer{
      padding-bottom:10px;
      .spec-wrapper{
        flex-direction: column;
        .block{
          width:100%;
          margin:0 0 10px;
          padding:20px;
          .top{
            .name{
              font-size:16px;
            }
          }
          p{
            font-size:12px;
            margin:10px 0;
          }
          .more{
            font-size:12px;
          }
        }
      }
    }
    .similar-block {
      .container{
        & > .title{
          padding:15px 0 25px!important;
        }
      }
      .slick-container {
        padding-top: 0;
        padding-bottom: 20px;
        padding-left:15px !important;
        .slide {
          width: 280px !important;
          .img-wrapper{
            width:100%;
            height:300px;
          }
          .capture{
            padding:15px 10px 15px 15px;
            .title{
              font-size:16px !important;
              .title-text{
                font-size:16px !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
