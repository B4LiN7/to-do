export interface Configuration {
  editMode: {
    isOn: boolean;
    id: string;
  };
  toast: {
    animation: boolean;
    delay: number;
  };
  cardStyle: {
    cardBody: {
      default: string;
      completed: string;
      expired: string;
    };
    button: {
      default: string;
      completed: string;
      expired: string;
    };
  };
}

export const defaultConfiguration = {
    editMode: {
        isOn: false,
        id: ""
    },
    toast: {
        animation: true,
        delay: 2000
    },
    cardStyle: {
        cardBody: {
            default: "text-bg-light",
            completed: "text-bg-primary",
            expired: "text-bg-warning"
        },
        button: {
            default: "btn-primary",
            completed: "btn-secondary",
            expired: "btn-secondary"
        }
    }
} as Configuration;