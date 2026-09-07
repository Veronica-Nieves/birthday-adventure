/* =========================================
   UNA PEQUEÑA AVENTURA
   Motor base del juego
   ========================================= */


/* =========================================
   ELEMENTOS DE LA INTERFAZ
   ========================================= */

const screens = {
    title: document.getElementById("title-screen"),
    wake: document.getElementById("wake-screen"),
    name: document.getElementById("name-screen"),
    room: document.getElementById("room-screen"),
    outside: document.getElementById("outside-screen")
};

const startButton = document.getElementById("start-button");

const wakeMessage = document.getElementById("wake-message");
const wakeButton = document.getElementById("wake-button");

const nameForm = document.getElementById("name-form");
const playerNameInput = document.getElementById("player-name-input");

const roomObject = document.getElementById("room-object");
const roomExit = document.getElementById("room-exit");

const roomDialog = document.getElementById("room-dialog");
const roomDialogName = document.getElementById("room-dialog-name");
const roomDialogText = document.getElementById("room-dialog-text");
const roomDialogNext = document.getElementById("room-dialog-next");

const fadeLayer = document.getElementById("fade-layer");


/* =========================================
   ESTADO DEL JUEGO
   ========================================= */

const defaultGameState = {
    started: false,
    playerName: "",
    currentScene: "title",
    roomObjectFound: false,
    roomVisited: false
};

let gameState = loadGameState();

let wakeStep = 0;
let roomDialogStep = 0;


/* =========================================
   GUARDADO
   ========================================= */

function loadGameState() {
    const savedState = localStorage.getItem("birthdayAdventureState");

    if (!savedState) {
        return { ...defaultGameState };
    }

    try {
        const parsedState = JSON.parse(savedState);

        return {
            ...defaultGameState,
            ...parsedState
        };
    } catch (error) {
        console.error("No se pudo cargar la partida.", error);

        return { ...defaultGameState };
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
    Object.values(screens).forEach((screen) => {
        screen.classList.remove("active");
    });

    const nextScreen = screens[screenName];

    if (!nextScreen) {
        console.error(`Pantalla no encontrada: ${screenName}`);
        return;
    }

    nextScreen.classList.add("active");

    gameState.currentScene = screenName;
    saveGameState();
}


function transitionTo(screenName, callback = null) {
    fadeLayer.classList.add("visible");

    setTimeout(() => {
        showScreen(screenName);

        if (callback) {
            callback();
        }

        setTimeout(() => {
            fadeLayer.classList.remove("visible");
        }, 120);
    }, 650);
}


/* =========================================
   INICIO
   ========================================= */

startButton.addEventListener("click", () => {
    gameState.started = true;
    saveGameState();

    wakeStep = 0;

    transitionTo("wake", () => {
        showWakeMessage();
    });
});


/* =========================================
   DESPERTAR
   ========================================= */

const wakeMessages = [
    "...",
    "Algo se siente diferente.",
    "Parece que alguien dejó algo para ti.",
    "Tal vez deberías averiguar qué está pasando."
];


function showWakeMessage() {
    wakeMessage.textContent = wakeMessages[wakeStep];
}


wakeButton.addEventListener("click", () => {
    wakeStep += 1;

    if (wakeStep < wakeMessages.length) {
        showWakeMessage();
        return;
    }

    transitionTo("name", () => {
        playerNameInput.focus();
    });
});


/* =========================================
   NOMBRE DEL JUGADOR
   ========================================= */

nameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const playerName = playerNameInput.value.trim();

    if (!playerName) {
        return;
    }

    gameState.playerName = playerName;
    gameState.roomVisited = true;

    saveGameState();

    transitionTo("room", () => {
        startRoom();
    });
});


/* =========================================
   HABITACIÓN
   ========================================= */

function startRoom() {
    hideRoomDialog();

    if (gameState.roomObjectFound) {
        roomObject.style.display = "none";
    } else {
        roomObject.style.display = "flex";
    }
}


/* =========================================
   OBJETO MISTERIOSO
   ========================================= */

const roomObjectDialog = [
    {
        name: "...",
        text: "Hay algo aquí."
    },
    {
        name: "...",
        text: "No parece pertenecer a esta habitación."
    },
    {
        name: "...",
        text: "Tiene una marca extraña."
    },
    {
        name: "...",
        text: "Quizá deberías guardarlo por ahora."
    }
];


roomObject.addEventListener("click", () => {
    roomDialogStep = 0;

    showRoomDialog(
        roomObjectDialog[roomDialogStep]
    );
});


roomDialogNext.addEventListener("click", () => {
    roomDialogStep += 1;

    if (roomDialogStep < roomObjectDialog.length) {
        showRoomDialog(
            roomObjectDialog[roomDialogStep]
        );

        return;
    }

    gameState.roomObjectFound = true;
    saveGameState();

    hideRoomDialog();

    roomObject.style.display = "none";
});


function showRoomDialog(dialog) {
    roomDialogName.textContent = dialog.name;
    roomDialogText.textContent = dialog.text;

    roomDialog.classList.remove("hidden");
}


function hideRoomDialog() {
    roomDialog.classList.add("hidden");
}


/* =========================================
   SALIDA DE LA HABITACIÓN
   ========================================= */

roomExit.addEventListener("click", () => {
    if (!gameState.roomObjectFound) {
        roomDialogStep = 0;

        showRoomDialog({
            name: "...",
            text: "Espera. Parece que hay algo en la habitación."
        });

        return;
    }

    transitionTo("outside");
});


/* =========================================
   RECUPERAR PARTIDA
   ========================================= */

function restoreGame() {
    /*
    Por ahora siempre mostramos la portada al abrir
    nuevamente la página.

    Más adelante añadiremos:
    CONTINUAR AVENTURA
    NUEVA PARTIDA
    */

    showScreen("title");

    if (gameState.playerName) {
        playerNameInput.value = gameState.playerName;
    }
}


restoreGame();
