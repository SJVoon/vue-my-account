<template>
  <v-container>
    <v-card
      class="mx-auto mt-12"
      max-width="344"
    >
      <v-card-text>
        <h2 class="mb-4">Login</h2>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="form.email"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-btn
            color="success"
            class="mr-4"
            @click="validate"
          >
            Login
          </v-btn>

          <v-btn
            color="error"
            class="mr-4"
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
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      fb.auth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          this.$router.replace({ name: "dashboard" });
        })
        .catch(err => {
          this.error = err.message;
        });
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