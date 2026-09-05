const startScreen = document.getElementById("start-screen");
const introScreen = document.getElementById("intro-screen");

const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const dialogText = document.getElementById("dialog-text");

const dialog = [
    "Buenos días...",
    "Sí. Fuimos nosotros los del sobre.",
    "Y no, todavía no te vamos a explicar todo.",
    "Pero podemos empezar por una cosa.",
    "Feliz cumpleaños. 💚"
];

let dialogIndex = 0;

startButton.addEventListener("click", () => {
    startScreen.classList.remove("active");
    introScreen.classList.add("active");

    dialogText.textContent = dialog[dialogIndex];
});

continueButton.addEventListener("click", () => {
    dialogIndex += 1;

    if (dialogIndex < dialog.length) {
        dialogText.textContent = dialog[dialogIndex];
    } else {
        dialogText.textContent = "Por ahora, eso es todo. 🐸";
        continueButton.style.display = "none";
    }
});
