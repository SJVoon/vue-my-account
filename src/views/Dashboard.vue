<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Hi {{user}}</div>
          <div class="card-body">
              <button @click="signOut">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import STORE_CONSTANT from '../store/constant'

const computed = {
    user() {
      return this.$store.getters[`${STORE_CONSTANT.GETTERS.USER}`]
    }
}

const data = function(){
    return {}
}

const methods = {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "Login"
          });
        });
    }
}

export default {
  computed,
  data,
  methods
};
</script>