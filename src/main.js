import Vue from "vue";
import ElementUI from 'element-ui';
import Element from 'element-ui';

import { emitEvent } from '@/views/common/tools';
import preventReClick from '@/utils/noDbClick';

import './styles/element-variables.scss';
import 'normalize.css/normalize.css';
import './styles/element-variables.scss';

import '@/styles/index.scss'; // 全局css

import App from "./App.vue";
import router from "./router";
import store from "./store";
import table from '@/views/common/table';
import pagination from '@/views/common/pagination';

import './icons'; // icon
import './permission'; // 权限控制

Vue.config.productionTip = false;
Vue.prototype.$emitEvent = emitEvent;

ElementUI.Dialog.props.closeOnClickModal.default = false; // 空白区域点击关闭弹窗: false
Vue.use(Element, {
  size: 'medium'
});

Vue.component('nice-table', table);
Vue.component('nice-pagination', pagination);
/* 放重复点击 */
Vue.use(preventReClick);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
