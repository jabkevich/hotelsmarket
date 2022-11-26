<template>
  <div class="hotel-room flex">
    <div class="wrapper" v-if="this.roomImg.length > 0">
      <client-only>
        <cool-light-box
            :items="this.roomImg"
            :index="index"
            @close="index = null">
        </cool-light-box>
      </client-only>
    </div>
    <div class="img" v-if="this.roomImg.length > 0" @click="index=0">
      <img :src="this.roomImg[0]" alt="">
      <span class="all-imgs"><span class="icon-photo"></span>{{roomImg.length}}</span>
    </div>
    <div class="img" v-else>
      <img src="/imgs/noimg.png" alt="">
    </div>
    <div class="info">
      <span class="name">{{this.currentRoom.name}}</span>
      <p class="description">{{this.currentRoom.description}}</p>
      <div class="bottom">
        <div class="services">
          <div class="service-block" v-for="block of roomServicesWithIcon" v-tooltip="block.service.name">
            <div v-html="block.service.icon"></div>
          </div>
        </div>
        <div v-if="!this.nobtn" class="btn-wrapper">
          <button class="btn" @click="toTariff">Выбрать</button>
        </div>
<!--        {{  }}-->
        <div class="price" v-if="this.withPrice && this.totalPrice()">{{formatPrice(this.totalPrice())}} Р / {{this.getDaysInTimeRange()}} суток</div>
      </div>
      <div class="note" v-if="!this.advantages">
       <span class="guests" v-if="this.currentRoom.main_capacity > 1">До {{this.currentRoom.main_capacity}} мест</span>
        <span class="guests" v-else>{{this.currentRoom.main_capacity}} место</span>
        <span class="additional-places" v-if="this.room.additionalPlaces">Дополнительных мест: {{this.room.additionalPlaces}}
        </span>
        <span class="square">{{ this.bedType(this.currentRoom.bed_type_id)}}</span>
      </div>
    </div>
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "HotelRoom",
  props: {
    room: {
      type: Object,
      require: true
    },
    roomFull: {
      type: Object
    },
    withPrice: {
      type: Boolean,
      default: false
    },
    advantages: {
      type: Boolean,
      default: false,
    },
    services: {
      type: Array
    },
    nobtn: {
      default(){
        return false
      }
    }
  },
  data () {
    return {
      index: null,
      currentRoomImgs: [],
      bedTypeInfo: [
        {id: 1, value: 'Отдельные кровати'},
        {id: 2, value: 'Двуспальная кровать'},
        {id: 3, value: 'Двуспальная кровать или отдельные кровати'},
        {id: 4, value: 'Односпальная кровать'},
        {id: 5, value: 'Двухъярусная кровать'}
      ]
    }
  },
  computed: {
    ...mapState(['localSearchData']),
    localSearchStartDate () {
      if (this.localSearchData) return this.localSearchData.startDate
      return ''
    },
    currentRoom () {
      return this.room.room ? this.room.room : this.room
    },
    searchDates () {
      let array = []
      if (this.$store.state.formData.startDate && this.$store.state.formData.endDate) {
        array.push(this.$store.state.formData.startDate)
        array.push(this.$store.state.formData.endDate)
      }
      return array
    },
    roomImg () {
      let array = []
      if (this.currentRoom.photos) {
        array = [...this.currentRoom.photos]
        array = array.map(item => item.url )
      } else if (this.currentRoom.photos) {
        array = [...this.currentRoom.photos]
        array = array.map(item => item.url )
      }
      return array
    },
    roomServicesArray () {
      let array = []
      if (this.currentRoom.services) array = this.currentRoom.services.map(item=>item.service_id)
      return array
    },
    roomServicesWithIcon () {
      const array = []
      if (this.currentRoom.services) {
        this.currentRoom.services.forEach(item => {

          if (item.service) {
            if (item.service.icon) array.push(item)
          } else console.log('item.service NO')
        })
      }
      return array
    }
  },
  watch: {
    localSearchStartDate (val) {
      console.log('watcher', val)
      this.getDaysInTimeRange()
    }
  },
  methods: {
    formatPrice(value) {
      let val = Math.floor(value)
      let result = val.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -2)
      return result
    },
    totalPrice () {
      let prices = []
      if (this.room.tariffs) {
        for (let key in this.room.tariffs) {
          if (this.room.tariffs[key].prices.total.prices) prices.push(this.room.tariffs[key].prices.total.prices.RUB)
        }
      }
      return Math.min.apply(null, prices)
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
      return timeDif / (1000 * 3600 * 24)
    },
    bedType(id) {
      let value = ''
      this.bedTypeInfo.forEach(item => {
       if (id === item.id) value = item.value
      })
      return value
    },
    toTariff() {
      this.$store.commit('SET_ACTIVE_ROOM', this.room)
      const UID = this.$store.state.localUID ? this.$store.state.localUID : this.$route.params.uid
      const hotelId = this.$route.params.hotelId || this.room.hotelId
      const roomId = this.currentRoom.api_id || this.room.roomId
      console.log(`/search/${UID}/${hotelId}/${roomId}`)
      this.$router.push({
        path: `/search/${UID}/${hotelId}/${roomId}`
      })
    }
  },
  mounted () {
    this.getDaysInTimeRange()
  }
}
</script>

<style scoped lang="less">
.hotel-room{
  margin-bottom:30px;
}
  .img{
    margin-right:30px;
    position: relative;
    width:390px;
    min-width:390px;
    border-radius: 20px;
    overflow: hidden;
    align-self: flex-start;
    cursor: pointer;
    display: flex;
    align-items: center;
    max-height:200px;
    &:hover{
      img{
        transform: scale(1.1);
      }
      &:after{
        opacity: 1;
      }
    }
    &:after{
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      background:rgba(0,0,0,0.5);
      content: "\e924";
      display:flex;
      font-family: 'icomoon' !important;
      font-size:50px;
      color:#fff;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: 0.3s ease-in-out;
      cursor: pointer;
    }
    img{
      max-width:100%;
      height:auto;
      transition:0.3s ease-in-out;
    }
    .all-imgs{
      position: absolute;
      right:25px;
      top:15px;
      color:#FFFFFF;
      background:#1F5299;
      height:35px;
      border-radius: 25px;
      font-size: 15px;
      line-height: 15px;
      /* identical to box height */
      display: flex;
      align-items: center;
      padding:0 15px;
      .icon-photo{
        color:#FFFFFF;
        font-size:15px;
        margin-right: 5px;

      }
    }
  }
  .info{
    width:100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #CCCCCC;
    padding-bottom:30px;
    box-sizing: border-box;
    position: relative;
    .note{
      position: absolute;
      right:0;
      top:25px;
      display:flex;
      flex-direction: column;
      align-items: flex-end;
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
      text-align: right;
      color: #666666;
      max-width:200px;
      .guests{
        padding: 5px 15px;
        background: rgba(31,82,153,.7);
        color: #FFF;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .square{
        margin:0 0 10px;
        display:block;
      }

      .additional-places{
        margin:0 0 5px;
      }
    }
    .name{
      font-weight: bold;
      font-size: 32px;
      line-height: 36px;
      color: #333333;
      padding-top:10px;
      display:flex;
      max-width:80%;
    }
     .description{
      font-weight: normal;
      font-size: 15px;
      line-height: 15px;
       max-height: 75px;
       overflow: hidden;
      color: #666666;
       width:100%;
       max-width:550px;
    }
    .bottom{
      width:100%;
      display:flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      .price{
        position: absolute;
        right:0;
        bottom:60px;
        font-weight:700;
      }
      .services{
        display:flex;
        flex-wrap: wrap;
        padding-right:50px;

        .service-block{
            background:#F4F6FC;
            border-radius: 15px;
            width:48px;
            min-width:48px;
            height:48px;
            display:flex;
            align-items: center;
            justify-content: center;
            margin-right:8px;
            margin-top: 8px;
            fill: #1F5299;
            div{
              width: 60%;
              max-height: 60%;
              height: auto;
              svg{
                max-width:100%;
              }
            }
        }
      }
      .features-list{
        display:flex;
        flex-wrap:wrap;
        .feature{
          background: #F4F6FC;
          border-radius: 15px;
          width:48px;
          min-width:48px;
          height:48px;
          display:flex;
          align-items: center;
          justify-content: center;
          color:#1F5299;
          margin-right:8px;
          margin-top: 8px;
          span{
            font-size:20px;
          }
        }
      }
      .btn{
        max-width:220px;
        min-width:220px;
        margin:0;
      }
    }
  }
@media(max-width:1250px){
  .rooms-list{
    .rooms-wrapper{
      .info{
        .name{
          max-width:60%;
          font-size:28px;
          line-height:30px;
        }
        .description{
          max-width:60%;
          font-size:14px;
        }
      }
    }
  }
}
@media(max-width:991px){
    .rooms-list{
      .rooms-wrapper{
        .hotel-room{
          flex-direction: column;
          .img{
            position: relative;
            width:100%;
            max-width:550px;
            padding-bottom:10px;
            max-height:none;
            img{
              width:100%;
            }
          }
          .info{
            .name{
              font-size: 22px;
              line-height: 24px;
              padding:0
            }
            .description{
              font-size:14px;
              line-height: 16px;
              padding:0
            }
            .name,
            .description{
              width:100%;
              max-width:100%;
              min-width:100%;
              box-sizing: border-box;
            }
            .features-list{
              padding: 0 0 0 15px;
            }
            .note{
              position: static;
              align-items: flex-start;
              display: flex;
              width: 100%;
              max-width: none;
              padding:0;
              font-size:14px !important

            }
            .features-list{
              flex-wrap: nowrap;
              overflow-x: auto;
            }
            .bottom{
              margin-top:20px;
              order:1;
              flex-direction: column;
              align-items: flex-start;
              .btn-wrapper{
                width:100%;
                max-width:550px;
                order:2;
              }
              .btn{
                width:100%;
                min-width:100%;
                margin-top:0;
              }
              .price{
                position: static;
                margin:10px 0;
              }
            }
          }
        }
      }
      .others{
        display:flex;
        flex-direction: column;
        .others-blocks{
          margin-left:-25px;
          margin-bottom:20px;
          .block{
            width:50px;
            height:50px;
            min-width:50px;
            margin-right:-25px;
          }
        }
        .btn{
          margin:0;
          width:250px;
        }
      }
    }
  }
@media(min-width:992px){
  .rooms-list .rooms-wrapper .info .description{
    min-height:75px;
  }
}
@media(max-width:767px) {
  .rooms-list {
    .rooms-wrapper {
      .hotel-room {
        .img {
          max-width:100%;
          min-width:250px;
          max-height: 300px;
        }

        .info {
          margin-top: 15px;
        }
      }
    }
  }
}
@media(max-width:460px){
  .rooms-list{
    .rooms-wrapper{
      .hotel-room{
        .info{
          .name{
            font-size: 20px;
            line-height: 22px;
          }
          .features-list{
            padding: 0 0 0 15px;
          }
          .note{
            font-size:12px !important

          }
        }
      }
    }
  }
}
</style>
