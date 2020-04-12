<template>
  <f7-app :params="f7params">
    <f7-view id="main-view" url="/" main/>
    <div class="global-backdrop" @click="closePops"></div>
    <div class="picker-modal" id="picker-global"></div>
  </f7-app>
</template>
<script>
import routes from "@/routes.js";
// import wxjsapi from '@/mixins/wxjsapi.js';
import { bsSetupRem } from "@/utils/util.js";
import { mapState } from "vuex";
export default {
  // mixins: [wxjsapi],
  computed: {
    ...mapState({
      commentPopupOpened: state => state.popup.commentOpened
    })
  },
  data() {
    return {
      f7params: {
        id: "io.framework7.testapp",
        name: "Framework7",
        theme: "ios",
        routes,
        view: {
          pushState: true,
          animate: true,
          history: true,
          pushStateSeparator: "#",
          stackPages: true,
          iosSwipeBackActiveArea: document.body.clientWidth * 0.8
        },
        dialog: {
          title: "系统提示",
          buttonOk: "确定",
          buttonCancel: "取消",
          preloaderTitle: "加载中..."
        },
        lazy: {
          threshold: 50,
          placeholder: "https://dn-zbj-boss.qbox.me/@/default/2019-01-02/5c2c2cf92eea0.png"
        },
        picker: {
          routableModals: false
        },
        smartSelect: {
          routableModals: false,
          openIn: "sheet",
          renderItem(item) {
            return `
              <li class="${item.className || ""}">
                <label class="item-${item.inputType} item-content" >
                  <input type="${item.inputType}" name="${item.inputName}" value="${item.value}" ${
              item.selected ? "checked" : ""
            }/>
                  <i class="icon icon-${item.inputType}"></i>
                  <div class="item-inner">
                    <div class="item-title">${item.text}</div>
                  </div>
                </label>
              </li>
            `;
          },
          renderSheet(items) {
            return `
              <div class="sheet-modal smart-select-sheet " data-select-name="${this.selectName}">
                <div class="sheet-modal-inner">
                  <div class="page-content">
                    <div class="list smart-select-list-${this.id} ${
              this.params.virtualList ? " virtual-list" : ""
            }">
                      <ul>${!this.params.virtualList && this.renderItems(items)}</ul>
                    </div>
                  </div>
                </div>
              </div>`;
          }
        },
        on: {
          init() {
            window.$f7 = this;
            this.$("body>.preload").css({
              opacity: 0.0001
            });
          },
          pageInit(e) {
            let {
              route: {
                query: { callbackUrl }
              }
            } = e;
            if (callbackUrl) {
              location.href = decodeURIComponent(callbackUrl);
            }
          }
        }
      }
    };
  },
  beforeCreate() {
    let isPicker = /select\/$/.test(location.hash);
    if (isPicker) {
      history.go(-1);
    }
  },
  mounted() {
    bsSetupRem();
  },
  methods: {
    goback() {
      history.back();
    },
    closePops() {
      let f7app = window.$f7;
      if (f7app) {
        f7app.picker.close();
      }
    }
  }
};
</script>
