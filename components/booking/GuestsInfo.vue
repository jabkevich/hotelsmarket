<template>
  <div class="guests-info">
    <div class="container">
      <div class="form-data">
        <span class="title">Информация о гостях</span>
        <span class="pre-title">Номер: <span>Стандартный номер Твин, 1 взрослый</span></span>
        <div class="form" v-for="(guest, index) of guests" >
          <div class="input-group" :class="{'hasError': hasError && !guest.firstName}">
            <label>
              Имя
            </label>
            <input type="text" v-model="guest.firstName">
          </div>
          <div class="input-group" :class="{'hasError': hasError && !guest.patronymic}">
            <label>
              Фамилия
            </label>
            <input type="text" v-model="guest.patronymic">
          </div>
          <div class="input-group" :class="{'hasError': hasError && !guest.secondName}">
            <label>
              Отчество
            </label>
            <input type="text" v-model="guest.lastName">
          </div>
          <div class="input-group select-group">
            <span>Гражданство</span>
            <div class="block language-block">
              <div class="select-value-img">
                <img :src="language.src" alt="">
              </div>
              <v-select class="language-select" :options="languageList" :clearable="false" label="name"
                        v-model="guest.nationality">
                <template v-slot:option="option" >
                  <div class="option">
                    <img :src="option.src">
                  </div>
                </template>
                <template #open-indicator="{ attributes }">
                  <span v-bind="attributes" class="icon-arrow-down"></span>
                </template>
              </v-select>
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="container">
          <button @click="prev" class="next booking-btn booking-btn_reverse">Назад</button>
          <button @click="next" class="next booking-btn ">Далее</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GuestsInfo",
  data() {
    return{
      hasError: false,
      number: 2,
      guestBlock: {
        firstName: '',
        lastName: '',
        patronymic: '',
        nationality: 'ru',
      },
      guests: [],
      languageList: [
        { id:1, name: 'ru', src: require('@/assets/img/flags/ru.svg') },
        { id:2, name: 'eng', src: require('@/assets/img/flags/us.svg') },
        { id:3, name: 'chi', src: require('@/assets/img/flags/cn.svg') }
      ],
      language: { id:1, name: 'ru', src: require('@/assets/img/flags/ru.svg') },
    }
  },
  computed: {
  },
  methods:{
    checkValid(){
      this.hasError = false
      for (let guest in this.guests) {
        for (let key in this.guests[guest]){
          if (!this.guests[guest][key]) this.hasError = true
        }
      }
    },
    async next () {
      await this.checkValid()
      if (!this.hasError) {
        try {
          this.$store.commit('BOOKING_FORM_GUESTS', this.guests)
          this.$store.commit('BOOKING_STAGE_CHANGE', 'checkinTime')
        } catch (e) {
          console.log(e)
        }
      }
    },
    async prev () {
      try {
        this.$store.commit('BOOKING_STAGE_CHANGE', 'personalData' )
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    for (let i = 0; i < this.number; i++) {
      this.guests.push({...this.guestBlock})
    }
  }
}
</script>

<style scoped lang="less">
  .guests-info{
    min-height:400px;
    .form{
      display:flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .input-group{
        width:23%;
        display:flex;
        flex-direction: column;
        margin-bottom:30px;
        &.select-group{
          display:flex;
          flex-direction: row;
          align-items: flex-end;
          & > span{
            height:47px;
            display:flex;
            align-items: center;
            margin-right:20px;
          }
        }
        .language-block{
          height:47px;
          position: relative;
          .v-select{

          }
          .select-value-img{
            position: absolute;
            z-index: 3;
            left:15px;
            top:0;
            height:47px;
            display:flex;
            align-items: center;
            pointer-events: none;
          }
        }
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
  @media(max-width:991px){
    .guests-info{
      .title{
        font-size:34px !important;
        padding:15px 0;
        line-height: 34px;
      }
      .pre-title{
        font-size:18px;
      }
      .input-group{
        label{
          font-size:18px !important;
        }
      }
    }
  }
  @media(max-width:767px){
    .guests-info{
      .title{
        font-size:28px !important;
        padding:15px 0;
        line-height: 28px;
      }
      .pre-title{
        font-size:16px;
      }
      .form{
        display:flex;
        flex-direction: column;
        .input-group{
          width:100%;
          margin-bottom:10px;
          label{
            font-size:14px !important;
          }
        }
      }
    }
  }
</style>
