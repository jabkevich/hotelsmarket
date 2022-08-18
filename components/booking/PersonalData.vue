<template>
  <div class="personal-data">
    <div class="container">
<!--      <div class="socials">
        <span>Выберите социальную цеть для автоматического заполнения личной информации</span>
        <div class="icons-wrapper">
          <vk-auth/>
          <div class="icon disabled">
            <span class="icon-facebook"></span>
          </div>
          <div class="icon">
            <span class="icon-google"></span>
          </div>
        </div>
        <span>Или заполните данные самостоятельно</span>
      </div>-->
      <div class="form-data">
        <span class="title">Контактные данные</span>
        <div class="note">
          <p>На электронную почту вам придёт подтверждение бронирования. При необходимости мы свяжемся с вами по телефону, чтобы уточнить детали</p>
        </div>
        <div class="form">
          <div class="input-group" :class="{ 'hasError': error && validation.firstName }">
            <label>
              Имя
              <span v-if="error && validation.firstName">
                <span class="error">Необходимо указать имя</span>
              </span>
            </label>
            <input type="text" v-model="firstName">
          </div>
          <div class="input-group" :class="{ 'hasError': error && validation.secondName }">
            <label>
              Фамилия
              <span>
                <span class="error" v-if="error && validation.secondName">Необходимо указать фамилию</span>
              </span>
            </label>
            <input type="text" v-model="secondName">
          </div>
          <div class="input-group">
            <label>Отчество</label>
            <input type="text" v-model="middleName">
          </div>
          <div class="input-group" :class="{ 'hasError': error && validation.email }">
            <label>
              Электронная почта
              <span>
                <span class="error" v-if="error && validation.email">Укажите корректый адрес электронной почты</span>
              </span>
            </label>
            <input type="text" v-model="email">
          </div>
          <div class="input-group" :class="{ 'hasError': error && validation.phone }">
            <label>
              Номер телефона
              <span >
                <span class="error" v-if="error && validation.phone">Необходимо указать номер телефона</span>
<!--                <span class="error">Необходимо указать корректный номер телефона</span>-->
              </span>
            </label>
            <client-only placeholder="Loading...">
            <the-mask mask="+7 (XXX) XXX XX-XX" v-model="phone" type="tel"
                      placeholder="+7 (XXX) XXX XX-XX"></the-mask>
            </client-only>
          </div>
          <div class="input-group checkboxes">
            <div class="checkbox-line">
              <input type="checkbox" id="extraInfo" v-model="extraInfo">
              <label for="extraInfo">Я хочу дополнительно получить подтверждение бронирования на телефон</label>
            </div>
            <div class="checkbox-line">
              <input type="checkbox" id="newsInfo" v-model="newsInfo">
              <label for="newsInfo">Я хочу узнавать о специальных предложениях и новостях по email или SMS</label>
            </div>
            <div class="checkbox-line">
              <input type="checkbox" id="anotherPerson" v-model="forAnotherPerson">
              <label for="anotherPerson">Я бронирую для другого человека</label>
            </div>
          </div>
        </div>
        <div class="controls">
          <div class="container">
            <button @click="next" class="next booking-btn">Далее</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import VkAuth from "@/components/getDataFromSocials/VkAuth";
export default {
  name: "PersonalData",
  data() {
    return {
      error: false,
      form: {
        firstName: '',
        secondName: '',
        middleName: '',
        email: '',
        phone: '',
        extraInfo: false,
        newsInfo: false,
        forAnotherPerson: false,
      }
    }
  },
  components: {VkAuth},
  computed: {
    validation () {
      let obj = {
        firstName: false,
        secondName: false,
        middleName: false,
        email: false,
        phone: false
      }
      this.firstName ? obj.firstName = false : obj.firstName = true
      this.secondName ? obj.secondName = false : obj.secondName = true
      this.email && this.isEmailValid(this.email) ? obj.email = false : obj.email = true
      this.phone && this.isPhoneValid(this.phone) ? obj.phone = false : obj.phone = true

      return obj
    },
    firstName: {
      get () {
        return this.$store.state.booking.form.firstName
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_FIRSTNAME', value)
      }
    },
    middleName: {
      get () {
        return this.$store.state.booking.form.middleName
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_MIDDLENAME', value)
      }
    },
    secondName: {
      get () {
        return this.$store.state.booking.form.secondName
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_SECONDNAME', value)
      }
    },
    email: {
      get () {
        return this.$store.state.booking.form.email
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_EMAIL', value)
      }
    },
    phone: {
      get () {
        return this.$store.state.booking.form.phone
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_PHONE', value)
      }
    },
    extraInfo: {
      get () {
        return this.$store.state.booking.form.extraInfo
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_EXTRAINFO', value)
      }
    },
    newsInfo: {
      get () {
        return this.$store.state.booking.form.newsInfo
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_NEWSINFO', value)
      }
    },
    forAnotherPerson: {
      get () {
        return this.$store.state.booking.form.forAnotherPerson
      },
      set (value) {
        this.$store.commit('BOOKING_FORM_FORANOTHERPERSON', value)
      }
    },
  },
  methods:{
    isEmailValid (email) {
     return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(email.toLowerCase());
   },
    isPhoneValid (phone) {
     return /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/.test(phone);
   },
    validationCheck () {
      this.error = false
      for (let key in this.validation) {
        if (this.validation[key]) this.error = true
      }
    },
    async next () {
      this.validationCheck()
      const formPersonalData = {
        firstName: this.form.firstName,
        middleName: this.form.middleName,
        secondName: this.form.secondName,
        phone: this.form.phone,
        email: this.form.email,
        extraInfo: this.extraInfo,
        newsInfo: this.newsInfo,
        forAnotherPerson: this.forAnotherPerson,
      }
      if (!this.error) {
        try {
          this.$store.dispatch('personalDataSubmit', formPersonalData)
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  mounted() {
    console.log(this.$store.state.booking.form)
    this.$store.state.booking.form.firstName ? this.form.firstName = this.$store.state.booking.form.firstName : this.form.firstName = ''
    this.$store.state.booking.form.secondName ? this.form.secondName = this.$store.state.booking.form.secondName : this.form.secondName = ''
    this.$store.state.booking.form.middleName ? this.form.middleName = this.$store.state.booking.form.middleName : this.form.middleName = ''
    this.$store.state.booking.form.email ? this.form.email = this.$store.state.booking.form.email : this.form.email = ''
    this.$store.state.booking.form.phone ? this.form.phone = this.$store.state.booking.form.phone : this.form.phone = ''
  }
}
</script>

<style scoped lang="less">
  .personal-data{
    background: #FFFFFF;
    .socials{
      padding:35px 0;
      font-weight: normal;
      font-size: 15px;
      line-height: 15px;
      text-align: center;
      color: #666666;
      display:flex;
      flex-direction: column;
      align-items: center;
      .icons-wrapper{
        display:flex;
        margin:15px 0;
        .icon{
          width:85px;
          height:45px;
          background: #F4F6FC;
          border-radius: 15px;
          display:flex;
          align-items: center;
          justify-content: center;
          font-size:26px;
          color:#1F5299;
          margin: 0 15px;
          cursor: pointer;
          &.disabled{
            cursor: default;
            color: #999999;
            opacity: 0.5;
          }
        }
      }
    }
    .form-data{
      .title{
        font-style: normal;
        font-weight: bold;
        font-size: 64px;
        line-height: 64px;
        color: #333333;
      }
      .note{
        background: #F4F6FC;
        border-radius: 25px;
        padding:15px 30px;
        font-weight: normal;
        font-size: 15px;
        line-height: 15px;
        color: #1F5299;
        box-sizing: border-box;
        margin-bottom:40px;
      }
      .form{
        display:flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .input-group{
          width:49%;
          display:flex;
          flex-direction: column;
          margin-bottom:30px;
          &:not(.checkboxes){
            label{
              justify-content: space-between;
            }
          }
          label{
            font-weight: bold;
            font-size: 24px;
            line-height: 24px;
            color: #333333;
            margin-bottom:10px;
            padding-left:10px;
            display:flex;
            align-items: center;
            .error{
              font-weight: normal;
              font-size: 15px;
              line-height: 15px;
              color: #FF1D1D;
            }
          }
          &.hasError{
            input[type=tel],
            input[type=text]{
              border:1px solid #FF1D1D;
            }
          }
          input[type=text],
          input[type=tel]{
            width:100%;
            border: 1px solid #CCCCCC;
            box-sizing: border-box;
            border-radius: 15px;
            height:47px;
            font-weight: normal;
            font-size: 15px;
            line-height: 15px;
            color: #1F5299;
            padding:0 10px;
          }
          &.checkboxes{
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
                font-size: 15px;
                line-height: 15px;
                color: #666666;
                &:before{
                  transition: 0.3s;
                  content: '';
                  display:block;
                  width:22px;
                  height:22px;
                  min-width:22px;
                  min-height:22px;
                  background: #F4F6FC;
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
        }
      }
    }
  }
  @media(max-width:991px){
    .personal-data{
      .form-data{
        .title{
          font-size:34px;
          padding:15px 0;
          line-height: 36px;
        }
        .note{
          padding:5px 10px!important;
          border-radius: 10px;
          margin-bottom:15px;
        }
        .form{
          .input-group:not(.checkboxes){
            label{
              font-size:18px;
            }
          }
        }
      }
    }
  }
  @media(max-width:767px){
    .personal-data{
      .form-data{
        .title{
          font-size:24px;
          padding:15px 0;
          line-height: 30px;
        }
        .note{
          padding:5px 10px!important;
          border-radius: 10px;
          margin-bottom:15px;
          font-size:13px;
        }
        .form{
          flex-direction: column;
          .input-group:not(.checkboxes){
            label{
              font-size:16px;
              line-height: 14px;
              justify-content: space-between;
              span{
                display:flex;
                justify-content: flex-end;
              }
              .error{
                font-size:12px;
                line-height: 14px !important;
                justify-content: flex-end;
                text-align: right;
              }
            }
          }
          .input-group.checkboxes{
            margin-top:10px;
            label{
              font-size:12px !important;
            }
          }
          .input-group{
            width:100%;
            margin-bottom:10px;
          }
        }
      }
    }
  }
</style>
