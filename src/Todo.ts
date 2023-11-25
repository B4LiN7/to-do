export interface Todo {
    title: string;
    description: string;
    priority: number;
    deadline: Date;
    isCompleted: boolean;
    isDeleted: boolean;
    addDate: Date;
    editDate: Date;
}

export interface IdTodo {
    id: string;
    todo: Todo;
}