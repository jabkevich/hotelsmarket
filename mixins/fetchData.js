import {mapMutations, mapState} from 'vuex'

export const fetchData = {
  data() {
    return {
      UIDFromURL: this.$route.params.uid,
      hotelIdFromURL: this.$route.params.hotelId,
      roomIdFromURL: this.$route.params.roomId,
      tariffIdFromURL: this.$route.params.tariffId,
      isMounted: false,
      totalPriceValue: 0,
    }
  },
  computed: {
    ...mapState(['localLoading', 'selectedHotel', 'hotelsList', 'currentHotel']),
    room() {
      return this.$store.state.activeRoom
    },
    tariff() {
      return this.$store.state.booking.tariff.id
    }
  },
  methods: {
    ...mapMutations(['SET_SELECTED_HOTEL', 'SET_ACTIVE_ROOM', 'SET_CURRENT_HOTEL']),
    formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    async fetchHotels() {
      try{
        await this.$store.dispatch('fetchHotels',this.UIDFromURL)
      } catch (e) {
        console.log(e)
      }
    },
    async selectHotel() {
      let selectedHotelId = this.hotelIdFromURL
      await this.hotelsList.forEach( hotel => {
        // Route params are strings & id is number => both values to numbers by adding "+"
        if (+(hotel.id) === +(selectedHotelId))  this.SET_SELECTED_HOTEL(hotel)
      })
    },
    async selectCurrentHotel() {
      let selectedHotelId = this.hotelIdFromURL
      await this.hotelsList.forEach( hotel => {
        // Route params are strings & id is number => both values to numbers by adding "+"
        if (+(hotel.id) === +(selectedHotelId))  this.SET_CURRENT_HOTEL(hotel.hotel)
      })
    },
    async selectRoom() {
      console.log(123)
      let selectedRoom = this.roomIdFromURL
      await this.selectedHotel.results.forEach( hotel => {
        // Route params are strings & id is number => both values to numbers by adding "+"
        if (+(hotel.roomId) === +(selectedRoom))  this.SET_ACTIVE_ROOM(hotel)
      })
    },
    async selectTariff() {
      let selectedTariff = this.tariffIdFromURL
      if (this.tariffIdFromURL) this.$store.commit('BOOKING_TARIFF', {id: selectedTariff})
    },
    async totalPrice () {
      let result = null
      let prices = []
      if (this.room){
        if (this.tariffIdFromURL) {
          if (this.room.tariffs) {
            for (let key in this.room.tariffs) {
              if (key === this.tariffIdFromURL) {
                result = this.room.tariffs[key].prices.total.prices.RUB
              }
            }
          }
        } else {
          if (this.room.tariffs) {
            for (let key in this.room.tariffs) {
              prices.push(this.room.tariffs[key].prices.total.prices.RUB)
            }
          }
          result = Math.min.apply(null, prices)
        }
      }
      if (Object.keys(this.$route.query).length != 0){
        for (let key in this.$route.query) {
          let obj = {
            id: key,
            count: +this.$route.query[key]
          }
          if (!this.$store.state.selectedHotel) await this.selectHotel()
          this.$store.state.selectedHotel.services.forEach(item => {
            if (item.id == key) {
              result += (+item.prices.RUB)*(+this.$route.query[key])
            }
          })
        }
      }
      this.totalPriceValue = result

    },
  },
  async mounted() {
    this.$store.commit('PRELOADER_TOGGLE', true)
    if (!this.hotelsList.length && this.UIDFromURL) await this.fetchHotels()
    if (!this.selectedHotel && this.hotelIdFromURL) await this.selectHotel()
    if (!this.currentHotel && this.hotelIdFromURL) await this.selectCurrentHotel()
    if (!this.room && this.roomIdFromURL) await this.selectRoom()
    await this.totalPrice()
    if (!this.tariff && this.tariffIdFromURL) await this.selectTariff()
    await this.$store.commit('PRELOADER_TOGGLE', false)
    this.isMounted = true
  }
}
