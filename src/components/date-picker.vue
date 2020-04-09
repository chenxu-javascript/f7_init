<template>
  <div :id="pickerId"></div>
</template>
<script>
import moment from 'moment';
import Utils from '@/utils/util'

const numbers = (count = 0, start = 1) => {
  const padStart = (s = '') => (s.length == 1 ? '0' + s : s);
  let values = Array(parseInt(count)).fill(0).map((o, i) => padStart(String(i + start)));
  return { values };
};

function w(str) {
  return str.split(' ')
}

export default {
  name: 'DatePicker',
  props: {
    mode: {
      type: String,
      default: 'day'
    },
    valueType: {
      type: Number,
      default: 1
    },
    isSetToNow: {
      type: Boolean,
      default: false
    },
    datevalue: {
      type: [Object, String],
      default: () => ''
    }
  },
  data() {
    return {
      value: moment(),
      years: numbers(73, 1950),   /* 列定义 */
      months: numbers(12),

      hours: numbers(24, 0),
      minutes: numbers(60, 0),
      picker: null,

      year: '',
      month: '',
      day: '',
      hour: '',
      minute: ''
    }
  },
  created() {
    let elId = Utils.uuid();
    this.pickerId = `date-picker-${elId}`;

    let m = this.value;
    if (!m) {
      m = moment();
      this.value = m;
    }
    this.mntChanged()
  },

  mounted() {
    this.domInsert()
  },
  computed: {
    days() {
      let { year, month, showtimeForweek } = this;
      if (!year || !month) {
        return numbers(0);
      }
      let mnt = moment([year, month].join('-'));
      let daysCount = mnt.daysInMonth();
      let values = numbers(daysCount).values;
      let displayValues = values.map(d => {
        let weekDay = mnt.date(parseInt(d)).format('dd');
        return showtimeForweek ? `${d} 周${weekDay}` : d;
      });
      return { values, displayValues };
    },

    weeks() {
      let year = this.year;
      let m = moment(parseInt(year)).endOf('year');
      let count = m.format('W');
      if (moment(`${year}-${count}`, 'YYYY-W').format() == 'Invalid date') {
        count = m.subtract(1, 'week').format('W');
      }

      let values = numbers(count).values;
      let displayValues = values.map(d => `第${d}周`);
      return { values, displayValues };
    },

    nowText() {
      let mode = this.mode;
      let maps = {
        year: '本年',
        month: '本月',
        day: '今天',
        week: '本周',
        time: '今天'
      };
      return maps[mode];
    },

    displayFormat() {
      let mode = this.mode;
      let maps = {
        year: 'YYYY年',
        month: 'YYYY年MM月',
        day: 'YYYY年MM月DD日',
        week: 'YYYY年第W周',
        time: 'YYYY-MM-DD HH:mm'
      };
      return maps[mode];
    },

    displayValues() {
      let m = this.value;
      let mode = this.mode || 'day'
      let maps = {
        year: 'YYYY',
        month: 'YYYY-MM',
        day: 'YYYY-MM-DD',
        week: 'YYYY-W',
        time: 'YYYY-MM-DD HH:mm'
      };
      return m.format(maps[mode]).split(/[-: ]/);
    },

    returnValues() {
      let m = this.value;
      let mode = this.mode || 'day'
      let maps = {
        year: 'YYYY',
        month: 'YYYY-MM',
        day: 'YYYY-MM-DD',
        week: 'YYYY-W',
        time: 'YYYY-MM-DD HH:mm'
      };
      return m.format(maps[mode]);
    },

    headers() {
      let mode = this.mode || 'day'
      let maps = {
        year: '年份',
        month: '年份 月份',
        day: '年份 月份 日',
        week: '年份 周',
        time: '年份 月份 日 小时 分'
      };
      return w(maps[mode]);
    },

    cols() {
      let mode = this.mode || 'day'
      let divider = {
        divider: true,
        content: '｜'
      };
      if (mode == 'day') {
        let { years, months, days } = this;
        return [years, divider, months, divider, days];
      } else if (mode == 'month') {
        let { years, months } = this;
        return [years, divider, months];
      } else if (mode == 'year') {
        let { years } = this;
        return [years];
      } else if (mode == 'week') {
        let { years, weeks } = this;
        return [years, divider, weeks];
      } else if (mode == 'time') {
        let { years, months, days, hours, minutes } = this;
        return [years, divider, months, divider, days, divider, hours, divider, minutes];
      }
    },
  },
  watch: {
    'mode': function () {
      this.domInsert()
    },
    'value': function (value) {
      this.mntChanged()
      this.updateDom(value)
    }
  },
  methods: {
    updateDom(value) {
      let v = moment(value).format(this.displayFormat);
      console.log(v);
      $f7.$('.sheet-modal.picker .chose-time').html(`已选择 : ${v}`)
    },
    mntChanged() {
      let m = this.value;
      let values = m.format('YYYY-MM-DD HH:mm').split(/[-: ]/);
      this.year = values[0];
      this.month = values[1];
      this.day = values[2];
      this.hour = values[3];
      this.minute = values[4];

      let { mode, picker, days, isSetToNow } = this;
      if (!picker) {
        return;
      }

      if ((mode == 'day' || mode == 'time') && picker.cols[4] &&
        days.values !== picker.cols[4].values
      ) {
        let col = picker.cols[4];
        let values = days.values;
        let displayValues = days.displayValues;
        col.values = values;
        col.displayValues = displayValues;
        col.replaceValues(values, displayValues)
        if (!isSetToNow) {
          let oldValue = this.day;
          if (!values.includes(oldValue)) {
            let newValue = this.values // get(values, 'lastObject');
            col.setValue(newValue, 0, true);
          } else {
            col.setValue(oldValue, 0, true);
          }
        }
      }
      if (isSetToNow) {
        picker.setValue(this.displayValues);
        this.isSetToNow = false;
      }
    },

    async domInsert() {
      let f7app = window.$f7;
      let self = this;
      await this.bsWait();

      let cols = this.cols;
      let picker = this.picker;
      if (picker) {
        picker.destroy();
      }
      let headers = this.headers;
      let headersStr = '';
      headers.forEach((o) => {
        headersStr += `<div class="picker-items-col">
                    <div class="picker-item">${o}</div>
                  </div>`
      })
      let initDisplayValue = moment(this.value).format(this.displayFormat)
      picker = f7app.picker.create({
        // containerEl: '#picker-global', // $inputEl: containerEl, // toolbar: false,
        rotateEffect: false,
        cols,
        updateValuesOnTouchmove: true,
        value: this.displayValues,
        renderToolbar() {
          return `
          <div class="toolbar">
            <div class="toolbar-inner nopadding">
              <a href="#" class="btn link sheet-close popover-close">取消</a>
              <span class="chose-time">已选择 : ${initDisplayValue}</span>
              <a class="btn confirm" id="confirm">完成</a>
            </div>
          </div>
          <div class="toolbar date-legend">
            <div class="picker-modal-inner picker-items">
                ${headersStr}
            </div>
          </div>`;
        },
        on: {
          opened() {
            let dom = document.getElementById('confirm')
            dom.addEventListener('click', self.confirm)
          },
          change() {
            self._handlePickChange(...arguments);
          },
          closed() {
            picker.close()
            self.$emit('update:openDatePicker', false)
          }
        }
      });
      this.picker = picker;
      picker.open()
    },
    _handlePickChange(picker, values) {
      let mode = this.mode;
      if (mode === 'week') {
        let m = moment(values.join('-'), 'YYYY-W');
        this.value = m;
      } else {
        let [year, month, day] = values;
        let mnt = moment([year, month].join('-'));
        let daysCount = mnt.daysInMonth();
        if (day > daysCount) {
          values[2] = daysCount;
        }
        this.value = moment(values.join('-'), 'YYYY-MM-DD HH:mm');
      }
    },
    confirm() {
      this.$emit('onConfirm', this.returnValues, this.valueType)
      this.close()
    },
    close() {
      let picker = this.picker;
      picker.close()
    },
    setToNow() {
      this.isSetToNow = true;
      this.value = moment();
    }
  }
}
</script>

<style lang="less">
.picker-items {
  font-size: 14px;
}
.picker-items {
  -webkit-mask-box-image: none;
}
.picker-item {
  min-width: 1.52rem;
  text-align: center;
  color: #b0b0b0;

  &.picker-selected {
    color: #333;
  }
}

.toolbar.date-legend {
  padding-left: 15px;
  height: 36px;
  .hairline(bottom, #ddd);

  .picker-item {
    color: #666;
  }
}
.picker-items-col-divider {
  display: none;
}

.picker-modal.picker-columns.picker-modal-inline {
  width: calc(~'100% - 15px');
  height: 180px;
  margin-left: 15px;
  background: linear-gradient(#fff 98.61%, #f1f1f1 0);
  background-size: 100% 36px;
}

.toolbar {
  background-color: #fff;
  &.date-legend {
    height: 36px;
    .hairline(bottom, #ddd);
  }
  a {
    font-size: 14px;
  }
  .btn {
    height: 44px;
    line-height: 44px;
    padding: 0 20px;
  }
  .cancel-btn {
    color: #666;
  }
  .chose-time {
    color: #333;
    font-size: 0.32rem;
  }
}

.toolbar-inner.toolbar-now {
  margin-top: -2px;
}
</style>

<style lang="less">
.date-legend {
  .picker-items {
    display: flex;
    justify-content: center;
    padding: 0;
    text-align: right;
  }
}

.sheet-modal-inner.picker-columns {
  width: 100%;
  height: 180px !important;
  padding-left: 15px;
  background: linear-gradient(#fff 98.61%, #f1f1f1 0);
  background-size: 100% 36px;
  overflow: hidden;
}
.picker-column.picker-column-divider {
  display: none;
}

.ios .sheet-modal .toolbar:before {
  background-color: #ddd;
}

.picker-center-highlight {
  display: none;
}

.picker.sheet-modal {
  height: auto;
  min-height: 200px;
}
</style>
