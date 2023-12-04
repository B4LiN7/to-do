/**
 * Todo adati.
 */
export interface Todo {
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
    deadline: Date;
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
    addDate: Date;
    /**
     * A Todo utolsó módosításának dátuma.
     */
    editDate: Date;
}

/**
 * A Todo adatai a firebase-es azonosítóval.
 */
export interface IdTodo {
    /**
     * A Todo azonosítója.
     */
    id: string;
    /**
     * A Todo maga.
     */
    todo: Todo;
}