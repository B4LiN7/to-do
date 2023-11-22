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

export interface TodoWithId extends Todo {
    id: string;
    todo: Todo;
}