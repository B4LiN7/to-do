import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Toast } from "bootstrap";
import { TodoService } from "./Todo/TodoService";
import { Todo, IdTodo } from "./Todo/Todo";
import { ConfigService } from "./Config/ConfigService";

// Globális változók
const loadingSpinner = document.getElementById("loadingSpinner") as HTMLDivElement;
const modalTodo = new Modal(document.getElementById("modalTodo") as HTMLElement);


// Konfigurációs objektumok
const config = ConfigService.config;

/**
 * Az oldal jobb alsó sarkában megjelenő értesítés.
 * @param message A toast értesités üzenete.
 * @param title A toast értesités címe.
 */
function makeToast(message: string, title: string): void {
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
function drawTodos(todos: IdTodo[]): void {
  loadingSpinner.style.visibility = "visible";

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
    // If todo is completed, add text-bg-primary class
    if (todo.isCompleted) {
      card.classList.add("text-bg-primary");
    }
    // If todo is expired, add text-bg-warning class
    else if (todo.deadline < new Date()) {
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
    cardPriority.textContent = "⚠️Prioritás: " + TodoService.getPriorityName(todo.priority) + " ⌛Határidő: " + todo.deadline.toLocaleString();
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

    // ! Ha a todo kész, akkor a gomb szürke lesz, egyébként kék.
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
      drawTodos(order(await TodoService.getIdTodoList()));
    });
    buttonGroup.appendChild(changeCompletedStatus);

    // Create dropdown button for other buttons
    const dropdownButton = document.createElement("button");
    dropdownButton.classList.add("btn", "dropdown-toggle");

    // ! Ha a todo kész, akkor a gomb szürke lesz, egyébként kék.
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
      const modalTodoTitle = document.getElementById("modalTodoTitle") as HTMLElement;
      modalTodoTitle.textContent = "Todo módosítása";
      (document.getElementById("inTodoTitle") as HTMLInputElement).value = todo.title;
      (document.getElementById("inTodoDescription") as HTMLInputElement).value = todo.description;
      (document.getElementById("inTodoPriority") as HTMLInputElement).value = todo.priority.toString();
      (document.getElementById("inTodoDeadline") as HTMLInputElement).value = todo.deadline.toLocaleString();
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
      drawTodos(order(await TodoService.getIdTodoList()));
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

  loadingSpinner.style.visibility = "hidden";
}

/**
 * Bemeneti mezők ellenőrzése.
 * @returns Egy tömböt ad vissza, amiben azok a hibák vannak, amiket a bemeneti mezők tartalmaznak.
 */
function checkModalInputs(): string[] {
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
function clearModalInputs(): void {
  (document.getElementById("inTodoTitle") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDescription") as HTMLInputElement).value = "";
  (document.getElementById("inTodoPriority") as HTMLInputElement).value = "";
  (document.getElementById("inTodoDeadline") as HTMLInputElement).value = "";
}

function order(todos: IdTodo[]): IdTodo[] {
  return TodoService.orderByStatus(TodoService.orderByPriority(TodoService.orderByDeadline(todos)));
}

/**
 * Új Todo hozzáadása.
 */
async function addTodo(): Promise<void> {
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
    await drawTodos(order(await TodoService.getIdTodoList()));
  }
  else {
    makeToast(`Hibás adato(ka)t tartalmazó mező(k) vannak! [Hibák: ${errorMessages}]`, "Hiba!");
  }
  clearModalInputs();
}

/**
 * Todo módosítása.
 */
async function editTodo(): Promise<void> {
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
    await drawTodos(order(await TodoService.getIdTodoList()));
  }
  else {
    makeToast("Hibás adato(ka)t tartalmazó mező(k) vannak!", "Hiba");
  }
  clearModalInputs();
}

document.addEventListener("DOMContentLoaded", async () => {
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
    const modalTodoTitle = document.getElementById("modalTodoTitle") as HTMLElement;
    modalTodoTitle.textContent = "Új Todo hozzáadása";
    modalTodo.show();
  });

  drawTodos(order( await TodoService.getIdTodoList()));
});