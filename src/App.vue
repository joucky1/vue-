<template>
  <div id="app">
    <div class="header">
      <Header :seller="seller"></Header>
    </div>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods" active-class="active_class">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="active_class">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="active_class">商家</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
      <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<style lang="stylus" sope>
@import "./common/stylus/mixin.styl"

  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-bottom 1px solid rgba(7,17,27,0.1)
    .tab-item
      flex 1
      text-align center
    .active_class
      color rgb(240,20,20)
    a
      display block
      font-size 14px
      color rgb(77,85,93)

</style>

<script>
import Header from './components/header/Header'
import axios from 'axios'
import { urlParse } from './common/js/url'

export default {
  name: 'app',
  data () {
    return {
      par: 0,
      seller: {
        id: (() => {
          const queryParam = urlParse()
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  components: {
    Header
  },

  mounted() {
    this.getSeller()
  },

  methods: {
    getSeller() {
      axios.get('/getSeller').then(res => {
        const { data } = res
        this.seller = Object.assign({}, data.seller)
        this.$store.commit('setSeller', this.seller)
        if (this.par === 0) {
          this.par = 1
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

}
</script>
