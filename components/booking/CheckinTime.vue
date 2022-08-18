<template>
  <div class="guests-info checkin-time">
    <div class="container">
      <div class="form-data">
        <span class="title">Время заезда и выезда</span>
        <p>Вы можете выбрать удобное для вас время заезда и выезда. <br> Услуга раннего заезда и позднего выезда предоставляется за дополнительную плату.</p>
        <p class="pre-title">Стандартное время заезда — 14:00, выезда — 12:00.</p>
        <div class="input-group">
          <label>Заезд</label>
          <v-select class="adults-select" ref="select" placeholder="Время заезда" :options="timeRange" :clearable="false"
                    v-model="inTime">
          </v-select>
        </div>
        <div class="input-group">
          <label>Выезд</label>
          <v-select class="adults-select" placeholder="Время выезда" :options="timeRange" :clearable="false"
                    v-model="outTime">
          </v-select>
        </div>
        <label class="textarea-label pre-title">Дополнительные комментарии</label>
        <textarea v-model="moreInfo" placeholder="Если у вас есть дополнительные пожелания, пожалуйста, дайте нам знать. Мы постараемся учесть ваши пожелания при наличии такой возможности."></textarea>
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
  name: "checkinTime",
  data() {
    return{
      timeRange: ['11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30', '17:00','17:30','18:00','18:30', '19:00'],
      inTime: '14:00',
      outTime: '12:00',
      moreInfo: ''
    }
  },
  computed: {
  },
  methods:{
    async next () {
      try {
        this.$store.commit('BOOKING_FORM_CHECKTIME', {inTime: this.inTime, outTime: this.outTime})
        this.$store.commit('BOOKING_FORM_MOREINFO', this.moreInfo)
        this.$store.commit('BOOKING_STAGE_CHANGE', 'paymentMethods' )
      } catch (e) {
        console.log(e)
      }
    },
    async prev () {
      try {
        this.$store.commit('BOOKING_STAGE_CHANGE', 'guestsInfo' )
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="less">
.guests-info{
  min-height:400px;
  .input-group{
    display:flex;
    margin-bottom:15px;
    align-items: center;
    label{
      font-weight: bold;
      font-size: 15px;
      line-height: 15px;
      color: #333333;
      min-width:150px;
    }
  }
  textarea{
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    border-radius: 15px;
    width:100%;
    padding:15px;
    min-height:150px;
    transition:0.3s ease-in-out;
    &:focus{
      outline:none;
    }
    &:focus-visible{
      border-color: rgba(31,82,153,1) !important;
    }
  }
  .pre-title{
    font-weight:700;
    font-size:24px;
    &.textarea-label{
      margin: 40px 0 20px;
    }
  }
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
  .checkin-time{
    .title{
      font-size:34px !important;
      padding:15px 0;
      line-height: 34px;
    }
    p{
      margin-top:0;
    }
    .pre-title{
      font-size:18px;
    }
  }
}
@media(max-width:767px){
  .checkin-time{
    .title{
      font-size:28px !important;
      padding:15px 0;
      line-height: 30px;
    }
    p{
      margin-top:0;
      font-size:14px;
      line-height: 16px;
    }
    .pre-title{
      font-size:16px;
      margin-bottom:15px;
      line-height: 20px;
    }
    .input-group{
      margin-bottom:10px;
      label{
        min-width:80px;
      }
    }
    .textarea-label{
      margin:20px 0 10px !important;
    }
  }
}

</style>
