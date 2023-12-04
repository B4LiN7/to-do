import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { ConfigurationService } from "./Configuration/ConfigurationService";

document.addEventListener("DOMContentLoaded", async () => {
    await ConfigurationService.loadConfig();
    if (ConfigurationService.config.darkMode) {
        document.querySelector('body')?.setAttribute('data-bs-theme', 'dark');
    }
    else {
        document.querySelector('body')?.setAttribute('data-bs-theme', 'white');
    }
});