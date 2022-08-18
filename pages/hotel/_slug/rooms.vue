<template>
  <div class="rooms-page">
    <div class="search-form">
      <div class="rooms-list">
        <div class="container">
          <div class="rooms-wrapper" v-if="selectedHotel.results">
            <hotel-room :nobtn="true" :roomFull="room" :room="room" :withPrice="false" :key="`${room.id} + ${index}`" v-for="(room,index) of selectedHotel.results"/>
          </div>
          <div class="rooms-wrapper" v-else>
            <hotel-room :nobtn="true" :roomFull="room" :room="room" :withPrice="false" :key="`${room.id} + ${index}`" v-for="(room,index) of selectedHotel.rooms"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const HotelRoom = () => import ("@/components/HotelRoom")
const BookingFormShort = () => import ("@/components/BookingFormShort")
export default {
  name: "rooms",
  layout: 'MainLayout',
  components: { BookingFormShort, HotelRoom },
  async asyncData({store, params}) {
    const hotel = await store.dispatch('getHotelBySlug', params.slug)
    return {hotel}
  },
  data () {
    return {

    }
  },
  head() {
    return {
      title: this.hotel.meta_title || `Отель ${this.hotel.name}. Бронирование по низким ценам.`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.hotel.meta_description || `Забронируйте проживание в отеле ${this.hotel.name} по самым низким ценам.`
        }
      ],
    }
  },
  computed: {
    selectedHotel() {
      return this.$store.state.selectedHotel || this.$store.state.currentHotel || this.hotel
    }
  },
  methods:{
    async runPusher() {
      this.$store.commit('PRELOADER_TOGGLE', true)
      let hotels = await this.$store.dispatch('runPusher')
      let slug = this.$route.params.slug
      await hotels.forEach(item => {
        if (item.hotel.slug === slug) this.$store.commit('SET_SELECTED_HOTEL', item)
      })
      this.$store.commit('PRELOADER_TOGGLE', false)
    }
  },
  mounted() {
    console.log(this.$route)
    if (!this.$store.state.pusherUID){
      if (this.$cookies.get('uid')) this.$store.commit('SET_PUSHER_UID', this.$cookies.get('uid'))
    }
  }
}
</script>

<style scoped lang="less">
.rooms-page{
  padding: 50px 0;
  .title{
    border:none;
    font-size:64px;
    line-height: 64px;
    text-align: left;
    justify-content: flex-start;
    padding:40px 0 50px;
  }
}
.search-form{
  background: #F4F6FC;
}
.rooms-list{
  background:#FFFFFF;
}
</style>