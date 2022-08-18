<template>
<div class="contacts">
  <div class="container">
    <div class="title"><span class="title-text">Контакты</span></div>
  </div>
  <div class="container map-container">
    <div class="info">
      <div class="block">
        <span class="icon-wrapper">
          <span class="icon-balloon"></span>
        </span>
        <div class="block-info">
          <span class="name">Адрес</span>
          <p>{{hotel.city.name}}, ул. {{hotel.address}}</p>
        </div>
      </div><div class="block">
        <span class="icon-wrapper">
          <span class="icon-phone"></span>
        </span>
      <div class="block-info">
        <span class="name">Телефон</span>
        <p><a :href="`tel:${mainPhone.value}`" class="phone">{{ mainPhone.formattedValue }}</a></p>
      </div>
      </div><div class="block">
        <span class="icon-wrapper">
          <span class="icon-mail"></span>
        </span>
      <div class="block-info">
        <span class="name">E-mail</span>
        <p><a :href="`mailto:${mainEmail}`" class="phone">{{ mainEmail }}</a></p>
      </div>
      </div>
    </div>
    <div class="map">
      <client-only placeholder="Loading...">
        <yandex-map
            :coords="coords"
            :zoom="17"
            :scrollZoom="false"
        >
          <ymap-marker
              :coords="coords"
              marker-id="123"
              hint-content="some hint"
          />
        </yandex-map>
      </client-only>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "HotelsContacts",
  props: {
    hotel: {
      type: Object,
      require: true
    },
  },
  data () {
    return {
      coords: [this.hotel.lat, this.hotel.lng]
    }
  },
  computed:{
    mainPhone() {
      let phone = {
        value: process.env.MAIN_PHONE,
        formattedValue: this.formatPhone(process.env.MAIN_PHONE)
      }
      return phone
    },
    mainEmail() {
      return process.env.MAIN_EMAIL
    }
  },
  methods: {
    formatPhone (phone) {
      let result
      if (phone[0] === '+') result = phone.substring(0, 2) + ' (' + phone.substring(2, 5) + ') ' + phone.substring(5, 8) + ' ' +phone.substring(8, 10) + ' ' + phone.substring(10, 12)
      if (phone[0] === '8') result = phone.substring(0, 1) + ' (' + phone.substring(1, 4) + ') ' + phone.substring(4, 7) + ' ' +phone.substring(7, 9) + ' ' + phone.substring(9, 11)
      return result
    },
  },

}
</script>

<style scoped lang="less">
.contacts{
  background: #FFFFFF;
  padding-bottom:40px;
  .ymap-container{
    height:100%;
    width:100%;
  }
  .map-container{
    margin-top:10px;
  }
  .container{
    display:flex;
    justify-content: space-between;
    .map{
      border-radius: 25px;
      overflow: hidden;
      width:49%;
      height: 350px;
    }
    .info{
      display:flex;
      width:49%;
      flex-direction: column;
      justify-content: space-between;
      .block{
        width:100%;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        border-radius: 25px;
        padding:25px;
        display:flex;
        align-items: center;
        .icon-wrapper{
          background: #F4F6FC;
          border-radius: 15px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1F5299;
          margin-right:15px;
          span{
            font-size:20px;
          }
        }
        .name{
          font-weight: bold;
          font-size: 18px;
          line-height: 18px;
          color: #333333;
          margin:0;
        }
        p{
          font-weight: normal;
          font-size: 15px;
          line-height: 15px;
          color: #666666;
          margin:10px 0 0;
          a{
            color: #666666;
            text-decoration: none;
            &:hover{
              color:#1F5299;
            }
          }
        }
      }
    }
  }
}
@media(max-width:767px) {
  .contacts{
    padding-bottom:25px;
    .container{
      flex-direction: column;
      justify-content: center;
      .map{
        width:100%;
        margin:0;
      }
      .info{
        width:100%;
        margin:0 0 10px;
        .block{
          padding:15px;
          margin-bottom:15px;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>
