'use strict';

import axios from "axios";
import router from "@/router";
import defaultSetting from "@/settings";
import { Message } from "element-ui";
import { getToken } from '@/utils/auth';

class Request {
  constructor(props) {
    this.instance = axios.create({
      baseURL: defaultSetting.proxy.name,
      timeout: 5000
    });
    this.instance.interceptors.request.use(
      config => {
        const token = getToken();
        if (token) {
          // 设置令牌请求头
          config.headers["Authorization"] = 'Bearer ' + token;
        }
        if (sessionStorage.getItem('req_' + config.baseURL + config.url)) {
          const msg = '请求已发出，请勿重复点击';
          Message({
            message: msg,
            type: 'info',
            duration: 1000
          });
          return Promise.reject(msg);
        }
        sessionStorage.setItem('req_' + config.baseURL + config.url, 'stop');
        return config;
      },
      error => {
        console.log("use：", error);
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      response => {
        sessionStorage.removeItem('req_' + response.config.baseURL + response.config.url);
        const res = response.data;
        res.errMsg && Message({
          message: res.errMsg,
          type: res.code && res.code === 200 ? 'success' : 'error',
          duration: 2 * 1000
        });
        if (res.code && res.code === 200) {
          return res;
        } else {
          return Promise.reject(res.msg);
        }
      },
      error => {
        console.log("error.response：", error.response);
        if (!error.response) {
          sessionStorage.removeItem('req_' + error.config.baseURL + error.config.url);
          Message({
            message: '请求失败',
            type: 'error',
            duration: 2 * 1000
          });
          return Promise.reject('请求失败');
        }
        if (error.response.status === 401) {
          router.push('/login');
        }
        sessionStorage.removeItem('req_' + error.config.baseURL + error.config.url);
        const res = error.response.data.errMsg;
        Message({
          message: !res ? error.response.statusText : res,
          type: 'error',
          duration: 2 * 1000
        });
        return Promise.reject(res);
      }
    );
  }

  post(url, params = {}, config) {
    return new Promise((resolve, reject) => {
      config = config || {
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      };
      this.instance
        .post(url, params, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(url) {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new Request();
