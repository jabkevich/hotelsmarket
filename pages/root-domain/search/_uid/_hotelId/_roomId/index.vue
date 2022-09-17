<template>
  <div class="rooms-page tariff-page">
    <div class="room-info-wrapper" v-if="this.room">
      <div class="hotels-list room-wrapper">
        <div class="hotel-block room-block" :key="room.id">
          <div class="container">
            <div class="title">
              <span class="title-text">Выберите тариф</span>
            </div>
          </div>
          <div v-if="imgArray && imgArray.length > 0">
            <hotel-slick v-if="room" :imgList="imgArray" :id="room.id"></hotel-slick>
          </div>

          <div class="container">
            <div class="name">
              <span class="name-text">{{room.room.name}}</span>
            </div>
            <div class="bottom-part">
              <p class="description">{{room.room.description}}</p>
              <div class="note">
<!--                <span>Площадь 35 м2</span>-->
                <span>Вместимость до {{room.room.main_capacity}} мест</span>
              </div>
              <div class="comfort">
                <div class="main" v-if="roomServices[0].length">
                  <span class="comfort-title">Удобства</span>
                  <div class="item-wrapper">
<!--                   <div class="item" v-for="comfortItem of comfortItems">
                      <span :class="`icon-${comfortItem.icon}`"></span>
                      <span>{{comfortItem.name}}</span>
                    </div>-->
                    <div class="services item-wrapper">
                      <div class="service-block item" v-for="block of roomServices[0]">
                        <div v-html="block.service.icon" v-if="block.service.icon" class="icon"></div>
                        <span class="service-name">{{block.service.name}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="extra" v-if="roomServices[1].length">
                  <span class="comfort-title">Дополнительно</span>
                  <div class="item-wrapper">
                    <div class="service-block item" v-for="block of roomServices[1]">
                      <span>{{block.service.name}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="this.room">
      <div class="container">
        <div class="list-wrapper" v-if="this.room">
          <div class="block" v-for="block of this.room.tariffs">
            <div class="left-part">
              <div class="line">
                <div class="icon-wrapper">
                  <span class="icon-food"></span>
                </div>
                <h3>{{ feedTypeValue(block.tariff.feedTypeId) }}</h3>
              </div>
              <div class="rest-lines" v-if="block.tariff.spoDescription || block.tariff.spoTypeId">
                <span class="spo-value" v-if="block.tariff.spoTypeId">{{spoTypeValue(block.tariff.spoTypeId)}}</span>
                <div v-html="block.tariff.spoDescription" v-if="block.tariff.spoDescription" class="spo-description"></div>
              </div>
            </div>
            <div class="right-part" :class="{'extra-padding-top': block.tariff.spoDescription || block.tariff.spoTypeId}">
              <div class="days">Стоимость за <span>{{getDaysInTimeRange()}}</span></div>
              <div class="price-wrapper">
                <div class="price">
<!--                  <div class="previous"><span class="discount">-15 %</span><span class="previous-price">14 400 P</span></div>-->
                  <div class="current">{{ formatPrice(Math.floor(block.prices.total.prices.RUB)) }} P</div>
                </div>
                <button @click="toBooking(block)" class="btn">Выбрать тариф</button>
              </div>
              <span class="charges-info type">
                <span class="not-refundable" v-if="block.charges[0].isHardNotRefundable">Тариф невозвратный</span>
                <span class="refundable" v-else>Бесплатная отмена бронирования</span>
              </span>
              <span v-if="block.charges[0].chargeDate && !block.charges[0].isHardNotRefundable" class="charges-info date">{{chargesDate(block.charges[0].chargeDate)}}</span>
              <span class="charges-info">{{chargesName(block.charges[0].usedChargeId)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {fetchData} from "@/mixins/fetchData";
const HotelSlick = () => import ("@/components/HotelSlick")

export default {
  name: "tariff",
  layout: 'BookingLayout',
  components: { HotelSlick },
  mixins: [fetchData],
  data() {
    return {
      isOpen: false, // closed by default
      bottomInfo: true,
      bottomInitHeight: null,
      //comfortItems: [{icon:'air', name:'Кондиционер'},{icon:'kettle', name:'Чайник'},{icon:'shower', name:'Душевая кабина'},{icon:'coffee-machine', name:'Кофемашина'},{icon:'balcony', name:'Балкон'},{icon:'wifi', name:'Wi-Fi'},{icon:'tv', name:'Кабельное TV'},{icon:'bath', name:'Ванна'},{icon:'coctail', name:'Минибар'},{icon:'safe', name:'Сейф'}],
      //comfortItemsExtra: ['Халаты', 'Тапочки', 'Душевая кабина', 'Косметические средства', 'Ванная комната', 'Раковина', 'Санузел', 'Банные полотенца', 'Мягкая мебель', 'Письменный стол', 'Журнальный столик', 'Вешалки', 'Фен', 'Холодильник', 'Зеркало'],
      feedType: [
        {id: 1, value: 'Питание не входит в стоимость'},
        {id: 2, value: 'Завтрак'},
        {id: 3, value: 'Полупансион'},
        {id: 4, value: 'Полный пансион'},
        {id: 5, value: 'Все включено'},
        {id: 6, value: 'Ультра все включено'}
      ],
      spoType: [
        {id: 1, value: 'Бесплатные ночи (с перерасчетом, на все проживание)'},
        {id: 2, value: 'Бесплатные ночи (с перерасчетом, на один интервал)'},
        {id: 3, value: 'Бесплатные ночи (каждая первая, на все проживание)'},
        {id: 4, value: 'Бесплатные ночи (каждая последняя, на все проживание'},
        {id: 5, value: 'Бесплатные ночи (каждая самая дешевая, на все проживание)'},
        {id: 6, value: 'Бесплатная ночь (первая, на один интервал)'},
        {id: 7, value: 'Бесплатная ночь (последняя, на один интервал)'},
        {id: 8, value: 'Бесплатная ночь (самая дешевая, на один интервал)'},
        {id: 9, value: 'Минимальный срок проживания'},
        {id: 10, value: 'Раннее бронирование'},
        {id: 11, value: 'Бронирование в последнюю минуту'},
        {id: 12, value: 'Невозвратный тариф'},
        {id: 14, value: 'Специальное предложение от отеля'}
      ]
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
    imgArray() {
      let result = []
      if (this.room.room.photos) { result = this.room.room.photos.map(item => item.url) }
      return result
    },
    roomServices () {
      const array = [[],[]]
      if (this.room.room.services) {
        this.room.room.services.forEach(item => {
          item.service.icon ? array[0].push(item) : array[1].push(item)
        })
      }
      return array
    },
    minPrice () {
      return this.$store.state.selectedHotel.min_price
    },
    startDate() {
      return this.$store.state.localSearchData ? this.$store.state.localSearchData.startDate : this.$store.state.formData.startDate
    },
    endDate() {
      return this.$store.state.localSearchData ? this.$store.state.localSearchData.endDate : this.$store.state.formData.endDate
    },
  },
  methods: {
    chargesDate(date) {
      return `Бесплатная отмена бронирования до ${this.$moment(date).format('DD MMMM, YYYY HH:MM')} по местному времени отеля`
    },
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    chargesName(id) {
      let result = ''
      if (this.selectedHotel.charges){
        let charges = this.selectedHotel.charges.find(item => item.id === id)
        result = charges.name.ru
      } else if (this.hotelsList && this.hotelsList.length === 1) {
        this.$store.commit('SET_SELECTED_HOTEL', this.hotelsList[0])
        let charges = this.selectedHotel.charges.find(item => item.id === id)
        result = charges.name.ru
      }
      return result
    },
    toBooking (tariff) {
      this.$store.commit('BOOKING_HOTEL', {id: this.$route.params.hotelId})
      this.$store.commit('BOOKING_ROOM', {id: this.$route.params.roomId})
      this.$store.commit('BOOKING_TARIFF', {id: tariff.tariff.id})
      this.$store.commit('BOOKING_STAGE_CHANGE', 'personalData' )

      const UID = this.$route.params.uid
      const hotelId = this.$route.params.hotelId
      const roomId = this.$route.params.roomId
      const services = tariff.serviceIds
      if (services && services.length) this.$router.push({path: `/search/${UID}/${hotelId}/${roomId}/${tariff.tariff.id}/services`})
      else this.$router.push({path: `/search/${UID}/${hotelId}/${roomId}/${tariff.tariff.id}/booking`})
    },
    feedTypeValue(value){
      let result = ''
      this.feedType.forEach(item => {
        if (item.id === value) result = item.value
      })
      return result
    },
    spoTypeValue(value){
      let result = ''
      this.spoType.forEach(item => {
        if (item.id === value) result = item.value
      })
      return result
    },
    getDaysInTimeRange () {
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
      return n === 1 ? '1 ночь': n < 5 ? `${n} ночи` : `${n} ночей`
    }
  }
}
</script>

<style scoped lang="less">
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
        text-align: right;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &.extra-padding-top{
          padding-top:10px;
        }
        .charges-info{
          margin-top:15px;
          max-width:300px;
          font-size:12px;
          line-height:14px;
          &.type{
            .refundable{
              background: rgba(29, 255, 37, 0.3);
              border-radius: 5px;
              padding:5px 10px;
              color:green;
            }
            .not-refundable{
              background:rgba(255,29,29,0.3);
              border-radius: 5px;
              padding:5px 10px;
              color:red;
            }
          }
        }
        .days{
          font-weight: normal;
          font-size: 16px;
          line-height: 16px;
          /* identical to box height */
          text-align: right;
          color: #000000;
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
  padding-bottom:50px;
  margin-bottom:10px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  .name{
    display:flex;
    width:100%;
    justify-content: space-between;
    align-items: center;
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
          flex-direction: column;
          align-items: center;
          .charges-info{
            text-align: center;
          }
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
