# 📚 MATERI SHARE KNOWLEDGE: BOT TELEGRAM

## 🎯 Tujuan Pembelajaran
Materi ini dirancang untuk memberikan pemahaman komprehensif tentang pengembangan bot Telegram, mulai dari konsep dasar Telegram API hingga implementasi praktis menggunakan berbagai modul dan teknologi.

---

## 📋 DAFTAR ISI

1. [Konsep Dasar Bot Telegram](#1-konsep-dasar-bot-telegram)
2. [Telegram Bot API](#2-telegram-bot-api)
3. [Framework dan Library](#3-framework-dan-library)
4. [Arsitektur Bot Telegram](#4-arsitektur-bot-telegram)
5. [Modul-Modul yang Digunakan](#5-modul-modul-yang-digunakan)
6. [Implementasi Praktis](#6-implementasi-praktis)
7. [Best Practices](#7-best-practices)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. KONSEP DASAR BOT TELEGRAM

### 🤖 Apa itu Bot Telegram?
Bot Telegram adalah program komputer yang berjalan di platform Telegram dan dapat berinteraksi dengan pengguna melalui pesan, perintah, dan fitur interaktif lainnya.

### 🔧 Cara Kerja Bot
1. **Webhook atau Long Polling**: Bot menerima update dari Telegram
2. **Processing**: Bot memproses pesan/perintah
3. **Response**: Bot mengirim respons kembali ke pengguna

### 📱 Fitur Utama Bot Telegram
- **Commands** (`/start`, `/help`, dll)
- **Inline Keyboards** (tombol interaktif)
- **Media Support** (foto, video, dokumen)
- **Callback Queries** (interaksi tombol)
- **Session Management** (penyimpanan data pengguna)
- **Webhooks** (real-time updates)

---

## 2. TELEGRAM BOT API

### 🔗 API Endpoint
```
https://api.telegram.org/bot<TOKEN>/<METHOD>
```

### 📝 Metode API Utama

#### 2.1 Update Methods
```typescript
// Mendapatkan updates
GET /getUpdates

// Mengirim pesan
POST /sendMessage
{
  "chat_id": 123456789,
  "text": "Hello World!",
  "parse_mode": "HTML"
}
```

#### 2.2 Message Types
```typescript
// Text Message
POST /sendMessage

// Photo
POST /sendPhoto

// Document
POST /sendDocument

// Video
POST /sendVideo

// Audio
POST /sendAudio

// Voice
POST /sendVoice
```

#### 2.3 Inline Keyboards
```typescript
POST /sendMessage
{
  "chat_id": 123456789,
  "text": "Choose an option:",
  "reply_markup": {
    "inline_keyboard": [
      [
        {"text": "Option 1", "callback_data": "opt1"},
        {"text": "Option 2", "callback_data": "opt2"}
      ]
    ]
  }
}
```

### 🔐 Authentication
```typescript
// Bot Token dari @BotFather
const BOT_TOKEN = "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz";

// Authorization Header
Authorization: Bot 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

---

## 3. FRAMEWORK DAN LIBRARY

### 🚀 Telegraf.js
Framework utama yang digunakan dalam proyek ini.

#### 3.1 Instalasi
```bash
npm install telegraf
npm install @types/node typescript ts-node
```

#### 3.2 Setup Dasar
```typescript
import { Telegraf, Context } from 'telegraf';

const bot = new Telegraf<Context>(process.env.BOT_TOKEN);

// Basic command
bot.command('start', (ctx) => {
  ctx.reply('Hello! Welcome to the bot!');
});

// Launch bot
bot.launch();
```

#### 3.3 Middleware System
```typescript
// Session middleware
import { session } from 'telegraf';

bot.use(session());

// Custom middleware
bot.use(async (ctx, next) => {
  console.log('New message:', ctx.message);
  await next();
});
```

### 📦 Dependencies Utama

#### 3.3.1 Core Dependencies
```json
{
  "telegraf": "^4.15.6",        // Framework bot Telegram
  "dotenv": "^16.3.1",          // Environment variables
  "typescript": "^5.3.2"        // Type safety
}
```

#### 3.3.2 Chart Generation Dependencies
```json
{
  "puppeteer": "^21.6.1",       // Headless browser untuk rendering
  "amcharts": "^4.0.0"          // Library chart (via CDN)
}
```

#### 3.3.3 Database Dependencies
```json
{
  "pg": "^8.11.3",              // PostgreSQL client
  "ssh2": "^1.16.0"             // SSH tunneling
}
```

---

## 4. ARSITEKTUR BOT TELEGRAM

### 🏗️ Struktur Umum
```
bot-telegram/
├── src/
│   ├── index.ts              # Entry point
│   ├── types.ts              # TypeScript definitions
│   ├── services/             # Business logic
│   │   ├── ChartService.ts
│   │   ├── DatabaseService.ts
│   │   └── ImageProcessor.ts
│   └── workers/              # Background processes
│       └── chartWorker.ts
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

### 🔄 Flow Arsitektur

#### 4.1 Basic Bot Flow
```
User Input → Telegram API → Bot → Processing → Response → User
```

#### 4.2 Chart Bot Flow
```
User Command → Bot → Chart Service → Puppeteer → Image → Response
```

#### 4.3 Database Bot Flow
```
User Command → Bot → Database Service → PostgreSQL → Data → Chart → Response
```

---

## 5. MODUL-MODUL YANG DIGUNAKAN

### 🎯 5.1 Bot Telegram Base

#### Dependencies
```json
{
  "telegraf": "^4.15.6",
  "dotenv": "^16.3.1"
}
```

#### Fitur Utama
- **Session Management**: Penyimpanan data pengguna
- **Inline Keyboards**: Tombol interaktif
- **Media Handling**: Foto, dokumen, suara
- **Command Processing**: Perintah dasar
- **Callback Queries**: Interaksi tombol

#### Implementasi Kunci
```typescript
// Session setup
bot.use(session());

// Command handler
bot.command('start', async (ctx) => {
  const welcomeMessage = `🤖 Welcome to the Bot!`;
  await ctx.reply(welcomeMessage);
});

// Inline keyboard
const keyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Option 1', 'opt1')],
  [Markup.button.callback('Option 2', 'opt2')]
]);
```

### 📊 5.2 Bot Telegram Chart (Subprocess)

#### Dependencies
```json
{
  "telegraf": "^4.15.6",
  "puppeteer": "^21.6.1",
  "dotenv": "^16.3.1"
}
```

#### Fitur Utama
- **Chart Generation**: Grafik dengan AmCharts v4
- **Subprocess Processing**: Isolasi pemrosesan gambar
- **Buffer Transfer**: Transfer gambar tanpa file I/O
- **Puppeteer Integration**: Rendering HTML ke gambar

#### Implementasi Kunci
```typescript
// Chart generation service
class ChartGenerator {
  async generateChart(data: any[]): Promise<Buffer> {
    const html = this.createChartHTML(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
  }
}

// Subprocess worker
const worker = spawn('node', ['dist/workers/imageWorker.js']);
worker.send({ type: 'generate', data: chartData });
```

### 🗄️ 5.3 Bot Telegram PostgreSQL

#### Dependencies
```json
{
  "telegraf": "^4.15.6",
  "puppeteer": "^21.6.1",
  "pg": "^8.11.3",
  "ssh2": "^1.16.0",
  "dotenv": "^16.3.1"
}
```

#### Fitur Utama
- **PostgreSQL Integration**: Koneksi database langsung
- **SSH Tunneling**: Koneksi database yang aman
- **Multiple Chart Types**: Line, column, area charts
- **Connection Pooling**: Manajemen koneksi efisien
- **Modular Architecture**: Arsitektur chart yang dapat digunakan kembali

#### Implementasi Kunci
```typescript
// Database service
class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

// SSH tunnel service
class SSHTunnelService {
  async createTunnel(): Promise<void> {
    const conn = new Client();
    await conn.connect({
      host: process.env.DB_SSH_HOST,
      port: parseInt(process.env.DB_SSH_PORT),
      username: process.env.DB_SSH_USERNAME,
      password: process.env.DB_SSH_PASSWORD
    });
  }
}
```

---

## 6. IMPLEMENTASI PRAKTIS

### 🚀 6.1 Setup Project

#### Step 1: Inisialisasi Project
```bash
# Buat direktori project
mkdir my-telegram-bot
cd my-telegram-bot

# Inisialisasi npm
npm init -y

# Install dependencies
npm install telegraf dotenv
npm install -D typescript @types/node ts-node nodemon
```

#### Step 2: Konfigurasi TypeScript
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

#### Step 3: Environment Variables
```env
# .env
BOT_TOKEN=your_telegram_bot_token_here
NODE_ENV=development
```

### 📝 6.2 Basic Bot Implementation

#### Entry Point (src/index.ts)
```typescript
import { Telegraf, Context } from 'telegraf';
import { session } from 'telegraf';
import * as dotenv from 'dotenv';

// Load environment
dotenv.config();

// Create bot instance
const bot = new Telegraf<Context>(process.env.BOT_TOKEN!);

// Session middleware
bot.use(session());

// Basic commands
bot.command('start', async (ctx) => {
  await ctx.reply('Hello! Welcome to the bot!');
});

bot.command('help', async (ctx) => {
  await ctx.reply('Available commands: /start, /help');
});

// Launch bot
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

### 🎨 6.3 Inline Keyboards

#### Implementation
```typescript
import { Markup } from 'telegraf';

bot.command('menu', async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('📊 Charts', 'charts'),
      Markup.button.callback('⚙️ Settings', 'settings')
    ],
    [
      Markup.button.url('🌐 Website', 'https://example.com'),
      Markup.button.callback('📞 Contact', 'contact')
    ]
  ]);

  await ctx.reply('Choose an option:', keyboard);
});

// Handle callback queries
bot.action('charts', async (ctx) => {
  await ctx.answerCbQuery('📊 Loading charts...');
  await ctx.editMessageText('Chart options coming soon!');
});
```

### 📊 6.4 Chart Generation

#### Chart Service
```typescript
import puppeteer from 'puppeteer';

class ChartService {
  async generateLineChart(data: any[]): Promise<Buffer> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.amcharts.com/lib/4/core.js"></script>
          <script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
          <script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
        </head>
        <body>
          <div id="chartdiv" style="width: 800px; height: 400px;"></div>
          <script>
            am4core.useTheme(am4themes_animated);
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            
            chart.data = ${JSON.stringify(data)};
            
            var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "category";
            
            var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "category";
          </script>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html);
    await page.waitForSelector('#chartdiv');
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false
    });

    await browser.close();
    return screenshot;
  }
}
```

### 🗄️ 6.5 Database Integration

#### Database Service
```typescript
import { Pool } from 'pg';

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

  async getLatencyData(region: string, node: string, days: number = 30) {
    const query = `
      SELECT 
        date,
        avg_latency,
        min_latency,
        max_latency
      FROM latency_data 
      WHERE region = $1 AND node = $2 
      AND date >= NOW() - INTERVAL '${days} days'
      ORDER BY date ASC
    `;

    const result = await this.pool.query(query, [region, node]);
    return result.rows;
  }

  async close() {
    await this.pool.end();
  }
}
```

---

## 7. BEST PRACTICES

### 🔒 7.1 Security
```typescript
// ✅ Gunakan environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;

// ✅ Validasi input
bot.command('echo', (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (text.length > 1000) {
    return ctx.reply('Message too long!');
  }
  ctx.reply(text);
});

// ✅ Rate limiting
const rateLimit = new Map();
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  const now = Date.now();
  const userRateLimit = rateLimit.get(userId) || 0;
  
  if (now - userRateLimit < 1000) { // 1 second
    return ctx.reply('Please wait before sending another message.');
  }
  
  rateLimit.set(userId, now);
  await next();
});
```

### 🏗️ 7.2 Architecture
```typescript
// ✅ Modular structure
// services/ChartService.ts
export class ChartService {
  async generateChart(data: any[]): Promise<Buffer> {
    // Implementation
  }
}

// services/DatabaseService.ts
export class DatabaseService {
  async query(sql: string, params: any[]): Promise<any> {
    // Implementation
  }
}

// index.ts
import { ChartService } from './services/ChartService';
import { DatabaseService } from './services/DatabaseService';

const chartService = new ChartService();
const dbService = new DatabaseService();
```

### 📝 7.3 Error Handling
```typescript
// ✅ Global error handler
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('Sorry, something went wrong!').catch(console.error);
});

// ✅ Try-catch in commands
bot.command('chart', async (ctx) => {
  try {
    const chart = await chartService.generateChart(data);
    await ctx.replyWithPhoto({ source: chart });
  } catch (error) {
    console.error('Chart generation error:', error);
    await ctx.reply('Failed to generate chart. Please try again.');
  }
});
```

### 🔄 7.4 Performance
```typescript
// ✅ Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Caching
const cache = new Map();
bot.command('weather', async (ctx) => {
  const city = ctx.message.text.split(' ')[1];
  const cacheKey = `weather_${city}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < 300000) { // 5 minutes
      return ctx.reply(cached.data);
    }
  }
  
  const weather = await getWeather(city);
  cache.set(cacheKey, {
    data: weather,
    timestamp: Date.now()
  });
  
  ctx.reply(weather);
});
```

---

## 8. TROUBLESHOOTING

### 🚨 8.1 Common Issues

#### Bot Not Responding
```typescript
// ✅ Check token
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required!');
}

// ✅ Check webhook/polling
bot.launch({
  polling: true // or webhook configuration
});
```

#### Chart Generation Fails
```typescript
// ✅ Puppeteer issues
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});

// ✅ Memory issues
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 400 });
```

#### Database Connection Issues
```typescript
// ✅ Connection timeout
const pool = new Pool({
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
});

// ✅ SSH tunnel issues
const conn = new Client();
conn.on('error', (err) => {
  console.error('SSH connection error:', err);
});
```

### 🔧 8.2 Debugging

#### Logging
```typescript
// ✅ Debug mode
if (process.env.NODE_ENV === 'development') {
  bot.use(async (ctx, next) => {
    console.log('Update:', JSON.stringify(ctx.update, null, 2));
    await next();
  });
}

// ✅ Error logging
bot.catch((err, ctx) => {
  console.error('Bot error:', {
    error: err.message,
    stack: err.stack,
    update: ctx.update
  });
});
```

#### Testing
```typescript
// ✅ Unit tests
import { Telegraf } from 'telegraf';

describe('Bot Commands', () => {
  it('should respond to /start', async () => {
    const bot = new Telegraf('test-token');
    // Test implementation
  });
});
```

---

## 📚 RESOURCES TAMBAHAN

### 🔗 Dokumentasi Resmi
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegraf.js Documentation](https://telegraf.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### 📖 Tutorial & Examples
- [BotFather Guide](https://core.telegram.org/bots#how-do-i-create-a-bot)
- [Telegraf.js Examples](https://github.com/telegraf/telegraf/tree/master/docs/examples)
- [Puppeteer Documentation](https://pptr.dev/)

### 🛠️ Tools & Libraries
- [AmCharts](https://www.amcharts.com/) - Chart library
- [Puppeteer](https://pptr.dev/) - Headless browser
- [PostgreSQL](https://www.postgresql.org/) - Database
- [SSH2](https://github.com/mscdex/ssh2) - SSH tunneling

---

## 🎯 KESIMPULAN

Materi ini telah mencakup:
1. ✅ Konsep dasar bot Telegram dan API
2. ✅ Framework Telegraf.js dan setup
3. ✅ Arsitektur modular untuk bot
4. ✅ Implementasi chart generation dengan Puppeteer
5. ✅ Integrasi database PostgreSQL
6. ✅ Best practices untuk security dan performance
7. ✅ Troubleshooting common issues

---

## 📞 SUPPORT

Untuk pertanyaan atau bantuan lebih lanjut:
- 📧 Email: [Egie Sugina](mail:egiesugina704@gmail.com)
- 💬 Telegram: [SylensNight](@sylensnight)
- 🐛 Issues: [GitHub Repository](https://github.com/EgieSugina/Bot-Telegram-TypeScript/issues)

---

*Materi ini dibuat untuk keperluan knowledge sharing internal. Terakhir diperbarui: [Current Date]* 