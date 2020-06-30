import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import STORE_CONSTANT from './store/constant'
const fb = require('./services/firebase.service')

Vue.config.productionTip = false

// OnAuthentication save to state
fb.auth.onAuthStateChanged(user => {
  store.dispatch(`${STORE_CONSTANT.ACTIONS.FETCH_USER}`, user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
