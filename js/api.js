const API = {

    baseUrl:
        "https://freedictionaryapi.com/api/v1",

    sourceLanguage:
        "en"
};


/* =========================================================
   IDIOMAS
   ========================================================= */

async function loadLanguages() {

    const response =
        await fetch(
            `${API.baseUrl}/languages`,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Não foi possível carregar os idiomas."
        );
    }

    const data =
        await response.json();

    if (!Array.isArray(data)) {

        throw new Error(
            "Resposta inválida da API de idiomas."
        );
    }

    AppState.languages =
        data;
}


function findLanguage(code) {

    return AppState.languages.find(
        language =>
            language.code === code
    );
}


function updateLanguageUI() {

    const source =
        findLanguage(
            AppState.sourceLanguage
        );

    const target =
        findLanguage(
            AppState.targetLanguage
        );

    if (
        source &&
        DOM.sourceLanguageLabel
    ) {

        DOM.sourceLanguageLabel.textContent =
            source.name;
    }

    if (
        target &&
        DOM.targetLanguageLabel
    ) {

        DOM.targetLanguageLabel.textContent =
            target.name;
    }

    if (
        target &&
        DOM.targetColumnTitle
    ) {

        DOM.targetColumnTitle.textContent =
            sourceLanguageName(
                target.name
            );
    }
}


function sourceLanguageName(name) {

    return String(
        name || ""
    ).toUpperCase();
}


/* =========================================================
   DICIONÁRIO
   ========================================================= */

async function getWordEntry(word) {

    const cacheKey =
        word.toLowerCase();

    if (
        AppState.dictionaryCache.has(
            cacheKey
        )
    ) {

        return AppState.dictionaryCache.get(
            cacheKey
        );
    }

    const url =
        `${API.baseUrl}/entries/` +
        `${AppState.sourceLanguage}/` +
        `${encodeURIComponent(word)}` +
        `?translations=true`;

    const response =
        await fetch(url);

    if (!response.ok) {

        if (
            response.status === 404
        ) {

            AppState.dictionaryCache.set(
                cacheKey,
                null
            );

            return null;
        }

        throw new Error(
            `Erro ${response.status} ao consultar "${word}".`
        );
    }

    const data =
        await response.json();

    AppState.dictionaryCache.set(
        cacheKey,
        data
    );

    return data;
}


/* =========================================================
   TRADUÇÕES
   ========================================================= */

function getTranslations(
    entry,
    languageCode
) {

    const translations = [];

    if (
        !entry ||
        !Array.isArray(entry.entries)
    ) {

        return translations;
    }

    entry.entries.forEach(
        dictionaryEntry => {

            if (
                !Array.isArray(
                    dictionaryEntry.senses
                )
            ) {

                return;
            }

            dictionaryEntry.senses.forEach(
                sense => {

                    if (
                        !Array.isArray(
                            sense.translations
                        )
                    ) {

                        return;
                    }

                    sense.translations.forEach(
                        translation => {

                            if (
                                translation?.language?.code !==
                                languageCode
                            ) {

                                return;
                            }

                            if (
                                typeof translation.word !==
                                "string"
                            ) {

                                return;
                            }

                            const value =
                                translation.word.trim();

                            if (
                                value &&
                                !translations.some(
                                    item =>
                                        normalizeText(item) ===
                                        normalizeText(value)
                                )
                            ) {

                                translations.push(
                                    value
                                );
                            }
                        }
                    );
                }
            );
        }
    );

    return translations;
}


async function getWordTranslation(word) {

    const entry =
        await getWordEntry(word);

    if (!entry) {

        return null;
    }

    const translations =
        getTranslations(
            entry,
            AppState.targetLanguage
        );

    if (
        translations.length === 0
    ) {

        return null;
    }

    return {

        word,

        translation:
            chooseRandom(
                translations
            ),

        translations,

        entry
    };
}