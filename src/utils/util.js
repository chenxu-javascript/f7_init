import Vue from "vue";
export const bsToast = function(msg, closeTimeout = 3000, position = "center") {
  if (window.$vm.$f7 && window.$vm.$f7.toast) {
    window.$vm.$f7.toast.show({
      text: msg,
      closeTimeout,
      position
    });
  } else {
    alert(msg);
  }
};

let bsTipModal = null;
export const bsTip = function(msg, title = "") {
  if (window.$vm && window.$vm.$f7) {
    if (bsTipModal) {
      return;
    }
    return new Promise(function(resolve) {
      bsTipModal = window.$vm.$f7.dialog.alert(msg || "error", title, function() {
        bsTipModal = null;
        resolve();
      });
    });
  } else {
    alert(msg || "error", "系统提示");
    return bsPromise({});
  }
};

export const bsPromise = function(data, time) {
  return new Promise(function(resolve) {
    if (time) {
      setTimeout(function() {
        resolve(data);
      }, time || 1);
    } else {
      resolve(data);
    }
  });
};
export const bsWait = function(time) {
  return bsPromise({}, time);
};

export const bsConfirm = function(msg, options = {}) {
  if (window.$vm && window.$vm.$f7) {
    return new Promise(function(resolve, reject) {
      let { modalButtonOk, title = "" } = options;
      let oldModalButtonOk = window.$vm.$f7.params.modalButtonOk;
      if (modalButtonOk) {
        window.$vm.$f7.params.modalButtonOk = modalButtonOk;
      }
      window.$vm.$f7.dialog.confirm(msg, title, resolve, reject);
      window.$vm.$f7.params.modalButtonOk = oldModalButtonOk;
    });
  }
  return bsPromise();
};

export const bsRunWhen = function(fn, cod) {
  if (cod()) {
    fn();
    return;
  }

  let i = 0;
  const interval = setInterval(function() {
    i++;
    if (i > 500) {
      clearInterval(interval);
    } else if (cod()) {
      fn();
      clearInterval(interval);
    }
  }, 30);
};

export const bsCheck = function(cod) {
  return new Promise(function(resolve, reject) {
    bsRunWhen(resolve, cod, "bsCheck", reject);
  });
};

export const bsHtmlDecode = function(text) {
  let temp = document.createElement("div");
  temp.innerHTML = text;
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
};

export const bsHtmlEncode = function(value) {
  const div = document.createElement("div");
  const text = document.createTextNode(value);
  div.appendChild(text);
  return div.innerHTML;
};

export function debounce(func, delay) {
  let timer;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const bsSetupRem = function() {
  try {
    const docEl = document.documentElement,
      resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
      recalc = function() {
        const clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        if (clientWidth >= 750) {
          docEl.style.fontSize = "100px";
        } else {
          docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
        }
      };

    if (document.addEventListener) {
      window.addEventListener(resizeEvt, recalc, false);
      document.addEventListener("DOMContentLoaded", recalc, false);
    }
  } catch (e) {
    throw new Error("初始化失败");
  }
};

const Utils = {
  bsTip,
  bsPromise,
  bsWait,
  bsCheck,
  bsHtmlDecode,
  bsHtmlEncode,
  bsToast,
  bsSetupRem,
  debounce
};

window.Utils = Utils;
export default Utils;
Vue.prototype.$bsToast = bsToast;
Vue.prototype.$bsWait = bsWait;
Vue.prototype.$bsTip = bsTip;
Vue.prototype.$bsCheck = bsCheck;
Vue.prototype.$debounce = debounce;
Vue.prototype.$bsConfirm = bsConfirm;
