/* =========================================================
   INICIAR JOGO
   ========================================================= */

async function startGame() {

    if (!AppState.initialized) {

        return;
    }

    if (
        AppState.words.length <
        CONFIG.pairsPerRound
    ) {

        alert(
            `Sua base precisa ter pelo menos ${CONFIG.pairsPerRound} palavras.`
        );

        return;
    }

    resetGame();

    showScreen(
        "screenGame"
    );

    await startRound();
}


/* =========================================================
   RESET
   ========================================================= */

function resetGame() {

    AppState.currentRound = 0;

    AppState.score = 0;

    AppState.correctMatches = 0;

    AppState.wrongMatches = 0;

    AppState.roundMatches = 0;

    AppState.roundWrong = 0;

    AppState.roundPairs = [];

    AppState.selectedSource = null;

    AppState.selectedTarget = null;

    AppState.isChecking = false;

    AppState.currentStreak = 0;

    AppState.roundStartedAt = null;

    updateScore();
}


/* =========================================================
   RODADA
   ========================================================= */

async function startRound() {

    AppState.currentRound++;

    AppState.roundMatches = 0;

    AppState.roundWrong = 0;

    AppState.selectedSource = null;

    AppState.selectedTarget = null;

    AppState.isChecking = false;

    AppState.roundStartedAt =
        performance.now();

    updateRoundLabels();

    setSelectionStatus(
        "Selecione uma palavra para começar.",
        ""
    );

    setFeedback(
        "",
        ""
    );

    renderLoading();

    try {

        AppState.roundPairs =
            await createRound();

        renderRound();

    } catch (error) {

        console.error(
            "Erro ao criar rodada:",
            error
        );

        showRoundError();
    }
}


/* =========================================================
   CRIAR RODADA
   ========================================================= */

async function createRound() {

    const candidates =
        shuffleArray(
            AppState.words
        );

    const pairs = [];

    for (
        const word of candidates
    ) {

        if (
            pairs.length >=
            CONFIG.pairsPerRound
        ) {

            break;
        }

        try {

            const result =
                await getWordTranslation(
                    word
                );

            if (
                !result ||
                !result.translation
            ) {

                continue;
            }

            pairs.push({

                id:
                    `${Date.now()}-${pairs.length}-${Math.random()}`,

                source:
                    result.word,

                target:
                    result.translation,

                matched:
                    false
            });

        } catch (error) {

            console.warn(
                `Falha ao consultar "${word}".`,
                error
            );
        }
    }

    if (
        pairs.length <
        CONFIG.pairsPerRound
    ) {

        throw new Error(
            "Não foi possível montar a quantidade necessária de pares."
        );
    }

    return pairs;
}


/* =========================================================
   RENDER
   ========================================================= */

function renderLoading() {

    if (DOM.sourceColumn) {

        DOM.sourceColumn.innerHTML =
            `<div class="loading-state">
                Carregando palavras...
            </div>`;
    }

    if (DOM.targetColumn) {

        DOM.targetColumn.innerHTML =
            `<div class="loading-state">
                Consultando traduções...
            </div>`;
    }
}


function renderRound() {

    const sourcePairs =
        shuffleArray(
            AppState.roundPairs
        );

    const targetPairs =
        shuffleArray(
            AppState.roundPairs
        );

    DOM.sourceColumn.innerHTML =
        "";

    DOM.targetColumn.innerHTML =
        "";

    sourcePairs.forEach(
        pair => {

            DOM.sourceColumn.appendChild(
                createMatchCard(
                    pair,
                    "source"
                )
            );
        }
    );

    targetPairs.forEach(
        pair => {

            DOM.targetColumn.appendChild(
                createMatchCard(
                    pair,
                    "target"
                )
            );
        }
    );
}


/* =========================================================
   CARTÃO
   ========================================================= */

function createMatchCard(
    pair,
    side
) {

    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.className =
        "match-card";

    button.dataset.id =
        pair.id;

    button.dataset.side =
        side;

    const text =
        side === "source"
            ? pair.source
            : pair.target;

    button.innerHTML = `

        <span class="match-card-word">
            ${escapeHtml(text)}
        </span>

        <span class="match-card-check">
            ✓
        </span>
    `;

    button.addEventListener(
        "click",
        () => handleCardClick(button)
    );

    return button;
}


/* =========================================================
   CLIQUE
   ========================================================= */

function handleCardClick(button) {

    if (
        AppState.isChecking
    ) {

        return;
    }

    const pair =
        AppState.roundPairs.find(
            item =>
                item.id ===
                button.dataset.id
        );

    if (
        !pair ||
        pair.matched
    ) {

        return;
    }

    const side =
        button.dataset.side;

    if (
        side === "source"
    ) {

        selectSource(
            button,
            pair
        );

    } else {

        selectTarget(
            button,
            pair
        );
    }
}


/* =========================================================
   SELECIONAR ORIGEM
   ========================================================= */

function selectSource(
    button,
    pair
) {

    if (
        AppState.selectedSource
    ) {

        clearSelectedCard(
            "source"
        );
    }

    AppState.selectedSource = {

        button,

        pair
    };

    button.classList.add(
        "selected"
    );

    setSelectionStatus(
        `Agora encontre "${pair.target}".`,
        "active"
    );

    if (
        AppState.selectedTarget
    ) {

        checkPair();
    }
}


/* =========================================================
   SELECIONAR DESTINO
   ========================================================= */

function selectTarget(
    button,
    pair
) {

    if (
        AppState.selectedTarget
    ) {

        clearSelectedCard(
            "target"
        );
    }

    AppState.selectedTarget = {

        button,

        pair
    };

    button.classList.add(
        "selected"
    );

    setSelectionStatus(
        "Agora confirme a combinação.",
        "active"
    );

    if (
        AppState.selectedSource
    ) {

        checkPair();
    }
}


/* =========================================================
   VERIFICAR
   ========================================================= */

function checkPair() {

    if (
        !AppState.selectedSource ||
        !AppState.selectedTarget ||
        AppState.isChecking
    ) {

        return;
    }

    AppState.isChecking =
        true;

    const source =
        AppState.selectedSource;

    const target =
        AppState.selectedTarget;

    const correct =
        source.pair.id ===
        target.pair.id;

    if (correct) {

        handleCorrectPair(
            source,
            target
        );

    } else {

        handleWrongPair(
            source,
            target
        );
    }
}


/* =========================================================
   ACERTO
   ========================================================= */

function handleCorrectPair(
    source,
    target
) {

    source.pair.matched =
        true;

    source.button.classList.remove(
        "selected"
    );

    target.button.classList.remove(
        "selected"
    );

    source.button.classList.add(
        "matched"
    );

    target.button.classList.add(
        "matched"
    );

    source.button.disabled =
        true;

    target.button.disabled =
        true;

    AppState.roundMatches++;

    AppState.correctMatches++;

    AppState.currentStreak++;

    AppState.bestStreak =
        Math.max(
            AppState.bestStreak,
            AppState.currentStreak
        );

    AppState.score +=
        CONFIG.pointsPerMatch;

    updateScore();

    setSelectionStatus(
        "Combinação correta! ✓",
        "success"
    );

    setFeedback(
        `+${CONFIG.pointsPerMatch} pontos`,
        "success"
    );

    AppState.selectedSource =
        null;

    AppState.selectedTarget =
        null;

    AppState.isChecking =
        false;

    if (
        AppState.roundMatches ===
        AppState.roundPairs.length
    ) {

        setTimeout(
            completeRound,
            500
        );
    }
}


/* =========================================================
   ERRO
   ========================================================= */

function handleWrongPair(
    source,
    target
) {

    source.button.classList.add(
        "wrong"
    );

    target.button.classList.add(
        "wrong"
    );

    AppState.roundWrong++;

    AppState.wrongMatches++;

    AppState.currentStreak =
        0;

    AppState.score =
        Math.max(
            0,
            AppState.score -
            CONFIG.wrongPenalty
        );

    updateScore();

    setSelectionStatus(
        `"${source.pair.source}" não corresponde a "${target.pair.target}".`,
        "error"
    );

    setFeedback(
        `-${CONFIG.wrongPenalty} pontos`,
        "error"
    );

    setTimeout(
        () => {

            source.button.classList.remove(
                "wrong",
                "selected"
            );

            target.button.classList.remove(
                "wrong",
                "selected"
            );

            AppState.selectedSource =
                null;

            AppState.selectedTarget =
                null;

            AppState.isChecking =
                false;

            setSelectionStatus(
                "Tente novamente.",
                ""
            );

        },
        650
    );
}


/* =========================================================
   FINAL DA RODADA
   ========================================================= */

function completeRound() {

    AppState.score +=
        CONFIG.roundCompletionBonus;

    updateScore();

    setFeedback(
        `Rodada completa! +${CONFIG.roundCompletionBonus} pontos de bônus.`,
        "success"
    );

    if (
        AppState.currentRound >=
        AppState.totalRounds
    ) {

        setTimeout(
            finishGame,
            750
        );

        return;
    }

    setTimeout(
        startRound,
        900
    );
}


/* =========================================================
   FINAL DO JOGO
   ========================================================= */

function finishGame() {

    const elapsed =
        AppState.roundStartedAt
            ? (
                performance.now() -
                AppState.roundStartedAt
            ) / 1000
            : 0;

    if (DOM.finalScore) {

        DOM.finalScore.textContent =
            AppState.score;
    }

    if (DOM.correctMatches) {

        DOM.correctMatches.textContent =
            AppState.correctMatches;
    }

    if (DOM.wrongMatches) {

        DOM.wrongMatches.textContent =
            AppState.wrongMatches;
    }

    if (DOM.finalTime) {

        DOM.finalTime.textContent =
            `${Math.round(elapsed)}s`;
    }

    saveGameStats();

    showScreen(
        "screenResult"
    );
}