import { Configuration, defaultConfiguration } from "./Configuration";

export class ConfigurationService {
    static config: Configuration;

    /**
     * Alapértelmezett konfiguráció beállítása.
     */
    static setDefaultConfig(): void {
        this.config = defaultConfiguration;
    }

    /**
     * Konfiguráció betöltése.
     */
    static loadConfig(): void {
        const lconfig = this.loadFromLocalStorage();
        if (lconfig) {
            this.config = lconfig;
        } 
        else {        
            this.setDefaultConfig();
            this.saveConfig();
        }
    }

    /**
     * Konfiguráció mentése.
     */
    static saveConfig(): void {
        this.saveToLocalStorage(this.config);
    }

    static saveToLocalStorage(config: Configuration) {
        const configJson = JSON.stringify(config);
        localStorage.setItem("config", configJson);
    }

    static loadFromLocalStorage(): Configuration {
        const configJson = localStorage.getItem("config") as string;
        return JSON.parse(configJson) as Configuration;
    }

    /**
     * Todo kártya stílusok.
     */
    static cardButtonStyles: { [key: string]: string } = {
        "Kék": "btn-primary",
        "Szürke": "btn-secondary",
        "Zöld": "btn-success",
        "Piros": "btn-danger",
        "Sárga": "btn-warning",
        "Világoskék": "btn-info",
        "Fehér": "btn-light",
        "Fekete": "btn-dark",
        "Kék körvonal": "btn-outline-primary",
        "Szürke körvonal": "btn-outline-secondary",
        "Zöld körvonal": "btn-outline-success",
        "Piros körvonal": "btn-outline-danger",
        "Sárga körvonal": "btn-outline-warning",
        "Világoskék körvonal": "btn-outline-info",
        "Fehér körvonal": "btn-outline-light",
        "Fekete körvonal": "btn-outline-dark"
    };

    /**
     * Alamértelmezett gomb stílus beállítása.
     * @param style Stílus értéke.
     */
    static setDefaultCardButtonStyleByValue(style: string): void {
        this.config.cardStyle.button.default = style;
    }
    /**
     * Befejezett gomb stílus beállítása.
     * @param style Stílus értéke.
     */
    static setCompletedCardButtonStyleByValue(style: string): void {
        this.config.cardStyle.button.completed = style;
    }
    /**
     * Lejárt gomb stílus beállítása.
     * @param style Stílus értéke.
     */
    static setExpiredCardButtonStyleByValue(style: string): void {
        this.config.cardStyle.button.expired = style;
    }


    /**
     * Todo gomb stílusok.
     */
    static cardBodyStyles: { [key: string]: string } = {
        "Kék": "text-bg-primary",
        "Szürke": "text-bg-secondary",
        "Zöld": "text-bg-success",
        "Piros": "text-bg-danger",
        "Sárga": "text-bg-warning",
        "Világoskék": "text-bg-info",
        "Fehér": "text-bg-light",
        "Fekete": "text-bg-dark"
    };

    /**
     * Alamértelmezett card body stílus beállítása.
     * @param style Stílus értéke.
     */
    static setDefaultCardBodyStyleByValue(style: string): void {
        this.config.cardStyle.cardBody.default = style;
    }
    /**
     * Befejezett card body stílus beállítása.
     * @param style Stílus értéke.
     */
    static setCompletedCardBodyStyleByValue(style: string): void {
        this.config.cardStyle.cardBody.completed = style;
    }
    /**
     * Lejeárt card body stílus beállítása.
     * @param style Stílus értéke.
     */
    static setExpiredCardBodyStyleByValue(style: string): void {
        this.config.cardStyle.cardBody.expired = style;
    }
}