<template>
  <v-container>
    <h1 class="mt-8">{{ displayName }}</h1>
  </v-container>
</template>

<script>
import firebase from "firebase";
import STORE_CONSTANT from "../store/constant";
const fb = require("../services/firebase.service");

const computed = {
  displayName() {
    return this.$store.getters[`${STORE_CONSTANT.GETTERS.USER}`].data
      .displayName;
  },
  userId() {
    return this.$store.getters[`${STORE_CONSTANT.GETTERS.USER_ID}`];
  },
};

const data = function() {
  return {};
};

const methods = {};

const mounted = function() {
  fb.transactionsRef.child(this.userId).on(
    "value",
    function(snapshot) {
      console.log(snapshot.val());
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
};

export default {
  computed,
  data,
  methods,
  mounted,
};
</script>
