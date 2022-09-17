<template>
  <div class="rooms-page tariff-page tariff-services-page">
    <div class="room-info-wrapper" v-if="this.room">
      <div class="hotels-list room-wrapper">
        <div class="hotel-block room-block" :key="room.id">
          <div class="container">
            <div class="title">
              <span class="title-text">Закажите услуги<p>Перед тем, как завершить бронирование, вы можете улучшить <span>условия проживания</span></p></span>
            </div>
          </div>
          <div v-if="imgArray && imgArray.length > 0">
            <hotel-slick v-if="room" :imgList="imgArray" :id="room.id"></hotel-slick>
          </div>
          <div class="container">
            <div class="name">
              <span class="name-text">{{room.room.name}}</span>
              <div class="price" v-if="formatPrice(totalPriceValue)">Всего <span class="sum">+ {{this.servicesPrice()}} Р</span> за {{this.getDaysInTimeRange()}} ночи</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="this.room">
      <div class="container">
        <div class="list-wrapper" v-if="this.room">
          <div class="block" v-for="(service, index) of availableServices">
            <div class="left-part">
              <div class="line">
                <div class="icon-wrapper">
                  <div v-html="service.icon" v-if="service.icon" class="icon"></div>
                  <span v-else class="icon-star"></span>
                </div>
                <h3>{{service.name.ru}}</h3>
              </div>
              <div class="rest-lines">
                <div v-if="service.description.ru" class="spo-description">{{ service.description.ru }}</div>
              </div>
            </div>
            <div class="right-part">
              <div class="days" v-if="service.isPerNight">Стоимость за сутки</div>
              <div class="days" v-else>Стоимость за весь период проживания</div>
              <div class="price-wrapper">
                <div class="price">
<!--              <div class="previous"><span class="discount">-15 %</span><span class="previous-price">14 400 P</span></div>-->
                  <div class="current">{{ formatPrice(service.prices.RUB) }} P</div>
                </div>
                <div v-if="service.isMultiple" class="btn">
                  <span class="with-count" @click="plusServiceCount(service, index)">Добавить</span>
                  <div class="counter">
                    <span class="minus" @click="minusServiceCount(service, index)">-</span>
                    <span class="value" v-if="servicesToAdd[index]">{{servicesToAdd[index].amount}}</span>
                    <span class="value" v-else>0</span>
                    <span class="plus" @click="plusServiceCount(service, index)">+</span>
                  </div>

                </div>
                <div v-else @click="addService(service, index)" class="btn"><input type="checkbox" name="moment-accept" v-model="servicesToAdd[index]">
                  <label>Добавить</label>
                </div>
              </div>
              <div class="note" v-if="service.isNeedConfirmation">Услуга не гарантируется онлайн и заказывается под запрос</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-line">
      <div class="container">
        <div class="price" v-if="totalPriceValue"><span class="desktop">{{formatPrice(totalPriceValue)}} Р / {{this.getDaysInTimeRange()}} суток</span>  <button class="btn" @click="toBooking"><span class="desktop">Продолжить</span><span class="mobile">{{formatPrice(totalPriceValue)}} P<span class="icon-arrow-right"></span></span></button></div>
      </div>

    </div>
  </div>
</template>

<script>

import {fetchData} from "@/mixins/fetchData";
import {mapState} from "vuex";
const HotelSlick = () => import ("@/components/HotelSlick")

export default {
  name: "services",
  layout: 'BookingLayout',
  components: { HotelSlick },
  mixins: [fetchData],
  async asyncData ({store}) {
    await store.dispatch('getServices')
  },
  data() {
    return {
      isOpen: false, // closed by default
      bottomInfo: true,
      servicesToAdd: [],
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
    ...mapState(['services']),
    availableServices () {
      let tariffServicesIds = [],
       result = []
      for (let key in this.room.tariffs) {
        if (key === this.$route.params.tariffId) tariffServicesIds = this.room.tariffs[key].serviceIds
      }
      this.selectedHotel.services.forEach(service => {
        if (tariffServicesIds.includes(service.id)) {
          let servIcon = null
          this.services.forEach(item => {
            item.services.forEach(innerItem => {
              if (innerItem.id === service.propertyId) servIcon = innerItem.icon
            })
          })
          service = {...service, icon: servIcon}
          result.push(service)
        }
      })

      return result
    },
    imgArray() {
      let result = []
      if (this.room.room.photos) { result = this.room.room.photos.map(item => item.url) }
      return result
    },
  },
  methods: {
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    servicesPrice () {
      let prices = []
      if (this.room){
        if (this.room.tariffs) {
          for (let key in this.room.tariffs) {
            prices.push(this.room.tariffs[key].prices.total.prices.RUB)
          }
        }
        let value = this.totalPriceValue - Math.min.apply(null, prices)
        return this.formatPrice(value)
      }
    },
    getDaysInTimeRange () {
      let start = new Date(this.$store.state.formData.startDate)
      let end = new Date(this.$store.state.formData.endDate)
      let timeDif = end.getTime() - start.getTime()
      return timeDif / (1000 * 3600 * 24)
    },
    plusServiceCount (service, index){
      console.log(service)
      let adults = this.$store.state.formData.accommodation[0].adults,
          max = 0
      service.isPerNight ? max = adults * this.getDaysInTimeRange() : max = adults
      if (!this.servicesToAdd[index]) {
        this.totalPriceValue += service.prices.RUB
        this.servicesToAdd.splice(index, 1, {id: service.id, amount: 1, price: service.prices.RUB, name: service.name.ru})
      } else if (this.servicesToAdd[index].amount < max) {
        this.servicesToAdd[index].amount = this.servicesToAdd[index].amount + 1
        this.totalPriceValue += service.prices.RUB
      }
    },
    minusServiceCount (service, index){
      if (this.servicesToAdd[index] && this.servicesToAdd[index].amount > 0)  this.totalPriceValue -= service.prices.RUB
      this.servicesToAdd[index] ? this.servicesToAdd.splice(index, 1, {id: service.id, price: service.prices.RUB, name: service.name.ru, amount: this.servicesToAdd[index].amount ? this.servicesToAdd[index].amount - 1 : 0}) : this.servicesToAdd.splice(index, 1, {id: service.id, amount: 0})
      if (this.servicesToAdd[index].amount === 0) this.servicesToAdd.splice(index, 1)
    },
    addService (service, index){
      if (this.servicesToAdd[index]) {
        this.servicesToAdd.splice(index, 1)
        this.totalPriceValue -= service.prices.RUB
      } else {
        this.servicesToAdd.splice(index, 1, {id: service.id, price: service.prices.RUB, name: service.name.ru})
        this.totalPriceValue += service.prices.RUB

      }

    },
    toBooking () {
      this.$store.commit('BOOKING_HOTEL', {id: this.$route.params.hotelId})
      this.$store.commit('BOOKING_ROOM', {id: this.$route.params.roomId})
      this.$store.commit('BOOKING_TARIFF', {id: this.$route.params.tariffId})
      this.$store.commit('BOOKING_SERVICES', this.servicesToAdd)
      this.$store.commit('BOOKING_SUM', this.totalPriceValue)
      this.$store.commit('BOOKING_STAGE_CHANGE', 'personalData' )

      let queryObj = {}
      if (this.servicesToAdd.length) {
        this.servicesToAdd.forEach(service => {
          queryObj[service.id] = service.amount
        })
      }
      const UID = this.$route.params.uid
      const hotelId = this.$route.params.hotelId
      const roomId = this.$route.params.roomId
      const tariffId = this.$route.params.tariffId
      Object.keys(queryObj).length === 0 ?
          this.$router.push({path: `/search/${UID}/${hotelId}/${roomId}/${tariffId}/booking`}) :
          this.$router.push({path: `/search/${UID}/${hotelId}/${roomId}/${tariffId}/booking`, query: queryObj})
    }
  },
  async created() {
    await this.totalPrice()
  }
}
</script>

<style scoped lang="less">
.tariff-services-page {
  .desktop{
    display:flex;
  }
  .mobile{
    display:none;
    span{
      margin-left:10px;
    }
  }
  .right-part {
    .btn {
      width: 200px;
      justify-content: center;
      padding: 0 15px;
      box-sizing: border-box;

      .with-count {
        flex-grow: 1;
        user-select: none;
      }

      label {
        margin: 0 !important
      }

      .counter {
        margin-left: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: flex-end;
      }

      .value {
        background: #FFF;
        display: flex;
        min-width: 22px;
        height: 22px;
        color: #1F5299;
        font-size: 16px;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        margin: 0 10px;
      }

      .plus {
        transform: translateY(1px);
      }

      .minus,
      .plus {
        font-size: 28px;
        user-select: none;
      }
    }

    .note {
      flex-grow: 1;
      margin-top: 10px;
      color: #1F5299;
      font-weight: 700;
    }
  }
}
.tariff-services-page{
  .bottom-line{
    width:100%;
    padding:20px 0;
    .price{
      justify-content: flex-end;
      align-items: center;
      display:flex;
      width:100%;
      font-weight: 700;
      font-size: 24px;

    }
    .btn{
      margin:0 0 0 20px;
      max-width:220px;
    }
  }
  .title{
    padding-bottom:10px;
  }
  .title .title-text{
    line-height:44px;
    p{
      font-size:14px;
      font-weight: 700;
      height:auto;
      span{
        color:#1F5299;
      }
    }
  }
}
.tariff-page{
  background: #F4F6FC;
  .list{
    background:#FFFFFF;
    padding:50px 0;
  }
  .list-wrapper{
    .block{
      padding:20px;
      position: relative;
      border: 1px solid #CCCCCC;
      box-sizing: border-box;
      border-radius: 25px;
      display:flex;
      justify-content: space-between;
      margin-bottom: 30px;
      .icon-wrapper{
        height:47px;
        width:47px;
        display:flex;
        justify-content: center;
        align-items: center;
        background: #F4F6FC;
        border-radius: 15px;
        margin-right:15px;
        span{
          color:#1F5299;
          font-size:18px;
        }
      }
      .line{
        display:flex;
        align-items: center;
        h3{
          font-weight: bold;
          font-size: 24px;
          line-height: 24px;
          color: #333333;
        }
        .more{
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          text-align: right;
          color: #1F5299;
          margin-left:10px;
          display:flex;
          align-items: center;
          .icon-arrow-up{
            margin-left:5px;
          }
        }
        .collapsed-info{
          padding-left:65px;
          font-weight: normal;
          font-size: 15px;
          line-height: 15px;
          color: #666666;
          ul{
            padding-left:20px;
          }
        }
        &.point-line{
          display:flex;
          flex-direction: column;
          align-items: flex-start;
          padding-left:65px;
          .point{
            display:flex;
            font-weight: normal;
            font-size: 15px;
            line-height: 15px;
            color: #666666;
            align-items: center;
            margin-bottom:10px;
            .icon{
              font-size:24px;
              color: #1F5299;
              margin-right:8px;
            }
            .strong{
              text-transform: uppercase;
              font-weight: bold;
              font-size: 18px;
              line-height: 18px;
              color: #1F5299;
            }
          }
        }
      }
      .left-part{
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items: flex-start;
        h3{
          margin:10px 0 !important;
        }
        .rest-lines{
          margin-top:20px;
          padding-left:65px;
          .spo-value{
            font-size:18px;
            color:#1F5299;

          }
          .spo-description{
            max-width:600px;
          }
        }
      }
      .right-part{
        justify-content: center;
        align-items: flex-end;
        display: flex;
        flex-direction: column;
        &.extra-padding-top{
          padding-top:10px;
        }
        .days{
          font-weight: normal;
          font-size: 12px;
          line-height: 12px;
          /* identical to box height */
          text-align: right;
          color: #666;
          display:flex;
          margin-bottom:10px;
          justify-content: flex-end;
          span{
            margin:0 5px;
          }
        }
        .price-wrapper{
          display:flex;
          align-items: center;
          .price{
            margin-right:15px;
            .previous{
              display:flex;
              align-items: center;
            }
            .previous-price{
              display:flex;
              font-weight: normal;
              font-size: 15px;
              line-height: 15px;
              /* identical to box height */
              text-decoration-line: line-through;
              color: #666666;
            }
            .discount{
              font-weight: bold;
              font-size: 10px;
              color: #FFFFFF;
              background: #1F5299;
              border-radius: 10px;
              height:20px;
              width:35px;
              padding:0 5px;
              display:flex;
              align-items: center;
              justify-content: center;
              margin-right:10px;
            }
            .current{
              display:flex;
              align-items: center;
              margin-top:5px;
              font-weight: bold;
              font-size: 24px;
              line-height: 24px;
              color: #333333;
              .icon-info{
                font-size:28px;
                color:#1F5299;;
                margin-left:5px;
              }
            }
          }
        }
      }
    }
  }
  .comfort{
    .icon{
      margin-right:5px;
    }
    .service-name{
      max-width: 200px !important;
    }
  }
}
.room-info-wrapper{
  background: #FFFFFF;
  padding-bottom:30px;
  margin-bottom:10px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  .name{
    display:flex;
    flex-direction: column;
    width:100%;
    justify-content: space-between;
    align-items: flex-start;
  }
  .price{
    padding:0 5px;
    box-sizing: border-box;
    align-items: center;
    display:flex;
    width:100%;justify-content: flex-end;
    .sum{
      font-weight: 700;
      font-size:24px;
      margin:0 10px;
    }
  }
  .name-text{
    font-weight: bold;
    font-size: 36px;
    line-height: 36px;
    color: #333333;
    padding:20px 0;
  }
  .info-toggle{
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    color: #1F5299;
    display:flex;
    cursor: pointer;
    span{
      margin-left:5px;
      display:block;
      transition: 0.3s;
      &.active{
        transform: rotate(180deg);
      }
    }
  }
  .bottom-part{
    transition: max-height 0.3s ease;
    overflow: hidden;
    .description{
      max-width:800px;
      width:100%;
    }
    .note{
      display:flex;
      flex-direction: column;
      span{
        font-weight: bold;
        font-size: 15px;
        line-height: 15px;
        color: #666666;
      }
    }
    .comfort{
      margin-top:40px;
      display:flex;
      .comfort-title{
        font-weight: bold;
        font-size: 24px;
        line-height: 24px;
        color: #333333;
        width:100%;
        min-width:100%;
        display:flex;
        margin-bottom:20px;
      }
      .main{
        display:flex;
        flex-direction: column;
        width:auto;
        min-width:650px;
        .item-wrapper{
          flex-wrap: wrap;
          display:flex;
          flex-direction: column;
          max-height:300px;
        }
        .item{
          display:flex;
          align-items: center;
          margin-bottom:10px;
          span{
            &:first-child{
              width:48px;
              height:48px;
              display:flex;
              min-width:48px;
              justify-content: center;
              align-items: center;
              background: #F4F6FC;
              color:#1F5299;
              margin-right:10px;
              border-radius: 15px;
              font-size:19px;
            }
            &:last-child{
              font-weight: normal;
              font-size: 15px;
              line-height: 15px;
              color: #666666;
              max-width:100px;
            }
          }
        }
      }
      .extra{
        display:flex;
        flex-direction: column;
        .item-wrapper{
          flex-wrap: wrap;
          display:flex;
          flex-direction: column;
          max-height:300px;
          .item{
            line-height: 28px;
            margin-right:80px;
          }
        }
      }
    }
  }
}
@media(max-width:991px){
  .tariff-page{
    .title{
      padding:20px 0;
      .title-text{
        font-size:36px !important;
      }
    }
    .room-info-wrapper{
      .name-text{
        font-size:24px;
      }
    }
    .list-wrapper{
      .block{
        flex-direction: column;
        .left-part{
          justify-content: center;
          align-items: center;
          .rest-lines{
            padding-left:0;
          }
          .spo-description{
            text-align: center;
          }
        }
        .right-part{
          align-items: center !important;
          flex-direction: column;
          .days{
            justify-content: center;
          }
          .price-wrapper{
            flex-direction: column;
            .price{
              margin:5px 0 15px;
            }
          }
        }
      }
    }
  }
}
@media(max-width:767px){
  .tariff-services-page {
    .bottom-line{
      .price{
        justify-content: center;
        width:100%;
        .btn{
          width:100%;
          max-width:100%;
          margin-left:0;
        }
      }
    }
    .desktop{
      display:none;
    }
    .mobile{
      display:flex;
    }
  }
  .tariff-page{
    .room-info-wrapper{
      padding-bottom:0px;
    }
    .list{
      padding:30px 0 10px;
    }
    .icon-info{
      display:none;
    }
    .title{
      padding:20px 0;
      .title-text{
        font-size:24px !important;
      }
    }
    .slick-container{
      padding-left:15px;
    }
    .room-info-wrapper{
      .name-text{
        font-size:18px;
        line-height: 20px;
      }
    }
    .list-wrapper{
      .block{
        .left-part{
          h3{
            font-size:18px;
          }
        }
        .right-part{
          .price-wrapper{
            .price{
              margin:5px 0 15px;
            }
          }
        }
      }
    }
  }
}
</style>
