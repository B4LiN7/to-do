import { Timestamp } from "firebase/firestore";

/**
 * Todo-k adatinak leirása.
 */
export interface Todo {
    /**
     * A teendő címe.
     */
    title: string;
    /**
     * A teendő leírása.
     */
    description: string;
    /**
     * A teendő prioritása. 1-3 közötti szám.
     */
    priority: number;
    /**
     * A teendő határideje.
     */
    deadline: Timestamp;
    /**
     * A teendő státusza. Igaz, ha kész.
     */
    isCompleted: boolean;
    /**
     * A teendő státusza. Igaz, ha törölt. Nem jelenik meg
     */
    isDeleted: boolean;
    /**
     * A teendő hozzáadásának dátuma.
     */
    addDate: Timestamp;
    /**
     * A teendő utolsó módosításának dátuma.
     */
    editDate: Timestamp;
}

export interface IdTodo {
    id: string;
    todo: Todo;
}