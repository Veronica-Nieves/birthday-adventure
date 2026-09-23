/* =========================================
   UNA PEQUEÑA AVENTURA
   PUNTO DE ENTRADA PRINCIPAL

   ESTADO: INFRAESTRUCTURA ESTABLE
   ========================================= */

import {
    gameState
} from "./state.js";

import {
    showScreen
} from "./screens.js";

import {
    restoreIntro
} from "./intro.js";

import {
    setEnterVillageCallback
} from "./room.js";

import {
    initializeVillageModule,
    initializeVillage,
    restoreVillage
} from "./village/village.js";


/* =========================================
   CONECTAR HABITACIÓN CON SAPOPINGA
   ========================================= */

setEnterVillageCallback(
    initializeVillage
);


/* =========================================
   INICIALIZAR MÓDULOS DE SAPOPINGA
   ========================================= */

initializeVillageModule();


/* =========================================
   RESTAURAR PARTIDA
   ========================================= */

function restoreGame() {
    /*
    Por ahora mantenemos el comportamiento
    actual:

    al abrir o recargar la página,
    siempre mostramos la portada.

    Más adelante podremos agregar:
    CONTINUAR AVENTURA
    NUEVA PARTIDA
    */

    showScreen(
        "title"
    );

    restoreIntro();

    restoreVillage();

    /*
    gameState se importa aquí porque
    main.js es el punto central del juego.

    De momento no necesitamos hacer nada
    adicional con currentScene, ya que
    seguimos mostrando la portada al cargar.
    */

    if (
        !gameState.currentScene
    ) {
        gameState.currentScene =
            "title";
    }
}


/* =========================================
   INICIAR
   ========================================= */

restoreGame();
