<template>
  <div>
    <div class="wrapper" v-if="imgArray.length > 0">
      <client-only>
        <cool-light-box
            :items="imgArray"
            :index="index"
            @close="index = null">
        </cool-light-box>
      </client-only>
    </div>


  <div class="container">
    <div class="slick-controls">
      <span @click="previousSlide()" class="icon-arrow-left"></span>
      <span @click="nextSlide()" class="icon-arrow-right"></span>
    </div>
  </div>
  <div class="slick-container">
    <VueSlickCarousel v-bind="settings" ref="slick">
      <div class="slide" v-for="(img, imgIndex) of imgList.slice(0,6)">
        <div @click="index = imgIndex" class="img-wrapper" :style="{ 'background-image' : 'url(' + img + ')' }">
        </div>
      </div>
    </VueSlickCarousel>
  </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
export default {
  name: "HotelSlick",
  props: {
    imgList: {
      type: Array,
      required: true
    },
    id: {
      type: Number,
      default: 2
    }
  },
  components: { VueSlickCarousel },
   data () {
      return {
        settings:{
          "arrows": false,
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
                "slidesToShow": 1,
                "slidesToScroll": 1,
                'swipe': true,
                'swipeToSlide': true
              }
            }
          ]
        },
        index: null,
      }
   },
  computed: {
    imgArray() {
      return this.imgList
    }
  },
  methods: {
    previousSlide () {
      this.$refs.slick.prev()
    },
    nextSlide () {
      this.$refs.slick.next()
    }
  },
}
</script>

<style scoped lang="less">
.slide{
  position: relative;
  cursor: pointer;
  &:hover{
    .img-wrapper{
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
}
.img-wrapper{
  width:400px;
  height:225px;
  display:block;
  background-size: cover !important;
  background-repeat: no-repeat;
  transition: 0.3s ease-in-out;
}
.container{
  position: relative;
}
.slick-controls{
  display:flex;
  width:100%;
  position: absolute;
  left:0;
  top:-70px;
  justify-content: flex-end;
  z-index: 1;
  padding-right:10px;
  box-sizing: border-box;
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
    &:nth-child(2){
      margin-left:15px;
      padding-left:3px;
    }
  }
}
@media(max-width:767px){
  .slick-controls{
    display:none;
  }
  .img-wrapper{
    width:280px;
    height:155px;
  }
}
</style>
