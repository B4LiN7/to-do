import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import * as bootstrap from "bootstrap/dist/js/bootstrap.min.js";

import { FirebaseService } from "./firebaseService";
import { Todo,IdTodo } from "./Todo";


function makeToast(message: string, title: string): void {
  const toastDiv = document.getElementById("toastDiv") as HTMLDivElement;
  const toastTitle = document.getElementById("toastTitle") as HTMLDivElement;
  const toastMessage = document.getElementById("toastMessage") as HTMLDivElement;ű

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  const toast = bootstrap.Toast.getOrCreateInstance(toastDiv);
  toast.show();

  /*
  const toastTrigger = document.getElementById('liveToastBtn')
  const toastLiveExample = document.getElementById('liveToast')
  
  if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }
  */
}

function drawTodos(todos: IdTodo[]): void {
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
      changeCompletedStatus.textContent = "Set to not completed";
    } else {
      changeCompletedStatus.textContent = "Set to completed";
    }
    changeCompletedStatus.addEventListener("click", async () => {
      await FirebaseService.editTodoById(
        idTodo.id, 
        {
          isCompleted: !todo.isCompleted
        } as Todo
        );
      drawTodos(await FirebaseService.getIdTodoList());
    });
    buttonGroup.appendChild(changeCompletedStatus);

    // Create dropdown button for other buttons
    const dropdownButton = document.createElement("button");
    dropdownButton.classList.add("btn", "btn-primary", "dropdown-toggle");
    dropdownButton.setAttribute("type", "button");
    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownButton.textContent = "Other actions";
    buttonGroup.appendChild(dropdownButton);

    // Create dropdown menu
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu");

    const editButton = document.createElement("button");
    editButton.classList.add("dropdown-item");
    editButton.textContent = "Edit";
    const editListItem = document.createElement("li");
    editListItem.appendChild(editButton);
    dropdownMenu.appendChild(editListItem);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("dropdown-item");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await FirebaseService.deleteTodoById(idTodo.id);
      drawTodos(await FirebaseService.getIdTodoList());
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
}

document.addEventListener("DOMContentLoaded", async () => {
  drawTodos(await FirebaseService.getIdTodoList());
  makeToast("Hello world!", "Welcome");
});