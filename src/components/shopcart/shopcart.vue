/* eslint-disable vue/no-side-effects-in-computed-properties */
<template>
<div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="iconfont icon-hdmshopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
           <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-rigth" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
   <transition name="fold">
     <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" v-on:click="empty">清空</span>
        </div>
        <div class="list-content" ref="list-content">
          <ul>
            <li class="food" v-for="n in selectFoods" :key="n.name">
              <span class="name">{{n.name}}</span>
              <div class="price">
                <span>￥{{n.price*n.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food ="n"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade">
    <div class="list-mask" v-show="listShow" @click="hideList"></div>
  </transition>
</div>
</template>

<script>
import BScroll from '@better-scroll/core'
import cartcontrol from '../cartconted/cartcontrol'
export default {
  name: 'shopcart',
  props: {
    selectFoods: {
      type: Array,
      default: () => []
    },
    minPrice: {
      type: Number,
      default: 3
    },
    deliveryPrice: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      name: {},
      droppedBalls: [],
      fold: false

    }
  },
  computed: {
    totalPrice() {
      let total = 0 // 定义总价total = 0
      this.selectFoods.forEach((food) => { // 遍历数组，对每个food的food.price和food.count相乘求和
        total += food.price * food.count
      })
      return total //  返回总价
    },
    totalCount() { // 根据selectFoods数组计算数量
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count // 每种food的count相加
      })
      return count // 返回总数量
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        const diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else { return 'enough' }
    },
    storeSeller() {
      return this.$store.getters.getSeller
    },
    listShow: {
      get: function () {
        return this.fold
      },
      set: function () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        const show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs['list-content'], {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    }
  },
  methods: {
    pay() {
      if (this.totalPrice < this.minPrice) {
        return window.alert('还未满20元不能配送')
      }
      window.alert(`支付${this.totalPrice}`)
    },
    hideList() {
      this.fold = true
    },
    empty() {
      this.selectFoods.forEach((n) => {
        this.fold = false
        n.count = 0
      })
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    dropMove (el) {
      for (var i = 0; i < this.balls.length; i++) {
        const b = this.balls[i]
        if (!b.show) {
          b.show = true
          b.el = el
          this.droppedBalls.push(b)
          return
        }
      }
    },
    beforeEnter (el, done) {
      let count = this.balls.length
      while (count--) {
        const ball = this.balls[count]
        if (ball.show) {
          const rect = ball.el.getBoundingClientRect()
          const x = rect.left - 32
          const y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.transform = `translate3d(0,${y}px,0`
          el.style.webkitTransform = `translate3d(0,${y}px,0`
          const inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
          // console.log(el);
        }
      }
    },
    dropEnter (el, done) {
      /* eslint-disable no-unused-vars */
      /* 触发浏览器重绘; */
      const rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        const inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
        el.addEventListener('transitionend', done)
        // done();
      })
      // console.log(el);
      // done();
    },
    afterEnter (el) {
      el.style.display = 'none'
      const ball = this.droppedBalls.shift()
      ball.show = false
      ball.el = null
      console.log(el)
    }

  },
  components: {
    cartcontrol
  }
}
</script>

<style lang="stylus" scoped>

 @import '../../mixins/Mixin.styl'

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0,160,220)
            .icon-hdmshopping_cart
              font-size 24px
              line-height 44px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255,255,255,0.4)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
      .content-rigth
        flex 0 0 95px
        width 95px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .shopcart-list
        position absolute
        top 0
        left 0
        z-index -1
        width 100%
        transform: translate3d(0, -100%, 0)
        &.fold-enter-active, &.fold-leave-active
          transition: all .5s
        &.fold-enter, &.fold-leave-active
          transform: translate3d(0, 0, 0)
        .list-header
          height 40px
          line-height 40px
          padding 0 18px
          background #f3f5f7
          border-bottom 1px solid rgba(7,17,27,0.1)
          .title
            float left
            font-size 14px
            color rgb(7,17,27)
          .empty
            float right
            font-size 12px
            color rgb(0,160,220)
        .list-content
          padding 0 18px
          max-height 217px
          overflow hidden
          background #ffffff
          .food
            position relative
            padding 12px 0
            box-sizing border-box
            border-bottom 1px solid rgba(7,17,27,0.1)
            .name
              line-height 24px
              font-size 14px
              color rgb(7,17,27)
            .price
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-size 14px
              font-weight 700
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter: blur(10px)
    opacity 1
    background rgba(7,17,27,0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all .5s
    &.fade-enter, &.fade-leave-active
      opacity 0
      background rgb(7,17,27,0)
</style>
