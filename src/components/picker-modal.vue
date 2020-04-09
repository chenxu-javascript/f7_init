<template>
  <portal to="picker-modal" class="remove-on-close" :class="cls" :id="containerId">
    <div class="fade-overlay hidden"></div>
    <slot></slot>
  </portal>
</template>
<script>
import Utils from '@/utils/util'
export default {
  name: 'PickerModal',
  props: {
    openIn: {
      type: String,
      default: 'picker'
    }, // 在哪里打开： picker、panel
    queryName: {
      type: String,
      default: 'modalshow'
    },
    picker: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      containerId: '',
      elementId: Utils.uuid(),
      modal: '',
      modalOpened: false
    }
  },
  created() {
    this.containerId = `date-picker-container-${this.elementId}`
    this.close = this.close.bind(this);
  },
  beforeMount() {
    let { openInPanel } = this
    let cls = 'picker-modal date-picker-container ';
    if (openInPanel) {
      cls = 'panel panel-right panel-cover ';
    }
    this.cls = cls
    // window.$f7.$(`<div class="remove-on-close ${cls}  ${modalClass}" id="${containerId}"/>`).appendTo('body');
  },
  mounted() {
    this.domInit();
    let $modal = document.getElementById(this.modalSelector);
    let pickershow = this.queryName;
    $modal.addEventListener('closed', () => {
      if (this[pickershow]) {
        history.back();
      }
      this.onClose();
    })
    $modal.addEventListener('open', () => {
      this.onOpen();
      this.pickershow = true;
    })
  },
  beforeDestroy() {
    let modalSelector = this.modalSelector;
    window.$f7.$(modalSelector).remove();
  },
  computed: {
    openInPicker() {
      return this.openIn == 'picker'
    },
    openInPanel() {
      return this.openIn == 'panel'
    },
    modalSelector() {
      return `${this.containerId}`;
    },
  },
  methods: {
    domInit() {
      let f7app = window.$f7;
      let { modal, modalOpened, openInPanel } = this
      if (!(modal && !modalOpened)) {
        if (openInPanel) {
          modal = f7app.openPanel('right');
        } else {
          modal = this.picker.open();
        }
        this.modal = modal
        this.modalOpened = true;
      }
    },
    close() {
      let openInPanel = this.openInPanel;
      if (openInPanel) {
        window.f7app.closePanel();
      } else {
        window.f7app.closeModal(this.modalSelector);
        this.modalOpened = false;
      }
    }
  }
}
</script>
