<template>
<v-container>
    <v-card
      class="mx-auto mt-12 card-login"
      max-width="344"
    >
      <v-card-text>
        <h2 class="mb-4">Register</h2>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="form.name"
            label="Name"
            required
                        prepend-inner-icon="mdi-account-circle-outline"
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            label="E-mail"
            required 
            prepend-inner-icon="mdi-email-outline"
          ></v-text-field>

          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            required
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>

          <v-btn
            color="#48AAAD"
            class="mr-4 login-success"
            @click="validate"
          >
            Register
          </v-btn>

          <v-btn
            color="#59788E"
            class="mr-4 login-reset"
            @click="reset"
          >
            Reset
          </v-btn>

          <v-alert
            class="mt-4"
            dense
            outlined
            type="error"
            v-if="error"
            icon="mdi-alert-circle-outline"
          >
            {{error}}
          </v-alert>
        </v-form>
      </v-card-text>       
    </v-card>
  </v-container>
</template>


<script>
import firebase from "firebase";
const fb = require('../services/firebase.service')

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      error: null,
      defaultAccountList:[
        { accountName:'Cash', isVisible: true},
        { accountName:'Bank', isVisible: true},
        { accountName:'Card', isVisible: true},
        { accountName:'Savings', isVisible: true},
        { accountName:'Loan', isVisible: true},
      ],
      defaultCategoryList:[
        { categoryName:'Food', isVisible: true},
        { categoryName:'Entertainment', isVisible: true},
        { categoryName:'Housing', isVisible: true},
        { categoryName:'Transportation', isVisible: true},
        { categoryName:'Savings', isVisible: true},
      ],
    };
  },
  methods: {
    submit() {
      fb.auth
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          console.log(data)
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(() => {
              this.createAccountList(data.user.uid);
              this.createCategoryList(data.user.uid);
              this.$router.push({ name: "login" });
            })
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    async createAccountList(uid) {
      for (const acc of this.defaultAccountList) {
        await fb.accountRef
                .child(uid)
                .push()
                .set(acc)
      }
    },
    async createCategoryList(uid) {
      for(const cat of this.defaultCategoryList) {
        await fb.categoryRef
                .child(uid)
                .push()
                .set(cat)
      }
    },
    validate () {
      if(this.$refs.form.validate())
        this.submit()
      else
        return
    },
    reset () {
      this.$refs.form.reset()
    },
  }
};
</script>