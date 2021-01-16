<template>
  <v-container>
      <v-row class="ma-4" justify="start">
        <v-col cols=2>
          <v-btn @click="openModal = true">Create Transaction</v-btn>
        </v-col>
        <v-col cols=2>
          <v-btn @click="openModalAccount = true">Customize Account</v-btn>
        </v-col>
        <v-col cols=2>
          <v-btn @click="openModalCategory = true">Customize Category</v-btn>
        </v-col>
      </v-row>
      <v-row class="ma-4">
        <v-col cols=10>
          <v-card>
            <v-card-title>
              Money In (RM)
              <v-spacer></v-spacer>
              Money Out (RM)
              <v-spacer></v-spacer>
              Balance (RM)
            </v-card-title>
            <v-card-title>
              {{transactionsTypeAmt.moneyIn}}
              <v-spacer/>
              {{transactionsTypeAmt.moneyOut}}
              <v-spacer/>
              {{transactionsTypeAmt.balance}}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols=10>
          <v-card>
            <v-card-title>
              Transaction History
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchKeyword"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <template>
              <v-data-table
                :headers="headers"
                :items="transactionsList"
                :search="searchKeyword"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </template>
          </v-card>
        </v-col>
      </v-row>
    <v-overlay :value="openModal">
      <CreateTransaction v-if="openModal" @close="closeModal" />
    </v-overlay>
    <v-overlay :value="openModalAccount">
      <CustomizeAccount v-if="openModalAccount" @close="closeModalAccount" />
    </v-overlay>
    <v-overlay :value="openModalCategory">
      <CustomizeCategory v-if="openModalCategory" @close="closeModalCategory" />
    </v-overlay>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import _ from "lodash";
import { CreateTransaction, CustomizeAccount, CustomizeCategory } from "../components/";
import firebase from "firebase";
import STORE_CONSTANT from "../store/constant";
import Constant from "../constant/constant";
const fb = require("../services/firebase.service");

const components = {
  CreateTransaction,
  CustomizeAccount,
  CustomizeCategory
};

const computed = {
  displayName() {
    console.log(this.$store.getters[`${STORE_CONSTANT.GETTERS.USER}`].data);
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
    openModalAccount: false,
    openModalCategory: false,
    overlay: false,
    searchKeyword: "",
    transactionsTypeAmt: {
      moneyIn: 0,
      moneyOut: 0,
      balance: 0,
    },
    headers: [
      {
        text: "Content",
        align: "start",
        sortable: false,
        value: "content",
      },
      { text: "Date", value: "date" },
      { text: "Type", value: "type" },
      { text: "Category", value: "category" },
      { text: "Amount(RM)", value: "amount" },
      { text: "Account", value: "account" },
    ],
    transactionsList: [],
    accountList: [],
    categoryList: [],
  };
};

const methods = {
  async closeModal(val) {
    this.openModal = false;
    if(val) await this.loadTransactions();
  },
  closeModalAccount() {
    this.openModalAccount = false;
  },
  closeModalCategory() {
    this.openModalCategory = false;
  },
  editItem (item) {
    console.log(item)
    // this.editedIndex = this.desserts.indexOf(item)
    // this.editedItem = Object.assign({}, item)
    // this.dialog = true
  },
  deleteItem (item) {
    console.log(item)
    // const index = this.desserts.indexOf(item)
    // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
  },
  computeTransactionTypeAmt(trans) {
    let self = this
    if (trans.type === Constant.TRANSACTION_TYPE_MONEY_IN) {
      self.transactionsTypeAmt.moneyIn += Number(trans.amount)
    }
    else if (trans.type === Constant.TRANSACTION_TYPE_MONEY_OUT) {
      self.transactionsTypeAmt.moneyOut += Number(trans.amount)
    }
    self.transactionsTypeAmt.balance = self.transactionsTypeAmt.moneyIn - self.transactionsTypeAmt.moneyOut
  },
  mapFirebaseDataToModel(trans){
    return {
      account: trans.type === Constant.TRANSACTION_TYPE_TRANSFER ? 
        this.checkAccountName(trans.accountFrom) + ' -> ' + this.checkAccountName(trans.accountTo) : 
        this.checkAccountName(trans.account), 
      amount: trans.amount,
      category: trans.type === Constant.TRANSACTION_TYPE_TRANSFER ? '-' : this.checkCategoryName(trans.category),
      content: trans.content,
      date: trans.date,
      type: trans.type
    }
  },
  checkAccountName(id) {
    for(const acc of this.accountList){
      if(acc.id === id){
        return acc.accountName;
      }
    }
  },
  checkCategoryName(id) {
    for(const cat of this.categoryList){
      if(cat.id === id){
        return cat.categoryName;
      }
    }
  },
  async loadTransactions() {
    let self = this;
    self.transactionsList = [];
    self.transactionsTypeAmt= {
      moneyIn: 0,
      moneyOut: 0,
      balance: 0,
    },
    self.overlay = true;
    await fb.transactionsRef.child(self.userId).once(
      "value",
      function(snapshot) {
        let transList = _.cloneDeep(snapshot.val());
        if(transList){
          Object.values(transList).forEach((trans) => {
            self.computeTransactionTypeAmt(trans);
            self.transactionsList.push(self.mapFirebaseDataToModel(trans));
          });
        }
        self.overlay = false;
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  },
  async getDataFromFirebase() {
    let self = this
    await fb.accountRef.child(self.userId).once(
      "value",
      function(snapshot) {
        let accList = _.cloneDeep(snapshot.val());
        Object.keys(accList).forEach((acc) => {
          let model = {
            id: acc,
            accountName: accList[acc].accountName,
            isVisible: accList[acc].isVisible
          }
          self.accountList.push(model)
        });
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
    await fb.categoryRef.child(self.userId).once(
      "value",
      function(snapshot) {
        let catList = _.cloneDeep(snapshot.val());
        Object.keys(catList).forEach((cat) => {
          let model = {
            id: cat,
            categoryName: catList[cat].categoryName,
            isVisible: catList[cat].isVisible
          }
          self.categoryList.push(model)
        });
        console.log(self.categoryList)
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  },
};

const mounted = async function() {
  await this.getDataFromFirebase();
  await this.loadTransactions();
};

const watch = {
};

export default {
  components,
  computed,
  data,
  methods,
  mounted,
  watch
};
</script>

<style scoped>
.no-flex-basis {
  flex-basis: unset;
}
</style>
