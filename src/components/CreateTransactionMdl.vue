<template>
  <v-container class="container">
    <h2>Add New Transaction</h2>

    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab>Money In</v-tab>
      <v-tab>Money Out</v-tab>
      <v-tab>Transfer</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="type in formType" :key="type" class="pa-4">
        <v-form :ref="type" lazy-validation>
          <v-menu
            v-model="isOpenDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.date.fieldValue"
                label="Date"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.date.fieldValue"
              @input="isOpenDatePicker = false"
            ></v-date-picker>
          </v-menu>

          <v-text-field
            v-if="tab != 2"
            v-model="form.account.fieldValue"
            label="Account"
            :rules="form.account.rules"
          ></v-text-field>

          <v-text-field
            v-if="tab != 2"
            v-model="form.category.fieldValue"
            label="Category"
            :rules="form.category.rules"
          ></v-text-field>

          <v-text-field
            v-if="tab == 2"
            v-model="form.accountFrom.fieldValue"
            label="Account From"
            :rules="form.accountFrom.rules"
          ></v-text-field>

          <v-text-field
            v-if="tab == 2"
            v-model="form.accountTo.fieldValue"
            label="Account To"
            :rules="form.accountTo.rules"
          ></v-text-field>

          <v-text-field
            v-model="form.amount.fieldValue"
            label="Amount"
            :rules="form.amount.rules"
          ></v-text-field>

          <v-text-field
            v-model="form.content.fieldValue"
            label="Content"
            :rules="form.content.rules"
          ></v-text-field>
        </v-form>
      </v-tab-item>
    </v-tabs-items>

    <v-btn color="blue darken-3" @click="save">Save</v-btn>

    <v-btn color="error" @click="close">Close</v-btn>
  </v-container>
</template>

<script>
import firebase from "firebase";
import STORE_CONSTANT from "../store/constant";
import ValidationRules from "../mixins/validation-rules";
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
  return {
    form: {
      account: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      accountFrom: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      accountTo: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      amount: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      category: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      content: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      date: {
        fieldValue: new Date().toISOString().substr(0, 10),
        rules: [ValidationRules.required],
      },
      type: "",
    },
    formType: ["form0", "form1", "form2"],
    isOpenDatePicker: false,
    tab: 0,
  };
};

const methods = {
  close() {
    this.$emit("close");
  },
  save() {
    const type = this.formType[this.tab];
    if (!this.$refs[type][0].validate()) {
      return;
    } else {
      let form = this.mapFormToDatabase();
      fb.transactionsRef
        .child(this.userId)
        .push()
        .set(form);
      this.close();
    }
  },
  mapFormToDatabase() {
    const form = this.form;
    const tab = this.tab;
    if (tab == 0 || tab == 1) {
      return {
        account: form.account.fieldValue,
        amount: form.amount.fieldValue,
        category: form.category.fieldValue,
        content: form.content.fieldValue,
        date: Date.parse(form.date.fieldValue),
        type: tab == 0 ? 1 : -1,
      };
    } else {
      return {
        accountFrom: form.accountFrom.fieldValue,
        accountTo: form.accountTo.fieldValue,
        amount: form.amount.fieldValue,
        content: form.content.fieldValue,
        date: Date.parse(form.date.fieldValue),
        type: 0,
      };
    }
  },
};

const mounted = function() {};

const watch = {};

export default {
  name: "CreateTransaction",
  computed,
  data,
  methods,
  mounted,
  watch,
};
</script>

<style scoped>
.container {
  background-color: cornflowerblue;
}
</style>
