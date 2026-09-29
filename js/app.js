/* =========================================================
   WORDMATCH
   APLICAÇÃO PRINCIPAL
   ========================================================= */

const CONFIG = {

    wordsFile: "sources/languages/en.json",

    pairsPerRound: 5,

    roundsPerGame: 10,

    pointsPerMatch: 10,

    wrongPenalty: 2,

    roundCompletionBonus: 20,

    requestDelay: 0
};


/* =========================================================
   ESTADO
   ========================================================= */

const AppState = {

    initialized: false,

    words: [],

    languages: [],

    sourceLanguage: "en",

    targetLanguage: "pt",

    dictionaryCache: new Map(),

    currentRound: 0,

    totalRounds: CONFIG.roundsPerGame,

    score: 0,

    correctMatches: 0,

    wrongMatches: 0,

    roundMatches: 0,

    roundWrong: 0,

    roundPairs: [],

    selectedSource: null,

    selectedTarget: null,

    isChecking: false,

    roundStartedAt: null,

    bestStreak: 0,

    currentStreak: 0
};


/* =========================================================
   DOM
   ========================================================= */

const DOM = {};


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    cacheDomElements();

    configureEvents();

    try {

        await Promise.all([
            loadWords(),
            loadLanguages()
        ]);

        AppState.initialized = true;

        updateHomeStats();

        updateLanguageUI();

        updateRoundLabels();

    } catch (error) {

        console.error(
            "Erro ao inicializar:",
            error
        );

        showInitializationError();
    }
}


/* =========================================================
   DOM
   ========================================================= */

function cacheDomElements() {

    DOM.screenHome =
        document.getElementById("screenHome");

    DOM.screenGame =
        document.getElementById("screenGame");

    DOM.screenResult =
        document.getElementById("screenResult");

    DOM.btnStart =
        document.getElementById("btnStart");

    DOM.btnSettings =
        document.getElementById("btnSettings");

    DOM.btnBrand =
        document.getElementById("btnBrand");

    DOM.btnExitGame =
        document.getElementById("btnExitGame");

    DOM.btnPlayAgain =
        document.getElementById("btnPlayAgain");

    DOM.btnBackHome =
        document.getElementById("btnBackHome");

    DOM.statWords =
        document.getElementById("statWords");

    DOM.statScore =
        document.getElementById("statScore");

    DOM.statStreak =
        document.getElementById("statStreak");

    DOM.currentRound =
        document.getElementById("currentRound");

    DOM.totalRounds =
        document.getElementById("totalRounds");

    DOM.gameScore =
        document.getElementById("gameScore");

    DOM.progressValue =
        document.getElementById("progressValue");

    DOM.sourceColumn =
        document.getElementById("sourceColumn");

    DOM.targetColumn =
        document.getElementById("targetColumn");

    DOM.targetColumnTitle =
        document.getElementById("targetColumnTitle");

    DOM.selectionStatus =
        document.getElementById("selectionStatus");

    DOM.roundFeedback =
        document.getElementById("roundFeedback");

    DOM.finalScore =
        document.getElementById("finalScore");

    DOM.correctMatches =
        document.getElementById("correctMatches");

    DOM.wrongMatches =
        document.getElementById("wrongMatches");

    DOM.finalTime =
        document.getElementById("finalTime");

    DOM.sourceLanguageLabel =
        document.getElementById("sourceLanguageLabel");

    DOM.targetLanguageLabel =
        document.getElementById("targetLanguageLabel");

    DOM.homeRoundSize =
        document.getElementById("homeRoundSize");
}


/* =========================================================
   EVENTOS
   ========================================================= */

function configureEvents() {

    DOM.btnStart?.addEventListener(
        "click",
        startGame
    );

    DOM.btnExitGame?.addEventListener(
        "click",
        exitGame
    );

    DOM.btnPlayAgain?.addEventListener(
        "click",
        startGame
    );

    DOM.btnBackHome?.addEventListener(
        "click",
        goHome
    );

    DOM.btnBrand?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            goHome();
        }
    );

    DOM.btnSettings?.addEventListener(
        "click",
        showSettings
    );
}


/* =========================================================
   INTERFACE
   ========================================================= */

function updateRoundLabels() {

    if (DOM.currentRound) {

        DOM.currentRound.textContent =
            AppState.currentRound || 1;
    }

    if (DOM.totalRounds) {

        DOM.totalRounds.textContent =
            AppState.totalRounds;
    }

    const completed =
        Math.max(
            0,
            AppState.currentRound - 1
        );

    const percentage =
        AppState.totalRounds > 0
            ? (
                completed /
                AppState.totalRounds
            ) * 100
            : 0;

    if (DOM.progressValue) {

        DOM.progressValue.style.width =
            `${percentage}%`;
    }
}


function setSelectionStatus(
    text,
    type = ""
) {

    if (!DOM.selectionStatus) {
        return;
    }

    DOM.selectionStatus.className =
        `selection-status ${type}`;

    DOM.selectionStatus.innerHTML = `

        <span class="status-dot"></span>

        <span>
            ${escapeHtml(text)}
        </span>
    `;
}


function setFeedback(
    text,
    type = ""
) {

    if (!DOM.roundFeedback) {
        return;
    }

    DOM.roundFeedback.className =
        `feedback ${type}`;

    DOM.roundFeedback.textContent =
        text;
}


function clearSelectedCard(side) {

    const selected =
        side === "source"
            ? AppState.selectedSource
            : AppState.selectedTarget;

    if (selected?.button) {

        selected.button.classList.remove(
            "selected"
        );
    }
}


function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "screen-active"
            );
        });

    const screen =
        document.getElementById(id);

    if (screen) {

        screen.classList.add(
            "screen-active"
        );
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showRoundError() {

    if (DOM.sourceColumn) {

        DOM.sourceColumn.innerHTML =
            `<div class="loading-state">
                Não foi possível carregar a rodada.
            </div>`;
    }

    if (DOM.targetColumn) {

        DOM.targetColumn.innerHTML =
            `<div class="loading-state">
                Verifique sua conexão e tente novamente.
            </div>`;
    }

    setSelectionStatus(
        "Erro ao carregar as palavras.",
        "error"
    );
}


function showInitializationError() {

    if (!DOM.btnStart) {
        return;
    }

    DOM.btnStart.disabled = true;

    DOM.btnStart.style.opacity = ".5";

    const span =
        DOM.btnStart.querySelector("span");

    if (span) {

        span.textContent =
            "Erro ao carregar";
    }
}


function showSettings() {

    alert(
        "Configurações de idioma serão adicionadas em uma próxima etapa."
    );
}


/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function goHome() {

    AppState.isChecking = false;

    AppState.selectedSource = null;

    AppState.selectedTarget = null;

    showScreen(
        "screenHome"
    );

    updateHomeStats();
}


function exitGame() {

    const confirmed =
        confirm(
            "Deseja sair da partida?"
        );

    if (!confirmed) {
        return;
    }

    goHome();
}


/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function escapeHtml(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;
}