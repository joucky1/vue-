<template>
<div>
  <transition name="mode">
  <div v-show="showFlag" class="food" ref='foodMenu'>
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image">
        <div class="back" @click="hide">
          <i class="iconfont icon-hdmarrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{ food.rating }}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{ food.price }}</span>
          <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food ="food" v-show="food.count || food.count===!0"></cartcontrol>
        </div>
        <div @click="addFirst(food,$event)" class="buy" v-show="!food.count || food.count===0">立即加入购物车</div>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品消息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <raing
        @select="selectRating" @toggle="toggleContent" :select-type="selectType"
                        :only-content="onlyContent"
                        :desc="desc" :ratings="food.ratings"
        ></raing>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,id) in food.ratings" :key="id" class="rating-item border-1px" >
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate }}</div>
              <p class="text">
                <span :class="{'iconfont icon-hdmthumb_up ':rating.rateType===0, 'iconfont icon-hdmthumb_down':rating.rateType===1}">{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.rating.length">暂无评价</div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</div>
</template>

<script>

import BScroll from '@better-scroll/core'
import Vue from 'vue'
import { formatDate } from '../../common/js/data'
import cartcontrol from '../cartconted/cartcontrol'
import split from '../split/split'
import raing from '../ratingselect/raingselect'

/* const POSITIVE = 0
const NEGATIVE = 1 */
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      number: 1,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show() {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodMenu, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
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
    hide() {
      this.showFlag = false
    },
    addFirst(food, event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.food, 'count', 1)
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
  filters: {
    formatDate(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol,
    split,
    raing
  }
}
</script>

<style lang="stylus" scoped>
@import '../../mixins/Mixin.styl'
  &.move-enter-active, &.move-leave-active
    transition all 0.2s linear
  &.move-enter, &.move-leave-active
    transform translate3d(100%, 0, 0)
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #ffffff
    transform translate3d(0, 0, 0)
    .image-header
      position relative
      width: 100%
      height 0
      padding-top 100%
      img
        position absolute
        top: 0
        left: 0
        width: 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-hdmarrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        font-size 0
        height 10px
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240,20,20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147,153,159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 20
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #fff
        background rgb(0,160,220)
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        font-weight 500
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating
        padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        font-weight 500
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              font-size 10px
              margin-left 6px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
            .text
              line-height 16px
              font-size 12px
              color rgb(7,17,27)
              .icon-hdmthumb_up,.icon-hdmthumb_down
                margin-right 4px
                line-height 16px
                font-size 12px
              .icon-hdmthumb_up
                color rgb(0,160,220)
              .icon-hdmthumb_down
                color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
</style>
