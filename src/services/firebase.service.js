import firebase from "firebase/app";
import 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6H62aF-rShCTm2VZt5kv9HuTRKLkubM8",
  authDomain: "vue-my-account.firebaseapp.com",
  databaseURL: "https://vue-my-account.firebaseio.com",
  projectId: "vue-my-account",
  storageBucket: "vue-my-account.appspot.com",
  messagingSenderId: "592086333071",
  appId: "1:592086333071:web:ba534251b68dc450f322fa",
  measurementId: "G-NZG4B2E62N"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

// firebase utils
const db = fire.database()
const auth = fire.auth()
const currentUser = auth.currentUser

const transactionsRef = db.ref('transactions')
const balanceRef = db.ref('balance')

export {
    db,
    auth,
    currentUser,
    transactionsRef,
    balanceRef
}