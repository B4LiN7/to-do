import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { Todo, IdTodo } from "./Todo";

const firebaseConfig = {
  apiKey: "AIzaSyD9Hc0pHKG19t8rCFwfggY45qaDLGGpqTY",
  authDomain: "to-do-9780c.firebaseapp.com",
  databaseURL: "https://to-do-9780c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-9780c",
  storageBucket: "to-do-9780c.appspot.com",
  messagingSenderId: "62879893913",
  appId: "1:62879893913:web:cfdae36b3ce56ad7982b08",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "todos");

export class FirebaseService {

    static async getTodoList(): Promise<Todo[]> {
        const todos: Todo[] = [];

        try {
            const snapshot = await getDocs(colRef); // wait for the promise to resolve
            snapshot.forEach((doc) => {
            todos.push(doc.data() as Todo);
            });
        } catch (error) {
            throw error; // throw the error
        }

        return todos; // return the todos array
    }

    static async getIdTodoList(): Promise<IdTodo[]> {
        const todos: IdTodo[] = [];

        try {
            const snapshot = await getDocs(colRef); // wait for the promise to resolve
            snapshot.forEach((doc) => {
            todos.push({ id: doc.id, todo: doc.data() } as IdTodo);
            });
        } catch (error) {
            throw error; // throw the error
        }

        return todos; // return the todos array
    }

    static async addTodo(newTodo: Todo): Promise<boolean> {
        return addDoc(colRef, newTodo)
            .then(() => true) // Add successful
            .catch((error) => {
            console.error("Error adding todo:", error);
            return false; // Add failed
            });
    }

    static async deleteTodoById(id: string): Promise<boolean> {
        try {
            const docRef = doc(db, "todos", id);
            await deleteDoc(docRef);
            return true; // Delete successful
        } catch (error) {
            console.error("Error deleting todo:", error);
            return false; // Delete failed
        }
    }
    
    static async editTodoById(id: string, updatedTodo: Todo): Promise<boolean> {
        try {
            const docRef = doc(db, "todos", id);
            await updateDoc(docRef, updatedTodo);
            return true; // Update successful
        } catch (error) {
            console.error("Error updating todo:", error);
            return false; // Update failed
        }
    }
}

// https://www.youtube.com/watch?v=s1frrNxq4js