# WordMatch

> A lightweight word-matching game built with vanilla HTML, CSS, and JavaScript.

**WordMatch** is an interactive browser game designed to combine vocabulary practice with a simple and engaging gameplay experience.

The application presents words to the player and uses a dictionary API to retrieve linguistic data and translations, creating a dynamic experience without requiring a backend or external JavaScript framework.

---

## Overview

WordMatch was developed entirely with native web technologies, focusing on clean structure, modular JavaScript, responsive UI, and integration with an external REST API.

The project demonstrates how a complete interactive web application can be built without frameworks or build tools.

### Main technologies

* **HTML5** — semantic page structure
* **CSS3** — layout, styling, animations, and responsive interface
* **JavaScript (ES6+)** — application logic, game mechanics, state management, and API integration
* **REST API** — dictionary and translation data
* **JSON** — language and application data

---

## Features

* 🎮 Interactive word-matching gameplay
* 🌎 Word translation using an external dictionary API
* 📖 Dictionary-based word data
* 🧩 Modular JavaScript architecture
* 🌐 Multilingual structure
* 📊 Score tracking
* ⚡ Dynamic content without page reloads
* 📱 Responsive interface
* 🚫 No frontend framework required
* 🚫 No backend required

---

## How It Works

The application is divided into independent modules responsible for different parts of the experience.

The game flow can be summarized as:

```text
User
  │
  ▼
WordMatch Interface
  │
  ├── Game Logic
  │
  ├── Word Management
  │
  ├── Score Management
  │
  └── Dictionary API
          │
          ▼
    FreeDictionaryAPI
          │
          ▼
   Word / Translation Data
```

When the application needs information about a word, it communicates with the **FreeDictionaryAPI**, processes the returned JSON data, and uses the result within the game.

The API provides dictionary entries and can include translations, definitions, pronunciations, examples, synonyms, and other linguistic information.

---

## Project Structure

```text
WordMatch/
│
├── index.html
│
├── js/
│   ├── api.js
│   ├── app.js
│   ├── game.js
│   ├── score.js
│   └── words.js
│
├── sources/
│   └── languages/
│       └── en.json
│
├── styles/
│   └── main.css
│
└── README.md
```

### JavaScript modules

| File       | Responsibility                                     |
| ---------- | -------------------------------------------------- |
| `api.js`   | Communication with the external dictionary API     |
| `app.js`   | Application initialization and general UI behavior |
| `game.js`  | Core game mechanics and gameplay flow              |
| `score.js` | Score management                                   |
| `words.js` | Word-related data and operations                   |

This separation keeps the application logic organized and makes individual components easier to maintain and evolve.

---

## API Integration

WordMatch uses **FreeDictionaryAPI** as its dictionary data provider.

[FreeDictionaryAPI](https://freedictionaryapi.com/?utm_source=chatgpt.com)

The API provides access to structured dictionary data sourced from Wiktionary and supports word lookup and translations.

One of its advantages for this project is that it can be consumed directly from a browser because CORS is enabled and no API key is required.

### Example request

```http
GET /api/v1/en/hello?translations=true
```

The API returns structured JSON containing information such as:

```json
{
  "word": "hello",
  "entries": [
    {
      "language": {
        "code": "en",
        "name": "English"
      },
      "partOfSpeech": "interjection",
      "senses": [
        {
          "definition": "...",
          "translations": []
        }
      ]
    }
  ]
}
```

The application then processes the response and uses the relevant information during gameplay.

---

## Internationalization

The project includes a language-oriented structure under:

```text
sources/languages/
```

This allows language-specific resources to be maintained separately from the application logic.

For example:

```text
sources/
└── languages/
    └── en.json
```

This structure makes it possible to expand the application with additional languages in the future without having to restructure the entire project.

---

## Architecture

WordMatch intentionally avoids frameworks and libraries for its core functionality.

Instead, the application uses native browser APIs and a modular JavaScript structure.

### Application layers

```text
Presentation
    │
    └── HTML + CSS
          │
          ▼
Application
    │
    ├── app.js
    ├── game.js
    ├── score.js
    └── words.js
          │
          ▼
Integration
    │
    └── api.js
          │
          ▼
External REST API
```

This approach keeps the project lightweight while demonstrating fundamental frontend development concepts.

---

## Running Locally

Because WordMatch is a client-side application, no backend installation is required.

Clone the repository:

```bash
git clone https://github.com/KillDare/WordMatch.git
```

Enter the project directory:

```bash
cd WordMatch
```

Then open:

```text
index.html
```

in a modern web browser.

For development, using a local HTTP server is recommended.

For example, with VS Code, the **Live Server** extension can be used to serve the project locally.

---

## Browser Compatibility

WordMatch is designed for modern browsers supporting standard HTML5, CSS3, and modern JavaScript features.

Recommended browsers include:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

---

## Design Goals

The project was created with a few principles in mind:

### Simplicity

Avoid unnecessary dependencies and keep the application lightweight.

### Modularity

Separate game mechanics, API communication, score management, and word handling into independent modules.

### Maintainability

Keep responsibilities separated so new features can be added without significantly affecting existing functionality.

### Native Web Technologies

Demonstrate what can be achieved using the browser's native capabilities without relying on frontend frameworks.

---

## Future Improvements

Potential improvements for future versions include:

* [ ] Additional languages
* [ ] Difficulty levels
* [ ] Persistent player statistics
* [ ] Leaderboards
* [ ] Sound effects
* [ ] Additional game modes
* [ ] Improved accessibility
* [ ] Progressive Web App (PWA) support
* [ ] Offline word caching
* [x] More detailed player statistics

---

## Data Attribution

Dictionary data used by WordMatch is provided through **FreeDictionaryAPI**, which sources its content from Wiktionary.

According to the API documentation, the underlying Wiktionary content is distributed under the **CC BY-SA 4.0** license. FreeDictionaryAPI also requires attribution and a link to the original Wiktionary source where applicable.

For more information:

[FreeDictionaryAPI Documentation](https://freedictionaryapi.com/?utm_source=chatgpt.com)

[Wiktionary](https://www.wiktionary.org/?utm_source=chatgpt.com)

---

## License

This project is intended for educational and portfolio purposes.

If you intend to distribute or modify the project, please check the licensing terms of both this repository and the external data sources used by the application.

---

## Author

**Kildare Alves**

Computer Engineering student and software developer focused on frontend development, JavaScript, React Native, Delphi, APIs, and database-driven applications.

### Technologies

```text
HTML5
CSS3
JavaScript
REST APIs
JSON
Git
GitHub
```

---

## Repository

[View the project on GitHub](https://github.com/KillDare/WordMatch?utm_source=chatgpt.com)

---

> **WordMatch** — Learn words. Match them. Improve your vocabulary.
