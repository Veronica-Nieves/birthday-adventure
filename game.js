/* =========================================
   UNA PEQUEÑA AVENTURA
   Motor principal
   ========================================= */


/* =========================================
   ELEMENTOS DE LA INTERFAZ
   ========================================= */

const screens = {
    title: document.getElementById("title-screen"),
    wake: document.getElementById("wake-screen"),
    name: document.getElementById("name-screen"),
    room: document.getElementById("room-screen"),
    outside: document.getElementById("outside-screen"),
    treasure: document.getElementById("treasure-screen"),
    treasureMap: document.getElementById("treasure-map-screen")
};

const startButton =
    document.getElementById("start-button");

const wakeMessage =
    document.getElementById("wake-message");

const wakeButton =
    document.getElementById("wake-button");

const nameForm =
    document.getElementById("name-form");

const playerNameInput =
    document.getElementById("player-name-input");

const roomExit =
    document.getElementById("room-exit");

const roomDialog =
    document.getElementById("room-dialog");

const roomDialogName =
    document.getElementById("room-dialog-name");

const roomDialogText =
    document.getElementById("room-dialog-text");

const roomDialogNext =
    document.getElementById("room-dialog-next");

const villagePlayer =
    document.getElementById("village-player");

const villagePlayerSprite =
    document.getElementById("village-player-sprite");

const movementButtons =
    document.querySelectorAll(".move-button");

const actionControls =
    document.getElementById("action-controls");

const actionButton =
    document.getElementById("action-button");

const actionLabel =
    document.getElementById("action-label");

const villageDialog =
    document.getElementById("village-dialog");

const villageDialogName =
    document.getElementById("village-dialog-name");

const villageDialogText =
    document.getElementById("village-dialog-text");

const villageDialogClose =
    document.getElementById("village-dialog-close");

const villageNameSign =
    document.getElementById("village-name-sign");

const riverSign =
    document.getElementById("river-sign");

const speakerPost =
    document.getElementById("speaker-post");

const villageShop =
    document.getElementById("village-shop");

const treasureBack =
    document.getElementById("treasure-back");

const activateTreasureMap =
    document.getElementById("activate-treasure-map");

const closeTreasureMap =
    document.getElementById("close-treasure-map");

const fadeLayer =
    document.getElementById("fade-layer");


/* =========================================
   ESTADO DEL JUEGO
   ========================================= */

const defaultGameState = {
    started: false,

    playerName: "",

    currentScene: "title",

    roomIntroCompleted: false,

    playerX: 50,
    playerY: 91,

    playerDirection: "back",

    villageDiscovered: false,
    riverDiscovered: false,
    shopDiscovered: false,

    speakerExamined: false
};

let gameState =
    loadGameState();

let wakeStep = 0;
let roomStep = 0;

let activeDirection = null;
let movementTimer = null;

let currentInteraction = null;

let dialogOpen = false;

/*
Para izquierda y derecha alternamos:
idle / walk.

Para frente y espalda alternamos:
idle / walk-1 / idle / walk-2.
*/
let walkPhase = 0;


/* =========================================
   GUARDADO
   ========================================= */

function loadGameState() {
    const savedState =
        localStorage.getItem(
            "birthdayAdventureState"
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


function saveGameState() {
    localStorage.setItem(
        "birthdayAdventureState",
        JSON.stringify(gameState)
    );
}


/* =========================================
   CAMBIO DE PANTALLA
   ========================================= */

function showScreen(screenName) {
    Object.values(screens).forEach(
        (screen) => {
            if (screen) {
                screen.classList.remove(
                    "active"
                );
            }
        }
    );

    const nextScreen =
        screens[screenName];

    if (!nextScreen) {
        console.error(
            `Pantalla no encontrada: ${screenName}`
        );

        return;
    }

    nextScreen.classList.add(
        "active"
    );

    gameState.currentScene =
        screenName;

    saveGameState();
}


function transitionTo(
    screenName,
    callback = null
) {
    stopMovement();

    fadeLayer.classList.add(
        "visible"
    );

    window.setTimeout(() => {
        showScreen(screenName);

        if (callback) {
            callback();
        }

        window.setTimeout(() => {
            fadeLayer.classList.remove(
                "visible"
            );
        }, 120);
    }, 650);
}


/* =========================================
   PORTADA
   ========================================= */

startButton.addEventListener(
    "click",
    () => {
        gameState.started = true;

        saveGameState();

        wakeStep = 0;

        transitionTo(
            "wake",
            () => {
                showWakeMessage();
            }
        );
    }
);


/* =========================================
   INTRODUCCIÓN
   ========================================= */

const wakeMessages = [
    "...",
    "

   
