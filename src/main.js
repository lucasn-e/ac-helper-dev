import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';
import wb from "./registerServiceWorker";



Vue.prototype.$workbox = wb;

// eslint-disable-next-line
import styles from './scss/app.scss';

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  store
}).$mount('#app');
