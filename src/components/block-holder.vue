<template>
  <div ref="block" class="minh100 all-center-parent w100p ">
    <div class="all-center data-content">
      <span v-if="loading" class="preloader"></span>
      <div class="no-data" v-else>
        <img v-if="imgShow" :src="imgUrl" alt="no-data">
        <div class="mt10 no-data-text">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: '暂无数据',
    height: {
      type: String,
      default: '100px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    imgShow: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: 'https://dn-zbj-boss.qbox.me/@/default/2019-01-10/5c36b6eff4171.png'
    }
  },
  mounted() {
    this.$refs.block.style.height = this.height
  },
}
</script>
<style lang="less">
.data-content {
  width: 100%;
}
.no-data {
  color: #bdbdbd;
  font-size: 15px;
  padding: 0 20px;
  font-family: PingFangSC-Regular;
  img {
    width: 2rem;
    height: 2rem;
  }
}
</style>


