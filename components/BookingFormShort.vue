<template>
  <div class="booking-main-form booking-short-form" :class="{'nobg' : this.nobg, 'disabled': this.disabled}">
    <transition name="fade-in">
      <div class="darken-layout" v-if="dateRangeOpen" @click="dateRangeOpen = false"></div>
    </transition>
    <transition name="fade-in">
      <div class="darken-layout guests" v-if="guestBlock" @click="guestBlock = false"></div>
    </transition>
    <div class="flex p-4 line bottom-line top-line">
      <div class="flex flex-col middle-block date-block">
        <client-only>
          <date-picker class="w-full hidden class" popup-class="booking-form-datepicker" :popup-style="datePickerPosition"
                       :open.sync="dateRangeOpen"  v-model="newDates"
                       :disabled-date="disabledRange"
                       :confirm="this.windowWidth < 991" confirm-text="готово"
                       value-type="YYYY-MM-DD" type="date" range placeholder="Select date range">

            <span slot="icon-calendar" class="icon-calendar"></span>
            <div slot="footer" class="datepicker-footer">
            <span class="footer-title">
              Выберите дату заезда
              <div class="tooltip-wrapper">
                <i class="icon-info" @click="datepickerTooltip = !datepickerTooltip"></i>
                <div class="tooltip-content" v-if="datepickerTooltip">
                  <div class="tooltip-inner">
                    <span>Лучшие цены для 1 гостя за ночь</span>
                    <span>Цена может быть доступна при соблюдении специальных условий бронирования</span>
                     <i class="icon-close" @click="datepickerTooltip = !datepickerTooltip"></i>
                  </div>
                </div>
              </div>
            </span>
              <span>Лучшие цены для 1 гостя за ночь</span>
              <span>Цена может быть доступна при соблюдении специальных условий бронирования</span>
            </div>
          </date-picker>
        </client-only>
        <input type="text" @click="dateRangeOpen = true" v-model="valueFormattedFrom" readonly>
        <span class="icon-calendar"></span>
      </div>
      <div class="flex flex-col date-block date-to-block">
        <input type="text" @click="dateRangeOpen = true" v-model="valueFormattedTo" readonly >
        <span class="icon-calendar"></span>
      </div>
      <div class="flex p-4 line room-block" :class="{'closed': !this.guestBlock}">
        <div class="flex flex-row guests-preview" @click="guestBlockToggle">
          <div class="content">
            <span class="icon icon-user"></span>
            <div class="content-inner">
              <span>{{ totalAdults }}</span>,
              <span>{{ totalChildren }}</span> <span class="md-hidden">-</span>
              <span class="number">{{totalRooms}}</span>
            </div>

          </div>
          <span class="icon icon-arrow-down"></span>
        </div>
        <div class="hidden-part">
          <div class="rooms-info">
            <div class="room btn" :key="index" v-for="(room, index) of this.rooms" @click="activeRoom(index)" :class="{'room-active': activeIndex === index}">
              <span class="adults">{{room.adults}}</span>
              <span class="plus">+</span>
              <span class="children" v-if="room.children">{{room.children.length}}</span>
              <span class="children" v-else>0</span>
              <!--                <div class="remove-room" @click="roomRemove(index)"><span class="icon-close"></span></div>-->
            </div>
            <!--              <button @click="addRoom"  class="btn"><span class="btn-plus">+</span>Добавить номер</button>-->
          </div>
          <div class="guests-control" v-if="activeIndex !== null">
            <div class="inner-line adults">
              <label>Взрослые</label>
              <span @click="removeAdult" class="icon minus">-</span>
              <span class="quantity">{{ this.rooms[this.activeIndex].adults }}</span>
              <span @click="addAdult" class="icon plus">+</span>
            </div>
            <div class="inner-line children">
              <label>Дети</label>
              <span @click="removeChild" class="icon minus">-</span>
              <span class="quantity" v-if="this.rooms[this.activeIndex].children">{{ this.rooms[this.activeIndex].children.length }}</span>
              <span class="quantity" v-else>0</span>
              <span @click="addChild" class="icon plus">+</span>
            </div>
            <div class="inner-line age" :key="index" v-for="(child, index) of this.rooms[this.activeIndex].children">
              <label><span>Возраст </span><span>от 0 до 17 лет</span></label>
              <span @click="removeYear(index)" class="icon icon-arrow-left"></span>
              <input type="number" min="0" max="17" :value="child" class="quantity">
              <span @click="addYear(index)" class="icon icon-arrow-right"></span>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-white" @click="newSearch"><span v-if="hotelId">Найти номер</span><span v-else>Искать</span></button>
<!--      PROMO AND CURRENCY-->
<!--      <div class="promo-toggle flex">
        <div @click="promoToggle()" class="icon-wrapper">
          <span class="icon-lock"></span>
        </div>
        <span @click="promoToggle()">Ввести<br>промокод</span>
        <transition name="fade-up">
          <promo-form v-if="promoForm" @close="promoToggle()"/>
        </transition>
      </div>
      <div class="block currency-block">
        <v-select class="currency-select" :disabled="this.disabled" :options="currencyList" :clearable="false" label="name"
                  v-model="currency">
          <template v-slot:option="option">
            <div class="option">
              <span>{{ option.name }}</span>
            </div>
          </template>
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="icon-arrow-down"></span>
          </template>
        </v-select>
      </div>-->
    </div>
  </div>
</template>

<script>
import PromoForm from "@/components/PromoForm";
import {mapState} from "vuex";
export default {
  name: "BookingForm",
  components: {PromoForm},
  props: {
    disabled: {
      type: Boolean
    },
    nobg: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    startOnMounted: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    hotelId: {
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      activeIndex: 0,
      guestBlock: false,
      promoForm:false,
      languageList: [
          { id:1, name: 'ru', src: require('../assets/img/flags/ru.svg') },
          { id:2, name: 'eng', src: require('../assets/img/flags/us.svg') },
          { id:3, name: 'chi', src: require('../assets/img/flags/cn.svg') }
      ],
      language: { id:1, name: 'ru', src: require('../assets/img/flags/ru.svg') },
      currencyList: [
          {id:1, name: 'RUB'},
          {id:2, name: 'CN'},
          {id:3, name: 'USD'}
      ],
      adultList: [1,2,3,4,5],
      childrenList: [
        {id:1, name: 'Ребенок 1 год'},
        {id:2, name: 'Ребенок 2 года'},
        {id:3, name: 'Ребенок 3 года'}
      ],
      children: [],
      currency: {id:1, name: 'RUB'},
      rating: [],
      dateRangeOpen: false,
      momentAccept: false,
      showFee: true,
      ratingList: [
        {id: 0, name: 'Без'},
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'}
      ],
      ratingArray: [],
      windowWidth: 0,
      datepickerTooltip: false,
      newDates: ['', ''],
      isMounted: false
    }
  },
  computed: {
    ...mapState(['formData']),

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
    valueFormattedFrom () {
      return this.newDates && this.isMounted ? this.windowWidth > 991 ? this.$moment(this.newDates[0]).format('Do MMMM YYYY') : `${this.$moment(this.newDates[0]).format('Do MMMM YYYY')} - ${this.$moment(this.newDates[1]).format('Do MMMM YYYY')}` : ''
    },
    valueFormattedTo () {
      return this.newDates && this.isMounted ? this.windowWidth > 991 ? this.$moment(this.newDates[1]).format('Do MMMM YYYY') : [this.$moment(this.newDates[0]).format('Do MMMM YYYY'), this.$moment(this.newDates[1]).format('Do MMMM YYYY')] : ''
    },
    adults : {
      get () {
        if (this.$store.state.formData.accommodation && this.$store.state.formData.accommodation[0]) return `${this.$store.state.formData.accommodation[0].adults} взрослых`
      },
      set (value) {
        this.$store.commit('SET_FORM_ADULTS', value)
      }
    },
    ratingArrayFiltered: {
      get () {
        return this.ratingArray.sort( (a, b) => a.id - b.id)
      },
      set (value) {
        this.ratingArray = value
      }
    },
    datePickerPosition () {
      return this.windowWidth > 991 ? {'transform': 'translate(300px, -10px)'} :  {'margin': '-250px 0 0 -160px', 'left': '50%', 'top': '50%'}
    }
  },
  methods: {
    disabledRange: function (date) {
      return date < new Date();
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
    promoToggle () {
      if (!this.disabled) this.promoForm = !this.promoForm
    },
    async newSearch () {
        if (this.disabled) return
        let hotel = this.hotelId || this.$store.state.selectedHotel.hotel.id
        const formData = {...this.$store.state.formData}
        formData.type = 'hotel'
        formData.location_id = hotel
        formData.startDate = this.newDates[0]
        formData.endDate = this.newDates[1]
        try{
          await this.$store.dispatch('hotelsSearchLocal', formData)
        } catch (e) {
          console.log(e)
        }
    }
  },
  mounted() {
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
    if (this.$store.state.localSearchData) {
      let newArray = [this.$store.state.localSearchData.startDate, this.$store.state.localSearchData.endDate]
      this.newDates = newArray
    } else if (this.$store.state.formData.startDate && this.$store.state.formData.endDate) {
      let newArray = [this.$store.state.formData.startDate, this.$store.state.formData.endDate]
      this.newDates = newArray
    } else {
      this.newDates = [this.$moment(new Date).add(3, 'days').format('YYYY-MM-DD'), this.$moment(new Date).add(10, 'days').format('YYYY-MM-DD')]
    }
    if (!this.$store.state.formData.location_id){
      if (this.$cookies.get('searchData')) this.$store.commit('SET_FORM_DATA', this.$cookies.get('searchData'))
    }
    if (this.startOnMounted) this.newSearch()
    this.isMounted = true
  }
}
</script>

<style scoped lang="less">
.booking-short-form{
  .date-block{
    .icon-calendar{
      right:auto !important;
    }
  }
  &.disabled{
    position: relative;
    &:after{
      content:'';
      display:flex;
      background:rgba(244,246,252,0.5);
      width:100%;
      height:100%;
      position: absolute;
      z-index: 99999;
      top:0;
      left:0;
    }
  }
  &.nobg{
    background:none !important;
  }
  .btn-white{
    background: #FFFFFF;
    color: #1F5299;
    border:1px solid #1F5299;
    margin: 0;
    width: 310px;
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
.promo-toggle{
  cursor:pointer;
  display:flex;
  align-items: center;
  margin:0 15px;
  position: relative;
  .icon-wrapper{
    height:47px;
    width:47px;
    display:flex;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    border-radius: 15px;
    margin-right:15px;
    span{
      color:#1F5299;
      font-size:18px;
    }
  }
}

.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity .3s;
}
.fade-in-enter, .fade-in-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.hidden{
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

.checkbox-line{
  width:920px;
  box-sizing: border-box;
  margin:20px 0;
  input[type=checkbox]{
    display:none;
    &:checked + label{
      &:before{
        transform: rotate(0deg);
      }
      &:after{
        opacity:1;
        transform: rotate(0);
        left:5px;
      }
    }
    & + label{
      user-select: none;
      font-weight: normal;
      display:flex;
      align-items: center;
      position: relative;
      padding:0;
      cursor:pointer;
      margin-right:50px;
      &:before{
        transition: 0.3s;
        content: '';
        display:block;
        width:22px;
        height:22px;
        min-width:22px;
        min-height:22px;
        background: #FFFFFF;
        border-radius: 5px;
        margin-right:10px;
        padding:0;
        transform: rotate(90deg);
      }
      &:after{
        transition: 0.3s;
        content: "\e90c";
        font-size:12px;
        color:#1F5299;
        font-family: 'icomoon' !important;
        speak: never;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transform: rotate(90deg);
        opacity:0;
        position:absolute;
        left:15px;
        height:22px;
        display:flex;
        align-items: center;
      }
    }
  }
}
.top-line{
  align-self: center;
  .block{
    cursor:pointer;
    width:80px;
    height:47px;
    background:#fff;
    border-radius: 15px;
    position: relative;
    &.currency-block{
      width: 90px;
    }
    .select-value-img{
      position: absolute;
      z-index: 999;
      left: 15px;
      top: 0;
      height:100%;
      display:flex;
      align-items: center;
      pointer-events: none;
      img{
        border:1px solid #ececec;
      }
    }
    .v-select{
      max-width:100%;
    }
  }
}
.bottom-line{
  margin-top:20px;
  .v-select{
    border-radius: 15px;
    height:47px;
    display:flex;
    padding:0 15px;
  }
}
.main-form-btn{
  background: #1F5299;
  border-radius: 15px;
  width:295px;
  max-width:100%;
  height:47px;
  display:flex;
  align-items: center;
  justify-content: center;
  margin:0 auto;
  font-weight: bold;
  font-size: 15px;
  line-height: 15px;
  text-align: center;
  color: #FFFFFF;
  border:none;
  cursor: pointer;
}
.icon-arrow-down{
  color:#1F5299;
}
.booking-main-form{
  display:flex;
  flex-direction:column;
  width:100%;
  align-items: center;
  justify-content: center;
  padding:20px 20px 45px;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
  .children-select{
    position: relative;
    padding-left:35px;
    &:before {
      content: "+";
      position: absolute;
      left:18px;
      top:16px;
      color:#CCCCCC;
      font-size:30px;
      line-height: 18px;
    }
  }
  .adults-select{
    position: relative;
    padding-left:35px;
    .vs__dropdown-menu{
      .vs__dropdown-option{
        padding-left:75px !important;
      }
      li{
        padding-left:55px !important;
      }
    }
    &:before{
      content: "\e92f";
      font-family: 'icomoon' !important;
      speak: never;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      position: absolute;
      left:18px;
      top:16px;
      color:#CCCCCC;
    }
  }
  .option{
    display:flex;
    align-items: center;
    img{
      margin-right:10px;
    }
    span{
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 15px;
      color: #1F5299;
    }
  }
  input:focus, input:active{
    outline:none !important;
    //border:1px solid #1F5299 !important
    //box-shadow: inset 0 0 0 1px #1F5299;
  }
  .date-block{
    position: relative;
    .icon-calendar{
      position: absolute;
      right:20px;
      bottom:15px;
    }
  }
  input[type=text]{
    width:295px;
    background: #FFFFFF;
    border-radius: 15px;
    height:47px;
    border:none;
    padding: 0 20px;
    box-sizing: border-box;
  }
  label{
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    margin:10px 0;
    padding:0 10px;
    display:flex;
  }
  .icon-calendar{
    color:#1F5299
  }
  .darken-layout{
    left:0;
    top:0;
    position: fixed;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
  }
  .rating-select-option{
    display:flex;
    align-items: center;
    span{
      margin-right:10px;
      color:#1F5299;
    }
  }
  .v-select{
    width: 295px;
    background:#fff;

    .vs__dropdown-toggle{
      height:47px !important;
      padding:0;
    }
  }
}
.tooltip-wrapper{
  display:none;
}
.date-block{
  &.date-to-block{
    margin:0 20px;
  }
  input{
    padding-left:40px !important;
  }
  .icon-calendar{
    right: auto;
    left:15px;
    bottom:16px !important;
  }
}
.guest-block{
  input,
  .v-select{
    border-radius: 0 15px 15px 0 !important;
  }
}
.booking-short-form{
  background: #F4F6FC;
}
@media(max-width:1330px){
  .booking-short-form {
    .icon-calendar{
      pointer-events: none;
      width:auto;
    }
    .top-line{
      .btn-white{
        width:220px !important;
      }
      .date-block{
        width:180px;

        &.date-to-block{
          margin:0 10px;
        }
        input[type=text]{
          width:100%;
        }
      }
    }
  }

}
@media(max-width:991px){
  .booking-short-form{
    max-width:100% !important;
    flex-direction: row;
    padding:20px 15px !important;
    .line{
      max-width:100% !important;
    }
    .top-line{
      max-width:100% !important;
      flex-direction: row !important;
      flex-wrap: wrap;
      justify-content: space-between;
      .btn{
        order:1;
        width:100% !important;
        margin-top:15px;
      }
    }
    .currency-block{
      margin:0 0 0 10px !important;
    }
    .promo-toggle{
      width:150px !important;
    }
    .date-block{
      margin-bottom:0 !important;
      width:100%;
      &.date-to-block{
        display:none;
      }
    }
    .guest-block{
      border-radius: 0 0 10px 10px !important;
      margin-top:0 !important;
      .v-select{
        border-radius: 0 0 10px 10px !important;
      }
    }
    .date-block,
    .guest-block{
      order:1;
    }
  }
  .booking-main-form{
    max-width:550px;
    margin:0 auto;
    .line{
      max-width:290px;
      width:100%;
        flex-direction: column;
        & > .flex{
          margin: 0 0 10px;
          width:100%;
          input{
            max-width:100%;
          }
        }
        &.bottom-line{
          margin-top:0;
        }
        &.checkbox-line{
          margin:15px 0;
          width:100%;
          max-width:260px;
          label{
            margin:0;
          }
        }
      }
  }
  .tooltip-wrapper{
    display: flex !important;
    position: relative;
    span{
      display:block !important;
    }
    .icon-info{
      color:#1F5299;
      margin-left:5px;
      position: relative;
      top:3px;
      cursor: pointer;
    }
    .tooltip-inner{
      position: relative;
      width:100%;
      padding:10px 0 10px 10px;
      span{
        margin-bottom:5px;
      }
      .icon-close{
        position: absolute;
        right:0;
        top:10px;
        cursor: pointer;
      }
    }
    .tooltip-content{
      position: absolute;
      background:#FFFFFF;
      z-index: 9999;
      width:290px;
      left:-170px;
      top:-100px;
      padding-right:20px;
      box-sizing: border-box;
      border-radius: 10px;
      box-shadow: 0 1px 4px 2px rgba(0,0,0,0.1);
    }
  }
}
@media(max-width:767px){
  .booking-main-form{
    padding:25px 0;
  }
  .booking-form .container{
    padding:0;
  }
}
</style>
