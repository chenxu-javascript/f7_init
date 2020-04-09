import { bsGetJSON, bsCheck } from './../utils/api.js'

let isInit = false
let timestamp, noncestr
let wxjsapi = {
  data() {
    return {
      configUrl: null
    }
  },
  async mounted() {
    if (isInit) {
      return
    }
    isInit = true
    // url（当前网页的URL，不包含#及其后面部分）, http://work.weixin.qq.com/api/doc#10029/%E7%AD%BE%E5%90%8D%E7%AE%97%E6%B3%95
    let url = location.href.replace(/#.*/, '')
    timestamp = new Date().getTime()
    noncestr = timestamp
    let result = await bsGetJSON('/wechant/public/getJsApiSignature', { url, timestamp, noncestr }, 'POST')
    this.wxConfig(result.data)

    await bsCheck(() => !!window.$f7)
    this.onhashChanged = () => {
      this.wxConfig(result.data)
    }

    window.addEventListener('hashchange', this.onhashChanged, false)

    // 区分ios系统的按返回键、手势返回，实现手势返回时page切换无动画，因为手势返回自带了动画
    // if (Framework7.prototype.device.ios && window.wx && wx.onHistoryBack) {
    //   wx.onHistoryBack(() => {
    //     window.appController.set('iosPressBackBtn', true)
    //     return true
    //   })
    // }
  },
  methods: {
    wxConfig(data) {
      let url = location.href
      let configUrl = this.configUrl
      if (url == configUrl) {
        return
      }
      if (data) {
        debugger
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: ZBJConfig.isDevx, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: data.noncestr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            'previewImage',
            'chooseImage',
            'uploadImage',
            'closeWindow',
            'translateVoice',
            'openEnterpriseChat',
            'getLocation',
            'onHistoryBack',
            'selectEnterpriseContact'
          ]
        })
        this.configUrl = url
      }
    }
  }
}

export default wxjsapi;

