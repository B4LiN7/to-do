import { Timestamp } from "firebase/firestore";

/**
 * Todo adati a Firebase-ben.
 */
export interface TodoDTO {
     /**
     * A Todo neve/címe.
     */
    title: string;
    /**
     * A Todo leírása.
     */
    description: string;
    /**
     * A Todo prioritása. 1-3 közötti szám.
     */
    priority: number;
    /**
     * A Todo határideje.
     */
    deadline: Timestamp;
    /**
     * A Todo státusza. Igaz, ha kész.
     */
    isCompleted: boolean;
    /**
     * A Todo státusza. Igaz, ha törölve van.
     */
    isDeleted: boolean;
    /**
     * A Todo hozzáadásának dátuma.
     */
    addDate: Timestamp;
    /**
     * A Todo utolsó módosításának dátuma.
     */
    editDate: Timestamp;
}