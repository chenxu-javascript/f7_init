<template>
  <div class="card-footer flex-row w100p">
    <f7-link class="tool text-center tool-border flex-rest-width" @click="openCommentPopup(2)">
      <span class="iconfont icon-comment"></span>
      <span class="text" v-text="data.commentNum ? data.commentNum : '评论'"></span>
    </f7-link>
    <f7-link class="tool text-center flex-rest-width" :class="{liked: data.thumbUpNum}" @click.stop="toggleLike(data)">
      <span class="iconfont icon-like"></span>
      <span class="text" v-text="data.thumbUpNum ? data.thumbUpNum : '喜欢'"></span>
    </f7-link>
  </div>
</template>

<style lang="less">
.tool.text-center {
  justify-content: center !important;
  align-items: center;
}
.tool-border {
  position: relative;
  .hairline(right, #ddd);
}
</style>


<script>
import TimeLine from '@model/timeline.js'
import { mapActions } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  created() {
    console.log('---------');
    console.log(this.data);
    console.log('---------');
  },
  beforeDestroy() {
    this.openCommentPopup(0)
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    openCommentPopup(val) {
      this.updatePopup({
        key: 'commentOpened',
        value: val
      })
    },
    async toggleLike(item) {
      let contentId = item.contentId
      let data = await TimeLine.thumbUp({ contentId })
      if (data) {
        this.bsToast('操作成功')
        this.$set(item, 'thumbUpNum', item.thumbUpNum + 1)
      }
    }
  }
}
</script>
