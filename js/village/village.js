/* =========================================
   ALDEA DE SAPOPINGA

   Coordinador principal de la escena.

   ESTADO: EN DESARROLLO
   ========================================= */

import {
    gameState
} from "../state.js";

import {
    initializeMovementControls,
    renderVillagePlayer,
    resetWalkingAnimation,
    setMovementBlocked,
    setMovementUpdateCallback
} from "./movement.js";

import {
    initializeInteractions,
    updateInteraction,
    setVillageReturnCallback
} from "./interactions.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const villageNameSign =
    document.getElementById(
        "village-name-sign"
    );

const riverSign =
    document.getElementById(
        "river-sign"
    );

const villageShop =
    document.getElementById(
        "village-shop"
    );


/* =========================================
   ESTADO DEL MÓDULO
   ========================================= */

let villageModuleInitialized =
    false;


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
   INICIALIZAR MÓDULO
   ========================================= */

export function initializeVillageModule() {
    if (
        villageModuleInitialized
    ) {
        return;
    }

    villageModuleInitialized =
        true;

    /*
    Cada vez que Sergio se mueve,
    comprobamos si está cerca de
    algún objeto interactivo.
    */

    setMovementUpdateCallback(
        updateInteraction
    );

    /*
    Si regresamos desde la casa
    misteriosa, volvemos a cargar
    la aldea.
    */

    setVillageReturnCallback(
        initializeVillage
    );

    initializeMovementControls();

    initializeInteractions();
}


/* =========================================
   ENTRAR A SAPOPINGA
   ========================================= */

export function initializeVillage() {
    setMovementBlocked(
        false
    );

    resetWalkingAnimation();

    applyDiscoveries();

    renderVillagePlayer();

    updateInteraction();
}


/* =========================================
   RESTAURAR ELEMENTOS VISUALES
   ========================================= */

export function restoreVillage() {
    applyDiscoveries();

    renderVillagePlayer();
}
