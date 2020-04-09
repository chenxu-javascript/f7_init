<template>
  <div>
    <div class="comments-title">
      <span>评论</span>
    </div>
    <div class="comment-all" v-if="comment && comment.length">
      <div class="comment flex-row" v-for="item in comment" :key="item.id">
        <img class="avatar" :src="item.userParse.headImgUrl"   alt="头像"/>
        <div class="detail flex-rest-width">
          <div class="name">
            <span>{{item.userParse.name}}</span>
          </div>
          <div class="time">
            <span>{{formatTime(item.updateTime)}}</span>
          </div>
          <div class="text-comment">
            <span>{{item.comment}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-content" v-else>
      <z-block height="120px">
        暂无评论， 快前来挽尊～
      </z-block>
    </div>
  </div>
</template>


<style lang="less">
.comment {
  margin-top: 0.2rem;
}
.comment-all {
  margin: 0 10px;
}
.comment.flex-row {
  display: flex;
  width: 100%;
}
.detail {
  margin-left: 10px;
}
.name,
.time {
  font-size: 10px;
  color: #666;
}
.time {
  margin-top: 5px;
}
.text-comment {
  line-height: 1.5;
  font-size: 13px;
  color: #333;
}
</style>

<script>
import TimeLine from '@model/timeline.js'
import zh_cn from 'date-fns/locale/zh_cn'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import moment from 'moment'
import commentOpen from '@/mixins/commentOpend.js'
export default {
  props: {
    comments: {
      type: Array,
      default: null
    },
    contentId: {
      type: String,
      default: ''
    }
  },
  mixins: [commentOpen],
  data() {
    return {
      listItem: null,
    }
  },
  computed: {
    comment() {
      return this.comments || this.listItem || []
    }
  },
  mounted() {
    this.getContentComment()
  },
  methods: {
    async getContentComment() {
      let re = await TimeLine.contentComment({ contentId: this.contentId })
      re = re.map((o) => {
        o.userParse = JSON.parse(o.user)
        return o
      })
      this.listItem = re
    },
    formatTime(time) {
      // time = time.replace(/-/g, '/');
      time = moment(time).format('YYYY/MM/DD hh:mm:ss');
      time = new Date(time).getTime()
      let t = distanceInWordsToNow(Number(time), { addSuffix: true, locale: zh_cn })
      console.log(time, t);
      return t
    }
  }
}
</script>
