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

const treasureHouse =
    document.getElementById("treasure-house");

const closedHouse =
    document.getElementById("closed-house");

const villageShop =
    document.getElementById("village-shop");

const hintHouse =
    document.getElementById("hint-house");

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

    playerX: 50,
    playerY: 79,

    playerDirection: "front",

    villageDiscovered: false,
    riverDiscovered: false,
    shopDiscovered: false
};

let gameState = loadGameState();

let wakeStep = 0;

let activeDirection = null;
let movementTimer = null;

let currentInteraction = null;
let dialogOpen = false;

let animationStep = false;


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
   PANTALLAS
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

    nextScreen.classList.add("active");

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
   INICIO
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
   DESPERTAR
   ========================================= */

const wakeMessages = [
    "Algo se siente diferente.",
    "Parece que hoy no es un día normal.",
    "Algo está pasando afuera.",
    "Tal vez deberías averiguar qué está pasando."
];


function showWakeMessage() {
    wakeMessage.textContent =
        wakeMessages[wakeStep];
}


wakeButton.addEventListener(
    "click",
    () => {
        wakeStep += 1;

        if (
            wakeStep <
            wakeMessages.length
        ) {
            showWakeMessage();

            return;
        }

        transitionTo(
            "name",
            () => {
                playerNameInput.focus();
            }
        );
    }
);


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

        gameState.playerName =
            playerName;

        saveGameState();

        transitionTo("room");
    }
);


/* =========================================
   HABITACIÓN
   ========================================= */

roomExit.addEventListener(
    "click",
    () => {
        transitionTo(
            "outside",
            () => {
                initializeVillage();
            }
        );
    }
);


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
   CONFIGURACIÓN DE MOVIMIENTO
   ========================================= */

const playerMovement = {
    step: 1.15,

    minX: 5,
    maxX: 95,

    minY: 46,
    maxY: 93,

    repeatDelay: 110
};


/* =========================================
   COLISIONES
   Coordenadas en porcentaje del escenario
   ========================================= */

const collisionAreas = [
    {
        name: "river",
        left: 0,
        right: 100,
        top: 30,
        bottom: 46
    },

    {
        name: "closed-house",
        left: 5,
        right: 32,
        top: 47,
        bottom: 64
    },

    {
        name: "treasure-house",
        left: 68,
        right: 96,
        top: 45,
        bottom: 63
    },

    {
        name: "shop",
        left: 19,
        right: 48,
        top: 65,
        bottom: 82
    },

    {
        name: "hint-house",
        left: 56,
        right: 86,
        top: 64,
        bottom: 82
    }
];


/* =========================================
   ZONAS DE INTERACCIÓN
   ========================================= */

const interactionAreas = [
    {
        id: "village-sign",

        left: 3,
        right: 34,

        top: 71,
        bottom: 90,

        label: "LEER"
    },

    {
        id: "river-sign",

        left: 66,
        right: 98,

        top: 23,
        bottom: 47,

        label: "LEER"
    },

    {
        id: "treasure-house",

        left: 67,
        right: 97,

        top: 58,
        bottom: 70,

        label: "ENTRAR"
    },

    {
        id: "closed-house",

        left: 5,
        right: 33,

        top: 58,
        bottom: 70,

        label: "TOCAR"
    },

    {
        id: "shop",

        left: 18,
        right: 49,

        top: 76,
        bottom: 88,

        label: "EXAMINAR"
    },

    {
        id: "hint-house",

        left: 55,
        right: 87,

        top: 76,
        bottom: 88,

        label: "EXAMINAR"
    }
];


/* =========================================
   INICIALIZAR ALDEA
   ========================================= */

function initializeVillage() {
    applyDiscoveries();

    renderVillagePlayer();

    updateInteraction();
}


/* =========================================
   MOSTRAR DESCUBRIMIENTOS
   ========================================= */

function applyDiscoveries() {
    if (
        gameState.villageDiscovered
    ) {
        villageNameSign.classList.add(
            "discovered"
        );
    }

    if (
        gameState.riverDiscovered
    ) {
        riverSign.classList.add(
            "discovered"
        );
    }

    if (
        gameState.shopDiscovered
    ) {
        villageShop.classList.add(
            "discovered"
        );
    }
}


/* =========================================
   DIBUJAR PERSONAJE
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
        playerSprites[
            direction
        ][state];

    villagePlayerSprite.src =
        sprite;
}


/* =========================================
   DETECTAR COLISIONES
   ========================================= */

function isInsideArea(
    x,
    y,
    area
) {
    return (
        x >= area.left &&
        x <= area.right &&
        y >= area.top &&
        y <= area.bottom
    );
}


function hasCollision(
    x,
    y
) {
    return collisionAreas.some(
        (area) => {
            return isInsideArea(
                x,
                y,
                area
            );
        }
    );
}


/* =========================================
   MOVER PERSONAJE
   ========================================= */

function moveVillagePlayer(
    direction
) {
    if (
        gameState.currentScene !==
        "outside"
    ) {
        return;
    }

    if (dialogOpen) {
        return;
    }

    let nextX =
        gameState.playerX;

    let nextY =
        gameState.playerY;

    if (direction === "up") {
        nextY -=
            playerMovement.step;

        gameState.playerDirection =
            "back";
    }

    if (direction === "down") {
        nextY +=
            playerMovement.step;

        gameState.playerDirection =
            "front";
    }

    if (direction === "left") {
        nextX -=
            playerMovement.step;

        gameState.playerDirection =
            "left";
    }

    if (direction === "right") {
        nextX +=
            playerMovement.step;

        gameState.playerDirection =
            "right";
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

    if (
        !hasCollision(
            nextX,
            nextY
        )
    ) {
        gameState.playerX =
            nextX;

        gameState.playerY =
            nextY;
    }

    animationStep =
        !animationStep;

    if (animationStep) {
        setPlayerSprite(
            "walk"
        );
    } else {
        setPlayerSprite(
            "idle"
        );
    }

    villagePlayer.style.left =
        `${gameState.playerX}%`;

    villagePlayer.style.top =
        `${gameState.playerY}%`;

    saveGameState();

    updateInteraction();
}


/* =========================================
   MOVIMIENTO CONTINUO
   ========================================= */

function startMovement(
    direction
) {
    stopMovement(false);

    activeDirection =
        direction;

    moveVillagePlayer(
        direction
    );

    movementTimer =
        window.setInterval(
            () => {
                if (
                    !activeDirection
                ) {
                    return;
                }

                moveVillagePlayer(
                    activeDirection
                );
            },
            playerMovement.repeatDelay
        );
}


function stopMovement(
    showIdle = true
) {
    activeDirection = null;

    if (
        movementTimer !== null
    ) {
        window.clearInterval(
            movementTimer
        );

        movementTimer = null;
    }

    animationStep = false;

    if (
        showIdle &&
        villagePlayerSprite
    ) {
        setPlayerSprite(
            "idle"
        );
    }
}


/* =========================================
   CONTROLES TÁCTILES
   ========================================= */

movementButtons.forEach(
    (button) => {
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
                    Pointer capture puede
                    no estar disponible en
                    algunos navegadores.
                    */
                }

                startMovement(
                    direction
                );
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
    }
);


/* =========================================
   TECLADO
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
            keyboardDirections[
                event.key
            ];

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
            activeDirection ===
            direction
        ) {
            return;
        }

        startMovement(
            direction
        );
    }
);


document.addEventListener(
    "keyup",
    (event) => {
        const direction =
            keyboardDirections[
                event.key
            ];

        if (!direction) {
            return;
        }

        event.preventDefault();

        stopMovement();
    }
);


/* =========================================
   INTERACCIONES
   ========================================= */

function updateInteraction() {
    currentInteraction = null;

    interactionAreas.forEach(
        (area) => {
            if (
                isInsideArea(
                    gameState.playerX,
                    gameState.playerY,
                    area
                )
            ) {
                currentInteraction =
                    area;
            }
        }
    );

    if (
        currentInteraction
    ) {
        actionControls.classList.add(
            "available"
        );

        actionLabel.textContent =
            currentInteraction.label;
    } else {
        actionControls.classList.remove(
            "available"
        );

        actionLabel.textContent =
            "";
    }
}


/* =========================================
   BOTÓN A
   ========================================= */

actionButton.addEventListener(
    "click",
    () => {
        if (
            gameState.currentScene !==
            "outside"
        ) {
            return;
        }

        if (
            !currentInteraction
        ) {
            return;
        }

        stopMovement();

        handleInteraction(
            currentInteraction.id
        );
    }
);


/* =========================================
   RESOLVER INTERACCIONES
   ========================================= */

function handleInteraction(
    interactionId
) {
    if (
        interactionId ===
        "village-sign"
    ) {
        gameState.villageDiscovered =
            true;

        villageNameSign.classList.add(
            "discovered"
        );

        saveGameState();

        showVillageDialog(
            "",
            "ALDEA DE SAPOPINGA"
        );

        return;
    }

    if (
        interactionId ===
        "river-sign"
    ) {
        gameState.riverDiscovered =
            true;

        riverSign.classList.add(
            "discovered"
        );

        saveGameState();

        showVillageDialog(
            "",
            "RÍO UNIVERSIDAD"
        );

        return;
    }

    if (
        interactionId ===
        "treasure-house"
    ) {
        transitionTo(
            "treasure"
        );

        return;
    }

    if (
        interactionId ===
        "closed-house"
    ) {
        showVillageDialog(
            "",
            "Parece que no hay nadie."
        );

        return;
    }

    if (
        interactionId ===
        "shop"
    ) {
        gameState.shopDiscovered =
            true;

        villageShop.classList.add(
            "discovered"
        );

        saveGameState();

        showVillageDialog(
            "",
            "Parece ser una pequeña tienda."
        );

        return;
    }

    if (
        interactionId ===
        "hint-house"
    ) {
        showVillageDialog(
            "",
            "La puerta está cerrada."
        );
    }
}


/* =========================================
   DIÁLOGOS DE LA ALDEA
   ========================================= */

function showVillageDialog(
    name,
    text
) {
    dialogOpen = true;

    stopMovement();

    villageDialogName.textContent =
        name;

    villageDialogText.textContent =
        text;

    if (!name) {
        villageDialogName.style.display =
            "none";
    } else {
        villageDialogName.style.display =
            "block";
    }

    villageDialog.classList.remove(
        "hidden"
    );
}


function hideVillageDialog() {
    dialogOpen = false;

    villageDialog.classList.add(
        "hidden"
    );

    updateInteraction();
}


villageDialogClose.addEventListener(
    "click",
    () => {
        hideVillageDialog();
    }
);


/* =========================================
   CASA MISTERIOSA
   ========================================= */

treasureBack.addEventListener(
    "click",
    () => {
        transitionTo(
            "outside",
            () => {
                initializeVillage();
            }
        );
    }
);


activateTreasureMap.addEventListener(
    "click",
    () => {
        transitionTo(
            "treasureMap"
        );
    }
);


closeTreasureMap.addEventListener(
    "click",
    () => {
        transitionTo(
            "treasure"
        );
    }
);


/* =========================================
   SEGURIDAD DE MOVIMIENTO
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
        if (
            document.hidden
        ) {
            stopMovement();
        }
    }
);


/* =========================================
   RECUPERAR PARTIDA
   ========================================= */

function restoreGame() {
    /*
    Por ahora siempre mostramos
    la portada al abrir la página.

    Posteriormente tendremos:

    CONTINUAR AVENTURA
    NUEVA PARTIDA
    */

    showScreen("title");

    if (
        gameState.playerName
    ) {
        playerNameInput.value =
            gameState.playerName;
    }

    applyDiscoveries();

    renderVillagePlayer();
}


/* =========================================
   INICIAR
   ========================================= */

restoreGame();
