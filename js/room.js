/* =========================================
   HABITACIÓN INICIAL
   ESTADO: APROBADO / CONGELADO

   No modificar salvo cambio explícito
   de esta escena.
   ========================================= */

import {
    gameState,
    saveGameState
} from "./state.js";

import {
    transitionTo
} from "./screens.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const roomExit =
    document.getElementById(
        "room-exit"
    );

const roomDialog =
    document.getElementById(
        "room-dialog"
    );

const roomDialogName =
    document.getElementById(
        "room-dialog-name"
    );

const roomDialogText =
    document.getElementById(
        "room-dialog-text"
    );

const roomDialogNext =
    document.getElementById(
        "room-dialog-next"
    );


/* =========================================
   ESTADO LOCAL
   ========================================= */

let roomStep = 0;

let enterVillageCallback =
    null;


/* =========================================
   MENSAJES
   ========================================= */

const roomMessages = [
    "Algo está pasando afuera.",
    "Tal vez deberías averiguar qué está pasando.",
    "..."
];


/* =========================================
   INICIAR HABITACIÓN
   ========================================= */

export function startRoomSequence() {
    roomStep = 0;

    roomExit.disabled =
        true;

    roomExit.style.opacity =
        "0.35";

    roomExit.style.pointerEvents =
        "none";

    showRoomMessage(
        roomMessages[
            roomStep
        ]
    );
}


/* =========================================
   MOSTRAR MENSAJE
   ========================================= */

function showRoomMessage(
    text
) {
    roomDialogName.style.display =
        "none";

    roomDialogText.textContent =
        text;

    roomDialog.classList.remove(
        "hidden"
    );
}


/* =========================================
   FINALIZAR SECUENCIA
   ========================================= */

function finishRoomSequence() {
    gameState.roomIntroCompleted =
        true;

    saveGameState();

    roomDialog.classList.add(
        "hidden"
    );

    roomExit.disabled =
        false;

    roomExit.style.opacity =
        "1";

    roomExit.style.pointerEvents =
        "auto";
}


/* =========================================
   SIGUIENTE MENSAJE
   ========================================= */

roomDialogNext.addEventListener(
    "click",
    () => {
        roomStep += 1;

        if (
            roomStep <
            roomMessages.length
        ) {
            showRoomMessage(
                roomMessages[
                    roomStep
                ]
            );

            return;
        }

        finishRoomSequence();
    }
);


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

        gameState.playerX =
            50;

        gameState.playerY =
            88;

        gameState.playerDirection =
            "back";

        saveGameState();

        transitionTo(
            "outside",
            () => {
                if (
                    enterVillageCallback
                ) {
                    enterVillageCallback();
                }
            }
        );
    }
);


/* =========================================
   CONECTAR CON LA SIGUIENTE ESCENA
   ========================================= */

export function setEnterVillageCallback(
    callback
) {
    enterVillageCallback =
        callback;
}
