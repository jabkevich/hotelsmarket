<template>
  <div class="hotel-gallery">
    <div class="wrapper" v-if="galleryForCoolBox.length > 0">
      <client-only>
        <cool-light-box
            :items="galleryForCoolBox"
            :index="index"
            @close="index = null">
        </cool-light-box>
      </client-only>
    </div>
    <div class="container">
      <div class="block-wrapper" v-for="(array, index) of slicedArray" :class="{'two-img': array.length < 3, 'four-img': array.length < 5, 'six-img': array.length < 7}" >
        <div v-if="array[0]" class="block-container block block-a" @click="indexChange(0, index)">
          <div  class="height" :style="{ 'background-image' : 'url(' + array[0] + ')' }"></div>
        </div>
        <div v-if="array[1]" class="block-container block block-b" @click="indexChange(1, index)">
          <div class="width m-height" :style="{ 'background-image' : 'url(' + array[1]+ ')' }"></div>
        </div>
        <div v-if="array[2]" class="block-container block block-c" @click="indexChange(2, index)">
          <div class="width toggle" :style="{ 'background-image' : 'url(' + array[2] + ')' }">
            <span class="mobile-visible" v-if="!showAll" @click="showAll = !showAll">Смотреть все</span>
          </div>
        </div>
        <div v-if="array[3]" class="block-container block block-d" @click="indexChange(3, index)">
          <div class="height" :style="{ 'background-image' : 'url(' + array[3] + ')' }"></div>
        </div>
        <div v-if="array[4]" class="block-container block block-e" @click="indexChange(4, index)">
          <div class="height" :style="{ 'background-image' : 'url(' + array[4] + ')' }"></div>
        </div>
        <div v-if="array[5]" class="block-container block block-f" @click="indexChange(5, index)">
          <div class="width m-height toggle" :style="{ 'background-image' : 'url(' + array[5] + ')' }">
            <span class="mobile-hidden" v-if="!showAll" @click="showAll = !showAll">Смотреть все</span>
          </div>
        </div>
        <div v-if="array[6]" class="block-container block block-g" @click="indexChange(6, index)">
          <div class="width" :style="{ 'background-image' : 'url(' + array[6] + ')' }"></div>
        </div>
        <div v-if="array[7]" class="block-container block block-h" @click="indexChange(7, index)">
          <div class="height" :style="{ 'background-image' : 'url(' + array[7] + ')' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "GridGallery",
  props: {
    galleryArray: {
      type: Array,
      required: true
    },
    mobile: {
      type: Boolean,
      required: true,
    },
    showAllProp: {
      type: Boolean,
      default: false
    }

  },
  data () {
    return {
      images: [
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
        "https://static.toiimg.com/photo/72975551.cms",
      ],
      index: null,
      showAll: this.showAllProp || false,
    }
  },
  computed: {
    galleryForCoolBox () {
      return this.galleryArray.map(item=>item.url)
    },
    formatedGalleryArray() {
      const formatedGalleryArray = []
      this.galleryArray.forEach(item=>formatedGalleryArray.push(item.url))
      return formatedGalleryArray
    },
    slicedArray () {
      const array_size = this.mobile ? 6 : 8
      const sliced_array = []
      const formatedGalleryArray = []
      this.galleryArray.forEach(item=>formatedGalleryArray.push(item.url))
      if (this.showAll) {
        const array = formatedGalleryArray
        for (let i = 0; i < array.length; i += array_size) {
          sliced_array.push(array.slice(i, i + array_size))
        }
        return sliced_array
      } else {
        sliced_array.push(formatedGalleryArray)
        return sliced_array
      }
    }
  },
  methods: {
    indexChange(value, index) {
      this.index = value + (8 * index)
    }
  }
}
</script>

<style scoped lang="less">
.block-wrapper{
  margin-bottom:2vw;
  &:last-child{
    margin-bottom:0;
  }
}
.block {
  background-color: #ececec;
  border-radius: 25px;
  background-position: center;
  overflow: hidden;
  cursor:pointer;
  &:hover{
    .height,
    .width{
      transform: scale(1.05);
    }
  }
  .height{
    width:100%;
    height:100%;
    background-position: center;
    background-size: auto 100%;
    transition:0.3s;
  }
  .width{
    width:100%;
    height:100%;
    background-position: center;
    background-size: 100% auto;
    transition:0.3s;
  }
  .toggle{
    overflow: hidden;
    position: relative;
    span{
      background:#CCCCCC !important;
      position: absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      display:flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s;
      cursor:pointer;
      &:hover{
        opacity:0.7;
      }
    }
  }
}
.block-wrapper{
  display: grid;
  grid-gap: 20px;
  grid-template-columns: auto;
  grid-template-rows: 170px 170px 170px;
  grid-template-areas:
    'block-a block-c block-e block-g'
    'block-a block-d block-e block-h'
    'block-b block-d block-f block-h'
}
.block-wrapper.six-img{
  grid-template-rows: 170px 170px 0;
  grid-template-areas:
    'block-a block-b block-d block-e'
    'block-a block-c block-d block-f'
}
.block-wrapper.four-img{
  grid-template-rows: 170px 0 0;
  grid-template-areas:
    'block-a block-b block-c block-d'
}
.block-a {
  grid-area: block-a;
}

.block-b {
  grid-area: block-b;
}

.block-c {
  grid-area: block-c;
}

.block-d {
  grid-area: block-d;
}

.block-e {
  grid-area: block-e;
}

.block-f {
  grid-area: block-f;
}

.block-g {
  grid-area: block-g;
}

.block-h {
  grid-area: block-h;
}
@media(max-width:1199px){
  .block-wrapper{
    grid-template-rows: 12vw 12vw 12vw;
    grid-gap: 2vw;
  }
  .block-wrapper.six-img {
    grid-template-rows: 12vw 12vw 0;
  }
  .block-wrapper.four-img{
    grid-template-rows: 12vw 0 0;
  }
  .block {
    border-radius: 15px;
  }
}
@media(max-width:767px){
  .block-wrapper{
    margin-bottom:2vw;
    grid-template-columns: 50% 50% !important;
    grid-template-rows: 25vw 25vw 25vw 25vw 25vw !important;
    grid-template-areas:
    'block-a block-d'
    'block-a block-e'
    'block-b block-e'
    'block-b block-f'
    'block-c block-f';
    &.six-img{
      grid-template-areas:
      'block-a block-d'
      'block-a block-e'
      'block-b block-e'
      'block-b block-f'
      'block-c block-f';
    }
    &.four-img{
      grid-template-rows: 25vw 25vw 0 0 0 !important;
      grid-template-areas:
      'block-a block-b'
      'block-c block-d'
    }
    &.two-img{
      grid-template-rows: 25vw 0 0 0 0 !important;
      grid-template-areas:
      'block-a block-b'
    }
  }
  .m-height{
    background-position: center !important;
    background-size: auto 100%  !important;
  }
}
</style>
