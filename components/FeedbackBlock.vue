<template>
  <div class="feedback-block">
      <div class="feedback-form">
        <div class="container">
        <span class="title">Оставьте о нас отзыв</span>
        <span class="sub-title">Нам очень важно Ваше мнение</span>
        <div class="form">
          <div class="input-group" :class="{'has-error': this.hasError && this.validation.field === 'name'}">
            <label>Ваше имя</label>
            <input type="text" v-model="feedback.name">
            <span v-if="this.hasError && this.validation.field === 'name'">{{validation.value}}</span>
          </div>
          <div class="input-group" :class="{'has-error': this.hasError && this.validation.field === 'email'}">
            <label>E-mail</label>
            <input type="text" v-model="feedback.email">
            <span v-if="this.hasError && this.validation.field === 'email'">{{validation.value}}</span>
          </div>
          <div class="input-group" :class="{'has-error': this.hasError && this.validation.field === 'text'}">
            <label>Ваш отзыв</label>
            <input type="text" v-model="feedback.text">
            <span v-if="this.hasError && this.validation.field === 'text'">{{validation.value}}</span>
          </div>
          <div class="input-group" :class="{'has-error': this.hasError && this.validation.field === 'rating'}">
            <label>Ваша оценка</label>
            <div class="wrapper flex">
              <div class="rating">
                <client-only placeholder="Loading...">
                  <star-rating :increment="1"
                             v-model="feedback.rating"
                             :max-rating="5"
                             inactive-color="#F4F6FC"
                             active-color="#1F5299"
                             :star-size="20">
                </star-rating>
                </client-only>
              </div>
              <button class="submit-btn" @click="submitForm">Отправить</button>
            </div>
            <span class="rating" v-if="this.hasError && this.validation.field === 'rating'">{{validation.value}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="feedback-list">
      <div class="container">
        <span class="title">
          Все отзывы
        </span>
        <div class="feedback-wrapper">
          <div class="feedback" :key="feedback.id" v-for="feedback of getReviews" >
            <div class="avatar">{{feedback.name[0]}}</div>
            <div class="text-block">
              <span class="name">{{ feedback.name }}</span>
              <span class="date">{{ feedback.created_at | formatDate }}</span>
              <p>{{feedback.text}}</p>
              <div class="stars-container">
                <span class="star" v-for="star of feedback.rating">
                  <span class="icon-star"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'


export default {
  name: "FeedbackBlock",
  data () {
    return {
      feedback: {
        name: null,
        email: '',
        text: '',
        rating: 0
      },
      hasError: false,
      feedbackList: [
        {id:1, name:'Владимир', date: 'Июнь 2021', text: 'Спасибо команде сайта hotelsi.com за сотрудничество в работе. Один из лучших сайтов, с которыми я работаю. Все доступно и понятно. Разработчикам сайта огромное спасибо!!!'},
        {id:2, name:'Елена', date: 'Июнь 2021', text: 'Отличный сайт. Всё удобно и понятно. Нашла подходящее жилье для отдыха. Спасибо.'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getReviews',
    ]),
    validation() {
      let value = '',
          field = '',
          result = true

      if (this.feedback.rating === 0) {result = false; field = 'rating'; value = 'Поставьте оценку от 1 до 5'}
      if (!this.feedback.text) {result = false; field = 'text'; value = 'Отзыв не может быть пустым'}
      if (!this.isEmailValid(this.feedback.email)) {result = false; field = 'email'; value = 'Введите корректный email адрес'}
      if (!this.feedback.email) {result = false; field = 'email'; value = 'Введите email адрес'}
      if (!this.feedback.name) {result = false; field = 'name'; value = 'Введите Имя'}
      return {result, value, field}
    }
  },
  methods: {
    ...mapActions([
      'storeQuestion',
    ]),
    checkValidation () {
      this.validation.result ? this.hasError = false : this.hasError = true
    },
    async submitForm () {
      await this.checkValidation()
      if (!this.hasError){
        this.$store.commit('PRELOADER_TOGGLE', true)
        try {
          await this.$store.dispatch('postReview', this.feedback)
          this.$store.commit('PRELOADER_TOGGLE', false)
          this.feedback = {
                name: null,
                email: '',
                text: '',
                rating: 0
          }
          this.$emit('dialog')
        } catch (e) {
          console.log(e)
          this.$store.commit('PRELOADER_TOGGLE', false)
        }
      }
    },
    isEmailValid (email) {
      return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(email);
    },
  }
}
</script>

<style scoped lang="less">

.feedback-block{
  .title{
    border:none;
    justify-content: flex-start;
    font-size: 64px;
    padding: 20px 0 20px;
    color: #333333;
  }
}
.feedback-list{
  background:#FFFFFF;
  padding:35px 0 15px;
  .feedback-wrapper{
    margin-top:25px;
    .feedback{
      margin-bottom:20px;
      display:flex;
      .avatar{
        background: #1F5299;
        height:60px;
        width:60px;
        min-height:60px;
        min-width:60px;
        font-weight: bold;
        font-size: 24px;
        line-height: 24px;
        color: #FFFFFF;
        border-radius: 50%;
        display:flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        margin-right:30px;
        position: relative;
        z-index: 2;
      }
      .text-block{
        flex-grow: 1;
        border: 1px solid #CCCCCC;
        box-sizing: border-box;
        border-radius: 25px;
        padding:25px;
        position: relative;
        z-index: 1;
        display:flex;
        flex-direction: column;
        position: relative;
        .name{
          font-weight: bold;
          font-size: 18px;
          line-height: 18px;
          color: #333333;
          display:block;
          margin-bottom:10px;
        }
        .date{
          text-transform: capitalize;
        }
        .stars-container{
          position: absolute;
          right:20px;
          top:30px;
          .star{
            font-size:20px;
            margin-right:2px;
            color:#1F5299;
          }
        }
        &:before{
          width:50px;
          height:30px;
          background:#fff;
          content: '';
          position: absolute;
          left:-25px;
          top:-1px;
          border-top: 1px solid #CCCCCC;

        }
        &:after{
          width:50px;
          height:80px;
          background:#fff;
          content: '';
          position: absolute;
          left:-51px;
          top:-1px;
          border-right: 1px solid #CCCCCC;
          border-radius: 0 25px 0 0;
        }
      }
    }
  }
}
.feedback-form{
    background:#FFFFFF;
    padding:35px 0 25px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.15);
    margin-bottom:10px;
    .input-group{
      position:relative;
    }
    .input-group span{
      position:absolute;
      right:15px;
      top:85px;
      color:red
    }
    .input-group span.rating{
      right:auto;
      left:0;
    }
    .input-group.has-error input{
      border:1px solid red !important;
    }
    .sub-title{
      font-weight: bold;
      font-size: 18px;
      line-height: 18px;
      color: #666666;
      padding-left:5px;
      margin-bottom:45px;
      display:flex;
    }
    .form{
      margin-top:20px;
      display:flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .input-group{
        width:49%;
        display:flex;
        flex-direction: column;
        margin-bottom:25px;
        label{
          font-weight: bold;
          font-size: 24px;
          line-height: 24px;
          color: #333333;
          display:flex;
          margin-bottom:10px;
          padding-left:15px;
        }
        input{
          border: 1px solid #CCCCCC;
          box-sizing: border-box;
          border-radius: 15px;
          padding:0 35px;
          height:47px;
          font-size: 15px;
          line-height: 15px;
          color: #1F5299;
        }
        .wrapper{
          justify-content: space-between;
        }
        .rating{
          padding-left:15px;
          height:47px;
          display:flex;
          align-items: center;
        }
        .submit-btn{
          background: #1F5299;
          border-radius: 15px;
          font-weight: bold;
          font-size: 15px;
          line-height: 15px;
          text-align: center;
          color: #FFFFFF;
          height:47px;
          width:100%;
          max-width:250px;
          border:none;
        }
      }
    }
  }
@media(max-width:1024px){
  .feedback-form .form .input-group .submit-btn{
    max-width:200px;
  }
}
@media(max-width:767px){
  .feedback-block{
    display:none;
    margin:0;
  }
}
</style>
