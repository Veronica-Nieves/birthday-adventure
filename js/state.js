/* =========================================
   ESTADO GLOBAL DEL JUEGO
   ESTADO: INFRAESTRUCTURA ESTABLE
   ========================================= */


const STORAGE_KEY =
    "birthdayAdventureState";


/* =========================================
   ESTADO INICIAL
   ========================================= */

const defaultGameState = {
    started: false,

    playerName: "",

    currentScene: "title",

    roomIntroCompleted: false,

    playerX: 50,
    playerY: 88,

    playerDirection: "back",

    villageDiscovered: false,
    riverDiscovered: false,
    shopDiscovered: false,

    speakerExamined: false
};


/* =========================================
   CARGAR ESTADO
   ========================================= */

function loadGameState() {
    const savedState =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!savedState) {
        return {
            ...defaultGameState
        };
    }

    try {
        const parsedState =
            JSON.parse(savedState);

        return {
            ...defaultGameState,
            ...parsedState
        };
    } catch (error) {
        console.error(
            "No se pudo cargar la partida.",
            error
        );

        return {
            ...defaultGameState
        };
    }
}


/* =========================================
   ESTADO ACTUAL
   ========================================= */

export const gameState =
    loadGameState();


/* =========================================
   GUARDAR ESTADO
   ========================================= */

export function saveGameState() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gameState)
    );
}
