
# WeatherNow – Weather & Calendar Web App

## 🚀 Features

- **Current weather & 5-day forecast** (OpenWeatherMap API)
- **Google Calendar integration** (OAuth2, see/add events)
- **AI-powered activity suggestions** (Google Gemini via local proxy)
- **Modern UI:** React, Tailwind, Nginx in production
- **Easy deployment:** Docker & docker-compose

---

## 🐳 Quickstart (Docker Compose)

### 1. **Requirements**

- [Docker](https://www.docker.com/) & [docker-compose](https://docs.docker.com/compose/) installed
- **Google API credentials** (for Calendar, OAuth)
- **Gemini API key** (for AI activity suggestions, used only in proxy service)

### 2. **Project Structure**

```

.
├── Dockerfile\_Frontend
├── proxy/
│   ├── Dockerfile\_Proxy
│   ├── gemini-proxy.js
│   └── package.json
├── docker-compose.yml
├── nginx.conf
├── src/
│   └── ... (React source code)
└── ...

````

### 3. **Start the App**

```bash
# From the project root
docker-compose up --build
````

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Proxy (Gemini API):** [http://localhost:4000](http://localhost:4000)
  (Note: only the frontend should use the proxy, not directly from browser!)

### 4. **Configuration & API Keys**

#### OpenWeather API Key

* Set in `WeatherContext.js` by default (can also be moved to `.env`).

#### Google Calendar API

* Set up a Google OAuth2 client for your app.
* Credentials are handled client-side; **never commit secrets to git!**
* OAuth consent flow runs in browser.

#### Gemini Proxy

* Gemini API key is passed via `docker-compose.yml` (`GEMINI_API_KEY=...`).
* The frontend communicates **only** with the local proxy, never directly with Gemini.

---

## 📋 Requirements (per Portfolio Assignment)

Based on the official portfolio assignment (see PDF):

* **Frontend:** Modern React weather web app
* **Backend/Proxy:** Node.js/Express service as proxy for Gemini API
* **Dockerized:** Both frontend and proxy in separate containers; orchestrated with `docker-compose`
* **Google Calendar:** Users can log in via Google, view/add events to their calendar
* **AI Functionality:** Activity suggestions are generated using Gemini and shown in the UI
* **Security:** No API keys in frontend code; Gemini key is protected by proxy

---

## 🛠️ Local Development (Optional)

**Start frontend:**

```bash
npm install
npm start
```

**Start proxy:**

```bash
cd proxy
npm install
node gemini-proxy.js
```


