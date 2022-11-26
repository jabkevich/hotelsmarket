<template>
  <div class="tour-comfort">
    <div class="container">
      <div class="title">
        <span class="title-text">Путешествуйте по России <br> с комфортом и выгодой</span>
        <div class="slider-controls">
          <span @click="previousSlide" class="icon-arrow-left"></span>
          <span @click="nextSlide" class="icon-arrow-right"></span>
        </div>
      </div>
    </div>
    <div class="slick-container">
      <VueSlickCarousel v-bind="settings" ref="slickComfort">
        <div class="slide" v-for="slide of comfortList">
          <div class="capture">
            <span class="title"><span class="title-text"><span
                :class="slide.icon"></span> {{ slide.title }}</span></span>
            <span class="quantity">{{ slide.description }}</span>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "TourComfort",
  components: {VueSlickCarousel},
  async asyncData({store}) {

  },
  data() {
    return {
      settings: {
        "dots": false,
        "edgeFriction": 0.35,
        "infinite": true,
        "speed": 500,
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "variableWidth": true
      },
      comfortList: [
        // {
        //   id: 1,
        //   icon: 'icon-images',
        //   title: 'Удобный поиск отелей',
        //   description: 'В поиске выберите город или отель, даты проживания, количество гостей, и мы найдем для вас самые лучшие предложения'
        // },
        {
          id: 1,
          icon: 'icon-guaranteed',
          title: 'Гарантия лучших тарифов',
          description: 'Найдете дешевле - мы предоставим такую же цену и сделаем дополнительную скидку для вашей лучшей выгоды'
        },
        {
          id: 2,
          icon: 'icon-star',
          title: 'Безопасность бронирования',
          description: 'Сервис работает с партнерами напрямую, это позволяет гостям не беспокоится о достоверности их цен и услуг'
        },
        {
          id: 3,
          icon: 'icon-card',
          title: 'Бесплатная отмена',
          description: 'Во многих отелях действует бесплатная отмена бронирования, ищите эту информацию в описании места отдыха'
        },
      ]
    }
  },
  methods: {
    previousSlide() {
      this.$refs.slickComfort.prev()
    },
    nextSlide() {
      this.$refs.slickComfort.next()
    }
  },
}
</script>

<style scoped lang="less">
.tour-comfort {
  margin-top: 10px;
  background: #FFFFFF;
  padding: 20px 0 40px;
}
.title {
  background: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  border: none;
  justify-content: space-between;

  .title-text {
    text-align: left;
  }

  .slider-controls {
    display: flex;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 42px;
      height: 42px;
      background: #1F5299;
      color: #FFFFFF;
      font-size: 14px;
      cursor: pointer;
      transition: 0.3s;
      box-sizing: border-box;

      &:hover {
        background: #3f78c7;
      }

      &:first-child {
        padding-right: 1px;
      }

      &:last-child {
        margin-left: 30px;
        padding-left: 3px;
      }
    }
  }

  .title-text {
    display: flex;
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 64px;
    line-height: 64px;
    color: #333333;
    margin-bottom: 10px;

    span {
      margin-right: 10px;
    }
  }
}
.slide {
  width: 400px !important;
}
@media(max-width:1024px){
  .tour-comfort{
    .title{
      .title-text{
        font-size:32px !important;
        line-height: 34px !important;
      }
    }
  }
}
@media(max-width:991px) {
  .tour-comfort {
    .slide {
      .capture{

        .title{
          margin:0;
          height:40px;
        }
        .title-text{
          font-size:16px !important;
        }
        .quantity{
          font-size:12px;
          height:50px;
          display:block;
        }
      }
    }
  }
}
@media(max-width:767px){
  .tour-comfort{
    padding-bottom:20px;
    padding-top:0;
    .title{
      .title-text{
        font-size:22px !important;
        line-height: 22px !important;
      }
    }
    .slider-controls{
        display:none;
    }

    .slick-container{
      margin:10px 0;
      .title {
        .title-text {
          font-size: 18px !important;
          line-height: 18px !important;
        }
      }
    }
    .slide {
      width: 280px !important;

      .capture{
        height:100px;
        padding:15px;
        .title{
          margin:0;
        }
        .title-text{
          font-size:16px;
        }
        .quantity{
          font-size:12px;
        }
      }
    }
  }
}
</style>
