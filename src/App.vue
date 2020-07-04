<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
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
      <v-btn text v-else @click="onClickPushRoute('dashboard')">
        <span class="mr-2">Dashboard</span>
      </v-btn>
    </v-app-bar>

    <router-view class="mt-12" />
  </v-app>
</template>

<script>
import STORE_CONSTANT from "./store/constant";

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
  },
};
</script>
