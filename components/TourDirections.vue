<template>
  <div class="directions">
    <div v-if="popularDirections && popularDirections.length" class="popular-directions">
      <div class="container">
        <div class="title">
          <span class="title-text">Популярные направления</span>
          <div class="slider-controls">
            <span @click="previousSlide" class="icon-arrow-left"></span>
            <span @click="nextSlide" class="icon-arrow-right"></span>
          </div>
        </div>
      </div>
      <div class="slick-container">
        <VueSlickCarousel v-bind="settings" ref="slick" @swipe="swipe()"  @afterChange="afterChange()">
          <div class="slide cursor-pointer" :key="slide.id" v-for="slide of popularDirections" @click="toDirection(slide.url)">
            <div v-if="slide.photo" class="img-wrapper" :style="{ 'background-image' : `url(${slide.photo})` }">
            </div>
            <div v-else class="img-wrapper" :style="{ 'background-image' : 'url(/imgs/noimg.png)' }">
            </div>
            <div class="capture">
              <span class="title"><span class="title-text">{{slide.name}}</span><span class="icon-arrow-right"></span></span>
              <span class="quantity">{{slide.count}} вариантов размещения</span>
            </div>
          </div>
        </VueSlickCarousel>
      </div>
    </div>
    <div v-if="allDirections" class="all-directions">
      <div class="container">
        <div class="title">
          <span class="directions-pre-title">Все направления</span>
          <div class="direction-collapse" @click="directionCollapse.active = !directionCollapse.active">
            <span v-if="!directionCollapse.active">Развернуть</span>
            <span v-else>Свернуть</span>
            <span class="icon-arrow-down" :class="{'active' : directionCollapse.active}"></span>
          </div>
        </div>
        <div class="directions-wrapper" ref="directions" :style="directionsStyle">
          <div class="inner-wrapper" ref="directionsInner">
            <div class="letter-block" v-for="(locArray, key, index) of allDirections">
              <span class="letter">{{key}}</span>
              <div class="wrapper flex block">
                <nuxt-link :to="loc.url" v-for="(loc, index) of locArray" :key="index">
                  <div class="direction-name" >
                    {{loc.name}}
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'

export default {
  name: "TourDirections",
  components: { VueSlickCarousel },
  props: {
    popularDirections: {
      required: true,
      type: Array
    },
    allDirections: {
      required: true,
      type: Object
    }
  },
  async asyncData({store}) {

  },
  data() {
    return {
      clickable:true,
      settings:{
        "dots": false,
        "dotsClass": "slick-dots custom-dot-class",
        "edgeFriction": 0.35,
        "infinite": true,
        "speed": 500,
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "variableWidth": true,
        "responsive": [
          {
            "breakpoint": 1024,
            "settings": {
              "slidesToShow": 2,
              "slidesToScroll": 1,
              'swipe': true,
              'swipeToSlide': true
            }
          }, {
            "breakpoint": 767,
            "settings": {
              "slidesToShow": 1,
              "slidesToScroll": 1,
              'swipe': true,
              'swipeToSlide': true
            }
          }
        ]
      },
      popularDirectionsTest: [
        {id:1, name: 'Эсто-Садок', quantity: 2357, img:'img-example.png'},
        {id:2, name: 'Сочи', quantity: 500, img:'img-example2.png'},
        {id:3, name: 'Горки город', quantity: 30257, img:'img-example3.png'},
        {id:4, name: 'Геленджик', quantity: 12, img:'img-example4.png'},
        {id:5, name: 'Эсто-Садок', quantity: 0, img:'img-example.png'},
        {id:6, name: 'Эсто-Садок', quantity: 12, img:'img-example2.png'},
        {id:7, name: 'Эсто-Садок', quantity: 888, img:'img-example3.png'}
      ],
      directionsList: ['Адлер', 'Роза хутер', 'Анапа', 'Сочи', 'Москва', 'Горки город', 'Геленджик', 'Санкт-Петербург', 'Адлер', 'Роза хутер', 'Анапа', 'Сочи', 'Москва', 'Горки город', 'Геленджик', 'Санкт-Петербург', 'Красная поляна'],
      directionCollapse: {
        active: false,
        closed: 310,
        opened: 270
      },
      windowWidth: 0
    }
  },
  computed: {
    directionsStyle () {
      return this.directionCollapse.active ? `max-height: ${this.directionCollapse.opened}px` : `max-height: ${this.directionCollapse.closed}px`
    },
    sortedDirections () {
      if (this.directionsList.length === 0) {
          return [];
      }
      let array = Object.values(
          this.directionsList.reduce((acc, direction) => {
              let firstLetter = direction[0].toLocaleUpperCase();
              if (!acc[firstLetter]) {
                acc[firstLetter] = { letter: firstLetter, data: [direction] };
              } else {
                acc[firstLetter].data.push(direction);
              }
              return acc;
            }, {})
      );
      return array.sort((a, b) => a.letter.localeCompare(b.letter))
    }
  },
  methods: {
    swipe(){
      this.clickable = false
    },
    afterChange () {
      this.clickable = true
    },
    previousSlide () {
      this.$refs.slick.prev()
    },
    nextSlide () {
      this.$refs.slick.next()
    },
    toDirection(url) {
      console.log("alo")
      if (this.clickable) this.$router.push({path: url})
    }
  },
  mounted() {
    window.innerWidth ? this.windowWidth = window.innerWidth : this.windowWidth = 0
    this.directionCollapse.opened = this.$refs.directionsInner.clientHeight + 60
  }
}
</script>

<style lang="less">
  .directions{
    background:#FFFFFF;
    padding-bottom:50px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);

    .popular-directions{
      padding-bottom: 40px;
      .title{
        background: none;
        display:flex;
        align-items: center;
        flex-direction: row;
        border:none;
        justify-content: space-between;
        .slider-controls{
          display:flex;
          span{
            display:flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            width:42px;
            height:42px;
            background: #1F5299;
            color:#FFFFFF;
            font-size:14px;
            cursor: pointer;
            transition: 0.3s;
            box-sizing: border-box;
            &:hover{
              background: #3f78c7;
            }
            &:first-child{
              padding-right:1px;
            }
            &:last-child{
              margin-left:30px;
              padding-left:3px;
            }
          }
        }
        .title-text{
          font-style: normal;
          font-weight: bold;
          font-size: 64px;
          line-height: 64px;
          color: #333333;
        }
      }
      .img-wrapper{
        width:400px;
        height:436px;
        background-size: 100% auto;
      }
    }
    .all-directions{
      .directions-pre-title{
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 24px;
        color: #333333;
      }
      a{
        text-decoration: none;
        margin-right:10px;
        display:inline-block;
      }
      .title{
        border:none;
        justify-content: space-between;
        margin:0 0 20px;
        padding:0 20px;
        background: none;
        .direction-collapse{
          cursor: pointer;
          font-size:15px;
          color:#1F5299;
          .icon-arrow-down{
            margin-left:5px;
            position: relative;
            top:1px;
            transition: 0.3s;
            display:inline-block;
            &.active{
              transform: rotate(180deg);
            }
          }
        }
      }
      .directions-wrapper{
        padding:35px 35px 15px;
        box-sizing: border-box;
        border-radius: 25px;
        border: 1px solid #CCCCCC;
        overflow: hidden;
        transition: 0.3s;
      }
      .inner-wrapper{
        display:flex;
        flex-wrap: wrap;
        margin:0 -35px;
        .letter-block{
          margin:10px 30px 25px;
          .letter{
            display:block;
            font-weight: bold;
            font-size: 18px;
            line-height: 18px;
            color: #333333;
            margin:0 0 0 10px;
            padding-bottom:10px;
          }
          .block{
            cursor: pointer;
            flex-wrap:wrap;
            .direction-name{
              font-size: 15px;
              line-height: 15px;
              text-align: center;
              color: #1F5299;
              background: #F4F6FC;
              border-radius: 15px;
              padding:0 15px;
              display:flex;
              height:47px;
              align-items: center;
              justify-content: center;
              margin-right:10px;
              transition: background-color 0.3s ease-in-out;
              margin-bottom:10px;
              &:hover{
                background: #e7f2fe;
              }
              a{
                text-decoration: none;
                color: #1F5299;
              }
              &:last-child{
                margin-right:0;
              }
            }
          }
        }
      }
    }
  }
  @media(max-width:1330px){
    .directions {
      .popular-directions {
        .img-wrapper {
          width: 300px;
          height: 336px;
        }
      }
    }
  }
  @media(max-width:1024px){
    .directions {
      .popular-directions {
        .img-wrapper {
          width: 250px;
          height: 280px;
        }

        .title {
          .title-text {
            font-size: 34px;
          }
        }
      }
    }
  }
  @media(max-width:991px){
    .directions {
      .popular-directions{
        .slick-container{
          .capture{
            max-width:250px;
            box-sizing: border-box;
            .title{
              white-space: nowrap;
              .title-text{
                font-size:18px !important;
              }
            }
          }
        }
      }
    }
  }
  @media(max-width:767px){
    .directions {
      .popular-directions {
        .img-wrapper {
          width: 260px;
          height: 280px;
        }
        .slick-container{
          .capture{
            max-width:none;
          }
        }

        .title {
          padding:20px 0;

          .title-text {
            font-size: 22px;
          }

          .slider-controls {
            display: none;
          }
        }
      }
      .all-directions {
        .directions-pre-title{
          font-size:18px;
        }
        .title {
          padding: 0 !important;
          align-items: center;

          .direction-collapse {
            display: flex;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            text-align: center;
            color: #1F5299;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
          }
        }

        .directions-wrapper {
          border-radius: 15px;
          padding: 10px 25px;
        }

        .inner-wrapper {
          .letter-block {
            .block {
              flex-wrap: wrap;

              .direction-name {
                margin-bottom: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
