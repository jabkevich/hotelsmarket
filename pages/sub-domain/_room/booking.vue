<template>
  <div class="booking-page">
<!--    {{$store.state.booking.form}}-->
    <div class="details">
      <div class="container">
        <span class="title">Детали брони</span>
        <span class="more-info">{{ $dateFns.format(new Date(this.startDate), 'dd MMMM') }} - {{ $dateFns.format(new Date(this.endDate), 'dd MMMM') }}, {{ this.roomsQuantity }}, {{this.guestQuantity}}</span>
        <div class="total">
          <span>Общая стоимость:</span>
          <span class="total-price">12 240 Р</span>
<!--      <div class="details-toggle">
            <span>Детали</span>
            <span class="icon-arrow-down"></span>
          </div>-->
        </div>
      </div>
    </div>
    <div class="booking-stage-container">
      <transition name="booking-stage">
          <personal-data key="personalData" v-if="$store.state.booking.stage === 'personalData'"/>
          <guests-info key="guestsInfo" v-if="$store.state.booking.stage === 'guestsInfo'"/>
          <checkin-time key="checkinTime" v-if="$store.state.booking.stage === 'checkinTime'"/>
          <payment-methods key="paymentMethods" v-if="$store.state.booking.stage === 'paymentMethods'"/>
      </transition>
    </div>
  </div>
</template>

<script>
import PersonalData from "@/components/booking/PersonalData";
import GuestsInfo from "@/components/booking/GuestsInfo";
import PaymentMethods from "@/components/booking/PaymentMethods";
import CheckinTime from "@/components/booking/CheckinTime";
export default {
  name: "index",
  components: {PersonalData, CheckinTime, PaymentMethods, GuestsInfo},
  layout: 'BookingLayout',
  data() {
    return {

    }
  },
  head() {
    return {
      title: 'Бронирование выбранного варианта размещения',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Бронирование выбранного варианта размещения'
        }
      ],
    }
  },


  computed: {

    startDate() {
      return this.$store.state.formData.startDate
    },
    endDate() {
      return this.$store.state.formData.endDate
    },
    guestQuantity () {
      let array = [...this.$store.state.formData.accommodation]
      let result = 0
      array.forEach(item => {
        result = item.adults + result
        if (item.children) result = item.children.length + result
      })
      return result === 1 ? '1 гость' :  result < 5 ? `${result} гостя` : `${result} гостей`
    },
    roomsQuantity () {
      let number = this.$store.state.formData.accommodation.length
      return number === 1 ? '1 номер' : number < 5 ? `${number} номера` : `${number} номеров`
    },

  },

}
</script>

<style lang="less">
.booking-stage-enter-active {
  transition: all .3s ease;
}
.booking-stage-leave-active{
  transition: all .0s;
}
.booking-stage-enter, .booking-stage-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(20px);
  opacity: 0;
}
.booking-stage-container{
  background: #FFFFFF;
}
.booking-page{
  background: #F4F6FC;
  .title{
    font-weight: bold;
    font-size: 64px;
    line-height: 64px;
    color: #333333;
  }
  .pre-title{
    display:block;
    margin-bottom: 40px;
    color:#333333;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
  }
  .controls{
    padding:20px 0;
    .container{
      padding:0;
      display:flex;
      flex-direction: row;
      justify-content: flex-start;
    }

  }
  .booking-btn{
    background: #1F5299;
    border-radius: 15px;
    width: 155px;
    max-width: 100%;
    height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    text-align: center;
    color: #FFFFFF;
    cursor: pointer;
    border:1px solid #FFFFFF;
    transition: background-color 0.3s ease-in-out;
    &:hover{
      background: #5689ce;
    }
    &.booking-btn_reverse{
      color:#1F5299;
      background:#FFFFFF;
      border:1px solid #1F5299;
      margin-right:10px;
    }
  }
  .details{
    background: #FFFFFF;
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    padding-bottom:50px;
    .title{
      font-weight: bold;
      font-size: 64px;
      line-height: 64px;
      color: #333333;
    }
    .more-info{
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      color: #333333;
    }
    .total{
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      color: #333333;
      display:flex;
      align-items: center;
      margin:20px 0 0;
      .total-price{
        font-weight: bold;
        font-size: 36px;
        line-height: 36px;
        color: #1F5299;
        margin:0 15px;
      }
      .details-toggle{
        display:flex;
        align-items: center;
        span{
          font-style: normal;
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          color: #1F5299;
        }
      }
    }
  }
  .language-block{
    .vs__dropdown-toggle{
      position: relative;
      z-index: 2;
      height:47px !important;
      background: #F4F6FC;
      padding:0 8px;
      display:flex;
      min-width:90px;
      border-radius: 15px;
      border:1px solid #CCCCCC;
      cursor: pointer;
    }
    .vs__dropdown-menu{
      position: relative;
      z-index: 1;
      max-width:90px !important;
      min-width:0 !important;
      padding:0;
      transform: translateY(-10px);
      padding-top:20px;
      li{
        max-width:90px;
        align-items: center;
        display:flex;
        justify-content: center;
      }
    }
  }
}
</style>
