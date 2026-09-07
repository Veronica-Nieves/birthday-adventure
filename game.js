
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

const roomObject =
    document.getElementById("room-object");

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

const fadeLayer =
    document.getElementById("fade-layer");

const villagePlayer =
    document.getElementById("village-player");

const villagePlayerSprite =
    document.getElementById("village-player-sprite");

const movementButtons =
    document.querySelectorAll(".move-button");


/* =========================================
   ESTADO DEL JUEGO
   ========================================= */

const defaultGameState = {
    started: false,
    playerName: "",
    currentScene: "title",

    roomObjectFound: false,
    roomVisited: false,

    playerX: 50,
    playerY: 79,
    playerDirection: "front"
};

let gameState = loadGameState();

let wakeStep = 0;
let roomDialogStep = 0;


/* =========================================
   GUARDADO
   ========================================= */

function loadGameState() {
    const savedState =
        localStorage.getItem("birthdayAdventureState");

    if (!savedState) {
        return { ...defaultGameState };
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
        if (screen) {
            screen.classList.remove("active");
        }
    });

    const nextScreen =
        screens[screenName];

    if (!nextScreen) {
        console.error(
            `Pantalla no encontrada: ${screenName}`
        );

        return;
    }

    nextScreen.classList.add("active");

    gameState.currentScene = screenName;

    saveGameState();
}


function transitionTo(
    screenName,
    callback = null
) {
    fadeLayer.classList.add("visible");

    window.setTimeout(() => {
        showScreen(screenName);

        if (callback) {
            callback();
        }

        window.setTimeout(() => {
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
    wakeMessage.textContent =
        wakeMessages[wakeStep];
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

nameForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const playerName =
            playerNameInput.value.trim();

        if (!playerName) {
            return;
        }

        gameState.playerName = playerName;
        gameState.roomVisited = true;

        saveGameState();

        transitionTo("room", () => {
            startRoom();
        });
    }
);


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


roomDialogNext.addEventListener(
    "click",
    () => {
        roomDialogStep += 1;

        if (
            roomDialogStep <
            roomObjectDialog.length
        ) {
            showRoomDialog(
                roomObjectDialog[
                    roomDialogStep
                ]
            );

            return;
        }

        gameState.roomObjectFound = true;

        saveGameState();

        hideRoomDialog();

        roomObject.style.display = "none";
    }
);


function showRoomDialog(dialog) {
    roomDialogName.textContent =
        dialog.name;

    roomDialogText.textContent =
        dialog.text;

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

    transitionTo("outside", () => {
        renderVillagePlayer();
    });
});


/* =========================================
   SPRITES DE SERGIO
   ========================================= */

const playerSprites = {
    front: {
        idle:
            "assets/characters/sergio/front-idle.png",

        walk:
            "assets/characters/sergio/front-walk.png"
    },

    back: {
        idle:
            "assets/characters/sergio/back-idle.png",

        walk:
            "assets/characters/sergio/back-walk.png"
    },

    left: {
        idle:
            "assets/characters/sergio/left-idle.png",

        walk:
            "assets/characters/sergio/left-walk.png"
    },

    right: {
        idle:
            "assets/characters/sergio/right-idle.png",

        walk:
            "assets/characters/sergio/right-walk.png"
    }
};


/* =========================================
   MOVIMIENTO EN ALDEA DE SAPOPINGA
   ========================================= */

const playerMovement = {
    step: 1.1,

    minX: 5,
    maxX: 95,

    minY: 47,
    maxY: 92,

    repeatDelay: 85
};

let activeDirection = null;
let movementTimer = null;
let walkFrame = false;


/* =========================================
   DIBUJAR A SERGIO
   ========================================= */

function renderVillagePlayer() {
    villagePlayer.style.left =
        `${gameState.playerX}%`;

    villagePlayer.style.top =
        `${gameState.playerY}%`;

    setPlayerSprite("idle");
}


function setPlayerSprite(state) {
    const direction =
        gameState.playerDirection;

    const sprite =
        playerSprites[direction][state];

    villagePlayerSprite.src = sprite;
}


/* =========================================
   REALIZAR UN PASO
   ========================================= */

function moveVillagePlayer(direction) {
    let nextX = gameState.playerX;
    let nextY = gameState.playerY;

    if (direction === "up") {
        nextY -= playerMovement.step;
        gameState.playerDirection = "back";
    }

    if (direction === "down") {
        nextY += playerMovement.step;
        gameState.playerDirection = "front";
    }

    if (direction === "left") {
        nextX -= playerMovement.step;
        gameState.playerDirection = "left";
    }

    if (direction === "right") {
        nextX += playerMovement.step;
        gameState.playerDirection = "right";
    }

    nextX = Math.max(
        playerMovement.minX,
        Math.min(
            playerMovement.maxX,
            nextX
        )
    );

    nextY = Math.max(
        playerMovement.minY,
        Math.min(
            playerMovement.maxY,
            nextY
        )
    );

    gameState.playerX = nextX;
    gameState.playerY = nextY;

    walkFrame = !walkFrame;

    if (walkFrame) {
        setPlayerSprite("walk");
    } else {
        setPlayerSprite("idle");
    }

    villagePlayer.style.left =
        `${gameState.playerX}%`;

    villagePlayer.style.top =
        `${gameState.playerY}%`;

    saveGameState();
}


/* =========================================
   INICIAR MOVIMIENTO CONTINUO
   ========================================= */

function startMovement(direction) {
    stopMovement(false);

    activeDirection = direction;

    moveVillagePlayer(direction);

    movementTimer = window.setInterval(
        () => {
            if (!activeDirection) {
                return;
            }

            moveVillagePlayer(
                activeDirection
            );
        },
        playerMovement.repeatDelay
    );
}


/* =========================================
   DETENER MOVIMIENTO
   ========================================= */

function stopMovement(showIdle = true) {
    activeDirection = null;

    if (movementTimer !== null) {
        window.clearInterval(
            movementTimer
        );

        movementTimer = null;
    }

    walkFrame = false;

    if (
        showIdle &&
        villagePlayerSprite
    ) {
        setPlayerSprite("idle");
    }
}


/* =========================================
   CONTROLES TÁCTILES
   ========================================= */

movementButtons.forEach((button) => {
    button.addEventListener(
        "pointerdown",
        (event) => {
            event.preventDefault();

            const direction =
                button.dataset.direction;

            if (!direction) {
                return;
            }

            try {
                button.setPointerCapture(
                    event.pointerId
                );
            } catch (error) {
                /*
                Algunos navegadores pueden
                ignorar pointer capture.
                El movimiento sigue funcionando.
                */
            }

            startMovement(direction);
        }
    );

    button.addEventListener(
        "pointerup",
        (event) => {
            event.preventDefault();

            stopMovement();
        }
    );

    button.addEventListener(
        "pointercancel",
        () => {
            stopMovement();
        }
    );

    button.addEventListener(
        "lostpointercapture",
        () => {
            stopMovement();
        }
    );

    button.addEventListener(
        "contextmenu",
        (event) => {
            event.preventDefault();
        }
    );
});


/* =========================================
   CONTROLES DE TECLADO
   ========================================= */

const keyboardDirections = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
};


document.addEventListener(
    "keydown",
    (event) => {
        const direction =
            keyboardDirections[event.key];

        if (!direction) {
            return;
        }

        if (
            gameState.currentScene !==
            "outside"
        ) {
            return;
        }

        event.preventDefault();

        if (
            activeDirection === direction
        ) {
            return;
        }

        startMovement(direction);
    }
);


document.addEventListener(
    "keyup",
    (event) => {
        const direction =
            keyboardDirections[event.key];

        if (!direction) {
            return;
        }

        event.preventDefault();

        stopMovement();
    }
);


/* =========================================
   SEGURIDAD AL CAMBIAR DE PESTAÑA
   ========================================= */

window.addEventListener(
    "blur",
    () => {
        stopMovement();
    }
);

document.addEventListener(
    "visibilitychange",
    () => {
        if (document.hidden) {
            stopMovement();
        }
    }
);


/* =========================================
   RECUPERAR PARTIDA
   ========================================= */

function restoreGame() {
    /*
    Por ahora siempre mostramos la portada
    al abrir nuevamente la página.

    Más adelante añadiremos:

    CONTINUAR AVENTURA
    NUEVA PARTIDA
    */

    showScreen("title");

    if (gameState.playerName) {
        playerNameInput.value =
            gameState.playerName;
    }

    renderVillagePlayer();
}


/* =========================================
   INICIAR
   ========================================= */

restoreGame();
