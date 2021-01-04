import Vue from "vue";
import ElementUI from 'element-ui';
import Element from 'element-ui';

import './styles/element-variables.scss';
import 'normalize.css/normalize.css';

import App from "./App.vue";
import router from "./router";
import store from "./store";

import './icons'; // icon

Vue.config.productionTip = false;

ElementUI.Dialog.props.closeOnClickModal.default = false; // 空白区域点击关闭弹窗: false
Vue.use(Element, {
 size: 'medium'
});

new Vue({
 router,
 store,
 render: h => h(App)
}).$mount("#app");
