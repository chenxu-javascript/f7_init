import Vue from "vue";
import Axios from "axios";
import { bsTip, bsWait } from "./util";
import StoreCache from "./storeCache";

let cache = new StoreCache("f7");

const isDev =
  window.location.origin.indexOf("http://localhost") === 0 ||
  window.location.origin.indexOf("http://172.31.35.65") === 0;

export var ZBJConfig = {
  //  API_HOST: isDev ? 'http://172.17.61.151:7000' : window.location.origin,
  API_HOST: isDev ? "http://zhubi.test.zbjdev.com" : window.location.origin,
  isDev
};

if (isDev) {
  ZBJConfig.BASE_URI = "test.zbjdev.com";
} else {
  ZBJConfig.BASE_URI = ZBJConfig.API_HOST.substring(
    ZBJConfig.API_HOST.indexOf(".") + 1
  );
}

window.ZBJConfig = ZBJConfig;

Axios.interceptors.request.use(
  function(config) {
    config.baseURL = window.ZBJConfig.API_HOST;
    config.withCredentials = true;
    let token = cache.get("token");
    // 处理cookie 必须要
    config = devParams(config, token);
    if (config.method === "post" && config.nopostChange) {
      config.transformRequest = function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret.substring(0, ret.length - 1);
      };
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(async function({ data, config }) {
  if (data && data.token) {
    cache.set("token", data.token);
  }
  if (data.reqlogin && data.is_redirect && data.redirect_url) {
    // 请求登陆, 后面会进行跳转, 但是不需要报错
  } else if (!data.state) {
    bsTip(data.msg || data.data || "error");
  }
  if (data.is_redirect && data.redirect_url) {
    window.location = data.redirect_url.replace(
      /(back_url=)[^&]*/,
      "$1" + encodeURIComponent(window.location.href)
    );
  }
  if (config.method === "post") {
    await bsWait(200);
  }

  return data;
});

function bsGetJSON(url, params, type = "get", nopostChange = false) {
  type = type.toLocaleUpperCase();
  if (!url) {
    bsTip("url为空, 请检查");
  }

  if (typeof params !== "object") params = {};
  if (type == "GET") {
    return Axios({
      url,
      method: "get",
      params
    });
  } else {
    return Axios({
      url,
      method: "post",
      data: params,
      nopostChange
    });
  }
}

function devParams(config, token) {
  if (config.method === "get") {
    config.url = bsAddReqToken(config.url);
  } else {
    if (typeof data === "string") {
      config.data = config.data + "&token=" + token;
    } else {
      config.data.token = token;
    }
  }
  return config;
}

function bsAddReqToken(url) {
  let token = cache.get("token");
  if (!token) {
    return url;
  }
  if (url.indexOf("?") === -1) {
    return url + "?token=" + token;
  } else {
    return url + "&token=" + token;
  }
}

Vue.prototype.bsGetJSON = bsGetJSON;
Vue.prototype.$ajax = Axios;

export { Axios as ajax, bsGetJSON };
