/* =========================================
   MOVIMIENTO DE SERGIO
   ALDEA DE SAPOPINGA

   ESTADO: EN DESARROLLO
   ========================================= */

import {
    gameState,
    saveGameState
} from "../state.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const villagePlayer =
    document.getElementById(
        "village-player"
    );

const villagePlayerSprite =
    document.getElementById(
        "village-player-sprite"
    );

const movementButtons =
    document.querySelectorAll(
        ".move-button"
    );


/* =========================================
   ESTADO LOCAL
   ========================================= */

let activeDirection = null;
let movementTimer = null;

let walkPhase = 0;

let movementBlocked = false;

let movementUpdateCallback =
    null;

let controlsInitialized =
    false;


/* =========================================
   SPRITES DE SERGIO
   ========================================= */

const playerSprites = {
    front: {
        idle:
            "assets/characters/sergio/front-idle.png",

        walkRight:
            "assets/characters/sergio/front-walk-right.png",

        walkLeft:
            "assets/characters/sergio/front-walk-left.png"
    },

    back: {
        idle:
            "assets/characters/sergio/back-idle.png",

        walkRight:
            "assets/characters/sergio/back-walk-right.png",

        walkLeft:
            "assets/characters/sergio/back-walk-left.png"
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
    step: 1.25,

    minX: 3,
    maxX: 97,

    minY: 7,
    maxY: 94,

    repeatDelay: 115
};


/* =========================================
   DIBUJAR A SERGIO
   ========================================= */

export function renderVillagePlayer() {
    villagePlayer.style.left =
        `${gameState.playerX}%`;

    villagePlayer.style.top =
        `${gameState.playerY}%`;

    setPlayerSprite(
        "idle"
    );
}


/* =========================================
   CAMBIAR SPRITE
   ========================================= */

function setPlayerSprite(frame) {
    const direction =
        gameState.playerDirection;

    const directionSprites =
        playerSprites[
            direction
        ];

    if (!directionSprites) {
        return;
    }

    const sprite =
        directionSprites[
            frame
        ] ||
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
    IZQUIERDA Y DERECHA

    walk
    idle
    walk
    idle
    */

    if (
        direction === "left" ||
        direction === "right"
    ) {
        const lateralFrames = [
            "walk",
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
    ARRIBA Y ABAJO

    pierna derecha
    centro
    pierna izquierda
    centro
    */

    const verticalFrames = [
        "walkRight",
        "idle",
        "walkLeft",
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

function moveVillagePlayer(
    direction
) {
    if (
        gameState.currentScene !==
        "outside"
    ) {
        return;
    }

    if (movementBlocked) {
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

    if (
        movementUpdateCallback
    ) {
        movementUpdateCallback();
    }
}


/* =========================================
   INICIAR MOVIMIENTO
   ========================================= */

function startMovement(
    direction
) {
    if (
        gameState.currentScene !==
        "outside"
    ) {
        return;
    }

    if (movementBlocked) {
        return;
    }

    stopMovement(
        false
    );

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


/* =========================================
   DETENER MOVIMIENTO
   ========================================= */

export function stopMovement(
    showIdle = true
) {
    activeDirection =
        null;

    if (
        movementTimer !==
        null
    ) {
        window.clearInterval(
            movementTimer
        );

        movementTimer =
            null;
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
   BLOQUEAR MOVIMIENTO
   ========================================= */

export function setMovementBlocked(
    blocked
) {
    movementBlocked =
        blocked;

    if (blocked) {
        stopMovement();
    }
}


/* =========================================
   REINICIAR ANIMACIÓN
   ========================================= */

export function resetWalkingAnimation() {
    walkPhase = 0;
}


/* =========================================
   CALLBACK DE POSICIÓN
   ========================================= */

export function setMovementUpdateCallback(
    callback
) {
    movementUpdateCallback =
        callback;
}


/* =========================================
   CONTROLES TÁCTILES
   ========================================= */

function initializeTouchControls() {
    movementButtons.forEach(
        (button) => {
            button.addEventListener(
                "pointerdown",
                (event) => {
                    event.preventDefault();

                    const direction =
                        button.dataset
                            .direction;

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

    document.addEventListener(
        "pointerup",
        () => {
            if (
                activeDirection
            ) {
                stopMovement();
            }
        }
    );

    document.addEventListener(
        "pointercancel",
        () => {
            if (
                activeDirection
            ) {
                stopMovement();
            }
        }
    );
}


/* =========================================
   CONTROLES DE TECLADO
   ========================================= */

function initializeKeyboardControls() {
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
}


/* =========================================
   SEGURIDAD
   ========================================= */

function initializeMovementSafety() {
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
}


/* =========================================
   INICIALIZAR CONTROLES
   ========================================= */

export function initializeMovementControls() {
    if (controlsInitialized) {
        return;
    }

    controlsInitialized =
        true;

    initializeTouchControls();

    initializeKeyboardControls();

    initializeMovementSafety();
}
