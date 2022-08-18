<template>
  <div class="booking-main-form">
    <transition name="fade-in">
      <div class="darken-layout" v-if="dateRangeOpen" @click="dateRangeOpen = false"></div>
    </transition>
    <div class="darken-layout guests" v-if="guestBlock" @click="guestBlock = false"></div>
<!--    BLOCK WITH CURRENCY AND LANGUAGE-->
<!--    <div class="flex p-4 top-line">
      <div class="block language-block">
        <div class="select-value-img">
          <img :src="language.src" alt="">
        </div>
        <v-select readonly class="language-select" :options="languageList" :clearable="false" label="name"
                  v-model="language">
          <template v-slot:option="option" >
            <div class="option">
              <img :src="option.src">
              <span>{{option.name.toUpperCase()}}</span>
            </div>
          </template>
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="icon-arrow-down"></span>
          </template>
        </v-select>
      </div>
      <div class="block currency-block">
        <v-select readonly class="currency-select" :options="currencyList" :clearable="false" label="name"
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
      </div>
    </div>-->
    <div class="flex p-4 line">
      <div class="flex flex-col" :class="{'hasError': this.formHasError && this.formValidation.id === 1}">
        <label>Куда едем</label>
        <instant-search @setplace="setPlaceToGo"/>
      </div>
      <div class="flex flex-col middle-block date-block" :class="{'hasError': this.formHasError && (this.formValidation.id === 2 || this.formValidation.id === 3)}">
        <label>Дата заезда</label>
        <client-only>
        <date-picker class="w-full hidden class" popup-class="booking-form-datepicker" :popup-style="datePickerPosition"
                     :open.sync="dateRangeOpen"  v-model="dates"
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
      <div class="flex flex-col date-block" :class="{'hasError': this.formHasError && (this.formValidation.id === 2 || this.formValidation.id === 4)}">
        <label>Дата выезда</label>
        <input type="text" @click="dateRangeOpen = true" v-model="valueFormattedTo" readonly >
        <span class="icon-calendar"></span>
      </div>
    </div>
    <div class="flex p-4 line bottom-line">
      <div class="flex flex-col">
        <v-select ref="ratingSelect" class="rating-select" :class="{'disabled': this.form.type === 'hotel'}" multiple placeholder="Укажите колличество звёзд"  :options="ratingList" :clearable="false" :closeOnSelect="false"
                  v-model="ratingArrayFiltered">
          <template v-slot:option="option" >

            <span v-if="option.label !== 0" class="flex w-full rating-select-option"><span class="icon-star"></span> {{ option.label }}</span>
            <span v-else class="flex w-full rating-select-option no-stars"><span class="icon-star"></span> Без</span>
          </template>
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes" class="icon-arrow-down"></span>
          </template>
        </v-select>
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
    </div>
    <div class="flex p-4 line checkbox-line">
      <div class="flex">
        <input type="checkbox" name="moment-accept" id="momentAccept" v-model="momentAccept">
        <label for="momentAccept">Только отели с моментальным подтверждением</label>
      </div>
<!--      <div class="flex">
        <input type="checkbox" name="show-fee" id="showFee" v-model="showFee">
        <label for="showFee">Показывать комиссии</label>
      </div>-->
    </div>
    <button class="main-form-btn" @click="formSubmit">Найти</button>
    <div class="error" v-if="this.formHasError"  :class="{'visible': this.formValidation.id}">
      <span class="icon-info"></span>
      <span>{{this.formValidation.value}}</span>
    </div>
  </div>
</template>

<script>

const InstantSearch = () => import ("../components/InstantSearch")
import { mapState } from 'vuex'

export default {
  name: "BookingForm",
  components: {InstantSearch},
  data () {
    return {
      guestBlock: false,
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
      activeIndex: 0,
      currency: {id:1, name: 'RUB'},
      dateRangeOpen: false,
      momentAccept: false,
      showFee: true,
      ratingList: [0,1,2,3,4,5],
      ratingArray: [],
      windowWidth: 0,
      datepickerTooltip: false,
      form: {
        place: null,
        location_id: null,
        type: null,
        from: null,
        to: null,
        rating: null,
        adults: 1,
        children: 0
      },
      formHasError: false,
      isMounted:false,
    }
  },
  computed: {
    ...mapState(['formData']),
    test(){
      return this.$store.state.formData.startDate
    },
    rooms () {
      return this.formData.accommodation
    },
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
    ratingArrayFiltered: {
      get () {
        let result = [] //this.ratingArray.sort( (a, b) => a - b)
        if (this.formData.stars ) {
          result = [...this.formData.stars].sort( (a, b) => a - b)
        }
        console.log(result)
        return result

      },
      set (value) {
        this.$store.commit('SET_FORM_STARS', value)
      }
    },
    datePickerPosition () {
      return this.windowWidth > 991 ? {'transform': 'translate(300px, -10px)'} :  {'margin': '-250px 0 0 -160px', 'left': '50%', 'top': '50%'}
    },
    valueFormattedFrom () {
      return this.dates.length && this.isMounted ? this.$moment(this.dates[0]).format('Do MMMM YYYY')  : ''
    },
    valueFormattedTo () {
      return this.dates.length && this.isMounted ? this.$moment(this.dates[1]).format('Do MMMM YYYY') : ''
    },
    formValidation () {
      let error = {id: null, value:''}
      if (!this.formData.endDate) error = {id: 4, value:'Укажите дату отъезда'}
      if (!this.formData.startDate) error = {id: 3, value:'Укажите дату заезда'}
      if (!!this.formData.endDate && !this.formData.startDate) error = {id: 2, value:'Укажите дату проживания'}
      if (!this.formData.location_id) error = {id: 1, value:'Укажите направление'}
      return error
    }
  },
  methods: {
    disabledRange: function (date) {
      console.log(date)
      console.log(new Date())
      return new Date(date) < new Date();
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
    setPlaceToGo (value) {
      console.log('value', value)
      this.$store.commit('SET_FORM_PLACE', value)
      this.form.place = value.name
      this.form.location_id = value.id
      this.form.type = value.type
    },
    async formSubmit () {
      this.formValidation.id ? this.formHasError = true : this.formHasError = false
      if (!this.formHasError) {
        const formData = this.$store.state.formData
        console.log('formdata from form', formData)

        let pusherUID = await this.$store.dispatch('hotelsSearch', formData)
        console.log('pusherUID from component to redirect', pusherUID )
        this.$store.commit('HOTELS_SEARCH_IN_PROGRESS_TOGGLE', true)
        await this.$router.push({path: `/search/${pusherUID}`})
      }
    }
  },
  mounted() {
    this.$refs.ratingSelect.searchEl.readonly = true
    this.$store.commit('SET_LOCAL_SEARCH_DATA', null)
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
    if (!this.$store.state.formData.location_id){
      if (this.$cookies.get('searchData')) this.$store.commit('SET_FORM_DATA', this.$cookies.get('searchData'))
    }
    this.isMounted = true
  }
}
</script>

<style scoped lang="less">
.hidden{
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
.line{
  position:relative !important;
}
.disabled{
  pointer-events: none;
  cursor: default;
  opacity: 0.5;
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
  align-self: flex-end;
  .block{
    cursor:pointer;
    width:80px;
    height:47px;
    background:#fff;
    border-radius: 15px;
    position: relative;
    &.currency-block{
      width: 90px;
      margin-left:15px;
    }
    .select-value-img{
      position: absolute;
      z-index: 999;
      left: 15px;
      top: 0px;
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
  .room-block{
    margin-left:20px;
    width:453px;
    background:white;
    height:48px;
    border-radius: 15px 15px 0 0;
    position: relative;
    z-index: 10;
    &.closed{
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
  position: relative;
  display:flex;
  flex-direction:column;
  width:100%;
  align-items: center;
  justify-content: center;
  padding:20px 20px 80px;
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
  input[type=text],
  input[type=search]{
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
  .middle-block{
    margin:0 20px;
  }
  .darken-layout{
    left:0;
    top:0;
    position: fixed;
    width:100%;
    height:100%;
    background: rgba(0,0,0,0.5);
    z-index: 99999  ;
    &.guests{
      background: none;
      z-index: 9;
    }
  }
  .rating-select-option{
    display:flex;
    align-items: center;
    &.no-stars{
      .icon-star{
        color:#CCCCCC;
      }
    }
    span{
      margin-right:10px;
      color:#1F5299;
    }
  }
  .v-select{
    width: 450px;
    background:#fff;
    z-index: 10002;
    position: relative;
    max-width:100%;
    .vs__dropdown-toggle{
      height:47px !important;
      padding:0;
    }
  }
}
.tooltip-wrapper{
  display:none;
}
.error{
  display:flex;
  max-width:925px;
  justify-content: flex-start;
  width:100%;
  padding:0 10px;
  box-sizing: border-box;
  color: red;
  opacity:0;
  position: absolute;
  bottom:40px;
  transition: 0.3s ease-in-out;
  &.visible{
    opacity:1;
  }
  span{
    margin-right:10px;
    display:inline-block;
  }
}
@media(max-width:991px){
  .error{
    position: static;
    display:flex;
    align-items: center;
    justify-content: center;
    margin-top:20px;
  }
  .bottom-line .room-block .guests-preview .content {
    align-items: center;
    .icon{
      margin-right:15px;
    }
    .md-hidden{
      display:none;
    }
    .number{
      display:block;
      min-width:100%;
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
