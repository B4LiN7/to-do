import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";

import { TodoService } from "./Todo/TodoService";
import { Todo, IdTodo } from "./Todo/Todo";

const loadingSpinner = document.getElementById("loadingSpinner") as HTMLDivElement;
const modalTodo = new bootstrap.Modal(document.getElementById("modalTodo") as HTMLElement);

let edit = {
  isEdit: false,
  id: ""
};

function makeToast(message: string, title: string): void {
  const toastDiv = document.getElementById("toastDiv") as HTMLDivElement;
  const toastTitle = document.getElementById("toastTitle") as HTMLDivElement;
  const toastMessage = document.getElementById("toastMessage") as HTMLDivElement;

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  let options = {
    animation: true,
    delay: 2000
  };

  const toast = bootstrap.Toast.getOrCreateInstance(toastDiv, options);
  toast.show();
}

/**
 * A Todo-k listájának renderelése.
 * @param todos Todo-k listája. IdTodo-kat tartalmaz, hogy a gombokat megfelelően lehessen kezelni.
 */
function drawTodos(todos: IdTodo[]): void {
  loadingSpinner.style.visibility = "visible";

  const todoDiv = document.getElementById("todoDiv") as HTMLDivElement;
  todoDiv.innerHTML = "";

  todos.forEach((idTodo) => {
    const todo = idTodo.todo;

    if (todo.isDeleted) {
      return;
    }

    // Create card
    const card = document.createElement("div");
    card.classList.add("card");
    if (todo.isCompleted) {
      card.classList.add("text-bg-primary");
    }
    else if (TodoService.getDeadlineDate(todo) < new Date()) {
      card.classList.add("text-bg-warning");
    }

    // Create card header
    const cardHeader = document.createElement("h5");
    cardHeader.classList.add("card-header");
    cardHeader.textContent = todo.title;
    card.appendChild(cardHeader);

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Create card text for description
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = todo.description;
    cardBody.appendChild(cardText);

    // Create card text for priority and deadline
    const cardPriority = document.createElement("p");
    cardPriority.classList.add("card-text", "small");
    cardPriority.textContent = "⚠️Prioritás: " + getPriorityName(todo.priority) + " ⌛Határidő: " + 
      TodoService.getDeadlineDate(todo).toLocaleString();
    cardBody.appendChild(cardPriority);

    // Add cardBody for card
    card.appendChild(cardBody);

    // Create card footer
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "text-body-secondary", "text-end");

    // Create button group for actions
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    // Create button for changing completed status
    const changeCompletedStatus = document.createElement("button");
    changeCompletedStatus.classList.add("btn", "btn-primary");
    if (todo.isCompleted) {
      changeCompletedStatus.textContent = "Nem késznek jelölés";
    } else {
      changeCompletedStatus.textContent = "Késznek jelölés";
    }
    changeCompletedStatus.addEventListener("click", async () => {
      await TodoService.editTodo(
        idTodo.id, 
        {
          isCompleted: !todo.isCompleted
        } as Todo
        );
      drawTodos(await TodoService.getIdTodoList());
    });
    buttonGroup.appendChild(changeCompletedStatus);

    // Create dropdown button for other buttons
    const dropdownButton = document.createElement("button");
    dropdownButton.classList.add("btn", "btn-primary", "dropdown-toggle");
    dropdownButton.setAttribute("type", "button");
    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownButton.textContent = "Egyéb";
    buttonGroup.appendChild(dropdownButton);

    // Create dropdown menu
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");

    const editButton = document.createElement("button");
    editButton.classList.add("dropdown-item");
    editButton.textContent = "Módosítás";
    editButton.addEventListener("click", () => {
      edit.isEdit = true;
      edit.id = idTodo.id;
      modalTodo.show();
      const modalTodoTitle = document.getElementById("modalTodoTitle") as HTMLElement;
      modalTodoTitle.textContent = "Todo módosítása";
      (document.getElementById("inTodoTitle") as HTMLInputElement).value = todo.title;
      (document.getElementById("inTodoDescription") as HTMLInputElement).value = todo.description;
      (document.getElementById("inTodoPriority") as HTMLInputElement).value = todo.priority.toString();
      (document.getElementById("inTodoDeadline") as HTMLInputElement).value = TodoService.getDeadlineDate(todo).toLocaleString();
    });
    const editListItem = document.createElement("li");
    editListItem.appendChild(editButton);
    dropdownMenu.appendChild(editListItem);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("dropdown-item");
    deleteButton.textContent = "Törlés";
    deleteButton.addEventListener("click", async () => {
      await TodoService.editTodo(idTodo.id, {isDeleted: true} as Todo);
      drawTodos(await TodoService.getIdTodoList());
    });
    const deleteListItem = document.createElement("li");
    deleteListItem.appendChild(deleteButton);
    dropdownMenu.appendChild(deleteListItem);

    buttonGroup.appendChild(dropdownMenu);

    cardFooter.appendChild(buttonGroup);
    card.appendChild(cardFooter);

    const col = document.createElement("div");
    col.classList.add("col");

    col.appendChild(card);
    todoDiv.appendChild(col);
  });

  loadingSpinner.style.visibility = "hidden";
}

function getPriorityName(priority: number): string {
  switch (priority) {
    case 1:
      return "Alacsony";
    case 2:
      return "Közepes";
    case 3:
      return "Magas";
    default:
      return "Ismertelen";
  }
}

/**
 * Bemeneti mezők ellenőrzése. Igaz, ha minden mező megfelelő.
 */
function checkModalInputs(): boolean {
  const titleInput = (document.getElementById("inTodoTitle") as HTMLInputElement);
  const descriptionInput = (document.getElementById("inTodoDescription") as HTMLInputElement);
  const priorityInput = (document.getElementById("inTodoPriority") as HTMLInputElement);
  const deadlineInput = (document.getElementById("inTodoDeadline") as HTMLInputElement);

  if (/^[a-zA-Z]$/.test(titleInput.value)) {
    return false;
  }
  if (/^[a-zA-Z]$/.test(descriptionInput.value)) {
    return false;
  }
  if (isNaN(parseInt(priorityInput.value)) || parseInt(priorityInput.value) < 1 || parseInt(priorityInput.value) > 3) {
    return false;
  }
  if (new Date(deadlineInput.value) < new Date()) {
    return false;
  }
  return true;
}

/**
 * Bemeneti mezők kiürítése.
 */
function clearModalInputs(): void {
  (document.getElementById("inTodoTitle") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDescription") as HTMLInputElement).value = "";
  (document.getElementById("inTodoPriority") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDeadline") as HTMLInputElement).value = "";
}

/**
 * Új Todo hozzáadása.
 */
async function addTodo(): Promise<void> {
  if (checkModalInputs()) {
    const title = (document.getElementById("inTodoTitle") as HTMLInputElement).value;
    const description = (document.getElementById("inTodoDescription") as HTMLInputElement).value;
    const priority = parseInt((document.getElementById("inTodoPriority") as HTMLInputElement).value);
    const deadline = TodoService.convertDateToTimestamp(new Date((document.getElementById("inTodoDeadline") as HTMLInputElement).value));

    clearModalInputs();

    const newTodo: Todo = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
      isCompleted: false,
      isDeleted: false,
      addDate: TodoService.convertDateToTimestamp(new Date()),
      editDate: TodoService.convertDateToTimestamp(new Date())
    };

    if (await TodoService.addTodo(newTodo)) {
      makeToast("Todo sikeresen hozzáadva!", "Siker");
    }
    await drawTodos(orderByDeadline(await TodoService.getIdTodoList()));
  }
  else {
    makeToast("Hibás adato(ka)t tartalmazó mező(k) vannak!", "Hiba");
    clearModalInputs();
  }
}

async function editTodo(): Promise<void> {
  if (checkModalInputs()) {
    const title = (document.getElementById("inTodoTitle") as HTMLInputElement).value;
    const description = (document.getElementById("inTodoDescription") as HTMLInputElement).value;
    const priority = parseInt((document.getElementById("inTodoPriority") as HTMLInputElement).value);
    const deadline = TodoService.convertDateToTimestamp(new Date((document.getElementById("inTodoDeadline") as HTMLInputElement).value));

    clearModalInputs();

    const newTodo: Todo = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
      isCompleted: false,
      isDeleted: false,
      addDate: TodoService.convertDateToTimestamp(new Date()),
      editDate: TodoService.convertDateToTimestamp(new Date())
    };

    if (await TodoService.editTodo(
      edit.id,
      newTodo
    )) {
      makeToast("Todo sikeresen módosítva!", "Siker");
    }
    await drawTodos(await TodoService.getIdTodoList());
  }
  else {
    makeToast("Hibás adato(ka)t tartalmazó mező(k) vannak!", "Hiba");
    clearModalInputs();
  }
}

function orderByDeadline(todo: IdTodo[]): IdTodo[] {
  return todo.sort((a, b) => {
    if (TodoService.isDeadlineExpired(a.todo) && !TodoService.isDeadlineExpired(b.todo)) {
      return 1;
    }
    else if (!TodoService.isDeadlineExpired(a.todo) && TodoService.isDeadlineExpired(b.todo)) {
      return -1;
    }
    return TodoService.getDeadlineDate(a.todo).getTime() - TodoService.getDeadlineDate(b.todo).getTime();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("formTodo")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (edit.isEdit) {
      editTodo();
      edit.isEdit = false;
    }
    else {
      addTodo();
    }
    modalTodo.hide();
  });

  document.getElementById("openModalTodoForAdd")?.addEventListener("click", () => {
    const modalTodoTitle = document.getElementById("modalTodoTitle") as HTMLElement;
    modalTodoTitle.textContent = "Új Todo hozzáadása";
    modalTodo.show();
  });

  drawTodos(orderByDeadline( await TodoService.getIdTodoList()));

});