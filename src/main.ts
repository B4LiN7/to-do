import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { Todo, TodoWithId } from "./Todo";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9Hc0pHKG19t8rCFwfggY45qaDLGGpqTY",
  authDomain: "to-do-9780c.firebaseapp.com",
  databaseURL:
    "https://to-do-9780c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-9780c",
  storageBucket: "to-do-9780c.appspot.com",
  messagingSenderId: "62879893913",
  appId: "1:62879893913:web:cfdae36b3ce56ad7982b08",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "todos");

getDocs(colRef)
  .then((snapshot) => {
    let todos: TodoWithId[] = [];
    snapshot.forEach((doc) => {
      todos.push({ id: doc.id, todo: doc.data() } as TodoWithId);
    });
    console.log(todos);
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });

  