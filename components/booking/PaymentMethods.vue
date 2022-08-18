<template>
  <div class="guests-info payment-methods">
    <div class="container">
      <div class="form-data">
        <span class="title">Выберите способ оплаты</span>
        <p class="rules">Фактом бронирования вы соглашаетесь с <a href="#">правилами онлайн-бронирования</a>, <a href="#">обработкой персональных данных</a> и <a href="#">политикой конфиденциальности</a>.</p>

        <div class="block">
          <div class="left">
            <span class="block-title">
              Оплата банковской картой
            </span>
            <span class="for">Для физических лиц</span>
            <span class="all">Оплачивается <strong>вся сумма</strong> брони</span>
            <p class="description">Вы получите подтверждение бронирования и квитанцию для оплаты в банке. Квитанцию нужно оплатить в течение 3 банковских дней.</p>
          </div>
          <div class="right">
            <span class="note">Предоплата</span>
            <span class="price">{{ this.formatPrice(price) }} P</span>
            <button @click="createOrder('card')" class="next booking-btn">Забронировать</button>
          </div>
        </div>
<!--        <div class="block">
          <div class="left">
            <span class="block-title best-block">
              <div class="spec">Самый удобный способ</div>
              Оплатить при заселении
            </span>

            <p class="description">Выбирая этот способ оплаты, вы не вносите предоплату за бронь. Получите подтверждение бронирования на электронную почту, которую указали при бронировании, и предъявите его при заселении.</p>
          </div>
          <div class="right">
            <span class="note">Без предоплаты</span>
            <span class="price"></span>
            <button @click="createOrder(3)" class="next booking-btn">Забронировать</button>
          </div>
        </div>-->
        <div class="block" v-if="typeInvoice">
          <div class="left">
            <span class="block-title">
              Банковский перевод
            </span>
            <span class="for">Для юридических лиц</span>
            <span class="all">Оплачивается <strong>вся сумма</strong> брони</span>
            <p class="description">Вы получите подтверждение бронирования и счет на оплату. Счет нужно оплатить в течение 3 банковских дней.</p>
          </div>
          <div class="right">
            <span class="note">Предоплата</span>
            <span class="price">{{ this.formatPrice(price) }} P</span>
            <button @click="createOrder('invoice')" class="next booking-btn">Забронировать</button>
          </div>
        </div>
        <div class="controls">
          <div class="container">
            <button @click="prev" class="next booking-btn booking-btn_reverse">Назад</button>
          </div>
        </div>
    </div>
  </div>
  <transition name="fade">
      <div class="modal modal-review-accept" v-if="successModal">
        <div class="modal-overlay" @click="closeAndRedirect"></div>
        <div class="modal-container">
          <div class="modal-header">Ваш заказ поступил в обработку!</div>
          <div class="modal-body">Счет для оплаты будет отправлен на электронную почту, указанную при бронировании.</div>
          <div class="modal-footer"><button class="btn" @click="closeAndRedirect">Закрыть</button></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {fetchData} from "../../mixins/fetchData";
export default {
  name: "PaymentMethods",
  mixins: [fetchData],
  data() {
    return {
      successModal: false,
      services: null,
      products: null
    }
  },
  props: ['price'],
  computed: {
    ...mapState(['booking']),
    typeInvoice() {
      return Boolean(+process.env.PAYMENT_TYPE_INVOICE)
    },
    curPrice () {
      let price = 0
      if (this.room.tariffs[this.$route.params.tariffId]) price = this.room.tariffs[this.$route.params.tariffId].prices.total.prices.RUB
      return price
    },
    startDate() {
      return this.$store.state.localSearchData ? this.$store.state.localSearchData.startDate : this.$store.state.formData.startDate
    },
    endDate() {
      return this.$store.state.localSearchData ? this.$store.state.localSearchData.endDate : this.$store.state.formData.endDate
    },
  },
  methods: {
    ...mapGetters(['getBookingInfo']),
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    async prev () {
      try {
        this.$store.commit('BOOKING_STAGE_CHANGE', 'checkinTime' )
      } catch (e) {
        console.log(e)
      }
    },
    redirect(url) {
       /* let a = document.createElement('a');
        a.target="_blank";
        a.href=url;
        a.click();*/
      setTimeout(() => {
        window.open(url, '_blank');
      })
    },
    async createOrder(paymentType) {
      this.$store.commit('PRELOADER_TOGGLE', true)

      const userData = {
        firstName: this.$store.state.booking.form.firstName,
        lastName: this.$store.state.booking.form.secondName,
        patronymic: this.$store.state.booking.form.middleName,
        email: this.$store.state.booking.form.email,
        phone: this.$store.state.booking.form.phone,
        isConfirmation: this.$store.state.booking.form.getExtraInfo,
        isSubscription: this.$store.state.booking.form.getNewsInfo,
        isThirdParty: this.$store.state.booking.form.forAnotherPerson,
      },
        variants = [
        {
          hotelId: +this.$store.state.booking.hotel.id,
          roomId: +this.$store.state.booking.room.id,
          tariffId: +this.$store.state.booking.tariff.id,
          initials: [
            {
              accommodation: 'main',
              guests: this.$store.state.booking.form.guests
            }
          ]
        }
      ],
        order = {
              startDate: this.startDate,
              endDate: this.endDate,
              comment: this.$store.state.booking.form.moreInfo,
              products: this.products,
              services : this.services,
              userData,
              variants,
              sum: this.totalPriceValue,
              type: paymentType
        }
      console.log(order)
      try{
        const result = await this.$store.dispatch('createOrder', order)
        this.$store.commit('PRELOADER_TOGGLE', false)
        if (result.success) {
          result.paymentLink ? await this.redirect(result.paymentLink) : this.successModal = true
        }
      } catch (e) {
        console.log(e)
        this.$store.commit('PRELOADER_TOGGLE', false)
      }
    },
    closeAndRedirect() {
      this.successModal = true
      this.$router.push('/')
    },

    productFieldCreate() {
      let services = []
      for (let key in this.$route.query) {
        let obj = {
          id: key,
          count: +this.$route.query[key]
        }
        this.$store.state.selectedHotel.services.forEach(item => {
          if (item.id == key) {
            obj.name = item.name.ru
            obj.price = item.prices.RUB
          }
        })
        services.push(obj)
      }
      this.services = services
      let tariff = {},
        tariffId = this.$store.state.booking.tariff.id
      for (let key in this.room.tariffs) {
        if (key == tariffId) tariff = this.room.tariffs[key]
      }
      this.products = [...services,
        {
          name: `Бронирование проживания в отеле ${this.$store.state.selectedHotel.hotel ? this.$store.state.selectedHotel.hotel.name : this.$store.state.selectedHotel.name} с ${this.startDate} до ${this.endDate}`,
          count: this.getDaysInTimeRangeForBooking(),
          price: tariff.prices.total.prices.RUB / this.getDaysInTimeRangeForBooking(),
        }
      ]

    },
    getDaysInTimeRangeForBooking () {
      let startDate
      let endDate
      if (this.$store.state.localSearchData){
        startDate = this.$store.state.localSearchData.startDate ? this.$store.state.localSearchData.startDate :
            this.$store.state.formData.startDate ? this.$store.state.formData.startDate : this.$moment(new Date).add(3, 'days').format('YYYY-MM-DD')
        endDate = this.$store.state.localSearchData.endDate ? this.$store.state.localSearchData.endDate :
            this.$store.state.formData.endDate ? this.$store.state.formData.endDate : this.$moment(new Date).add(10, 'days').format('YYYY-MM-DD')
      } else {
        startDate = this.$store.state.formData.startDate ? this.$store.state.formData.startDate : this.$moment(new Date).add(3, 'days').format('YYYY-MM-DD')
        endDate = this.$store.state.formData.endDate ? this.$store.state.formData.endDate : this.$moment(new Date).add(10, 'days').format('YYYY-MM-DD')
      }

      let start = new Date(startDate)
      let end = new Date(endDate)
      let timeDif = end.getTime() - start.getTime()
      let n = timeDif / (1000 * 3600 * 24)
      return n
    }
  },
  async mounted() {
    await this.productFieldCreate()
  }
}
</script>

<style scoped lang="less">
  .payment-methods{
    .rules{
      margin:0 0 30px;
      a{
        color:#666666;
      }
    }
    .block{
      width:100%;
      padding:20px;
      border: 1px solid #CCCCCC;
      box-sizing: border-box;
      border-radius: 25px;
      display:flex;
      margin-bottom:10px;
      .left{
        flex-grow: 1;
        display:flex;
        flex-direction: column;
        .block-title{
          font-weight: bold;
          font-size: 24px;
          line-height: 24px;
          color: #000000;
          display:flex;
          align-items: center;
          margin-bottom:10px;
          &.best-block{
            margin-bottom:0px;
          }
          .spec{
            font-weight: normal;
            font-size: 15px;
            line-height: 15px;
            color: #FFFFFF;
            background: #49A31E;
            border-radius: 15px;
            padding:15px;
            width:93px;
            box-sizing: border-box;
            margin-right:20px;
          }
        }
        p{
          font-weight: normal;
          font-size: 15px;
          line-height: 15px;
          color: #666666;
          margin:20px 0 0;
          max-width:800px;
        }
      }
      .right{
        justify-content: flex-end;
        align-items: flex-end;
        display:flex;
        flex-direction: column;
        margin-left:20px;
        .booking-btn{
          width:260px;
          &.disabled{
            background:#666666 !important;
            opacity: 0.5;
            cursor: default;
          }
        }
        .note{
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          color: #000000;
        }
        .price{
          font-weight: bold;
          font-size: 24px;
          line-height: 24px;
          text-align: right;
          color: #1F5299;
          display:block;
          margin:5px 0;
        }
      }
    }
  }
  @media(max-width:991px){
    .payment-methods{
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
    .payment-methods{
      .title{
        font-size:28px !important;
        padding:15px 0;
        line-height: 30px;
      }
      p{
        margin-top:0;
      }
      .pre-title{
        font-size:16px;
      }
      .block{
        flex-direction: column;
        .left{

        }
        .right{
          display:flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-end;
          flex-wrap: wrap;
          margin:30px 0 0;
          .note{
            margin-right:10px;
          }
          .price{
            margin:0
          }
          .booking-btn{
            min-width:100%;
            margin-top:10px;
          }
        }
      }
    }
  }
</style>
