import { Configuration, defaultConfiguration } from "./Configuration";
// @ts-ignore
import Cookies from "js-cookie";

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
    static async loadConfig(): Promise<void> {
        const cookie = await this.loadCookie();
        if (cookie) {
            this.config = cookie;
        } 
        else {        
            this.setDefaultConfig();
            await this.saveConfig();
        }
    }

    /**
     * Konfiguráció mentése.
     */
    static async saveConfig(): Promise<void> {
        await this.saveCookie(this.config);
    }

    /**
     * Sütiből betöltött konfiguráció.
     * @returns Konfiguráció.
     */
    static async loadCookie(): Promise<Configuration | null> {
        const config = Cookies.get('config');
        if (config) {
            return JSON.parse(config);
        }
        else {
            return null;
        }
    }

    /**
     * Sütibe mentés.
     * @param config Konfiguráció.
     */
    static async saveCookie(config: Configuration): Promise<void> {
        Cookies.set('config', JSON.stringify(config));
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