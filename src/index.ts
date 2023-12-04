import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Toast } from "bootstrap";
import { Todo, IdTodo } from "./Todo/Todo";
import { TodoService } from "./Todo/TodoService";
import { ConfigurationService } from "./Configuration/ConfigurationService";

// Globális változók
const modalTodo = new Modal(document.getElementById("modalTodo") as HTMLElement);

/**
 * Az oldal jobb alsó sarkában megjelenő értesítés.
 * @param message A toast értesités üzenete.
 * @param title A toast értesités címe.
 */
export function makeToast(message: string, title: string): void {
  const config = ConfigurationService.config;

  const toastDiv = document.getElementById("toastDiv") as HTMLDivElement;
  const toastTitle = document.getElementById("toastTitle") as HTMLDivElement;
  const toastMessage = document.getElementById("toastMessage") as HTMLDivElement;

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  const toast = Toast.getOrCreateInstance(toastDiv, config.toast);
  toast.show();
}

/**
 * A Todo-k listájának renderelése.
 * @param todos Todo-k listája. IdTodo-kat tartalmaz, hogy a gombokat megfelelően lehessen kezelni.
 */
export function renderTodos(todos: IdTodo[]): void {
  const config = ConfigurationService.config;

  const todoDiv = document.getElementById("todoDiv") as HTMLDivElement;
  todoDiv.innerHTML = "";

  todos.forEach((idTodo) => {
    const todo = idTodo.todo;

    // Skip deleted todos
    if (todo.isDeleted) {
      return;
    }

    // Create card
    const card = document.createElement("div");
    card.classList.add("card", "h-100");
    if (todo.isCompleted) {
      card.classList.add(config.cardStyle.cardBody.completed);
    }
    else if (todo.deadline < new Date()) {
      card.classList.add(config.cardStyle.cardBody.expired);
    }
    else {
      card.classList.add(config.cardStyle.cardBody.default);
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
    cardPriority.textContent = "⚠️Prioritás: " + TodoService.getPriorityName(todo.priority) + " ⌛Határidő: " + todo.deadline.toLocaleString().slice(0, 19);
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
    changeCompletedStatus.classList.add("btn");
    if (todo.isCompleted) {
      changeCompletedStatus.classList.add(config.cardStyle.button.completed);
    }
    else if (todo.deadline < new Date()) {
      changeCompletedStatus.classList.add(config.cardStyle.button.expired);
    }
    else {
      changeCompletedStatus.classList.add(config.cardStyle.button.default);
    }

    if (todo.isCompleted) {
      changeCompletedStatus.textContent = "Nem késznek jelölés";
    } else {
      changeCompletedStatus.textContent = "Késznek jelölés";
    }
    changeCompletedStatus.addEventListener("click", async () => {
      await TodoService.editTodo(
        idTodo.id, 
        {
          ...todo,
          isCompleted: !todo.isCompleted
        } as Todo
      );
      drawTodos();
    });
    buttonGroup.appendChild(changeCompletedStatus);

    // Create dropdown button for other buttons
    const dropdownButton = document.createElement("button");
    dropdownButton.classList.add("btn", "dropdown-toggle");
    if (todo.isCompleted) {
      dropdownButton.classList.add(config.cardStyle.button.completed);
    }
    else if (todo.deadline < new Date()) {
      dropdownButton.classList.add(config.cardStyle.button.expired);
    }
    else {
      dropdownButton.classList.add(config.cardStyle.button.default);
    }

    dropdownButton.setAttribute("type", "button");
    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownButton.textContent = "Egyéb";
    buttonGroup.appendChild(dropdownButton);

    // Create dropdown menu
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");

    // Create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("dropdown-item");
    editButton.textContent = "Módosítás";
    editButton.addEventListener("click", () => {
      config.editMode.isOn = true;
      config.editMode.id = idTodo.id;
      modalTodo.show();
    });
    const editListItem = document.createElement("li");
    editListItem.appendChild(editButton);
    dropdownMenu.appendChild(editListItem);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("dropdown-item");
    deleteButton.textContent = "Törlés";
    deleteButton.addEventListener("click", async () => {
      await TodoService.editTodo(idTodo.id, {...todo, isDeleted: true} as Todo);
      drawTodos();
    });
    const deleteListItem = document.createElement("li");
    deleteListItem.appendChild(deleteButton);
    dropdownMenu.appendChild(deleteListItem);

    // Add dropdown menu for button group
    buttonGroup.appendChild(dropdownMenu);

    // Add button group for card footer
    cardFooter.appendChild(buttonGroup);
    card.appendChild(cardFooter);

    // Create column for card
    const col = document.createElement("div");
    col.classList.add("col");
    col.appendChild(card);

    // Add card for column
    todoDiv.appendChild(col);
  });
}

/**
 * Sorba rendezi a Todo-kat.
 * @param todos Todo-k listája.
 * @returns Sorba Rendezett Todo-k listája.
 */
export function order(todos: IdTodo[]): IdTodo[] {
  return TodoService.orderByCompleted(TodoService.orderByExpire(TodoService.orderByPriority(TodoService.orderByDeadline(todos))));
}

/**
 * Todo-k listájának frissítése: lekérdezi a Todo-kat, majd sorba rendezi őket, és végül kirendereli őket. Közben megjeleníti a loading spinnert.
 */
export async function drawTodos() {
  const loadingSpinner = document.getElementById("loadingSpinner") as HTMLDivElement;
  loadingSpinner.style.visibility = "visible";
  const todos = await TodoService.getIdTodoList();
  const ordered = order(todos);
  renderTodos(ordered);
  loadingSpinner.style.visibility = "hidden";
}

/**
 * Bemeneti mezők ellenőrzése.
 * @returns Egy tömböt ad vissza, amiben azok a hibák vannak, amiket a bemeneti mezők tartalmaznak.
 */
export function checkModalInputs(): string[] {
  const errorMessages: string[] = [];

  const titleInput = (document.getElementById("inTodoTitle") as HTMLInputElement);
  const descriptionInput = (document.getElementById("inTodoDescription") as HTMLInputElement);
  const priorityInput = (document.getElementById("inTodoPriority") as HTMLInputElement);
  const deadlineInput = (document.getElementById("inTodoDeadline") as HTMLInputElement);

  if (/^[a-zA-Z]$/.test(titleInput.value)) {
    errorMessages.push("A cím mező nem lehet üres!");
  }
  if (/^[a-zA-Z]$/.test(descriptionInput.value)) {
    errorMessages.push("A leírás mező nem lehet üres!");
  }
  if (isNaN(parseInt(priorityInput.value)) || parseInt(priorityInput.value) < 1 || parseInt(priorityInput.value) > 3) {
    errorMessages.push("A prioritás mező csak 1 és 3 közötti szám lehet!");
  }
  if (new Date(deadlineInput.value) < new Date()) {
    errorMessages.push("A határidő mező nem lehet a múltban!");
  }
  return errorMessages;
}

/**
 * Bemeneti mezők kiürítése.
 */
export function clearModalInputs(): void {
  (document.getElementById("inTodoTitle") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDescription") as HTMLInputElement).value = "";
  (document.getElementById("inTodoPriority") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDeadline") as HTMLInputElement).value = "";
}

/**
 * Új Todo hozzáadása.
 */
export async function addTodo(): Promise<void> {
  const errorMessages = checkModalInputs();
  if (errorMessages.length === 0) {
    const title = (document.getElementById("inTodoTitle") as HTMLInputElement).value;
    const description = (document.getElementById("inTodoDescription") as HTMLInputElement).value;
    const priority = parseInt((document.getElementById("inTodoPriority") as HTMLInputElement).value);
    const deadline = new Date((document.getElementById("inTodoDeadline") as HTMLInputElement).value);

    const newTodo: Todo = {
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
      isCompleted: false,
      isDeleted: false,
      addDate: new Date(),
      editDate: new Date()
    };

    if (await TodoService.addTodo(newTodo)) {
      makeToast("Todo sikeresen hozzáadva!", "Siker");
    }
    else {
      makeToast("Todo hozzáadása sikertelen!", "Hiba");
    }
    await drawTodos();
  }
  else {
    makeToast(`Hibás adato(ka)t tartalmazó mező(k) vannak! [Hibák: ${errorMessages}]`, "Hiba!");
  }
}

/**
 * Todo módosítása.
 */
export async function editTodo(): Promise<void> {
  const config = ConfigurationService.config;
  const errorMessages = checkModalInputs();
  if (errorMessages.length === 0) {
    const title = (document.getElementById("inTodoTitle") as HTMLInputElement).value;
    const description = (document.getElementById("inTodoDescription") as HTMLInputElement).value;
    const priority = parseInt((document.getElementById("inTodoPriority") as HTMLInputElement).value);
    const deadline = new Date((document.getElementById("inTodoDeadline") as HTMLInputElement).value);

    const currentTodo = await TodoService.getTodoById(config.editMode.id);

    const newTodo: Todo = {
      ...currentTodo,
      title: title,
      description: description,
      priority: priority,
      deadline: deadline,
    };

    if (await TodoService.editTodo(
      config.editMode.id,
      newTodo
    )) {
      makeToast("Todo sikeresen módosítva!", "Siker");
    }
    await drawTodos();
  }
  else {
    makeToast(`Hibás adato(ka)t tartalmazó mező(k) vannak! [Hibák: ${errorMessages}]`, "Hiba");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await ConfigurationService.loadConfig();
  const config = ConfigurationService.config;

  document.getElementById("formTodo")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (config.editMode.isOn) {
      editTodo();
      config.editMode.isOn = false;
    }
    else {
      addTodo();
    }
    modalTodo.hide();
  });

  document.getElementById("openModalTodoForAdd")?.addEventListener("click", () => {
    config.editMode.isOn = false;
    modalTodo.show();
  });

  document.getElementById("modalTodo")?.addEventListener("show.bs.modal", async () => {
    const modalTodoTitle = document.getElementById("modalTodoTitle") as HTMLElement;
    if (config.editMode.isOn) {
      modalTodoTitle.textContent = "Todo módosítása";
      
      if (! await TodoService.isExist(config.editMode.id)) {
        makeToast("A módosítani kívánt Todo nem létezik!", "Hiba");
        config.editMode.isOn = false;
        ConfigurationService.saveConfig();
        modalTodo.hide();
        return;
      }

      const todo = await TodoService.getTodoById(config.editMode.id);
      (document.getElementById("inTodoTitle") as HTMLInputElement).value = todo.title;
      (document.getElementById("inTodoDescription") as HTMLInputElement).value = todo.description;
      (document.getElementById("inTodoPriority") as HTMLInputElement).value = todo.priority.toString();
      (document.getElementById("inTodoDeadline") as HTMLInputElement).value = todo.deadline.toISOString().slice(0, 16);
    }
    else {
      modalTodoTitle.textContent = "Új Todo hozzáadása";
      clearModalInputs();
    }
  });

  await drawTodos()

  if (config.editMode.isOn) {
    modalTodo.show();
  }

});