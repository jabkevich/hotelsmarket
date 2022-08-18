<template>
  <div class="feedback-block" v-if="reviews.length">
    <div class="feedback-list">
      <div class="container">
        <span class="title">
          Отзывы
        </span>
        <div class="feedback-wrapper">
          <div class="feedback" :key="feedback.name + index" v-for="(feedback, index) of reviews" >
            <div class="avatar">{{feedback.name[0].toUpperCase()}}</div>
            <div class="text-block">
              <span class="name">{{ feedback.name }}</span>
              <span class="date">{{ feedback.date }}</span>
              <div class="trip-rating">
                <span class="circle" v-for="(i, index) of 5" :class="{'active': feedback.rating > index}"></span>
              </div>
              <p>{{feedback.text}}</p>
              <div class="tripadvisor"><img src="@/assets/img/tripadvisor.png" alt=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

export default {
  name: "FeedbackBlock",
  props: {
    reviews: {
      type: Array,
      default: [],
    },
  },
  data () {
    return {
      feedback: {
        name: null,
        email: 'ivanov@mail.ru',
        text: '',
        rating: 0
      },
      feedbackList: [
        {id:1, rating: 5, name:'Владимир', date: 'Июнь 2021', text: 'Спасибо команде сайта hotelsi.com за сотрудничество в работе. Один из лучших сайтов, с которыми я работаю. Все доступно и понятно. Разработчикам сайта огромное спасибо!!!'},
        {id:2, rating: 4, name:'Елена', date: 'Июнь 2021', text: 'Отличный сайт. Всё удобно и понятно. Нашла подходящее жилье для отдыха. Спасибо.'}
      ]
    }
  },
  methods: {
    submitForm () {

    }
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
    margin-top:35px;
    .feedback{
      margin-bottom:20px;
      display:flex;
      position: relative;
      .tripadvisor{
        position: absolute;
        right:15px;
        top:15px;
        width:100px;
        img{
          width:100%;
        }
      }
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
        .name{
          font-weight: bold;
          font-size: 18px;
          line-height: 18px;
          color: #333333;
          display:block;
          margin-bottom:10px;
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
      .trip-rating{
        display:flex;
        margin:25px 0 15px;
        .circle{
          width:18px;
          height:18px;
          display:block;
          border:1px solid #16CF60;
          border-radius: 50%;
          margin-right:3px;
          &.active{
            background: #16CF60;
          }
        }
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
