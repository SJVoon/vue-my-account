import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import STORE_CONSTANT from './store/constant'
import vuetify from './plugins/vuetify';
const fb = require('./services/firebase.service')
import './assets/customization.css';

Vue.config.productionTip = false

// OnAuthentication save to state
fb.auth.onAuthStateChanged(user => {
  if(router.currentRoute.name == 'register') return
  store.dispatch(`${STORE_CONSTANT.ACTIONS.FETCH_USER}`, user);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
