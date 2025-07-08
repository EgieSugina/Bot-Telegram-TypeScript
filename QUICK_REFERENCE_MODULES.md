# 📚 QUICK REFERENCE: MODULES & DEPENDENCIES

## 🎯 Overview
Quick reference untuk semua modul dan dependencies yang digunakan dalam proyek bot Telegram.

---

## 📦 CORE DEPENDENCIES

### 🤖 Telegraf.js
**Package:** `telegraf`  
**Version:** `^4.15.6`  
**Description:** Modern framework untuk bot Telegram

```typescript
import { Telegraf, Context, Markup, session } from 'telegraf';

// Basic setup
const bot = new Telegraf<Context>(process.env.BOT_TOKEN);

// Commands
bot.command('start', (ctx) => ctx.reply('Hello!'));

// Actions
bot.action('button', (ctx) => ctx.answerCbQuery('Clicked!'));

// Middleware
bot.use(session());
bot.use(async (ctx, next) => {
  console.log('New message:', ctx.message);
  await next();
});

// Launch
bot.launch();
```

**Key Features:**
- TypeScript support
- Middleware system
- Session management
- Inline keyboards
- File handling

---

### 🔧 Environment Variables
**Package:** `dotenv`  
**Version:** `^16.3.1`  
**Description:** Load environment variables dari file .env

```typescript
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Access variables
const botToken = process.env.BOT_TOKEN;
const dbHost = process.env.DB_HOST;
```

---

## 📊 CHART GENERATION

### 🎨 Puppeteer
**Package:** `puppeteer`  
**Version:** `^21.6.1`  
**Description:** Headless browser untuk rendering HTML ke gambar

```typescript
import puppeteer from 'puppeteer';

class ChartService {
  async generateChart(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 400 });
      await page.setContent(html);
      
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false
      });

      return screenshot;
    } finally {
      await browser.close();
    }
  }
}
```

**Key Features:**
- Headless browser automation
- HTML to image conversion
- Custom viewport settings
- Memory management

---

### 📈 AmCharts v4
**CDN:** `https://cdn.amcharts.com/lib/4/`  
**Description:** Library chart untuk membuat grafik interaktif

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.amcharts.com/lib/4/core.js"></script>
  <script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
  <script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
</head>
<body>
  <div id="chartdiv"></div>
  <script>
    am4core.useTheme(am4themes_animated);
    
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = [
      { category: "Jan", value: 100 },
      { category: "Feb", value: 120 },
      { category: "Mar", value: 90 }
    ];
    
    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "category";
    
    var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
  </script>
</body>
</html>
```

**Chart Types:**
- Line Chart
- Column Chart
- Area Chart
- Pie Chart
- Scatter Plot

---

## 🗄️ DATABASE INTEGRATION

### 🐘 PostgreSQL
**Package:** `pg`  
**Version:** `^8.11.3`  
**Description:** PostgreSQL client untuk Node.js

```typescript
import { Pool, PoolClient } from 'pg';

class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(text: string, params?: any[]): Promise<any[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
```

**Key Features:**
- Connection pooling
- Parameterized queries
- Transaction support
- Type safety

---

### 🔐 SSH Tunneling
**Package:** `ssh2`  
**Version:** `^1.16.0`  
**Description:** SSH client untuk tunneling koneksi database

```typescript
import { Client } from 'ssh2';

class SSHTunnelService {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async createTunnel(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect({
        host: process.env.DB_SSH_HOST,
        port: parseInt(process.env.DB_SSH_PORT || '22'),
        username: process.env.DB_SSH_USERNAME,
        password: process.env.DB_SSH_PASSWORD,
        // privateKey: fs.readFileSync('/path/to/key'),
        // passphrase: 'key_passphrase'
      });

      this.client.on('ready', () => {
        console.log('SSH tunnel established');
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('SSH connection error:', err);
        reject(err);
      });
    });
  }

  async close(): Promise<void> {
    this.client.end();
  }
}
```

**Authentication Methods:**
- Password authentication
- Private key authentication
- Passphrase protection

---

## ⚡ PERFORMANCE & UTILITIES

### 🔄 Child Process
**Built-in:** `child_process`  
**Description:** Subprocess untuk isolasi pemrosesan

```typescript
import { spawn } from 'child_process';

class ImageProcessor {
  async processImage(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const worker = spawn('node', ['dist/workers/imageWorker.js']);
      
      worker.send({ type: 'generate', data });
      
      worker.on('message', (result) => {
        if (result.type === 'success') {
          resolve(Buffer.from(result.data));
        } else {
          reject(new Error(result.error));
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });
    });
  }
}
```

**Key Features:**
- Process isolation
- Memory management
- Crash isolation
- Inter-process communication

---

### 📝 Session Management
**Built-in:** `telegraf/session`  
**Description:** Session middleware untuk state management

```typescript
import { session } from 'telegraf';

interface BotSession {
  step?: string;
  gameNumber?: number;
  attempts?: number;
  calculatorValue?: string;
}

interface BotContext extends Context {
  session?: BotSession;
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

// Session middleware
bot.use(session());

// Initialize session
bot.use(async (ctx, next) => {
  if (!ctx.session) {
    ctx.session = {};
  }
  await next();
});

// Use session
bot.command('game', async (ctx) => {
  ctx.session!.gameNumber = Math.floor(Math.random() * 100) + 1;
  ctx.session!.attempts = 0;
  ctx.session!.step = 'playing';
});
```

---

## 🛠️ DEVELOPMENT DEPENDENCIES

### 🔷 TypeScript
**Package:** `typescript`  
**Version:** `^5.3.2`  
**Description:** Type safety untuk JavaScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

### 🔄 Development Tools
**Packages:**
- `ts-node`: `^10.9.1` - Run TypeScript directly
- `nodemon`: `^3.0.1` - Auto-restart on file changes
- `@types/node`: `^20.10.0` - TypeScript definitions for Node.js

```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "nodemon --exec ts-node src/index.ts"
  }
}
```

---

## 📋 PACKAGE.JSON TEMPLATES

### 🎯 Basic Bot
```json
{
  "name": "telegram-bot-basic",
  "version": "1.0.0",
  "description": "Basic Telegram bot with Telegraf.js",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "nodemon --exec ts-node src/index.ts"
  },
  "dependencies": {
    "telegraf": "^4.15.6",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.2",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1"
  }
}
```

### 📊 Chart Bot
```json
{
  "name": "telegram-chart-bot",
  "version": "1.0.0",
  "description": "Telegram bot with chart generation",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "tsc --watch"
  },
  "dependencies": {
    "telegraf": "^4.15.6",
    "puppeteer": "^21.6.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}
```

### 🗄️ Database Bot
```json
{
  "name": "telegram-database-bot",
  "version": "1.0.0",
  "description": "Telegram bot with PostgreSQL integration",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "tsc --watch"
  },
  "dependencies": {
    "telegraf": "^4.15.6",
    "puppeteer": "^21.6.1",
    "pg": "^8.11.3",
    "ssh2": "^1.16.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/pg": "^8.10.9",
    "@types/ssh2": "^1.11.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}
```

---

## 🔧 ENVIRONMENT VARIABLES

### 🌍 Environment Template
```env
# Telegram Bot
BOT_TOKEN=your_telegram_bot_token_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bot_telegram
DB_USER=postgres
DB_PASSWORD=your_password_here

# SSH Tunnel Configuration (optional)
DB_USE_SSH=false
DB_SSH_HOST=your-ssh-server
DB_SSH_PORT=22
DB_SSH_USERNAME=root
DB_SSH_PASSWORD=your-ssh-password
DB_SSH_PRIVATE_KEY=
DB_SSH_PASSPHRASE=

# Application
NODE_ENV=development
PORT=3000
```

---

## 🚀 DEPLOYMENT SCRIPTS

### 📦 PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'telegram-bot',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      BOT_TOKEN: 'your_bot_token_here'
    }
  }]
};
```

### 🐳 Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  telegram-bot:
    build: .
    environment:
      - BOT_TOKEN=${BOT_TOKEN}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    restart: unless-stopped
```

---

## 📚 USEFUL COMMANDS

### 🔧 Development
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build project
npm run build

# Production mode
npm start

# Watch mode
npm run watch
```

### 🚀 Deployment
```bash
# PM2 deployment
pm2 start ecosystem.config.js
pm2 monit
pm2 logs telegram-bot
pm2 restart telegram-bot

# Docker deployment
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## 🎯 TROUBLESHOOTING

### 🚨 Common Issues

**Puppeteer Issues:**
```bash
# Install dependencies on Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
    libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils wget
```

**Database Connection Issues:**
```typescript
// Check connection
const client = await pool.connect();
try {
  const result = await client.query('SELECT NOW()');
  console.log('Database connected:', result.rows[0]);
} finally {
  client.release();
}
```

**SSH Tunnel Issues:**
```typescript
// Test SSH connection
const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection successful');
  conn.end();
});
conn.on('error', (err) => {
  console.error('SSH connection failed:', err);
});
```

---

*Quick Reference ini dibuat untuk memudahkan pengembangan bot Telegram. Terakhir diperbarui: [Current Date]* 