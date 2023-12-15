import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { ConfigurationService } from "./Configuration/ConfigurationService";
import { TodoService } from "./Todo/TodoService";

const confirmModal = new Modal(document.getElementById("modalConfirm") as HTMLDivElement);
const confirmMode = {
    isDelete: false,
    isRecover: false,
}

/**
 * Modal üzenet beállítása.
 * @param message Üzenet
 * @param title Cím
 */
export function setConfirmModal(message: string, title: string) {
    const modalConfirmTitle = document.getElementById("modalConfirmTitle") as HTMLDivElement;
    const modalConfirmMessage = document.getElementById("modalConfirmMessage") as HTMLDivElement;
    modalConfirmTitle.innerText = title;
    modalConfirmMessage.innerText = message;
}

/**
 * Betölti a lehetséges beállításokat a megfelelő helyre.
 */
export function loadOptions() {
    const selectDefaultCardStyle = document.getElementById("selectDefaultCardStyle") as HTMLSelectElement;
    const selectDefaultButtonStyle = document.getElementById("selectDefaultButtonStyle") as HTMLSelectElement;
    const selectCompletedCardStyle = document.getElementById("selectCompletedCardStyle") as HTMLSelectElement;
    const selectCompletedButtonStyle = document.getElementById("selectCompletedButtonStyle") as HTMLSelectElement;
    const selectExpiredCardStyle = document.getElementById("selectExpiredCardStyle") as HTMLSelectElement;
    const selectExpiredButtonStyle = document.getElementById("selectExpiredButtonStyle") as HTMLSelectElement;

    Object.entries(ConfigurationService.cardBodyStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectDefaultCardStyle.appendChild(option);
    });

    Object.entries(ConfigurationService.cardButtonStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectDefaultButtonStyle.appendChild(option);
    });

    Object.entries(ConfigurationService.cardBodyStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectCompletedCardStyle.appendChild(option);
    });

    Object.entries(ConfigurationService.cardButtonStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectCompletedButtonStyle.appendChild(option);
    });

    Object.entries(ConfigurationService.cardBodyStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectExpiredCardStyle.appendChild(option);
    });

    Object.entries(ConfigurationService.cardButtonStyles).forEach(([key, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = key;
        selectExpiredButtonStyle.appendChild(option);
    }); 
}

/**
 * Betölti a beállításokat a megfelelő helyre.
 */
export function loadSelecetedOptions() {
    const config = ConfigurationService.config;
    const selectDefaultCardStyle = document.getElementById("selectDefaultCardStyle") as HTMLSelectElement;
    const selectDefaultButtonStyle = document.getElementById("selectDefaultButtonStyle") as HTMLSelectElement;
    const selectCompletedCardStyle = document.getElementById("selectCompletedCardStyle") as HTMLSelectElement;
    const selectCompletedButtonStyle = document.getElementById("selectCompletedButtonStyle") as HTMLSelectElement;
    const selectExpiredCardStyle = document.getElementById("selectExpiredCardStyle") as HTMLSelectElement;
    const selectExpiredButtonStyle = document.getElementById("selectExpiredButtonStyle") as HTMLSelectElement;

    selectDefaultCardStyle.value = config.cardStyle.cardBody.default;
    selectDefaultButtonStyle.value = config.cardStyle.button.default;
    selectCompletedCardStyle.value = config.cardStyle.cardBody.completed;
    selectCompletedButtonStyle.value = config.cardStyle.button.completed;
    selectExpiredCardStyle.value = config.cardStyle.cardBody.expired;
    selectExpiredButtonStyle.value = config.cardStyle.button.expired;
}

/**
 * Az oldal betöltésekor lefutó kód.
 */
document.addEventListener("DOMContentLoaded", async () => {
    ConfigurationService.loadConfig();
    loadOptions();
    loadSelecetedOptions();

    document.getElementById("selectDefaultCardStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setDefaultCardBodyStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    });

    document.getElementById("selectDefaultButtonStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setDefaultCardButtonStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    });

    document.getElementById("selectCompletedCardStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setCompletedCardBodyStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    });

    document.getElementById("selectCompletedButtonStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setCompletedCardButtonStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    });

    document.getElementById("selectExpiredCardStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setExpiredCardBodyStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    });

    document.getElementById("selectExpiredButtonStyle")?.addEventListener("change", (event) => {
        ConfigurationService.setExpiredCardButtonStyleByValue((event.target as HTMLSelectElement).value);
        ConfigurationService.saveConfig();
    }); 


    document.getElementById("btnRecoverDeleted")?.addEventListener("click", () => {
        setConfirmModal("Biztos, hogy az összes törölt todo-t visszaállítod?", "Összes törölt todo visszaállítása");
        confirmMode.isRecover = true;
        confirmModal.show();
    });

    document.getElementById("btnDeleteDeleted")?.addEventListener("click", () => {
        setConfirmModal("Biztos, hogy az összes törölt todo-t véglegesen törölni szeretnéd?", "Összes törölt todo törlése");
        confirmMode.isDelete = true;
        confirmModal.show();
    });

    document.getElementById("btnChangeDarkMode")?.addEventListener("click", () => {
        ConfigurationService.changeDarkmode();
        ConfigurationService.saveConfig();
        if (ConfigurationService.config.darkMode) {
            document.querySelector('body')?.setAttribute('data-bs-theme', 'dark');
            (document.getElementById("btnChangeDarkMode") as HTMLButtonElement).innerText = "Világos mód";
        }
        else {
            document.querySelector('body')?.setAttribute('data-bs-theme', 'white');
            (document.getElementById("btnChangeDarkMode") as HTMLButtonElement).innerText = "Sötét mód";
        }
        loadSelecetedOptions();
    });

    document.getElementById("modalConfirmButton")?.addEventListener("click", () => {
        if (confirmMode.isRecover) {
            TodoService.undeleteAllTodos();
        } 
        else if (confirmMode.isDelete) {
            TodoService.dropAllDeletedTodos();
        }
        confirmModal.hide();
        confirmMode.isRecover = false;
        confirmMode.isDelete = false;
    });

    if (ConfigurationService.config.darkMode) {
        document.querySelector('body')?.setAttribute('data-bs-theme', 'dark');
        (document.getElementById("btnChangeDarkMode") as HTMLButtonElement).innerText = "Világos mód";
    }
    else {
        document.querySelector('body')?.setAttribute('data-bs-theme', 'white');
        (document.getElementById("btnChangeDarkMode") as HTMLButtonElement).innerText = "Sötét mód";
    }
});