<template>
  <v-container class="container">
    <h2>Customize Your Category</h2>

    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab>Add New Category</v-tab>
      <v-tab>Edit Category</v-tab>
      <v-tab>Delete Category</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item class="pa-4">
        <v-form ref="tab0" lazy-validation>
          <v-text-field
            v-model="form0.categoryName.fieldValue"
            label="Category Name"
            :rules="form0.categoryName.rules"
          ></v-text-field>
        </v-form>
        <v-btn color="blue darken-3" @click="addNew">Save</v-btn>
        <v-btn color="error" @click="close(true)">Close</v-btn>
      </v-tab-item>

      <v-tab-item class="pa-4">
        <v-form ref="tab1" lazy-validation>
          <v-select
            v-model="form1.selectedId"
            label="Choose an existing category"
            :items="categoryList"
            item-value="id"
            item-text="categoryName"
          >
          </v-select>
          <v-text-field
            v-model="form1.categoryName.fieldValue"
            label="New Category Name"
            :rules="form1.categoryName.rules"
          ></v-text-field>
        </v-form>
        <v-btn color="blue darken-3" @click="addEdit">Save</v-btn>
        <v-btn color="error" @click="close(true)">Close</v-btn>
      </v-tab-item>

      <v-tab-item class="pa-4">
        <v-form ref="tab2" lazy-validation>
          <v-select
            v-model="form2.selectedId"
            label="Choose an existing category"
            :items="categoryList"
            item-value="id"
            item-text="categoryName"
          >
          </v-select>
        </v-form>
        <v-btn color="blue darken-3" @click="del">Delete</v-btn>
        <v-btn color="error" @click="close(true)">Close</v-btn>
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
      categoryName: {
        fieldValue: "",
        rules: [ValidationRules.required, this.customizeRule],
      },
    },
    form1: {
      selectedId: '',
      categoryName: {
        fieldValue: "",
        rules: [ValidationRules.required, this.customizeRule],
      },
    },
    form2: {
      selectedId: '',
    },
    // categoryList contain object 'category'
    // { id: 'FIREBASE_AUTO_GEN_KEY', categoryName: 'CATEGORY_NAME', isVisible: 'IS_VISIBLE'}
    categoryList: [],
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
    else {
      let model = self.mapFormToDatabaseFormat(self.form0.categoryName.fieldValue, true);
      fb.categoryRef
        .child(self.userId)
        .push()
        .set(model)
        .then(()=>{
          self.cleanForm()
          self.getCategoryListFromDatabase()
        });
    }
  },
  addEdit() {
    let self = this;
    if (!self.$refs['tab1'].validate()){
      return;
    }
    else {
      let model = self.mapFormToDatabaseFormat(self.form1.categoryName.fieldValue, true);
      fb.categoryRef
        .child(self.userId)
        .child(self.form1.selectedId)
        .update(model)
        .then(()=>{
          self.cleanForm()
          self.getCategoryListFromDatabase()
        });
    }
  },
  del() {
    let self = this;
    let confirm = window.confirm("Are you sure you want to delete this category?")
    if(confirm){
      let cat = self.categoryList.find(category => category.id === self.form2.selectedId)
      let model = self.mapFormToDatabaseFormat(cat.categoryName, false);
      fb.categoryRef
        .child(self.userId)
        .child(cat.id)
        .update(model)
        .then(()=>{
          self.cleanForm()
          self.getCategoryListFromDatabase()
        });
    }
  },
  customizeRule(v) {
    let cat;
    for(cat of this.categoryList){
      if(cat.categoryName === v) {
        return 'Category Name already exist!'
      }
    }
    return true
  },
  cleanForm() {
    let self = this;
    self.form0.categoryName.fieldValue = ''
    self.form1.categoryName.fieldValue = ''
  },
  mapFormToDatabaseFormat(val1, val2) {
    return {
      categoryName : val1,
      isVisible : val2,
    }
  },
  getCategoryListFromDatabase() {
    let self = this
    self.categoryList = []
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
  }
};

const mounted = function() {
  this.getCategoryListFromDatabase();
};

const watch = {};

export default {
  name: "CustomizeCategory",
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