import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { ConfigurationService } from "./Configuration/ConfigurationService";

function loadOptions() {
    const config = ConfigurationService.config;
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


    selectDefaultCardStyle.value = config.cardStyle.cardBody.default;
    selectDefaultButtonStyle.value = config.cardStyle.button.default;
    selectCompletedCardStyle.value = config.cardStyle.cardBody.completed;
    selectCompletedButtonStyle.value = config.cardStyle.button.completed;
    selectExpiredCardStyle.value = config.cardStyle.cardBody.expired;
    selectExpiredButtonStyle.value = config.cardStyle.button.expired;
}

document.addEventListener("DOMContentLoaded", async () => {
    await ConfigurationService.loadConfig();
    loadOptions();

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
});