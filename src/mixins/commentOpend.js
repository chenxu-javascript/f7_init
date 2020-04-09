import { mapState } from 'vuex'
const getContentComment = {
  computed: {
    ...mapState(['popup']),
    commentOpened() {
      return this.popup.commentOpened
    }
  },
  watch: {
    commentOpened: {
      handler(val) {
        if (val == 0) {
          this.getContentComment()
        }
      }
    }
  }

}

export default getContentComment
