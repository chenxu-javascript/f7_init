import { bsGetJSON } from './../utils/api.js'
import { bsWait } from './../utils/util.js'
let getList = {
  data() {
    return {
      pagebar: {
        page: 1,
        limit: 15,
        total: -1
      },
      parameter: {},
      listData: [],
      url: '/content/listByType',
      allowInfinite: true,
      showPreloader: true,
      defaultImg:
        'https://dn-zbj-boss.qbox.me/@/default/2019-01-10/5c36b6eff4171.png'
    }
  },
  computed: {
    showMore() {
      let pagebar = this.pagebar
      if (pagebar.total == -1) return false
      let hasMore = pagebar.total > pagebar.limit * pagebar.page
      return hasMore
    }
  },
  async mounted() {
    this.getList()
  },

  methods: {
    async loadMore() {
      // 下拉加载
      if (!this.allowInfinite || !this.showMore) return
      this.allowInfinite = false
      await bsWait(200)
      this.pagebar.page++
      let re = await this.getList()
      this.listData = this.listData.concat(re)
      this.allowInfinite = true
    },
    async refresh(e, done) {
      // 上拉刷新
      await this.bsWait(100)
      this.pagebar.page = 1
      await this.getList()
      done()
    },
    async getList() {
      let params = Object.assign({}, this.pagebar, this.parameter)
      let re = await bsGetJSON(this.url, params, 'POST')
      if (re.success) {
        let { page, limit, totalSize } = re
        this.pagebar = { page, limit, total: totalSize }
        try {
          re.data = re.data.map(o => {
            if (o.hasOwnProperty('author')) {
              o.authorParse = JSON.parse(o.author)
            }
            return o
          })
        } catch (error) {
          throw Error(error)
        }
        if (re.page == 1) {
          this.listData = re.data
        } else {
          return re.data
        }
      }
    }
  }
}

export default getList
