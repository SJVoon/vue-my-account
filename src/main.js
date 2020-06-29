import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import STORE_CONSTANT from './store/constant'
import firebase from "firebase";

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD6H62aF-rShCTm2VZt5kv9HuTRKLkubM8",
  authDomain: "vue-my-account.firebaseapp.com",
  databaseURL: "https://vue-my-account.firebaseio.com",
  projectId: "vue-my-account",
  storageBucket: "vue-my-account.appspot.com",
  messagingSenderId: "592086333071",
  appId: "1:592086333071:web:ba534251b68dc450f322fa",
  measurementId: "G-NZG4B2E62N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// OnAuthentication save to dtate
firebase.auth().onAuthStateChanged(user => {
  store.dispatch('FETCH_USER', user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
