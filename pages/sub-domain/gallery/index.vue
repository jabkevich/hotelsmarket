<template>
  <div class="gallery-page">
    <div class="container">
      <div class="title">
        <div class="title-text">Галерея</div>
      </div>
    </div>
    <grid-gallery :gallery-array="this.hotel.photos" :mobile="mobileCheck" :show-all-prop="true"/>
  </div>
</template>

<script>

const GridGallery = () => import ("@/components/GridGallery")

export default {
  name: "gallery",
  layout: 'MainLayout',
  components: { GridGallery },
  data () {
    return {
      windowWidth: 0
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
  async asyncData({store, params, req, redirect}) {
    const getSubDomen = () => {
      if(process.server){
        const host = req.headers.host;
        const hostArray = host.split(".");
        const subDomen = hostArray[0].replace("https://", "").replace("http://");
        return subDomen;
      } else {
        const host =  window.location.href;
        const hostArray = host.split(".");
        const subDomen = hostArray[0].replace("https://", "").replace("http://", "");
        return subDomen;
      }
    }

    const hotel = await store.dispatch('getHotelBySlug', getSubDomen());
    if(!hotel) {
      redirect('https://hotelsmarket.ru/')
    }

    return hotel;

  },
  computed: {
    mobileCheck () {
      return this.windowWidth < 768
    },
    hotel() {
      return this.$store.state.currentHotel
    }
  },
  mounted() {
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
  }
}
</script>

<style scoped lang="less">
.title{
  background: none;
  display:flex;
  align-items: center;
  flex-direction: row;
  border:none;
  justify-content: space-between;
  .title-text{
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 64px;
    color: #333333;
  }
}
@media(max-width:1199px){
  .container > .title{
    font-size: 48px !important;
    line-height: 48px !important;
    .name{
      font-size: 48px !important;
      line-height: 48px !important;
    }
    .title-text{
      font-size: 48px !important;
      line-height: 48px !important;
    }
  }
}
@media(max-width:991px){
  .container > .title{
    font-size: 28px !important;
    line-height: 28px !important;
    .name{
      font-size: 28px !important;
      line-height: 28px !important;
    }
    .title-text{
      font-size: 28px !important;
      line-height: 28px !important;
    }
  }
}
@media(max-width:767px) {
  .gallery-page .container > .title {
    font-size: 24px !important;
    line-height: 24px !important;
    align-items: baseline !important;
    padding-bottom:15px;
    .name {
      font-size: 24px !important;
      line-height: 24px !important;
    }

    .title-text {
      font-size: 24px !important;
      line-height: 24px !important;
    }

    .btn-link span {
      margin-left: 5px;
      position: relative;
      top: 1px;
    }
  }
}
</style>
