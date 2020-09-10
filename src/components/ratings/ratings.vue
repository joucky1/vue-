<template>
  <div class="ratings" ref="rat">
    <div class="ratings-content" >
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score = "seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品服务</span>
            <star :size="36" :score = "seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
             <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <raing
        @select="selectRating"
        @toggle="toggleContent"
        :select-type="selectType"
        :only-content="onlyContent"
        :ratings="ratings"
        ></raing>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,i) in ratings" :key="i" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size= "24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.delivertTime">{{rating.delivertTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="iconfont icon-hdmthumb_up"></span>
                <span class="item" v-for="(recommend,b) in rating.recommend" :key="b">{{recommend}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate }}
              </div>
            </div>
          </li>
        </ul>
      </div>
  </div>
    </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import star from '../star/star'
import split from '../split/split'
import axios from 'axios'
import raing from '../ratingselect/raingselect'
import { formatDate } from '../../common/js/data'

const ALL = 2
export default {
  name: 'ratings',
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      ratings: [],
      showFlag: false,
      selectType: ALL,
      onlyContent: true
    }
  },
  created() {
    axios.get('/getRatings').then(res => {
      const { data } = res
      this.ratings = data.ratings
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.rat, {
          click: true
        })
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    needShow(type, text) {
      if (this.onlyContent && !text) {
        // 只看内容和内容为空时
        return false
      }
      if (this.selectType === ALL) {
        // 遍历：有内容时显示内容
        return true
      } else {
        return type === this.selectType
      }
    },
    selectRating(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  events: {
    'ratingtype.select'(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    'content.toggle'(onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  filters: {
    formatDate(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    star,
    split,
    raing
  }
}
</script>

<style lang="stylus" scoped>
 @import '../../mixins/Mixin.styl'
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        padding 6px 0
        flex 0 0 137px
        width 137px
        text-align center
        border-right 1px solid rgba(7,17,27,0.1)
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding-left 24px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            font-size 12px
            line-height 18px
            vertical-align top
            color rgb(7,17,27)
          .star
            display inline-block
            vertical-align top
            line-height 18px
            margin 0 12px
          .score
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(255,153,0)
        .delivery-wrapper
          font-size 0
          .title
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147,153,159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              line-height 12px
              font-size 10px
              color rgb(147,153,159)
          .text
            margin-bottom 8px
            line-height 18px
            color rgb(7,17,27)
            font-size 12px
          .recommend
            font-size 0
            line-height 16px
            .icon-hdmthumb_up,.item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-hdmthumb_up
              color rgb(0,160,220)
            .item
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
              background #ffffff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147,153,159)

</style>
