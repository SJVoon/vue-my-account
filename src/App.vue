<template>
  <v-app>
    <v-app-bar app color="#1f456E" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/images/wallet.svg')"
          transition="scale-transition"
          width="45"
        />

        <h2 class="name-top">Wallet</h2>
      </div>

      <v-spacer></v-spacer>

      <div v-if="!isLogin">
        <v-btn text @click="onClickPushRoute('login')">
          <span class="mr-2">Login</span>
        </v-btn>
        <v-btn text @click="onClickPushRoute('register')">
          <span class="mr-2">Register</span>
        </v-btn>
      </div>
      <v-btn text v-else @click="onClickLogout()">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <router-view class="mt-12" />
  </v-app>
</template>

<script>
import STORE_CONSTANT from "./store/constant";
import firebase from "firebase";
const fb = require("./services/firebase.service");

export default {
  name: "App",
  computed: {
    isLogin() {
      return this.$store.getters[`${STORE_CONSTANT.GETTERS.USER}`].isLogin;
    },
  },
  methods: {
    onClickPushRoute(route) {
      if (this.$router.currentRoute.name == route) {
        return;
      } else {
        this.$router.push(route);
      }
    },
    onClickLogout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "login",
          });
        });
    },
  },
};
</script>
