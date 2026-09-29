const STORAGE_KEY =
    "wordmatch_stats";


/* =========================================================
   PONTUAÇÃO DA PARTIDA
   ========================================================= */

function updateScore() {

    if (DOM.gameScore) {

        DOM.gameScore.textContent =
            AppState.score;
    }
}


/* =========================================================
   ESTATÍSTICAS
   ========================================================= */

function loadGameStats() {

    const defaults = {

        totalScore: 0,

        gamesPlayed: 0,

        correctMatches: 0,

        wrongMatches: 0,

        bestStreak: 0
    };

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {

            return defaults;
        }

        return {
            ...defaults,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.warn(
            "Não foi possível ler as estatísticas.",
            error
        );

        return defaults;
    }
}


function saveGameStats() {

    const stats =
        loadGameStats();

    stats.totalScore +=
        AppState.score;

    stats.gamesPlayed++;

    stats.correctMatches +=
        AppState.correctMatches;

    stats.wrongMatches +=
        AppState.wrongMatches;

    stats.bestStreak =
        Math.max(
            stats.bestStreak,
            AppState.bestStreak
        );

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stats)
        );

    } catch (error) {

        console.warn(
            "Não foi possível salvar estatísticas.",
            error
        );
    }

    updateHomeStats();
}


/* =========================================================
   ESTATÍSTICAS DA HOME
   ========================================================= */

function updateHomeStats() {

    const stats =
        loadGameStats();

    if (DOM.statWords) {

        DOM.statWords.textContent =
            AppState.words.length;
    }

    if (DOM.statScore) {

        DOM.statScore.textContent =
            stats.totalScore;
    }

    if (DOM.statStreak) {

        DOM.statStreak.textContent =
            stats.bestStreak;
    }

    if (DOM.homeRoundSize) {

        DOM.homeRoundSize.textContent =
            `${CONFIG.pairsPerRound} pares`;
    }
}