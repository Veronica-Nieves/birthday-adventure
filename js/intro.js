/* =========================================
   INTRODUCCIÓN
   ESTADO: APROBADO / CONGELADO

   No modificar salvo cambio explícito
   de la introducción.
   ========================================= */

import {
    gameState,
    saveGameState
} from "./state.js";

import {
    transitionTo
} from "./screens.js";

import {
    startRoomSequence
} from "./room.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const startButton =
    document.getElementById(
        "start-button"
    );

const wakeMessage =
    document.getElementById(
        "wake-message"
    );

const wakeButton =
    document.getElementById(
        "wake-button"
    );

const nameForm =
    document.getElementById(
        "name-form"
    );

const playerNameInput =
    document.getElementById(
        "player-name-input"
    );


/* =========================================
   ESTADO LOCAL
   ========================================= */

let wakeStep = 0;


/* =========================================
   MENSAJES
   ========================================= */

const wakeMessages = [
    "...",
    "Algo se siente diferente.",
    "Parece que hoy no es un día normal."
];


/* =========================================
   MOSTRAR MENSAJE
   ========================================= */

function showWakeMessage() {
    wakeMessage.textContent =
        wakeMessages[
            wakeStep
        ];
}


/* =========================================
   COMENZAR
   ========================================= */

startButton.addEventListener(
    "click",
    () => {
        gameState.started =
            true;

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
   AVANZAR INTRODUCCIÓN
   ========================================= */

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
            playerNameInput
                .value
                .trim();

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
   RECUPERAR NOMBRE
   ========================================= */

export function restoreIntro() {
    if (
        gameState.playerName
    ) {
        playerNameInput.value =
            gameState.playerName;
    }
}
