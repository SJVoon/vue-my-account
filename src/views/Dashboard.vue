<template>
  <v-container>
    <h2 class="ma-8">Hi {{ displayName }}</h2>
    <v-layout>
      <v-btn @click="openModal = true">Create Transaction</v-btn>
    </v-layout>
    <v-overlay :value="openModal">
      <CreateTransaction v-if="openModal" @close="closeModal" />
    </v-overlay>
  </v-container>
</template>

<script>
import { CreateTransaction } from "../components/";
import firebase from "firebase";
import STORE_CONSTANT from "../store/constant";
const fb = require("../services/firebase.service");

const components = {
  CreateTransaction,
};

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
  return {
    openModal: false,
  };
};

const methods = {
  closeModal() {
    this.openModal = false;
  },
};

const mounted = function() {
  fb.transactionsRef.child(this.userId).once(
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
  components,
  computed,
  data,
  methods,
  mounted,
};
</script>
