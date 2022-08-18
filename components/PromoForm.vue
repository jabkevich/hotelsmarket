<template>
    <div class="promo-form">
      <div class="layout" @click="promoClose"></div>
      <div class="wrapper">
        <span class="name">Введите промокод</span>
        <input type="text" v-model="promo">
        <button class="btn">Применить</button>
      </div>
    </div>
</template>

<script>
export default {
  name: "PromoForm",
  data () {
    return {
      promo: null
    }
  },
  methods: {
    promoClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">

.promo-form{
  position: absolute;
  background: #FFFFFF;
  top:100%;
  left:0;
  margin-top:20px;
  margin-left:-50px;

  border-radius: 30px;
  width:100%;
  min-width:280px;
  z-index: 99999;
  box-sizing: border-box;
  .layout{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    display:block;
    z-index: 1;
  }
  .wrapper{
    box-shadow: 0px -1px 6px -1px rgba(0,0,0,0.3);
    padding:30px;
    z-index: 2;
    border-radius: 30px;
    background: #FFFFFF;
    position: relative;
    width:100%;
  }
  input{
    width:100%;
    height:45px;
    border:1px solid #CCCCCC;
    border-radius: 15px;
    margin:10px 0;
    padding:0 15px;
    box-sizing: border-box;
    text-transform: uppercase;
    &:hover,
    &:active,
    &:focus{
      outline:none;
    }
  }
  .name{
    font-weight: 700;
    padding-left:15px;
  }
  .btn{
    margin:0;
    width:100%;
  }
}
@media(max-width:767px){
  .promo-form {
    margin-left: 0;
  }
}
</style>
