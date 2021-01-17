<template>
  <v-container>
    <v-card
      class="mx-auto mt-12 card-login"
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
            Login
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