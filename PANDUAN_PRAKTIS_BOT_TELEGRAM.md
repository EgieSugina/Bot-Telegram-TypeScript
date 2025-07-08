# 🛠️ PANDUAN PRAKTIS: MEMBUAT BOT TELEGRAM

## 🎯 Tujuan
Panduan praktis ini akan mengajarkan Anda cara membuat bot Telegram dari awal hingga deployment, dengan contoh-contoh yang dapat langsung dijalankan.

---

## 📋 DAFTAR ISI

1. [Persiapan Awal](#1-persiapan-awal)
2. [Bot Sederhana](#2-bot-sederhana)
3. [Bot dengan Inline Keyboard](#3-bot-dengan-inline-keyboard)
4. [Bot dengan Session Management](#4-bot-dengan-session-management)
5. [Bot dengan Chart Generation](#5-bot-dengan-chart-generation)
6. [Bot dengan Database](#6-bot-dengan-database)
7. [Deployment](#7-deployment)

---

## 1. PERSIAPAN AWAL

### 🔧 1.1 Setup Development Environment

#### Install Node.js dan npm
```bash
# Download dari https://nodejs.org/
# Atau gunakan nvm (Node Version Manager)
nvm install 18
nvm use 18
```

#### Install TypeScript
```bash
npm install -g typescript ts-node nodemon
```

### 🤖 1.2 Membuat Bot di Telegram

#### Step 1: Chat dengan @BotFather
1. Buka Telegram
2. Cari `@BotFather`
3. Kirim `/newbot`
4. Ikuti instruksi untuk membuat bot

#### Step 2: Dapatkan Token
```
BotFather akan memberikan token seperti:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 📁 1.3 Setup Project

#### Buat direktori project
```bash
mkdir my-telegram-bot
cd my-telegram-bot
```

#### Inisialisasi npm
```bash
npm init -y
```

#### Install dependencies
```bash
npm install telegraf dotenv
npm install -D typescript @types/node ts-node nodemon
```

#### Buat file konfigurasi TypeScript
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

#### Buat file environment
```env
# .env
BOT_TOKEN=your_bot_token_here
NODE_ENV=development
```

#### Update package.json scripts
```json
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

## 2. BOT SEDERHANA

### 📝 2.1 Bot Hello World

#### Buat file `src/index.ts`
```typescript
import { Telegraf, Context } from 'telegraf';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if bot token is provided
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

// Create bot instance
const bot = new Telegraf<Context>(process.env.BOT_TOKEN);

// Basic commands
bot.command('start', async (ctx) => {
  await ctx.reply('Hello! Welcome to my bot! 🤖');
});

bot.command('help', async (ctx) => {
  const helpMessage = `
Available commands:
/start - Welcome message
/help - Show this help
/echo [text] - Echo your message
  `;
  await ctx.reply(helpMessage);
});

bot.command('echo', async (ctx) => {
  const text = ctx.message.text.split(' ').slice(1).join(' ');
  if (text) {
    await ctx.reply(`You said: ${text}`);
  } else {
    await ctx.reply('Please provide some text to echo!');
  }
});

// Handle text messages
bot.on('text', async (ctx) => {
  await ctx.reply(`You sent: ${ctx.message.text}`);
});

// Launch bot
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Bot is running...');
```

#### Jalankan bot
```bash
npm run dev
```

### 🧪 2.2 Test Bot

1. Buka Telegram
2. Cari bot Anda (username yang Anda buat)
3. Kirim `/start`
4. Test command lainnya

---

## 3. BOT DENGAN INLINE KEYBOARD

### 🎨 3.1 Bot dengan Menu Interaktif

#### Update `src/index.ts`
```typescript
import { Telegraf, Context, Markup } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Context>(process.env.BOT_TOKEN);

// Start command with menu
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🤖 Welcome to Interactive Bot!

Choose an option from the menu below:
  `;
  
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('📊 Get Stats', 'get_stats'),
      Markup.button.callback('⚙️ Settings', 'settings')
    ],
    [
      Markup.button.callback('📞 Contact', 'contact'),
      Markup.button.callback('❓ Help', 'help')
    ],
    [
      Markup.button.url('🌐 Visit Website', 'https://example.com')
    ]
  ]);

  await ctx.reply(welcomeMessage, keyboard);
});

// Handle callback queries
bot.action('get_stats', async (ctx) => {
  await ctx.answerCbQuery('📊 Loading stats...');
  
  const stats = `
📊 Bot Statistics:
• Total users: 1,234
• Messages today: 567
• Commands used: 890
• Uptime: 99.9%
  `;
  
  await ctx.editMessageText(stats);
});

bot.action('settings', async (ctx) => {
  await ctx.answerCbQuery('⚙️ Opening settings...');
  
  const settingsKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🔔 Notifications', 'toggle_notifications'),
      Markup.button.callback('🌍 Language', 'change_language')
    ],
    [
      Markup.button.callback('🔙 Back to Main', 'back_to_main')
    ]
  ]);

  await ctx.editMessageText('⚙️ Settings Menu:', settingsKeyboard);
});

bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery('📞 Contact information');
  await ctx.editMessageText('📞 Contact us at: support@example.com');
});

bot.action('help', async (ctx) => {
  await ctx.answerCbQuery('❓ Help information');
  await ctx.editMessageText('❓ Use /start to see the main menu');
});

bot.action('back_to_main', async (ctx) => {
  await ctx.answerCbQuery('🔙 Going back...');
  await ctx.deleteMessage();
  await ctx.reply('🤖 Welcome back! Use /start to see the menu.');
});

bot.action('toggle_notifications', async (ctx) => {
  await ctx.answerCbQuery('🔔 Notifications toggled!');
  await ctx.editMessageText('🔔 Notifications have been toggled!');
});

bot.action('change_language', async (ctx) => {
  await ctx.answerCbQuery('🌍 Language options');
  await ctx.editMessageText('🌍 Language options coming soon!');
});

// Launch bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Interactive bot is running...');
```

### 🎯 3.2 Fitur Tambahan

#### Request Contact dan Location
```typescript
// Add these commands to your bot

bot.command('contact', async (ctx) => {
  const keyboard = Markup.keyboard([
    [Markup.button.contactRequest('📞 Share Contact')]
  ]).resize();

  await ctx.reply('Please share your contact information:', keyboard);
});

bot.command('location', async (ctx) => {
  const keyboard = Markup.keyboard([
    [Markup.button.locationRequest('📍 Share Location')]
  ]).resize();

  await ctx.reply('Please share your location:', keyboard);
});

// Handle contact sharing
bot.on('contact', async (ctx) => {
  const contact = ctx.message.contact;
  await ctx.reply(`Thanks! I received contact from ${contact.first_name}`);
});

// Handle location sharing
bot.on('location', async (ctx) => {
  const location = ctx.message.location;
  await ctx.reply(`Thanks! Your location: ${location.latitude}, ${location.longitude}`);
});
```

---

## 4. BOT DENGAN SESSION MANAGEMENT

### 💾 4.1 Bot dengan State Management

#### Install session middleware
```bash
npm install telegraf-session-local
```

#### Update `src/index.ts`
```typescript
import { Telegraf, Context, Markup } from 'telegraf';
import { session } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

// Define session interface
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

// Game command
bot.command('game', async (ctx) => {
  const number = Math.floor(Math.random() * 100) + 1;
  ctx.session!.gameNumber = number;
  ctx.session!.attempts = 0;
  ctx.session!.step = 'playing';

  await ctx.reply(`
🎮 Number Guessing Game!

I'm thinking of a number between 1 and 100.
Try to guess it!

Send me a number to start guessing.
  `);
});

// Handle number guesses
bot.on('text', async (ctx) => {
  if (ctx.session?.step === 'playing') {
    const guess = parseInt(ctx.message.text);
    
    if (isNaN(guess)) {
      await ctx.reply('Please send a valid number!');
      return;
    }

    ctx.session.attempts!++;

    if (guess === ctx.session.gameNumber) {
      await ctx.reply(`
🎉 Congratulations! You guessed it in ${ctx.session.attempts} attempts!

The number was: ${ctx.session.gameNumber}

Play again with /game
      `);
      ctx.session.step = undefined;
    } else if (guess < ctx.session.gameNumber) {
      await ctx.reply('📈 Too low! Try a higher number.');
    } else {
      await ctx.reply('📉 Too high! Try a lower number.');
    }
  } else {
    // Default text handler
    await ctx.reply(`You said: ${ctx.message.text}`);
  }
});

// Calculator command
bot.command('calculator', async (ctx) => {
  ctx.session!.calculatorValue = '';
  ctx.session!.step = 'calculator';

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('7', 'calc_7'),
      Markup.button.callback('8', 'calc_8'),
      Markup.button.callback('9', 'calc_9'),
      Markup.button.callback('÷', 'calc_divide')
    ],
    [
      Markup.button.callback('4', 'calc_4'),
      Markup.button.callback('5', 'calc_5'),
      Markup.button.callback('6', 'calc_6'),
      Markup.button.callback('×', 'calc_multiply')
    ],
    [
      Markup.button.callback('1', 'calc_1'),
      Markup.button.callback('2', 'calc_2'),
      Markup.button.callback('3', 'calc_3'),
      Markup.button.callback('-', 'calc_minus')
    ],
    [
      Markup.button.callback('0', 'calc_0'),
      Markup.button.callback('.', 'calc_dot'),
      Markup.button.callback('=', 'calc_equals'),
      Markup.button.callback('+', 'calc_plus')
    ],
    [
      Markup.button.callback('C', 'calc_clear')
    ]
  ]);

  await ctx.reply('🧮 Calculator\n\n0', keyboard);
});

// Handle calculator buttons
bot.action(/calc_(.+)/, async (ctx) => {
  if (ctx.session?.step !== 'calculator') return;

  const action = ctx.match[1];
  let value = ctx.session.calculatorValue || '';

  switch (action) {
    case 'clear':
      value = '';
      break;
    case 'equals':
      try {
        value = eval(value).toString();
      } catch {
        value = 'Error';
      }
      break;
    default:
      value += action;
  }

  ctx.session.calculatorValue = value;
  await ctx.editMessageText(`🧮 Calculator\n\n${value}`);
});

// Launch bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Session bot is running...');
```

---

## 5. BOT DENGAN CHART GENERATION

### 📊 5.1 Bot Chart Generator

#### Install dependencies
```bash
npm install puppeteer
```

#### Buat struktur folder
```bash
mkdir src/services
mkdir src/workers
```

#### Buat file `src/services/ChartService.ts`
```typescript
import puppeteer from 'puppeteer';

export class ChartService {
  async generateLineChart(data: any[]): Promise<Buffer> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Chart</title>
          <script src="https://cdn.amcharts.com/lib/4/core.js"></script>
          <script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
          <script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            #chartdiv { width: 800px; height: 400px; }
          </style>
        </head>
        <body>
          <div id="chartdiv"></div>
          <script>
            am4core.useTheme(am4themes_animated);
            
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.data = ${JSON.stringify(data)};
            
            var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "category";
            xAxis.title.text = "Time";
            
            var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.title.text = "Value";
            
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "category";
            series.strokeWidth = 3;
            series.tooltipText = "{category}: {value}";
            
            chart.cursor = new am4charts.XYCursor();
            chart.legend = new am4charts.Legend();
          </script>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 400 });
      await page.setContent(html);
      
      // Wait for chart to render
      await page.waitForSelector('#chartdiv');
      await page.waitForTimeout(1000);

      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false
      });

      return screenshot;
    } finally {
      await browser.close();
    }
  }

  generateSampleData(): any[] {
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        category: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 20
      });
    }
    return data;
  }
}
```

#### Update `src/index.ts`
```typescript
import { Telegraf, Context } from 'telegraf';
import * as dotenv from 'dotenv';
import { ChartService } from './services/ChartService';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Context>(process.env.BOT_TOKEN);
const chartService = new ChartService();

// Start command
bot.command('start', async (ctx) => {
  const welcomeMessage = `
📊 Chart Generator Bot

Available commands:
/start - Show this message
/help - Show help
/chart - Generate a sample chart
  `;
  
  await ctx.reply(welcomeMessage);
});

// Chart command
bot.command('chart', async (ctx) => {
  try {
    await ctx.reply('📊 Generating chart... Please wait.');
    
    const data = chartService.generateSampleData();
    const chartBuffer = await chartService.generateLineChart(data);
    
    await ctx.replyWithPhoto(
      { source: chartBuffer },
      { caption: '📊 Sample Line Chart' }
    );
  } catch (error) {
    console.error('Chart generation error:', error);
    await ctx.reply('❌ Failed to generate chart. Please try again.');
  }
});

// Help command
bot.command('help', async (ctx) => {
  const helpMessage = `
📚 Chart Bot Help

Commands:
• /start - Welcome message
• /help - This help message
• /chart - Generate a sample line chart

The bot uses AmCharts v4 and Puppeteer to generate beautiful charts.
  `;
  
  await ctx.reply(helpMessage);
});

// Launch bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Chart bot is running...');
```

---

## 6. BOT DENGAN DATABASE

### 🗄️ 6.1 Bot dengan PostgreSQL

#### Install dependencies
```bash
npm install pg ssh2
npm install -D @types/pg @types/ssh2
```

#### Buat file `src/services/DatabaseService.ts`
```typescript
import { Pool, PoolClient } from 'pg';

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'bot_telegram',
      user: process.env.DB_USER || 'postgres',
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

  async getLatencyData(region: string, node: string, days: number = 30): Promise<any[]> {
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

    return await this.query(query, [region, node]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
```

#### Buat file `src/services/SSHTunnelService.ts`
```typescript
import { Client } from 'ssh2';

export class SSHTunnelService {
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

#### Update `.env`
```env
# Telegram Bot Token
BOT_TOKEN=your_bot_token_here

# PostgreSQL Database Configuration
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
```

#### Update `src/index.ts`
```typescript
import { Telegraf, Context } from 'telegraf';
import * as dotenv from 'dotenv';
import { DatabaseService } from './services/DatabaseService';
import { SSHTunnelService } from './services/SSHTunnelService';
import { ChartService } from './services/ChartService';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Context>(process.env.BOT_TOKEN);
const dbService = new DatabaseService();
const sshService = new SSHTunnelService();
const chartService = new ChartService();

// Initialize SSH tunnel if needed
if (process.env.DB_USE_SSH === 'true') {
  sshService.createTunnel().catch(console.error);
}

// Start command
bot.command('start', async (ctx) => {
  const welcomeMessage = `
🗄️ Database Chart Bot

Available commands:
/start - Show this message
/help - Show help
/chart - Generate sample chart
/latency [region] [node] - Get latency data

Examples:
/latency SUMBAGSEL 4G
/latency JABAR 3G
  `;
  
  await ctx.reply(welcomeMessage);
});

// Latency command
bot.command('latency', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    const region = args[1] || 'SUMBAGSEL';
    const node = args[2] || '4G';

    await ctx.reply(`📊 Fetching latency data for ${region} - ${node}...`);

    // For demo purposes, generate sample data
    // In real implementation, use: const data = await dbService.getLatencyData(region, node);
    const data = generateSampleLatencyData(region, node);
    
    const chartBuffer = await chartService.generateLineChart(data);
    
    await ctx.replyWithPhoto(
      { source: chartBuffer },
      { caption: `📊 Latency Chart: ${region} - ${node}` }
    );
  } catch (error) {
    console.error('Latency command error:', error);
    await ctx.reply('❌ Failed to fetch latency data. Please try again.');
  }
});

// Helper function to generate sample data
function generateSampleLatencyData(region: string, node: string): any[] {
  const data = [];
  for (let i = 0; i < 30; i++) {
    data.push({
      category: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 50) + 20 // 20-70ms latency
    });
  }
  return data;
}

// Help command
bot.command('help', async (ctx) => {
  const helpMessage = `
📚 Database Bot Help

Commands:
• /start - Welcome message
• /help - This help message
• /chart - Generate a sample chart
• /latency [region] [node] - Get latency data

Database Features:
• PostgreSQL integration
• SSH tunneling support
• Connection pooling
• Real-time data queries

Examples:
/latency SUMBAGSEL 4G
/latency JABAR 3G
  `;
  
  await ctx.reply(helpMessage);
});

// Graceful shutdown
process.once('SIGINT', async () => {
  await dbService.close();
  await sshService.close();
  bot.stop('SIGINT');
});

process.once('SIGTERM', async () => {
  await dbService.close();
  await sshService.close();
  bot.stop('SIGTERM');
});

// Launch bot
bot.launch();

console.log('Database bot is running...');
```

---

## 7. DEPLOYMENT

### 🚀 7.1 Deployment ke Server

#### Step 1: Prepare Production Build
```bash
# Build TypeScript
npm run build

# Test production build
npm start
```

#### Step 2: Setup PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
```

#### Buat file `ecosystem.config.js`
```javascript
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

#### Step 3: Deploy dengan PM2
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor application
pm2 monit

# View logs
pm2 logs telegram-bot

# Restart application
pm2 restart telegram-bot

# Stop application
pm2 stop telegram-bot
```

### 🌐 7.2 Deployment dengan Docker

#### Buat file `Dockerfile`
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

#### Buat file `docker-compose.yml`
```yaml
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

#### Deploy dengan Docker
```bash
# Build dan run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### 🔧 7.3 Environment Variables untuk Production

#### Buat file `.env.production`
```env
# Telegram Bot
BOT_TOKEN=your_production_bot_token

# Database
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=bot_telegram
DB_USER=bot_user
DB_PASSWORD=secure_password

# SSH Tunnel (if needed)
DB_USE_SSH=true
DB_SSH_HOST=your_ssh_server
DB_SSH_PORT=22
DB_SSH_USERNAME=bot_user
DB_SSH_PASSWORD=ssh_password

# Application
NODE_ENV=production
PORT=3000
```

---

## 🎯 KESIMPULAN

Panduan ini telah mengajarkan Anda:

1. ✅ Setup development environment
2. ✅ Membuat bot sederhana
3. ✅ Menambahkan inline keyboards
4. ✅ Implementasi session management
5. ✅ Chart generation dengan Puppeteer
6. ✅ Database integration dengan PostgreSQL
7. ✅ Deployment ke production

### 🚀 Next Steps

1. **Eksperimen**: Coba fitur-fitur baru
2. **Optimasi**: Terapkan best practices
3. **Monitoring**: Setup logging dan monitoring
4. **Scaling**: Pertimbangkan horizontal scaling

### 📚 Resources Tambahan

- [Telegraf.js Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Puppeteer Documentation](https://pptr.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

*Panduan ini dibuat untuk pembelajaran praktis. Selamat coding! 🎉* 