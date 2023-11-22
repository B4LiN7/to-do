import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyD9Hc0pHKG19t8rCFwfggY45qaDLGGpqTY",
  authDomain: "to-do-9780c.firebaseapp.com",
  databaseURL: "https://to-do-9780c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-9780c",
  storageBucket: "to-do-9780c.appspot.com",
  messagingSenderId: "62879893913",
  appId: "1:62879893913:web:cfdae36b3ce56ad7982b08"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);


