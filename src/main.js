import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';

// eslint-disable-next-line
import styles from './scss/app.scss';

import './registerServiceWorker'

const prod = process.env.NODE_ENV === 'production'
const shouldSW = 'serviceWorker' in navigator && prod
if (shouldSW) {
  navigator.serviceWorker.register('/service-worker.js').then(() => {
    console.log("Service Worker Registered!")
  })
}


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
