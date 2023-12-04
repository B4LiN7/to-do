import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc, Timestamp, getDoc } from "firebase/firestore";
import { Todo, IdTodo } from "./Todo";
import { TodoDTO } from "./TodoDTO";

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

/**
 * A Todo-k kezelésére szolgáló osztály/szolgáltatás.
 */
export class TodoService {
    /**
     * A prioritások nevei.
     */
    static priorityNames: { [key: number]: string } = {
        1: "Alacsony",
        2: "Közepes",
        3: "Magas",
    };

    /*
    ! Főbb metódusok.
    ! Ezeket használjuk a Todo-k kezeléséhez: lekérdezés, létrehozás, törlés, módosítás.
    */

    /**
     * Lekéri a Todo-k listáját.
     * @returns A IdTodo-k listája, amik tartalmazzák a Todo-kat és az azonosítóikat.
     */
    static async getIdTodoList(): Promise<IdTodo[]> {
        const todos: IdTodo[] = [];
        try {
            const snapshot = await getDocs(colRef);
            snapshot.forEach((doc) => {
                const id = doc.id;
                const todoDTO = doc.data() as TodoDTO;
                const todo = this.convertTodoDTOToTodo(todoDTO);
                todos.push({ id: id, todo: todo } as IdTodo);
            });
        } catch (error) {
            throw error;
        }
        return todos;
    }

    /**
     * Egy Todo lekérdezése az azonosítója alapján.
     * @param id A lekérdezett Todo azonosítója.
     * @returns A lekérdezett Todo.
     */
    static async getTodoById(id: string): Promise<Todo> {
        try {
            const docRef = doc(db, "todos", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const todoDTO = docSnap.data() as TodoDTO;
                const todo = this.convertTodoDTOToTodo(todoDTO);
                return todo;
            } else {
                throw new Error("Todo not found");
            }
        } catch (error) {
            throw error;
        }    
    }

    /**
     * Létrehoz egy új Todo-t.
     * @param newTodo Az új Todo.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a létrehozás.
     */
    static async addTodo(newTodo: Todo): Promise<boolean> {
        const newTodoDTO = this.convertTodoToTodoDTO(newTodo);
        return addDoc(colRef, newTodoDTO)
            .then(() => true)
            .catch((error) => {
                console.error("Error adding todo:", error);
                return false;
            });
    }

    /**
     * Egy todo törlése.
     * @param id A törlendő Todo azonosítója.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a törlés.
     */
    static async deleteTodo(id: string): Promise<boolean> {
        try {
            const docRef = doc(db, "todos", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error("Error deleting todo:", error);
            return false;
        }
    }
    
    /**
     * Egy Todo módosítása.
     * @param id A módosítandó Todo azonosítója.
     * @param updatedTodo A módosított Todo.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a módosítás.
     */
    static async editTodo(id: string, updatedTodo: Todo): Promise<boolean> {
        try {
            updatedTodo.editDate = new Date();
            const updatedTodoDTO = this.convertTodoToTodoDTO(updatedTodo);
            const docRef = doc(db, "todos", id);
            // @ts-ignore
            await updateDoc(docRef, updatedTodoDTO);
            return true;
        } catch (error) {
            console.error("Error updating todo:", error);
            return false;
        }
    }

    /*
    ! A konvertáló metódusokat a Todo és a TodoDTO közötti konverziókhoz használjuk.
    ! A konverziókra azért van szükség, mert a Firebase Firestore-ban nem tudunk Date típusú adatokat tárolni.
    ! Ezért a Todo-kat a TodoDTO-ként tároljuk, és a konverziókat a két típus között a TodoService végzi. Ebben segit a convertDateToTimestamp és a convertTimestampToDate metódus.
    */

    /**
     * A Todo-ból csinál TodoDTO-t.
     * @param todo Todo.
     * @returns TodoDTO.
     */
     static convertTodoToTodoDTO(todo: Todo): TodoDTO {
        const todoDTO = {
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            deadline: Timestamp.fromDate(todo.deadline),
            isCompleted: todo.isCompleted,
            isDeleted: todo.isDeleted,
            addDate: Timestamp.fromDate(todo.addDate),
            editDate: Timestamp.fromDate(todo.editDate),
        } as TodoDTO;
        return todoDTO;
    }

    /**
     * A TodoDTO-ból csinál Todo-t.
     * @param todoDTO TodoDTO.
     * @returns Todo.
     */
    static convertTodoDTOToTodo(todoDTO: TodoDTO): Todo {
        const todo = {
            title: todoDTO.title,
            description: todoDTO.description,
            priority: todoDTO.priority,
            deadline: todoDTO.deadline.toDate(),
            isCompleted: todoDTO.isCompleted,
            isDeleted: todoDTO.isDeleted,
            addDate: todoDTO.addDate.toDate(),
            editDate: todoDTO.editDate.toDate(),
        } as Todo;
        return todo;
    }

    /*
    ! Segédmetódusok.
    ! Ezeket a metódusokat néhény funkció egyszerűsítésére használjuk.
    */
   
    /**
     * Megnézi, hogy létezik-e a Todo az adatbázisban.
     * @param todo A Todo vagy az azonosítója.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy létezik-e a Todo.
     */
    static async isExist(todo: IdTodo | string): Promise<boolean> {
        if (typeof todo === "string") {
            try {
                await this.getTodoById(todo);
                return true;
            } catch (error) {
                return false;
            }
        }
        else if (typeof todo === "object") {
            try {
                await this.getTodoById(todo.id);
                return true;
            } catch (error) {
                return false;
            }
        }
        return false;
    }

    /**
     * Todo határidejének lejárati idejét ellenőrzi.
     * @param todo A Todo, aminek a határidejét ellenőrizzük.
     * @returns Ha a határidő lejárt, akkor igaz, egyébként hamis.
     */
    static isDeadlineExpired(todo: Todo): boolean {
        return todo.deadline < new Date();
    }

    /**
     * A poritás számát konvertálja a prioritás nevére.
     * @param priority A prioritás száma: 1-3 közötti szám.
     * @returns A proiritás neve: Alacsony, Közepes vagy Magas.
     */
    static getPriorityName(priority: number): string {
        return this.priorityNames[priority] || "Ismertelen";
    }

    

    /**
     * Határidő szerint sorba rendezi a Todo-k listáját.
     * @param todo Todo-k listája.
     * @returns Sorba rendezett Todo-k listája.
     */
    static orderByDeadline(todo: IdTodo[]): IdTodo[] {
        return todo.sort((a, b) => {    
            if (a.todo.deadline < b.todo.deadline) {
                return -1;
            }
            else if (a.todo.deadline > b.todo.deadline) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    /**
     * Állapot szerint sorba rendezi a Todo-k listáját.
     * @param todo Todo-k listája.
     * @returns Sorba rendezett Todo-k listája.
     */
    static orderByStatus(todo: IdTodo[]): IdTodo[] {
        return todo.sort((a, b) => {
            if (TodoService.isDeadlineExpired(a.todo) && !TodoService.isDeadlineExpired(b.todo)) {
                return 1;
            }
            else if (!TodoService.isDeadlineExpired(a.todo) && TodoService.isDeadlineExpired(b.todo)) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }

    /**
     * Prioritás szerint sorba rendezi a Todo-k listáját.
     * @param todo Todo-k listája.
     * @returns Sorba rendezett Todo-k listája.
     */
    static orderByPriority(todo: IdTodo[]): IdTodo[] {
        return todo.sort((a, b) => {
            if (a.todo.priority < b.todo.priority) {
                return 1;
            }
            else if (a.todo.priority > b.todo.priority) {
                return -1;
            }
            else {
                return 0;
        }
        });
    }
    
    /*
    ! Debug metódusok.
    ! Elsősorban kisérleti célokat szolgálnak.
    */

    /**
     * Véglegesen törli a todos tábla adatbázist összes elemét
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a törlés.
     */
    static async dropDatabase(): Promise<boolean> {
        try {
            const todos = await this.getIdTodoList();
            for (const todo of todos) {
                await this.deleteTodo(todo.id);
            }
            return true;
        }
        catch (error) {
            console.error("Error dropping database: ", error);
            return false;
        }
    }

    /**
     * Véglelgesen törli az összes törölt jelölt Todo-t.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a törlés.
     */
    static async dropAllDeletedTodos(): Promise<boolean> {
        try {
            const todos = await this.getIdTodoList();
            for (const todo of todos) {
                if (todo.todo.isDeleted) {
                    await this.deleteTodo(todo.id);
                }
            }
            return true;
        }
        catch (error) {
            console.error("Error dropping deleted todos: ", error);
            return false;
        }
    }

    /**
     * A törölt Todo-kat visszaállítja.
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a visszaállítás.
     */
    static async undeleteAllTodos(): Promise<boolean> {
        try {
            const todos = await this.getIdTodoList();
            for (const todo of todos) {
                if (todo.todo.isDeleted) {
                    todo.todo.isDeleted = false;
                    await this.editTodo(todo.id, todo.todo);
                }
            }
            return true;
        } 
        catch (error) {
            console.error("Error undeleting todo: ", error);
            return false;
        }
    }

    /**
     * Törli az összes Todo-t. (Nem végleges)
     * @returns Igaz/Hamis értékkel tér vissza, attól függően, hogy sikerült-e a törlés.
     */
    static async deleteAllTodos(): Promise<boolean> {
        try {
            const todos = await this.getIdTodoList();
            for (const todo of todos) {
                if (!todo.todo.isDeleted) {
                    todo.todo.isDeleted = true;
                    await this.editTodo(todo.id, todo.todo);
                }
            }
            return true;
        }
        catch (error) {
            console.error("Error deleting todo: ", error);
            return false;
        }
    }
}