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

          <v-select
            v-if="tab != 2"
            v-model="form.account.fieldValue"
            label="Account"
            :items="accountList"
            item-value="id"
            item-text="accountName"
            :rules="form.account.rules"
          ></v-select>

          <v-select
            v-if="tab != 2"
            v-model="form.category.fieldValue"
            label="Category"
            :items="categoryList"
            item-value="id"
            item-text="categoryName"
            :rules="form.category.rules"
          ></v-select>

          <v-select
            v-if="tab == 2"
            v-model="form.accountFrom.fieldValue"
            label="Account From"
            :items="accountList"
            item-value="id"
            item-text="accountName"
            :rules="form.accountFrom.rules"
          ></v-select>

          <v-select
            v-if="tab == 2"
            v-model="form.accountTo.fieldValue"
            label="Account To"
            :items="accountList"
            item-value="id"
            item-text="accountName"
            :rules="form.accountTo.rules"
          ></v-select>

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

    <v-btn color="error" @click="close(false)">Close</v-btn>
  </v-container>
</template>

<script>
import firebase from "firebase";
import STORE_CONSTANT from "../store/constant";
import Constant from "../constant/constant";
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
        rules: [ValidationRules.required, this.accountToCustomRule],
      },
      amount: {
        fieldValue: "",
        rules: [ValidationRules.required, ValidationRules.isNumber],
      },
      category: {
        fieldValue: "",
        rules: [ValidationRules.required],
      },
      content: {
        fieldValue: "",
        rules: [],
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
    accountList: [],
    categoryList: [],
  };
};

const methods = {
  close(val) {
    this.$emit("close",val);
  },
  accountToCustomRule(v) {
    return v !== this.form.accountFrom.fieldValue ? true : 'Cannot be same as account from'
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
      this.close(true);
    }
  },
  mapFormToDatabase() {
    const form = this.form;
    const tab = this.tab;
    //tab 0 money in
    //tab 1 money out
    //tab 2 transfer
    if (tab == 0 || tab == 1) {
      return {
        account: form.account.fieldValue,
        amount: form.amount.fieldValue,
        category: form.category.fieldValue,
        content: form.content.fieldValue,
        date: form.date.fieldValue,
        type: tab == 0 ? Constant.TRANSACTION_TYPE_MONEY_IN : Constant.TRANSACTION_TYPE_MONEY_OUT,
      };
    } else {
      return {
        accountFrom: form.accountFrom.fieldValue,
        accountTo: form.accountTo.fieldValue,
        amount: form.amount.fieldValue,
        content: form.content.fieldValue,
        date: form.date.fieldValue,
        type: Constant.TRANSACTION_TYPE_TRANSFER,
      };
    }
  },
  getDataFromFirebase() {
    let self = this
    fb.accountRef.child(self.userId).once(
      "value",
      function(snapshot) {
        let accList = _.cloneDeep(snapshot.val());
        Object.keys(accList).forEach((acc) => {
          let model = {
            id: acc,
            accountName: accList[acc].accountName,
            isVisible: accList[acc].isVisible
          }
          if (model.isVisible) {
            self.accountList.push(model)
          }
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
    fb.categoryRef.child(self.userId).once(
      "value",
      function(snapshot) {
        let catList = _.cloneDeep(snapshot.val());
        Object.keys(catList).forEach((cat) => {
          let model = {
            id: cat,
            categoryName: catList[cat].categoryName,
            isVisible: catList[cat].isVisible
          }
          if (model.isVisible) {
            self.categoryList.push(model)
          }
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  },
};

const mounted = function() {
  let self = this;
  self.getDataFromFirebase();
};

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
