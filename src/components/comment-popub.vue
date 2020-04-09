<template>
  <f7-page class="comment-popub">
    <div class="card editor-container">
      <textarea type="textarea" :placeholder="placeholder" value="text" v-model="content"></textarea>
      <vue-core-image-upload
        v-if="imgArray.length < 10"
        class="btn btn-primary"
        :crop="false"
        @imageuploaded="imageuploaded"
        inputOfFile="file"
        :max-file-size="5242880"
        :url="uploadFileUrl" >
        <i class="iconfont icon-tupian f20 add-picture"></i>
      </vue-core-image-upload>
    </div>
    <div class="images-card" v-if="imgArray.length > 0">
      <div class="img-item"  v-for="(item, index) in imgArray" :key="index">
        <i class="iconfont icon-shanchu f16 delete-picture" @click="deleteImg(item)"></i>
        <img :src="item" alt="">
      </div>
    </div>
    <f7-toolbar tabbar class="toolbar-content">
      <f7-button fill big color="red" @click="sendComment" class="toolbar-btn">
        {{commentOpened == 1 ? '发 布' : '评 论'}}
      </f7-button>
    </f7-toolbar>
  </f7-page>
</template>

<style lang="less">
// .add-picture {
//   position: absolute;
//   left: 0.1rem;
//   bottom: 0.05rem;
//   z-index: 9;
//   display: inline-block;
//   i {
//     width: 24px;
//     height: 24px;
//   }
// }
.images-card {
  margin: 0.15rem 0;
  .img-item{
    display: inline-block;
    width: 2.2rem;
    height: 2.2rem;
    margin-left: 0.225rem;
    position: relative;
  }
  .delete-picture{
    position: absolute;
    right: 2px;
    top: 0;
    color: @t-color;
  }
  img {
   width: 100%;
   height: 100%;
  }
}
.g-core-image-upload-btn{
  width: 24px;
  height: 24px;
  left: 0.1rem;
  bottom: 0.05rem;
  z-index: 9;
  display: inline-block;
  .add-picture i {
    width: 24px;
    height: 24px;
  }
}
.editor-container {
  position: relative;
  > textarea {
    width: 100%;
    height: 150px;
    font-size: 15px;
    border: none;
    color: #444;
    margin: 0;
    padding: 5px;
    resize: none;
    box-sizing: border-box;
    background-color: #fff;
    text-indent: 2px;
  }

  .tools {
    width: 100%;
    height: 40px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #dadada;
    border-top: 1px solid #dadada;
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: -5px;
    .tool {
      width: 50px;
      height: 100%;
      text-align: center;
      line-height: 40px;
      .iconfont {
        color: #666;
      }
    }
  }
}

</style>

<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import { mapActions, mapState } from 'vuex';
import TimeLine from '@model/timeline.js';

export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '说点什么吧..'
    },
    state: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      content: '',
      dongtai: '',
      imgArray: []
    }
  },
  create() {
    this.imgArray = [];
  },
  components: {
    'vue-core-image-upload': VueCoreImageUpload
  },
  watch: {
    editText(text) {
      this.$emit('text:change', text)
    }
  },
  computed: {
    ...mapState(["popup"]),
    commentOpened() {
      return this.popup.commentOpened
    },
    uploadFileUrl() {
      return window.ZBJConfig.API_HOST + '/file/wechatPublicImgUpload'
    },
  },
  beforeDestroy() {
    this.closePopup()
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    // loadImg() {
    //   let self = this;
    //   wx.ready(() => {
    //     wx.chooseImage({
    //       count: 1, // 默认9
    //       sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //       success(res) {
    //         self.uploadImage(res.localIds[0]);
    //       }
    //     });
    //   })
    // },
    // uploadImage(localId) {
    //   let self = this;
    //   wx.uploadImage({
    //     localId, // 需要上传的图片的本地ID，由chooseImage接口获得
    //     isShowProgressTips: 0, // 默认为1，显示进度提示
    //     success(res) {
    //       let { serverId } = res;
    //       debugger
    //     }
    //   });
    // },
    deleteImg(item) {
      this.imgArray = this.imgArray.splice(item, 1);
    },
    imageuploaded(res) {
      if (res.success) {
        this.imgArray.push(res.data);
      }
    },
    async sendComment() {
      this.$f7.preloader.show()
      if (this.commentOpened == 1) {
        await this.dynamicCreate()
      } else if (this.commentOpened == 2) {
        await this.commentCreate()
      }
      setTimeout(() => {
        this.content = '';
        this.imgArray = [];
        this.$f7.preloader.hide()
        this.closePopup()
      }, 200)
    },
    async commentCreate() {
      let urlArray = location.hash.split('/')
      let index = urlArray.length - 1
      let id = urlArray[index]
      let params = {
        comment: this.content,
        contentId: id
      }
      await TimeLine.commentCreate(params)
    },
    async dynamicCreate() {
      let coverPic = '';
      if (this.imgArray.length) {
        coverPic = this.imgArray.join('#')
      }
      let params = {
        content: this.content,
        coverPic,
        type: 'dongtai'
      }
      await TimeLine.dynamicCreate(params)

    },
    closePopup() {
      this.updatePopup({
        key: 'commentOpened',
        value: 0
      })
    }
  }
}
</script>