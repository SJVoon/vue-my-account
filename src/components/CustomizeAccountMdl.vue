<template>
  <v-container class="container-modal">
    <h2 class="model-title">Customize Your Account</h2>

    <v-tabs v-model="tab" background-color="#1f456E" dark>
      <v-tab>Add New Account</v-tab>
      <v-tab>Edit Account</v-tab>
      <v-tab>Delete Account</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item class="pa-4">
        <v-form ref="tab0" lazy-validation>
          <v-text-field
            v-model="form0.accountName.fieldValue"
            label="Account Name"
            :rules="form0.accountName.rules"
          ></v-text-field>
        </v-form>
        <v-btn @click="addNew" class="button-save">Save</v-btn>
        <v-btn @click="close(true)" class="button-close">Close</v-btn>
      </v-tab-item>

      <v-tab-item class="pa-4">
        <v-form ref="tab1" lazy-validation>
          <v-select
            v-model="form1.selectedId"
            label="Choose an existing account"
            :items="accountList"
            item-value="id"
            item-text="accountName"
            append-icon="mdi-chevron-down"
          >
          </v-select>
          <v-text-field
            v-model="form1.accountName.fieldValue"
            label="New Account Name"
            :rules="form1.accountName.rules"
          ></v-text-field>
        </v-form>
        <v-btn @click="addEdit" class="button-save">Save</v-btn>
        <v-btn @click="close(true)" class="button-close">Close</v-btn>
      </v-tab-item>

      <v-tab-item class="pa-4">
        <v-form ref="tab2" lazy-validation>
          <v-select
            v-model="form2.selectedId"
            label="Choose an existing account"
            :items="accountList"
            item-value="id"
            item-text="accountName"
            append-icon="mdi-chevron-down"
          >
          </v-select>
        </v-form>
        <v-btn @click="del" class="button-delete">Delete</v-btn>
        <v-btn @click="close(true)" class="button-close">Close</v-btn>
      </v-tab-item>
    </v-tabs-items>
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
    form0: {
      accountName: {
        fieldValue: "",
        rules: [ValidationRules.required, this.customizeRule],
      },
    },
    form1: {
      selectedId: '',
      accountName: {
        fieldValue: "",
        rules: [ValidationRules.required, this.customizeRule],
      },
    },
    form2: {
      selectedId: '',
    },
    // accountList contain object 'account'
    // { id: 'FIREBASE_AUTO_GEN_KEY', accountName: 'ACCOUNT_NAME', isVisible: 'IS_VISIBLE'}
    accountList: [],
    tab: 0,
  };
};

const methods = {
  close(val) {
    this.$emit("close",val);
  },
  addNew() {
    let self = this;
    if (!self.$refs['tab0'].validate()){
      return;
    }
    // else if (self.customizeRule(self.form0.accountName.fieldValue) != true){
    //   window.alert("This account")
    // }
    else {
      let model = self.mapFormToDatabaseFormat(self.form0.accountName.fieldValue, true);
      fb.accountRef
        .child(self.userId)
        .push()
        .set(model)
        .then(()=>{
          self.cleanForm()
          self.getAccountListFromDatabase()
        });
    }
  },
  addEdit() {
    let self = this;
    if (!self.$refs['tab1'].validate()){
      return;
    }
    else {
      let model = self.mapFormToDatabaseFormat(self.form1.accountName.fieldValue, true);
      fb.accountRef
        .child(self.userId)
        .child(self.form1.selectedId)
        .update(model)
        .then(()=>{
          self.cleanForm()
          self.getAccountListFromDatabase()
        });
    }
  },
  del() {
    let self = this;
    let confirm = window.confirm("Are you sure you want to delete this account?")
    if(confirm){
      let acc = self.accountList.find(account => account.id === self.form2.selectedId)
      let model = self.mapFormToDatabaseFormat(acc.accountName, false);
      fb.accountRef
        .child(self.userId)
        .child(acc.id)
        .update(model)
        .then(()=>{
          self.cleanForm()
          self.getAccountListFromDatabase()
        });
    }
  },
  customizeRule(v) {
    let account;
    for(account of this.accountList){
      if(account.accountName === v) {
        return 'Account Name already exist!'
      }
    }
    return true
  },
  cleanForm() {
    let self = this;
    self.form0.accountName.fieldValue = ''
    self.form1.accountName.fieldValue = ''
  },
  mapFormToDatabaseFormat(val1, val2) {
    return {
      accountName : val1,
      isVisible : val2,
    }
  },
  getAccountListFromDatabase() {
    let self = this
    self.accountList = []
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
  }
};

const mounted = function() {
  this.getAccountListFromDatabase();
};

const watch = {};

export default {
  name: "CustomizeAccount",
  computed,
  data,
  methods,
  mounted,
  watch,
};
</script>

<style scoped>
</style>