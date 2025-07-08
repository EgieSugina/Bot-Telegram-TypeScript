# 🤖 Telegram Bot TypeScript Demo

A comprehensive Telegram bot built with TypeScript and Telegraf.js that demonstrates all the basic features and methods available in the Telegraf framework.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [System Flow](#-system-flow)
- [Setup Instructions](#️-setup-instructions)
- [Project Structure](#-project-structure)
- [Available Commands](#-available-commands)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Features

### 📋 Basic Commands
- `/start` - Welcome message and bot introduction
- `/help` - Comprehensive help guide
- `/echo [text]` - Echo your message back

### 🎯 Interactive Features
- `/buttons` - Inline keyboard buttons demonstration
- `/menu` - Multi-level menu system
- `/contact` - Request contact information
- `/location` - Request location sharing

### 📱 Media Handling
- `/photo` - Send sample photos with interactive buttons
- `/document` - Send sample documents
- Handle user-uploaded photos, documents, and voice messages

### 🎮 Fun Features
- `/poll` - Create interactive polls
- `/quiz` - Create quizzes with explanations
- `/game` - Number guessing game with session management
- `/weather` - Weather simulation
- `/calculator` - Interactive calculator

### 🔧 Advanced Features
- Session management for user data
- Error handling and graceful shutdown
- TypeScript type safety
- Modular code structure

## 🏗️ Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Telegram Platform"
        TG[Telegram Users]
        TG_API[Telegram Bot API]
    end
    
    subgraph "Bot Application"
        WEBHOOK[Webhook Handler]
        BOT[Telegraf Bot Instance]
        MIDDLEWARE[Middleware Stack]
        SESSION[Session Manager]
    end
    
    subgraph "Command Handlers"
        BASIC[Basic Commands]
        INTERACTIVE[Interactive Features]
        MEDIA[Media Handlers]
        GAMES[Game Features]
        UTILS[Utility Commands]
    end
    
    subgraph "Data Layer"
        ENV[Environment Variables]
        TYPES[TypeScript Types]
    end
    
    TG --> TG_API
    TG_API --> WEBHOOK
    WEBHOOK --> BOT
    BOT --> MIDDLEWARE
    MIDDLEWARE --> SESSION
    SESSION --> BASIC
    SESSION --> INTERACTIVE
    SESSION --> MEDIA
    SESSION --> GAMES
    SESSION --> UTILS
    ENV --> BOT
    TYPES --> BOT
```

### Component Architecture

```mermaid
graph LR
    subgraph "Core Components"
        MAIN[index.ts<br/>Main Entry Point]
        TYPES[types.ts<br/>Type Definitions]
    end
    
    subgraph "Middleware"
        SESSION_MW[Session Middleware]
        ERROR_MW[Error Handler]
        LOG_MW[Logging Middleware]
    end
    
    subgraph "Command Categories"
        CMD_BASIC[Basic Commands<br/>start, help, echo]
        CMD_INTERACTIVE[Interactive Commands<br/>buttons, menu, contact]
        CMD_MEDIA[Media Commands<br/>photo, document]
        CMD_GAMES[Game Commands<br/>game, quiz, poll]
        CMD_UTILS[Utility Commands<br/>weather, calculator]
    end
    
    subgraph "External Services"
        TG_API[Telegram Bot API]
        ENV[Environment Config]
    end
    
    MAIN --> SESSION_MW
    MAIN --> ERROR_MW
    MAIN --> LOG_MW
    SESSION_MW --> CMD_BASIC
    SESSION_MW --> CMD_INTERACTIVE
    SESSION_MW --> CMD_MEDIA
    SESSION_MW --> CMD_GAMES
    SESSION_MW --> CMD_UTILS
    CMD_BASIC --> TG_API
    CMD_INTERACTIVE --> TG_API
    CMD_MEDIA --> TG_API
    CMD_GAMES --> TG_API
    CMD_UTILS --> TG_API
    ENV --> MAIN
    TYPES --> MAIN
```

## 🔄 System Flow

### Message Processing Flow

```mermaid
flowchart TD
    A[User sends message] --> B[Telegram Bot API]
    B --> C[Webhook receives update]
    C --> D[Telegraf processes update]
    D --> E{Message type?}
    
    E -->|Text Command| F[Command Handler]
    E -->|Callback Query| G[Callback Handler]
    E -->|Media| H[Media Handler]
    E -->|Contact/Location| I[Contact/Location Handler]
    
    F --> J{Command type?}
    J -->|Basic| K[Basic Commands]
    J -->|Interactive| L[Interactive Commands]
    J -->|Media| M[Media Commands]
    J -->|Games| N[Game Commands]
    J -->|Utils| O[Utility Commands]
    
    G --> P[Process Callback]
    H --> Q[Process Media]
    I --> R[Process Contact/Location]
    
    K --> S[Generate Response]
    L --> S
    M --> S
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S --> T[Send to Telegram API]
    T --> U[User receives response]
```

### Session Management Flow

```mermaid
flowchart TD
    A[User interaction] --> B{Session exists?}
    B -->|No| C[Create new session]
    B -->|Yes| D[Load existing session]
    
    C --> E[Initialize session data]
    D --> F[Retrieve session data]
    
    E --> G[Process command]
    F --> G
    
    G --> H{Update session?}
    H -->|Yes| I[Update session data]
    H -->|No| J[Keep current session]
    
    I --> K[Save session]
    J --> K
    
    K --> L[Send response]
    L --> M[Session persists for next interaction]
```

### Error Handling Flow

```mermaid
flowchart TD
    A[Command execution] --> B{Error occurs?}
    B -->|No| C[Normal response]
    B -->|Yes| D[Error caught by middleware]
    
    D --> E{Error type?}
    E -->|API Error| F[Handle API error]
    E -->|Validation Error| G[Handle validation error]
    E -->|Unknown Error| H[Handle unknown error]
    
    F --> I[Log error details]
    G --> I
    H --> I
    
    I --> J[Send user-friendly error message]
    J --> K[Continue bot operation]
    
    C --> L[End]
    K --> L
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Telegram bot token (get from [@BotFather](https://t.me/BotFather))

### Installation

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd bot-telegram-base
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your bot token
   BOT_TOKEN=your_bot_token_here
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the bot**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
bot-telegram-base/
├── src/
│   ├── index.ts          # Main bot file with all commands and handlers
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript files (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🎯 Available Commands

### Basic Commands
- `/start` - Welcome message and feature overview
- `/help` - Detailed help information
- `/echo [text]` - Echo your message

### Interactive Menus
- `/buttons` - Simple inline keyboard
- `/menu` - Multi-level menu system with categories

### Media Commands
- `/photo` - Send random photos with interactive buttons
- `/document` - Send sample documents

### Interactive Features
- `/contact` - Request contact information
- `/location` - Request location sharing
- `/poll` - Create a poll about programming languages
- `/quiz` - Create a quiz about HTML

### Utility Commands
- `/weather` - Simulated weather information
- `/calculator` - Interactive calculator
- `/game` - Number guessing game

## 🔧 Development

### Available Scripts
- `npm run dev` - Start in development mode with auto-restart
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the compiled bot
- `npm run watch` - Watch for changes and auto-restart

### Adding New Features

1. **Add commands** in `src/index.ts`
2. **Add callback handlers** in the same file
3. **Update types** in `src/types.ts` if needed
4. **Test your changes** with `npm run dev`


## 🎮 Interactive Features

### Menu System
The bot includes a comprehensive menu system with:
- Media menu (photos, documents, audio, video)
- Games menu (number game, quiz)
- Tools menu (calculator, weather)
- Info menu (about, version)

### Session Management
The bot uses Telegraf's session middleware to store:
- Game state (secret number, attempts)
- Calculator state (display, operations)

### Error Handling
- Graceful error handling for all operations
- User-friendly error messages
- Automatic bot shutdown on SIGINT/SIGTERM

## 📱 Bot Features Demonstrated

### Inline Keyboards
- Callback buttons
- URL buttons
- Contact request buttons
- Location request buttons

### Message Types
- Text messages
- Photos
- Documents
- Voice messages
- Polls and quizzes

### Interactive Elements
- Reply keyboards
- Inline keyboards
- Callback queries
- Session management

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your bot token secure
- Use environment variables for sensitive data
- Consider rate limiting for production use

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 Learning Resources

- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving documentation
- Fixing bugs
- Adding tests

### Contribution Flow

```mermaid
flowchart TD
    A[Fork repository] --> B[Create feature branch]
    B --> C[Make changes]
    C --> D[Test changes]
    D --> E{Tests pass?}
    E -->|No| C
    E -->|Yes| F[Commit changes]
    F --> G[Push to branch]
    G --> H[Create pull request]
    H --> I[Review process]
    I --> J{Merge?}
    J -->|Yes| K[Merge to main]
    J -->|No| L[Request changes]
    L --> C
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your bot token is correct
3. Ensure all dependencies are installed
4. Check the Telegraf.js documentation

### Troubleshooting Flow

```mermaid
flowchart TD
    A[Issue encountered] --> B{Error type?}
    B -->|Startup error| C[Check environment variables]
    B -->|Runtime error| D[Check console logs]
    B -->|API error| E[Check bot token]
    B -->|Build error| F[Check TypeScript config]
    
    C --> G{Token valid?}
    D --> H{Logs show issue?}
    E --> I{Token correct?}
    F --> J{Config valid?}
    
    G -->|No| K[Update .env file]
    H -->|Yes| L[Fix code issue]
    I -->|No| M[Get new token from BotFather]
    J -->|No| N[Fix tsconfig.json]
    
    G -->|Yes| O[Check dependencies]
    H -->|No| P[Enable debug logging]
    I -->|Yes| Q[Check API limits]
    J -->|Yes| R[Check file structure]
    
    K --> S[Restart bot]
    L --> S
    M --> S
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> S
```

---

**Made with ❤️ using TypeScript and Telegraf.js**