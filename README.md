# 🤖 Bot Telegram TypeScript

Koleksi bot Telegram yang dibangun dengan TypeScript, menampilkan berbagai fitur dan kemampuan bot Telegram modern.

## 📁 Bot yang Tersedia

### 🎯 Bot Base
- **Lokasi:** `bot-telegram-base/`
- **Fitur:** Commands dasar, inline keyboards, session management, games, calculator
- **Teknologi:** Telegraf.js, TypeScript

### 📊 Bot Chart
- **Lokasi:** `bot-telegram-with-subs-proc/`
- **Fitur:** Generate chart dengan AmCharts v4 + Puppeteer
- **Teknologi:** Subprocess processing, buffer transfer

### 🗄️ Bot Database
- **Lokasi:** `bot-telegram-postgres/`
- **Fitur:** Chart dari data PostgreSQL, SSH tunneling
- **Teknologi:** PostgreSQL, SSH2, connection pooling

## 🚀 Quick Start

### 1. Pilih Bot
```bash
cd bot-telegram-base        # Bot sederhana
cd bot-telegram-with-subs-proc  # Bot chart
cd bot-telegram-postgres    # Bot database
```

### 2. Setup
```bash
npm install
cp env.example .env
# Edit .env dengan token bot Anda
```

### 3. Jalankan
```bash
npm run dev    # Development
npm run build  # Build
npm start      # Production
```

## 📋 Commands

### Bot Base
- `/start` - Welcome message
- `/help` - Bantuan
- `/menu` - Menu interaktif
- `/game` - Game tebak angka
- `/calculator` - Kalkulator

### Bot Chart
- `/start` - Welcome
- `/chart` - Generate chart

### Bot Database
- `/start` - Welcome
- `/chart` - Sample chart
- `/latency [region] [node]` - Data latency

## 🛠️ Prasyarat

- Node.js (v16+)
- npm/yarn
- Token bot dari [@BotFather](https://t.me/botfather)

## 📚 Dokumentasi

- **Materi Lengkap:** `MATERI_SHARE_KNOWLEDGE_BOT_TELEGRAM.md`
- **Panduan Praktis:** `PANDUAN_PRAKTIS_BOT_TELEGRAM.md`
- **Presentasi:** `PRESENTASI_BOT_TELEGRAM.md`
- **Quick Reference:** `QUICK_REFERENCE_MODULES.md`

## 🔒 Keamanan

- Jangan commit file `.env`
- Gunakan environment variables
- Jaga keamanan token bot

## 🚀 Deployment

### PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

## 📞 Support

- **Email:** egiesugina704@gmail.com
- **Telegram:** @sylensnight
- **Issues:** [GitHub](https://github.com/EgieSugina/Bot-Telegram-TypeScript/issues)

## 📄 License

MIT License

---

**Author:** Egie Sugina  
**GitHub:** [@EgieSugina](https://github.com/EgieSugina) 