import { Config, defaultConfig } from "./Config";
// @ts-ignore
import Cookies from "js-cookie";

export class ConfigService {
    static config: Config = defaultConfig;

    static setDefaultConfig(): void {
        this.config = defaultConfig;
    }

    static async setSavedConfig(): Promise<void> {
        this.config = await this.loadConfig();
    }

    static async loadConfig(): Promise<Config> {
        const config = Cookies.get('config');
        if (config) {
            return JSON.parse(config);
        }
        else {
            return defaultConfig;
        }
    }

    static async saveConfig(config: Config): Promise<void> {
        Cookies.set('config', JSON.stringify(config));
    }

    static cardButtonStyles: { [key: string]: string } = {
        "Blue": "btn-primary",
        "Gray": "btn-secondary",
        "Green": "btn-success",
        "Red": "btn-danger",
        "Yellow": "btn-warning",
        "LightBlue": "btn-info",
        "White": "btn-light",
        "Black": "btn-dark",
        "Outline Blue": "btn-outline-primary",
        "Outline Gray": "btn-outline-secondary",
        "Outline Green": "btn-outline-success",
        "Outline Red": "btn-outline-danger",
        "Outline Yellow": "btn-outline-warning",
        "Outline LightBlue": "btn-outline-info",
        "Outline White": "btn-outline-light",
        "Outline Black": "btn-outline-dark"
    };

    static setDefaultCardButtonStyle(style: string): void {
        this.config.cardStyle.button.default = this.cardButtonStyles[style];
    }
    static setCompletedCardButtonStyle(style: string): void {
        this.config.cardStyle.button.completed = this.cardButtonStyles[style];
    }
    static setExpiredCardButtonStyle(style: string): void {
        this.config.cardStyle.button.expired = this.cardButtonStyles[style];
    }


    static cardBodyStyles: { [key: string]: string } = {
        "White": "text-body-white",
        "Black": "text-body-black",
        "Primary": "text-body-primary",
        "Secondary": "text-body-secondary",
        "Success": "text-body-success",
        "Danger": "text-body-danger",
        "Warning": "text-body-warning",
        "Info": "text-body-info",
        "Light": "text-body-light",
        "Dark": "text-body-dark"
    };

    static setDefaultCardBodyStyle(style: string): void {
        this.config.cardStyle.cardBody.default = this.cardBodyStyles[style];
    }
    static setCompletedCardBodyStyle(style: string): void {
        this.config.cardStyle.cardBody.completed = this.cardBodyStyles[style];
    }
    static setExpiredCardBodyStyle(style: string): void {
        this.config.cardStyle.cardBody.expired = this.cardBodyStyles[style];
    }
}