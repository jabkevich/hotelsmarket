<template>
  <div class="information-block info-text">
    <div class="container">
      <div v-html="text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HotelsInfo",
  props: ['text']
}
</script>

<style lang="less">
.information-block.info-text{
  background:#FFFFFF;
  padding:40px 0 50px 0;
  margin-bottom:10px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
  font-family: 'intro', serif !important;
  font-size:15px;
  span, p, li, a {
    font-family: 'intro', serif !important;
  }
  .info-title{
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    color: #333333;
    display:flex;
    padding: 20px 0 15px;
  }
  .info-subtitle{
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    padding:0 0 0 20px;
    margin: 0 0 15px;
    display:flex;
  }
  p{
    font-weight: normal;
    font-size: 15px;
    line-height: 15px;
    color: #666666;
    padding:0 0 0 20px;
    margin: 0 0 15px !important;
    max-width:820px;
    width:100%;
  }
  ul{
    li{
      font-weight: normal;
      font-size: 15px;
      line-height: 15px;
      color: #666666;
    }
  }
}
@media(max-width:767px) {
  .information-block{
    padding-bottom:20px;
    margin-bottom:0;
    box-shadow: none;
    .info-title{
      padding-top:0;
      font-size: 16px;
    }
    .info-subtitle{
      font-size: 12px;
      padding:0;
    }
    p{
      font-size: 12px;
      line-height: 12px;
      padding:0;
    }
    ul{
      padding-left:15px;
      li {
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>