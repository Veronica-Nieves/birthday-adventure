/* =========================================
   INTERACCIONES DE SAPOPINGA

   ESTADO: EN DESARROLLO
   ========================================= */

import {
    gameState,
    saveGameState
} from "../state.js";

import {
    transitionTo
} from "../screens.js";

import {
    stopMovement,
    setMovementBlocked
} from "./movement.js";


/* =========================================
   ELEMENTOS
   ========================================= */

const actionControls =
    document.getElementById(
        "action-controls"
    );

const actionButton =
    document.getElementById(
        "action-button"
    );

const actionLabel =
    document.getElementById(
        "action-label"
    );

const villageDialog =
    document.getElementById(
        "village-dialog"
    );

const villageDialogName =
    document.getElementById(
        "village-dialog-name"
    );

const villageDialogText =
    document.getElementById(
        "village-dialog-text"
    );

const villageDialogClose =
    document.getElementById(
        "village-dialog-close"
    );

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

const treasureBack =
    document.getElementById(
        "treasure-back"
    );

const activateTreasureMap =
    document.getElementById(
        "activate-treasure-map"
    );

const closeTreasureMap =
    document.getElementById(
        "close-treasure-map"
    );

const dialogPortrait =
    document.getElementById(
        "dialog-portrait"
    );

const dialogPortraitImage =
    document.getElementById(
        "dialog-portrait-image"
    );


/* =========================================
   ESTADO LOCAL
   ========================================= */

let currentInteraction =
    null;

let interactionsInitialized =
    false;

let villageReturnCallback =
    null;

let activeDialogSequence =
    null;

let activeDialogStep =
    0;

let activeDialogFinishCallback =
    null;


/* =========================================
   DIÁLOGO INICIAL DE RANA
   ========================================= */

const ranaFirstDialog = [
    "Me dijeron que vendrías. Ya te estaba esperando.",
    "Pero como te tardaste tanto, ya hasta me iba a ir a Colombia.",
    "Mira. Ya hasta me compré mi playera.",
    "Pero ya que llegaste, te voy a entregar algo que es para ti.",
    "Es un mapa.",
    "Bueno... creo que es un mapa.",
    "Peeeeeero, lo dejé en mi mansión.",
    "Mi mansión está al otro lado del Río Universidad.",
    "Y dicen que es muy difícil cruzar.",
    "Por suerte estás conmigo. Soy una rana que todo lo sabe.",
    "Hasta me dicen Saponcio.",
    "Sígueme."
];


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
        id: "rana",

        left: 22,
        right: 38,

        top: 54,
        bottom: 70,

        label: "HABLAR"
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

export function updateInteraction() {
    currentInteraction =
        null;

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

        /*
        El río cambia de acción después
        de conocer a Rana.
        */

        if (
            currentInteraction.id ===
                "river-sign" &&
            gameState.riverUnlocked
        ) {
            actionLabel.textContent =
                "CRUZAR";

            return;
        }

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
   RETRATO DE DIÁLOGO
   ========================================= */

function showDialogPortrait(
    image,
    side = "left"
) {
    if (
        !image ||
        !dialogPortrait ||
        !dialogPortraitImage
    ) {
        hideDialogPortrait();

        return;
    }

    dialogPortraitImage.src =
        image;

    dialogPortrait.classList.remove(
        "hidden",
        "right"
    );

    if (
        side === "right"
    ) {
        dialogPortrait.classList.add(
            "right"
        );
    }
}


function hideDialogPortrait() {
    if (
        !dialogPortrait ||
        !dialogPortraitImage
    ) {
        return;
    }

    dialogPortrait.classList.add(
        "hidden"
    );

    dialogPortrait.classList.remove(
        "right"
    );

    dialogPortraitImage.src =
        "";
}


/* =========================================
   INICIAR SECUENCIA DE DIÁLOGO
   ========================================= */

function startDialogSequence(
    name,
    messages,
    finishCallback = null
) {
    activeDialogSequence =
        messages;

    activeDialogStep =
        0;

    activeDialogFinishCallback =
        finishCallback;

    showVillageDialog(
        name,
        activeDialogSequence[
            activeDialogStep
        ]
    );
}


/* =========================================
   MOSTRAR DIÁLOGO
   ========================================= */

function showVillageDialog(
    name,
    text
) {
    stopMovement();

    setMovementBlocked(
        true
    );

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


/* =========================================
   CERRAR DIÁLOGO
   ========================================= */

function hideVillageDialog() {
    villageDialog.classList.add(
        "hidden"
    );

    hideDialogPortrait();

    setMovementBlocked(
        false
    );

    updateInteraction();
}


/* =========================================
   RESOLVER INTERACCIÓN
   ========================================= */

function handleInteraction(
    interactionId
) {
    /* -----------------------------------------
       LETRERO DE SAPOPINGA
       ----------------------------------------- */

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


    /* -----------------------------------------
       ALTAVOZ
       ----------------------------------------- */

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


    /* -----------------------------------------
       RANA
       ----------------------------------------- */

    if (
        interactionId ===
        "rana"
    ) {
        /*
        Si Sergio ya conoció a Rana,
        no repetimos toda la presentación.
        */

        if (
            gameState.ranaMet
        ) {
            showDialogPortrait(
                "assets/characters/rana/rana-idle-seat.png",
                "left"
            );

            showVillageDialog(
                "Rana",
                "¿Qué? ¿Ya olvidaste que tenemos que ir a mi mansión?"
            );

            return;
        }

        /*
        Primera conversación con Rana.
        */

        showDialogPortrait(
            "assets/characters/rana/rana-idle-seat.png",
            "left"
        );

        startDialogSequence(
            "Rana",
            ranaFirstDialog,
            () => {
                gameState.ranaMet =
                    true;

                gameState.ranaFollowing =
                    true;

                gameState.riverUnlocked =
                    true;

                gameState.storyStage =
                    3;

                saveGameState();

                updateInteraction();
            }
        );

        return;
    }


    /* -----------------------------------------
       RÍO UNIVERSIDAD
       ----------------------------------------- */

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

        /*
        Antes de conocer a Rana,
        Sergio puede descubrir el río
        pero todavía no puede cruzarlo.
        */

        if (
            !gameState.riverUnlocked
        ) {
            showVillageDialog(
                "",
                "RÍO UNIVERSIDAD\n\nParece que no puedes cruzar por aquí."
            );

            return;
        }

        /*
        Rana ya desbloqueó el camino.

        El cruce real se implementará
        en la siguiente etapa.
        */

        showDialogPortrait(
            "assets/characters/rana/rana-idle-seat.png",
            "left"
        );

        showVillageDialog(
            "Rana",
            "Este es el Río Universidad. Yo sé cómo cruzarlo."
        );

        return;
    }


    /* -----------------------------------------
       CASA MISTERIOSA
       ----------------------------------------- */

    if (
        interactionId ===
        "treasure-house"
    ) {
        stopMovement();

        transitionTo(
            "treasure"
        );

        return;
    }


    /* -----------------------------------------
       CASA CERRADA
       ----------------------------------------- */

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


    /* -----------------------------------------
       EL PORVENIR
       ----------------------------------------- */

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


    /* -----------------------------------------
       CASA DE PISTAS
       ----------------------------------------- */

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
   BOTÓN A
   ========================================= */

function initializeActionButton() {
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
}


/* =========================================
   CASA MISTERIOSA
   ========================================= */

function initializeTreasureControls() {
    treasureBack.addEventListener(
        "click",
        () => {
            transitionTo(
                "outside",
                () => {
                    if (
                        villageReturnCallback
                    ) {
                        villageReturnCallback();
                    }
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
}


/* =========================================
   CONECTAR RETORNO A LA ALDEA
   ========================================= */

export function setVillageReturnCallback(
    callback
) {
    villageReturnCallback =
        callback;
}


/* =========================================
   INICIALIZAR INTERACCIONES
   ========================================= */

export function initializeInteractions() {
    if (
        interactionsInitialized
    ) {
        return;
    }

    interactionsInitialized =
        true;

    villageDialogClose.addEventListener(
        "click",
        () => {
            if (
                activeDialogSequence
            ) {
                activeDialogStep +=
                    1;

                if (
                    activeDialogStep <
                    activeDialogSequence.length
                ) {
                    villageDialogText.textContent =
                        activeDialogSequence[
                            activeDialogStep
                        ];

                    return;
                }

                const finishCallback =
                    activeDialogFinishCallback;

                activeDialogSequence =
                    null;

                activeDialogStep =
                    0;

                activeDialogFinishCallback =
                    null;

                hideVillageDialog();

                if (
                    finishCallback
                ) {
                    finishCallback();
                }

                return;
            }

            hideVillageDialog();
        }
    );

    initializeActionButton();

    initializeTreasureControls();
}

