/* =========================================================
   CARREGAR PALAVRAS
   ========================================================= */

async function loadWords() {

    const response =
        await fetch(
            CONFIG.wordsFile,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `Não foi possível carregar ${CONFIG.wordsFile}.`
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {

        throw new Error(
            "words.json deve ser um array de palavras."
        );
    }

    AppState.words =
        [
            ...new Set(
                data
                    .filter(
                        word =>
                            typeof word ===
                            "string"
                    )
                    .map(
                        word =>
                            word.trim()
                    )
                    .filter(Boolean)
            )
        ];

    console.log(
        `${AppState.words.length} palavras carregadas.`
    );
}


/* =========================================================
   EMBARALHAR
   ========================================================= */

function shuffleArray(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
                result[j],
                result[i]
            ];
    }

    return result;
}


/* =========================================================
   ESCOLHER ALEATORIAMENTE
   ========================================================= */

function chooseRandom(array) {

    if (
        !Array.isArray(array) ||
        array.length === 0
    ) {

        return null;
    }

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];
}


/* =========================================================
   NORMALIZAÇÃO
   ========================================================= */

function normalizeText(value) {

    return String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );
}