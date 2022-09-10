<template>
  <div class="header">
    <div class="container flex" :class="{'nowrap':!menuActive}">
        <a href="https://hotelsmarket.ru/" class="logo" id="logo">
          Отель
<!--          <img class="logo-img" :src="require(`@/assets/img/${appLogo}`)" alt="">-->
        </a>
        <transition name="menu-slide">
          <div key="hotelMenu" class="hotel-menu-left hotel-menu-left-name flex" v-if="($store.state.currentHotel && $route.fullPath.indexOf('/hotel/') !== -1) || ($store.state.currentHotel && $route.params.hotelId)">
            <span class="header-hotel-name"><nuxt-link :to="`/hotel/${this.currentHotel.slug}`">{{this.currentHotel.name}}</nuxt-link> </span>
            <a class="whatsapp-link" target="_blank" :href="`https://wa.clck.bar/${whatsapp}`"><span class="icon-whatsapp"></span></a>
            <a class="telegram-link" target="_blank" :href="`https://t.me/${telegram}`"><span class="icon-telegram"></span></a>
          </div>
          <div key="commonMenu" class="hotel-menu-left hotel-menu-left-number flex" v-else>
            <a  class="phone-number" :href="`tel:${mainPhone.value}`" >{{ mainPhone.formattedValue }}</a>
            <a class="whatsapp-link" target="_blank" :href="`https://wa.clck.bar/${whatsapp}`"><span class="icon-whatsapp"></span></a>
            <a class="telegram-link" target="_blank" :href="`https://t.me/${telegram}`"><span class="icon-telegram"></span></a>
          </div>
        </transition>
      <div @click="menuToggle()" class="menu-toggle" :class="{'active': menuActive}" >
        <transition name="toggle">
          <span key="menu" v-if="!menuActive" class="icon-menu"></span>
          <span key="close" v-else class="icon-close"></span>
        </transition>
      </div>
      <div :class="{'menu-wrapper_open': menuActive}" class="menu-wrapper flex" >
        <div class="messengers flex desktop-hidden" v-if="menuActive" >
          <a target="_blank" :href="`https://wa.me/${whatsapp}`"><span class="icon-whatsapp"></span></a>
          <a target="_blank" :href="`https://t.me/${telegram}`"><span class="icon-telegram"></span></a>
        </div>
        <transition name="menu-slide">
          <div key="hotelMenu" class="right-part flex" v-if="($store.state.currentHotel && $route.fullPath.indexOf('/hotel/') !== -1) || ($store.state.currentHotel && $route.params.hotelId)">
            <ul class="menu flex">
              <li @click="menuActive = !menuActive"><nuxt-link  :to="`/hotel/${currentHotel.slug}`">Главная</nuxt-link></li>
              <li @click="menuActive = !menuActive"><nuxt-link  :to="`/hotel/${currentHotel.slug}/about`">Об отеле</nuxt-link></li>
              <li @click="menuActive = !menuActive"><nuxt-link  :to="`/hotel/${currentHotel.slug}/rooms`">Номерной фонд</nuxt-link></li>
              <li @click="menuActive = !menuActive"><nuxt-link  :to="`/hotel/${currentHotel.slug}/gallery`">Галерея</nuxt-link></li>
              <li @click="scrollToMethod('contactBlock')">Контакты</li>
            </ul>
          </div>
          <div key="commonMenu" class="right-part flex" v-else>
          <ul class="menu flex">
            <a  href="bonus">Бонус</a>
            <li @click="scrollToMethod('directions')">Популярные направления</li>
            <li @click="scrollToMethod('about')">О сервисе</li>
            <li @click="scrollToMethod('reviews')">Отзывы</li>
          </ul>
          <div class="account flex">
            <span class="icon-user"></span>
            <a href="">Мои бронирования</a>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  data () {
    return {
      menuActive: false,
    }
  },
  asyncData({params}) {

  },
  computed: {
    currentHotel() {
      return this.$store.state.currentHotel
    },
    mainPhone() {
      let phone = {
        value: process.env.MAIN_PHONE,
        formattedValue: this.formatPhone(process.env.MAIN_PHONE)
      }
      return phone
    },
    telegram() {
      return process.env.TELEGRAM
    },
    whatsapp() {
      return process.env.WHATSAPP
    },
    appLogo() {
      return process.env.APP_LOGO || 'logo.svg'
    }
  },
  methods: {
    formatPhone (phone) {
      let result
      if (phone[0] === '+') result = phone.substring(0, 2) + ' (' + phone.substring(2, 5) + ') ' + phone.substring(5, 8) + ' ' +phone.substring(8, 10) + ' ' + phone.substring(10, 12)
      if (phone[0] === '8') result = phone.substring(0, 1) + ' (' + phone.substring(1, 4) + ') ' + phone.substring(4, 7) + ' ' +phone.substring(7, 9) + ' ' + phone.substring(9, 11)
      return result
    },
    menuToggle () {

      this.menuActive = !this.menuActive
    },
    push (href){
      this.$router.push(`/${href}`)
    },
    scrollToMethod( anchor ) {
      this.menuActive = !this.menuActive
      if (anchor === 'contactBlock') this.$route.name === 'hotel-slug' ? this.$scrollTo(document.querySelector('#contactBlock')) : this.$router.push({name: 'hotel-slug', params: {scroll: 'contactBlock'}})
      if (anchor === 'directions' || anchor === 'about' || anchor === 'reviews') this.$route.name === 'index' ? this.$scrollTo(document.querySelector(`#${anchor}`)) : this.$router.push({name: 'index', params: {scroll: anchor}})
    }
  },
  mounted() {
    document.getElementById("logo").style.background = "red"
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0

  }
}
</script>

<style scoped lang="less">
.desktop-hidden{
  display:none;
}
  .hotel-menu-left{
    display:flex;
    align-items: center;
    .icon{
      margin-right:8px;
      font-size:18px;
      cursor: pointer;
    }
  }
  .menu-slide-enter-active{
    transition: .5s;
  }
  .menu-slide-leave-active {
    transition: transform .0s;
    opacity: 0;
    position: absolute;
  }
  .menu-slide-enter{
    opacity: 0;
    transform:translateX(20px)
  }
  .menu-slide-leave-to {
    opacity: 0;
    position: absolute;
    transform:translateX(0px)
  }
  .toggle-enter-active, .toggle-leave-active {
    transition: .5s;
  }
  .toggle-enter, .toggle-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    position: absolute;
  }
  .toggle-enter{
    transform: translateX(15px);
  }
  .toggle-leave-to{
    transform: translateX(-15px);
  }
  .header{
    height:50px;
    display:flex;
    align-items: center;
    background: #1F5299;
    color:#FFFFFF;
    font-weight:bold;
    .container{
      align-items: center;
      width:100%;
      position: relative;
      .logo{
        display:flex;
        align-items: center;
        justify-content: center;
      }
      .hotel-menu-left{
        a{
          margin-right:5px;
        }
        .telegram-link{
          margin-right:0;
        }
        .whatsapp-link,
        .telegram-link{
          font-size:18px;
        }
      }
      .menu-toggle{
        flex-grow: 1;
        justify-content: flex-end;
        display:none;
        cursor:pointer;
          .icon-menu{
            font-size:30px;
          }
         .icon-close{
           font-size:18px;
           margin-top:5px;
           margin-right:3px;
         }
      }
      .header-hotel-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display:inline-block !important;
        height:18px !important;
      }
      .phone-number,
      .header-hotel-name{
        font-size:16px;
        border-left:1px solid #FFFFFF;
        margin:0 5px 0 20px;
        height:25px;
        display:flex;
        align-items: center;
        flex-grow:1;
        max-width:550px;
      }
      .phone-number{
        padding: 0px 10px 0px 15px;
      }
      .header-hotel-name{
        padding:0px 10px 0 15px;
      }
      .messengers{
        span{
          font-size:20px;
          margin: 0 4px;
        }
      }
      .account{
        margin-left:70px;
        font-weight:bold;
        flex-grow:1;
        justify-content: flex-end;
        .icon-user{
          margin-right:8px;
        }
      }
      .menu{
        padding:0;
        list-style:none;
        li{
          margin:0 20px;
          color: #CCDDFF;
          transition: color 0.3s;
          cursor:pointer;
          &:hover{
            color:#FFFFFF;
          }
          a{
            color: #CCDDFF;
            transition: color 0.3s;
            &:hover{
              color:#FFFFFF;
            }
          }
        }
      }
      .messengers,
      .account{
        align-items: center;
      }
      .menu-wrapper{
        flex-grow:1;
        justify-content: flex-end;
      }
      a{
        color:#FFFFFF;
        text-decoration: none;
      }
    }
  }
  @media(max-width:1199px){
    .header{
      align-items: center !important;
      height:auto;
      .container{
        align-items: center;
        display:flex;
        flex-wrap:wrap;
        padding-top:10px;
        padding-bottom:10px;
        .logo{
          position: absolute;
          left:15px;
          top: 15px;
        }
        .menu-toggle{
          position: absolute;
          right:15px;
          top:10px
        }

        .hotel-menu-left{
          width: 100%;
          max-width: 100%;
          padding: 5px 40px 5px 60px;
          box-sizing: border-box;
          &.more-padding{
            padding: 0 40px 0 120px !important;
          }
          &.hotel-menu-left-number{
            padding: 0 40px 0 60px;
          }
            .whatsapp-link,
            .telegram-link{
              display:none;
            }
        }
        .phone-number{
          margin-top:2px;
        }
        .menu-toggle{
          display:flex;
        }
        .messengers{
          position: absolute;
          right:15px;
          top:80px;
          display:flex;
          flex-direction: column;
          span{
            font-size:22px;
            margin: 0 0 15px;
            display:block;
          }
        }
        .menu-wrapper{
          width:100%;
          height:0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          display:flex;
          flex-direction: column;
          background: #1F5299;
          .right-part{
            flex-direction: column;
            .menu{
              margin-top:10px;
              padding:30px 0;
              flex-direction: column;
              li{
                margin:0;
                line-height:30px;
              }
            }
          }
          //&.active{
          //  height:250px;
          //}
        }
        .menu-wrapper_open {
          height: 250px;
        }
        .account{
          padding:20px 0;
          margin:0;
          justify-content: flex-start;
        }
      }
    }
  }
  @media(max-width:767px){
    .header {
      .container{
        .phone-number{
          margin-top:0;
        }
        &.nowrap{
          flex-wrap: nowrap;
          align-items: center;
          .menu-wrapper{
            position: absolute;
            left:0;
            top:40px;
            padding:0 15px;
          }
        }
        .menu-toggle{
          top:7px;
          flex-grow: 0;
        }
        .header-hotel-name{
          display: flex;
          width:auto;
          overflow: hidden;
          height:auto;
          max-height:33px;
          font-size:14px;
        }
        .hotel-menu-left{
          flex-grow: 1;
          .phone-number{
            font-size:14px;
          }
          .header-hotel-name{
            padding-top:3px;
            padding-bottom:3px;
          }
          .icon-whatsapp,
          .icon-telegram{
            display:none;
          }
          &.hotel-menu-left-name{
            align-items: flex-start !important;
          }
        }
      }
    }

  }
  @media(max-width:460px) {
    .header {
      .container {
        .menu-toggle {
          flex-grow: 0;
        }

      }
    }
  }
</style>
