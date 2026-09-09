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
    playerY: 88,

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
    "Algo se siente diferente.",
    "Parece que hoy no es un día normal."
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

        gameState.roomIntroCompleted =
            false;

        saveGameState();

        transitionTo(
            "room",
            () => {
                startRoomSequence();
            }
        );
    }
);


/* =========================================
   SECUENCIA DE LA HABITACIÓN
   ========================================= */

const roomMessages = [
    "Algo está pasando afuera.",
    "Tal vez deberías averiguar qué está pasando.",
    "..."
];


function startRoomSequence() {
    roomStep = 0;

    roomExit.disabled = true;

    roomExit.style.opacity =
        "0.35";

    roomExit.style.pointerEvents =
        "none";

    showRoomMessage(
        roomMessages[roomStep]
    );
}


function showRoomMessage(text) {
    roomDialogName.style.display =
        "none";

    roomDialogText.textContent =
        text;

    roomDialog.classList.remove(
        "hidden"
    );
}


roomDialogNext.addEventListener(
    "click",
    () => {
        roomStep += 1;

        if (
            roomStep <
            roomMessages.length
        ) {
            showRoomMessage(
                roomMessages[roomStep]
            );

            return;
        }

        finishRoomSequence();
    }
);


function finishRoomSequence() {
    gameState.roomIntroCompleted =
        true;

    saveGameState();

    roomDialog.classList.add(
        "hidden"
    );

    roomExit.disabled = false;

    roomExit.style.opacity =
        "1";

    roomExit.style.pointerEvents =
        "auto";
}


/* =========================================
   SALIR DE LA HABITACIÓN
   ========================================= */

roomExit.addEventListener(
    "click",
    () => {
        if (
            !gameState.roomIntroCompleted
        ) {
            return;
        }

        gameState.playerX = 50;
        gameState.playerY = 88;

        gameState.playerDirection =
            "back";

        saveGameState();

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

        walk1:
            "assets/characters/sergio/front-walk.png",

        walk2:
            "assets/characters/sergio/front-walk-2.png"
    },

    back: {
        idle:
            "assets/characters/sergio/back-idle.png",

        walk1:
            "assets/characters/sergio/back-walk.png",

        walk2:
            "assets/characters/sergio/back-walk-2.png"
    },

    left: {
        idle:
            "assets/characters/sergio/left-idle.png",

        walk1:
            "assets/characters/sergio/left-walk.png"
    },

    right: {
        idle:
            "assets/characters/sergio/right-idle.png",

        walk1:
            "assets/characters/sergio/right-walk.png"
    }
};


/* =========================================
   CONFIGURACIÓN DE MOVIMIENTO
   ========================================= */

const playerMovement = {
    step: 1.25,

    minX: 3,
    maxX: 97,

    minY: 7,
    maxY: 94,

    repeatDelay: 115
};


/* =========================================
   INICIALIZAR ALDEA
   ========================================= */

function initializeVillage() {
    dialogOpen = false;

    walkPhase = 0;

    applyDiscoveries();

    renderVillagePlayer();

    updateInteraction();
}


/* =========================================
   DESCUBRIMIENTOS
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
   DIBUJAR A SERGIO
   ========================================= */

function renderVillagePlayer() {
    villagePlayer.style.left =
        `${gameState.playerX}%`;

    villagePlayer.style.top =
        `${gameState.playerY}%`;

    setPlayerSprite(
        "idle"
    );
}


function setPlayerSprite(frame) {
    const direction =
        gameState.playerDirection;

    const directionSprites =
        playerSprites[direction];

    if (!directionSprites) {
        return;
    }

    const sprite =
        directionSprites[frame] ||
        directionSprites.idle;

    villagePlayerSprite.src =
        sprite;
}


/* =========================================
   ANIMACIÓN DE CAMINATA
   ========================================= */

function updateWalkingSprite() {
    const direction =
        gameState.playerDirection;

    /*
    Izquierda y derecha:
    walk → idle → walk → idle
    */

    if (
        direction === "left" ||
        direction === "right"
    ) {
        const lateralFrames = [
            "walk1",
            "idle"
        ];

        const frame =
            lateralFrames[
                walkPhase %
                lateralFrames.length
            ];

        setPlayerSprite(
            frame
        );

        walkPhase += 1;

        return;
    }

    /*
    Arriba y abajo:
    pierna 1 → centro → pierna 2 → centro
    */

    const verticalFrames = [
        "walk1",
        "idle",
        "walk2",
        "idle"
    ];

    const frame =
        verticalFrames[
            walkPhase %
            verticalFrames.length
        ];

    setPlayerSprite(
        frame
    );

    walkPhase += 1;
}


/* =========================================
   MOVIMIENTO LIBRE
   ========================================= */

function moveVillagePlayer(direction) {
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

    gameState.playerX =
        nextX;

    gameState.playerY =
        nextY;

    updateWalkingSprite();

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

function startMovement(direction) {
    if (
        gameState.currentScene !==
        "outside"
    ) {
        return;
    }

    if (dialogOpen) {
        return;
    }

    stopMovement(false);

    activeDirection =
        direction;

    walkPhase = 0;

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

    walkPhase = 0;

    if (
        showIdle &&
        villagePlayerSprite &&
        gameState.currentScene ===
            "outside"
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
            "contextmenu",
            (event) => {
                event.preventDefault();
            }
        );
    }
);


/* =========================================
   DETENER AL SOLTAR FUERA DEL BOTÓN
   ========================================= */

document.addEventListener(
    "pointerup",
    () => {
        if (activeDirection) {
            stopMovement();
        }
    }
);

document.addEventListener(
    "pointercancel",
    () => {
        if (activeDirection) {
            stopMovement();
        }
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

        if (
            activeDirection ===
            direction
        ) {
            stopMovement();
        }
    }
);


/* =========================================
   ZONAS DE INTERACCIÓN
   ========================================= */

const interactionAreas = [
    {
        id: "village-sign",

        left: 7,
        right: 40,

        top: 60,
        bottom: 78,

        label: "LEER"
    },

    {
        id: "speaker",

        left: 38,
        right: 59,

        top: 56,
        bottom: 75,

        label: "ESCUCHAR"
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
   UTILIDADES DE ZONAS
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


/* =========================================
   DETECTAR INTERACCIONES
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

    if (currentInteraction) {
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

        if (!currentInteraction) {
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
        "speaker"
    ) {
        gameState.speakerExamined =
            true;

        saveGameState();

        showVillageDialog(
            "",
            "Se reproduce audio."
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
   SEGURIDAD
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
    showScreen(
        "title"
    );

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
