@@ -15,25 +15,86 @@ This project emphasizes both **object-oriented design** and **user-centric priva
## 🛠 Tech Stack

- **Language**: C++
- **GUI Framework**: Qt (Widgets)
- **Paradigm**: Object-Oriented Programming (OOP)
- **Build Tool**: qmake / CMake

## ✨ Features

- 🔐 **Privacy Controls**: Toggle profiles and posts between public and private
- 👤 **Dynamic Profiles**: Store and display user attributes like name, interests, and connections
- 🔍 **Search Functionality**: Find users based on keywords or filters



https://github.com/user-attachments/assets/37016637-4cd2-415f-8a40-5b0c086be36b

## 🚀 Getting Started

1. Make sure you have **Qt installed** on your system.
2. Open the `SocialNetwork.pro` file using **Qt Creator**.
3. Click **Run** to build and launch the application.




---

# Cloudflare AI Assignment (cf_ai_*)

This repository now includes a Cloudflare Workers AI companion app in `cf_ai_app/` for the SocialNetwork project. It satisfies the assignment requirements and demonstrates how an AI assistant can guide users through SocialNetwork features:

**Assignment requirements mapped to implementation:**

- **LLM**: Workers AI with Llama 3.3 (`@cf/meta/llama-3.3-70b-instruct`).
- **Workflow/coordination**: Durable Objects (`ChatSession`) manage per-session chat flow.
- **User input (chat)**: Web chat UI served from Workers Assets.
- **Memory/state**: Durable Object storage keeps chat history (last 20 messages).

## 📁 Project Structure

```
cf_ai_app/
  public/            # Chat UI (Pages-like static assets)
  src/               # Worker + Durable Object
  package.json
  tsconfig.json
  wrangler.toml
```

## 🚀 Run Locally

1. Install dependencies:
   ```bash
   cd cf_ai_app
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL printed by Wrangler and start chatting.

## ☁️ Deploy

```bash
cd cf_ai_app
npm run deploy
```

## 🔑 Required Cloudflare Bindings

The provided `wrangler.toml` includes:

- **Workers AI binding**: `AI`
- **Durable Object binding**: `CHAT_SESSION`
- **Assets directory**: `public/`

## ✅ API Endpoints

- `POST /api/chat` — Body: `{ "message": "...", "sessionId": "..." }`
- `POST /api/reset` — Body: `{ "sessionId": "..." }`

## 📝 Prompts

All AI prompts used to build this are documented in `PROMPTS.md`.
