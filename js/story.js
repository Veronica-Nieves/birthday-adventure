/* =========================================
   PROGRESO DE LA HISTORIA
   ESTADO: EN DESARROLLO
   ========================================= */

import {
    gameState,
    saveGameState
} from "./state.js";


/* =========================================
   ETAPAS PRINCIPALES
   ========================================= */

export const storyStages = {
    INTRO: 0,
    VILLAGE_START: 1,
    RANA_MET: 2,
    RIVER_UNLOCKED: 3,
    RIVER_CROSSED: 4,
    CABIN_REACHED: 5,
    MAP_OBTAINED: 6,
    CHEST_FOUND: 7
};


/* =========================================
   CAMBIAR ETAPA
   ========================================= */

export function setStoryStage(
    stage
) {
    gameState.storyStage =
        stage;

    saveGameState();
}


/* =========================================
   CONSULTAR ETAPA
   ========================================= */

export function isStoryStageAtLeast(
    stage
) {
    return (
        gameState.storyStage >=
        stage
    );
}
