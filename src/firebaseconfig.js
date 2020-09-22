const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyC983802DATeK8IbXfHMxk_ihxlO5AbUOs",
  authDomain: "manager-appshop-c9fdb.firebaseapp.com",
  databaseURL: "https://manager-appshop-c9fdb.firebaseio.com",
  projectId: "manager-appshop-c9fdb",
  storageBucket: "manager-appshop-c9fdb.appspot.com",
  messagingSenderId: "71062288585",
  appId: "1:71062288585:web:f2a6c0594412a7de833518",
  measurementId: "G-QFP8J94GDV"
};
const firebaseC = firebase.initializeApp(firebaseConfig);
module.exports = firebase;
