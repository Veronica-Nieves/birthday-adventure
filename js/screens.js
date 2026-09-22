/* =========================================
   CONTROL DE PANTALLAS
   ESTADO: INFRAESTRUCTURA ESTABLE
   ========================================= */

import {
    gameState,
    saveGameState
} from "./state.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const screens = {
    title:
        document.getElementById(
            "title-screen"
        ),

    wake:
        document.getElementById(
            "wake-screen"
        ),

    name:
        document.getElementById(
            "name-screen"
        ),

    room:
        document.getElementById(
            "room-screen"
        ),

    outside:
        document.getElementById(
            "outside-screen"
        ),

    treasure:
        document.getElementById(
            "treasure-screen"
        ),

    treasureMap:
        document.getElementById(
            "treasure-map-screen"
        )
};

const fadeLayer =
    document.getElementById(
        "fade-layer"
    );


/* =========================================
   MOSTRAR PANTALLA
   ========================================= */

export function showScreen(
    screenName
) {
    Object.values(
        screens
    ).forEach(
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


/* =========================================
   TRANSICIÓN
   ========================================= */

export function transitionTo(
    screenName,
    callback = null
) {
    fadeLayer.classList.add(
        "visible"
    );

    window.setTimeout(
        () => {
            showScreen(
                screenName
            );

            if (callback) {
                callback();
            }

            window.setTimeout(
                () => {
                    fadeLayer.classList.remove(
                        "visible"
                    );
                },
                120
            );
        },
        650
    );
}
