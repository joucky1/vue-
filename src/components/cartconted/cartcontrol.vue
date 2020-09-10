<template>

  <div class="cartcontrol">
    <link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

    <transition name="slide-fade" :duration="500"
      enter-active-class="animated tada"
      leave-active-class="animated bounceOutRight">
    <div class="cart-decrease " v-show="food.count>0" @click.stop.prevent="decreaseCart" >
        <span class="inner iconfont icon-hdmremove_circle_outline" ></span>
    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
    <div class="cart-add iconfont icon-hdmadd_circle" @click.stop.prevent="addCart" ></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object,
      count: 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
    decreaseCart(event) {
      if (this.count < 1) {
      }
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count--
      }
    },
    trantion() {
      if (this.food.count < 0) {
        this.show = false
      }
    },
    addCart(event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
    }
    // emitDemo()
    // this.$emit('MyEvent', this.food.count)
    // 子组件往父组件传值，子组件使用事件，父组件监听子组件抛出的事件
    // this.$emit('EventName', ...args)
    // 子组件里面用this.emit('事件名', '任意类型参数')，来往外面抛出自己定义的s
  },

  created() {
  }
}
</script>

<style lang="stylus" scoped>
.cartcontrol
  font-size 0
  .cart-decrease
    display inline-block
    padding 6px
    .inner
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
  .cart-count
    display inline-block
    font-size 12px
    width 12px
    vertical-align top
    padding-top 6px
    line-height 24px
    text-align center
    color rgb(147,153,159)
  .cart-add
    display inline-block
    line-height 24px
    font-size 24px
    color rgb(0,160,220)
    padding 6px

</style>
