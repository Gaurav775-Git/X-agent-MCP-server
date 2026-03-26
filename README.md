# 🐦 Twitter MCP Agent

> An open-source MCP server to automate Twitter/X using Claude AI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-green.svg)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)
![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-1DA1F2.svg)

---

## 📖 What is Twitter MCP Agent?

**Twitter MCP Agent** is a fully open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets **Claude AI automate your Twitter/X account**. Simply describe what you want to tweet, and Claude handles the rest.

```
You (prompt Claude)
       ↓
    Claude
       ↓ calls a tool
  [post_tweet tool]
       ↓
  Your MCP Server  (Node.js)
       ↓
  Twitter/X API
       ↓
  Tweet goes live ✅
```

Built with **Node.js (ES Modules)** and the official MCP SDK — lightweight, extensible, and easy to contribute to.

---

## ✨ Features

- ✅ Post tweets directly through Claude AI
- 🕐 Schedule tweets for future publishing
- 💬 Auto-reply to mentions and threads
- 🔍 Search and retweet relevant content
- 🔌 Built on the official `@modelcontextprotocol/sdk`
- 🧩 Simple ES Module architecture — easy to read and extend

---

## 🛠️ Tech Stack

| Package | Purpose |
|---|---|
| `@modelcontextprotocol/sdk` | MCP protocol handler |
| `twitter-api-v2` | Twitter/X API v2 client |
| `zod` | Tool input validation |
| `dotenv` | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Twitter/X Developer Account](https://developer.twitter.com) with API keys

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/twitter-mcp.git
cd twitter-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

### 4. Run the Server

```bash
npm start
```

---

## 📁 Project Structure

```
twitter-mcp/
├── src/
│   ├── index.js          ← MCP server entry point
│   ├── twitter.js        ← Twitter API client setup
│   └── tools/
│       └── postTweet.js  ← Tool definition + handler
├── .env                  ← Your API keys (never commit)
├── .gitignore
└── package.json
```

---

## 🤝 Contributing

This project is **open source** and contributions are warmly welcomed — whether you're fixing a bug, adding a feature, improving docs, or just sharing ideas. Every contribution makes this better!

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit
   ```bash
   git commit -m "feat: add your feature"
   ```
4. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** and describe your changes

### 💡 Ideas for Contributions

- [ ] Add `schedule_tweet` tool
- [ ] Add `delete_tweet` tool
- [ ] Add `fetch_analytics` tool
- [ ] Improve error handling and retry logic
- [ ] Add Twitter rate limit awareness
- [ ] Write unit tests for existing tools
- [ ] Add support for Twitter threads (multi-tweet posts)
- [ ] Improve documentation and usage examples

> All skill levels are welcome. If you're new to open source, this is a great place to start! 🌱

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it.
See the [LICENSE](./LICENSE) file for details.

---

## 🌟 Support

If this project helped you, please consider giving it a **⭐ star** on GitHub — it helps others discover it!

---

<p align="center">Made with ❤️ by the community</p>