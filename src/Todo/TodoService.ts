import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc, Timestamp } from "firebase/firestore";
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

export class TodoService {

    static getDeadlineDate(todo: Todo): Date {
        return this.convertTimestampToDate(todo.deadline);
    }

    static isDeadlineExpired(todo: Todo): boolean {
        const deadlineDate = this.convertTimestampToDate(todo.deadline);
        const now = new Date();
        return deadlineDate < now;
    }

    static convertDateToTimestamp(date: Date): Timestamp {
        const jsDate = date;
        const firebaseTimestamp = Timestamp.fromDate(jsDate);
        return firebaseTimestamp;
    }

    static convertTimestampToDate(timestamp: Timestamp): Date {
        const firebaseTimestamp = timestamp;
        const jsDate = firebaseTimestamp.toDate();
        return jsDate;
    }

    static async dropDatabase(): Promise<boolean> {
        const todos = await this.getIdTodoList();
        for (const todo of todos) {
            await this.deleteTodo(todo.id);
        }
        return true;
    }

    static async undeleteAllTodos(): Promise<boolean> {
        const todos = await this.getIdTodoList();
        for (const todo of todos) {
            if (todo.todo.isDeleted) {
                todo.todo.isDeleted = false;
                await this.editTodo(todo.id, todo.todo);
            }
        }
        return true;
    }

    static async deleteAllTodos(): Promise<boolean> {
        const todos = await this.getIdTodoList();
        for (const todo of todos) {
            if (!todo.todo.isDeleted) {
                todo.todo.isDeleted = true;
                await this.editTodo(todo.id, todo.todo);
            }
        }
        return true;
    }

    static async getIdTodoList(): Promise<IdTodo[]> {
        const todos: IdTodo[] = [];

        try {
            const snapshot = await getDocs(colRef); // wait for the promise to resolve
            snapshot.forEach((doc) => {
            todos.push({ id: doc.id, todo: doc.data() } as IdTodo);
            });
            // Convert a Firebase timestamp to a JavaScript date

        } catch (error) {
            throw error; // throw the error
        }

        return todos; // return the todos array
    }

    /**
     * Létrehoz egy új Todo-t.
     * @param newTodo Az új Todo.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a létrehozás.
     */
    static async addTodo(newTodo: Todo): Promise<boolean> {
        return addDoc(colRef, newTodo)
            .then(() => true) // Add successful
            .catch((error) => {
            console.error("Error adding todo:", error);
            return false; // Add failed
            });
    }

    static async deleteTodo(id: string): Promise<boolean> {
        try {
            const docRef = doc(db, "todos", id);
            await deleteDoc(docRef);
            return true; // Delete successful
        } catch (error) {
            console.error("Error deleting todo:", error);
            return false; // Delete failed
        }
    }
    
    static async editTodo(id: string, updatedTodo: Todo): Promise<boolean> {
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