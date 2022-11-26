<template>
  <div class="hotel-about hotels-list-page">
    <div class="hotels-list">
      <div class="hotel-block">
        <div class="container">
          <div class="title">
            <span class="title-text">{{currentHotel.name}}</span>
          </div>
          <div class="rating">
            <span class="icon-star" v-for="star of currentHotel.stars"></span>
          </div>
        </div>
        <hotel-slick :imgList="hotelPhotos" :id="currentHotel.id" :slug="currentHotel.slug"></hotel-slick>
        <div class="container">
          <div class="bottom-part">
            <p>{{currentHotel.description}}</p>
          </div>
        </div>
      </div>
    </div>
<!--    <div class="rooms-list hotel-advantages">
      <div class="container">
        <div class="title">
          <span class="title-text">Возможности отеля</span>
        </div>
        <div class="rooms-wrapper">
          <hotel-room :room="advantage" :key="advantage.id" :nobtn="true" :advantages="true" v-for="advantage of advantagesList"/>
        </div>
      </div>
    </div>-->
    <div class="gallery">
      <div class="container">
        <div class="title"><span class="title-text">Галерея</span></div>
        <div class="gallery-container">
          <grid-gallery :gallery-array="currentHotel.photos" :mobile="mobileCheck"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const HotelSlick = () => import ("@/components/HotelSlick")
const HotelRoom = () => import ("@/components/HotelRoom")
export default {
  name: "hotelAbout",
  layout: 'MainLayout',
  components: { HotelSlick, HotelRoom },
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
  data () {
    return {
      hotel: {
        id:1,
        name: 'Swissotel Resort',
        rating: 4,
        description: 'Swissotel Resort Сочи Камелия — роскошный пятизвездочный отель на берегу Черного моря\n' +
            'с идеальным песчаным пляжем и открытым бассейном.\n' +
            'Прекрасная кухня, анимационная развлекательная программа и свежий морской воздух позволят\n' +
            'гостям наслаждаться отдыхом и природой южного курорта независимо от сезона.',
        startPrice: 8500,
        imgs: [
          'hotel1.png',
          'hotel1.png',
          'hotel1.png',
          'hotel1.png',
          'hotel1.png',
          'hotel1.png',
        ]
      },
      windowWidth: 0,
      advantagesList: [
        {
          id:1,
          title:'Стандартный номер Твин',
          description: 'Ощутите лаконичность и комфорт в стандартных номерах с двумя раздельными кроватями Queen-size, кофемашиной и тропическим душем.',
          imgs: ['room1.png','room1.png','room1.png','room1.png','room1.png'],
        },{
          id:2,
          title:'Стандартный номер Твин',
          description: 'Ощутите лаконичность и комфорт в стандартных номерах с двумя раздельными кроватями Queen-size, кофемашиной и тропическим душем.',
          imgs: ['room2.png','room2.png','room2.png','room2.png','room2.png'],
        },{
          id:3,
          title:'Стандартный номер Твин',
          description: 'Ощутите лаконичность и комфорт в стандартных номерах с двумя раздельными кроватями Queen-size, кофемашиной и тропическим душем.',
          imgs: ['room3.png','room3.png','room3.png','room3.png','room3.png'],
        }
      ],
      gallery: ['gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png', 'gallery3.png', 'gallery1.png', 'gallery2.png']
    }
  },
  head() {
    return {
      title: this.currentHotel.meta_title || `Отель ${this.currentHotel.name}. Бронирование по низким ценам.`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.currentHotel.meta_description || `Забронируйте проживание в отеле ${this.currentHotel.name} по самым низким ценам.`
        }
      ],
    }
  },
  computed: {
    currentHotel() {
      return this.$store.state.currentHotel
    },
    hotelPhotos() {
      return this.currentHotel.photos.map(item => item.url )
    },
    mobileCheck () {
      return this.windowWidth < 768
    }
  },
  mounted() {
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
  }
}
</script>

<style lang="less">
.hotel-about{
  background:#F4F6FC;
  .hotels-list{
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  }
  .hotel-advantages{
    background: #FFFFFF;
    margin-bottom:10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    .title {
      padding-bottom:40px;
    }
    .hotel-room{
      &:last-child{
        margin-bottom:0;
        .info{
          border:none !important;
        }
      }
    }
  }
  .gallery{
    .title{
      margin-bottom:20px;
    }
    background:#FFFFFF;
    padding-bottom: 50px;
  }
}
@media(max-width:767px){
  .hotel-about{
    .hotel-advantages {
      .title {
        padding-bottom: 20px;
      }
      .info{
        padding-bottom:10px;
      }
    }
  }
}
</style>px;
