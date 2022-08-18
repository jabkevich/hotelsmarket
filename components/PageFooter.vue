<template>
  <div class="footer">
    <div class="container">
      <div class="copyright-line">
        <span class="copyright">2022 © {{ mainUrl }}</span>
        <a :href="`tel:${mainPhone.value}`" class="phone">{{ mainPhone.formattedValue }}</a>

        <div class="messengers">
          <a target="_blank" :href="`https://wa.me/${whatsapp}`"><span class="icon-whatsapp"></span></a>
          <a target="_blank" :href="`https://t.me/${telegram}`"><span class="icon-telegram"></span></a>
        </div>
      </div>
      <ul class="footer-menu">
        <li><a href="#">Популярные направления</a></li>
        <li><a href="#">О сервисе</a></li>
        <li><a href="#">Отзывы</a></li>
      </ul>
      <ul class="footer-menu footer-extra-menu">
        <li><a href="#">Правила онлай-бронирования</a></li>
        <li><a href="#">Правила обработки персональных данных</a></li>
        <li><a href="#">Политика конфиденциальности</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
  computed: {
    mainPhone() {
      let phone = {
        value: process.env.MAIN_PHONE,
        formattedValue: this.formatPhone(process.env.MAIN_PHONE)
      }
      return phone
    },
    mainUrl() {
      return process.env.MAIN_URL
    },
    telegram() {
      return process.env.TELEGRAM
    },
    whatsapp() {
      return process.env.WHATSAPP
    }
  },
  methods: {
    formatPhone (phone) {
      let result
      if (phone[0] === '+') result = phone.substring(0, 2) + ' (' + phone.substring(2, 5) + ') ' + phone.substring(5, 8) + ' ' +phone.substring(8, 10) + ' ' + phone.substring(10, 12)
      if (phone[0] === '8') result = phone.substring(0, 1) + ' (' + phone.substring(1, 4) + ') ' + phone.substring(4, 7) + ' ' +phone.substring(7, 9) + ' ' + phone.substring(9, 11)
      return result
    },
  }
}
</script>

<style scoped lang="less">
.footer{
  display:flex;
  align-items: center;
  background: #1F5299;
  color:#FFFFFF;
  padding:35px 0;
  .copyright-line{
    display:flex;
    align-items: center;
    .copyright{
      padding-right:10px;
      border-right:1px solid #FFFFFF;
    }
    .phone{
      margin:0 15px;
      text-decoration: none;
    }
    .copyright,
    .phone{
      font-weight: bold;
      font-size: 15px;
      line-height: 15px;
      color: #FFFFFF;
      display:block;
    }
    .messengers{
      a{
        color:#fff !important;
        &:first-child{
          margin-right:5px;
        }
      }
      span {
        position: relative;
        top: 2px;
        cursor: pointer;
        font-size: 18px;
      }
    }
  }
  .footer-menu{
    padding:0;
    margin-top:30px;
    list-style: none;
    display:flex;
    li{
      margin-right:50px;
      &:last-child{
        margin-right:0;
      }
      a{
        font-weight: bold;
        font-size: 15px;
        line-height: 15px;
        color: #CCDDFF;
        text-decoration: none;
        transition: 0.3s;
        &:hover{
          color:#fff;
        }
      }
    }
  }
  .footer-extra-menu{
    li{
      a{
        font-weight: normal;
        font-size: 15px;
        line-height: 15px;
        color: #CCDDFF;
      }
    }
  }
}
@media(max-width:991px){
  .footer .footer-extra-menu{
    flex-direction: column;
    li{
      margin:5px 0;
    }
  }
}
@media(max-width:767px){

  .footer {
    padding:20px 0 10px;
    .container{
      position: relative;
      font-size:12px;
      .copyright, .phone{
        font-size:12px;
      }
      .messengers{
        flex-direction: column;
        display:flex;
        position: absolute;
        right:15px;
        top:50px;
        a{
          color:#fff !important;
          margin:0 0 10px;
        }
        span{
          margin:0 0 10px;
        }
      }
    }
    .footer-menu{
      flex-direction: column;
      li{
        font-size:12px;
        margin:5px 0;
        a{
          font-size:12px;
        }
      }
    }
  }
}
</style>
