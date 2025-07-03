# BTT - Bot Telegram TypeScript

Proyek koleksi bot Telegram yang dibangun dengan TypeScript, menampilkan berbagai fitur dan kemampuan bot Telegram modern.

## 📁 Struktur Proyek

Proyek ini terdiri dari dua bot Telegram yang berbeda:

### 🤖 bot-telegram-base
Bot Telegram komprehensif yang mendemonstrasikan semua fitur dasar dan metode yang tersedia dalam framework Telegraf.js.

### 📊 bot-telegram-with-subs-proc  
Bot Telegram khusus untuk menghasilkan grafik menggunakan AmCharts v4 dan Puppeteer dengan pemrosesan gambar berbasis subprocess.

## 🚀 Fitur Umum

- ✅ **TypeScript** - Keamanan tipe dan pengembangan yang lebih baik
- ✅ **Telegraf.js** - Framework bot Telegram yang powerful
- ✅ **Modular** - Struktur kode yang terorganisir
- ✅ **Error Handling** - Penanganan error yang baik
- ✅ **Environment Variables** - Konfigurasi yang aman

## 🛠️ Prasyarat

- Node.js (v16 atau lebih tinggi)
- npm/yarn package manager
- Token bot Telegram (dapatkan dari [@BotFather](https://t.me/botfather))

## 📖 Detail Masing-masing Bot

### 🤖 Bot Telegram Base

**Lokasi:** `bot-telegram-base/`

Bot komprehensif yang menampilkan semua fitur dasar Telegram bot:

#### Fitur Utama:
- **Perintah Dasar**: `/start`, `/help`, `/echo`
- **Fitur Interaktif**: Tombol inline, menu multi-level, kontak, lokasi
- **Media Handling**: Foto, dokumen, pesan suara
- **Fitur Fun**: Polling, kuis, game tebak angka, kalkulator
- **Session Management**: Penyimpanan data pengguna
- **Weather Simulation**: Simulasi cuaca

#### Teknologi:
- TypeScript
- Telegraf.js
- Session middleware
- Inline keyboards
- Callback queries

### 📊 Bot Telegram Chart

**Lokasi:** `bot-telegram-with-subs-proc/`

Bot khusus untuk menghasilkan dan mengirim grafik:

#### Fitur Utama:
- **Pembuatan Grafik**: Grafik garis dengan AmCharts v4
- **Subprocess Processing**: Isolasi pemrosesan gambar untuk performa lebih baik
- **Buffer Transfer**: Transfer gambar tanpa file I/O
- **Modern UI**: Styling grafik yang modern dan responsif

#### Teknologi:
- TypeScript
- Telegraf.js
- AmCharts v4
- Puppeteer
- Child Process
- Buffer processing

## 🚀 Cara Memulai

### 1. Clone Repository
```bash
git clone <repository-url>
cd BTT
```

### 2. Pilih Bot yang Ingin Dijalankan

#### Untuk Bot Telegram Base:
```bash
cd bot-telegram-base
```

#### Untuk Bot Telegram Chart:
```bash
cd bot-telegram-with-subs-proc
```

### 3. Install Dependencies
```bash
# Menggunakan npm
npm install

# Atau menggunakan yarn
yarn install
```

### 4. Setup Environment Variables
```bash
# Copy file contoh environment
cp env.example .env

# Edit file .env dan tambahkan token bot Anda
# BOT_TOKEN=token_bot_telegram_anda_disini
```

### 5. Build dan Jalankan Bot

#### Mode Development:
```bash
# Build terlebih dahulu (khusus untuk chart bot)
npm run build

# Jalankan dalam mode development
npm run dev
```

#### Mode Production:
```bash
# Build project
npm run build

# Jalankan bot
npm start
```

## 📋 Perintah Bot

### Bot Telegram Base
- `/start` - Pesan selamat datang dan pengenalan bot
- `/help` - Panduan bantuan lengkap
- `/echo [teks]` - Echo pesan Anda
- `/buttons` - Demo tombol inline keyboard
- `/menu` - Sistem menu multi-level
- `/contact` - Minta informasi kontak
- `/location` - Minta sharing lokasi
- `/photo` - Kirim foto contoh dengan tombol interaktif
- `/document` - Kirim dokumen contoh
- `/poll` - Buat polling interaktif
- `/quiz` - Buat kuis dengan penjelasan
- `/game` - Game tebak angka dengan session management
- `/weather` - Simulasi informasi cuaca
- `/calculator` - Kalkulator interaktif

### Bot Telegram Chart
- `/start` - Pesan selamat datang dan perintah yang tersedia
- `/help` - Informasi bantuan
- `/chart` - Menghasilkan grafik garis dengan data acak

## 🏗️ Arsitektur

### Bot Telegram Base
```
bot-telegram-base/
├── src/
│   ├── index.ts          # File utama bot
│   └── types.ts          # Definisi type TypeScript
├── dist/                 # File JavaScript yang dikompilasi
├── package.json          # Dependencies dan scripts
├── tsconfig.json         # Konfigurasi TypeScript
└── env.example           # Template environment variables
```

### Bot Telegram Chart
```
bot-telegram-with-subs-proc/
├── src/
│   ├── index.ts                    # Entry point bot utama
│   ├── services/
│   │   ├── ImageProcessor.ts       # Layanan pemrosesan gambar subprocess
│   │   └── ChartGenerator.ts       # Generator berbasis file
│   └── workers/
│       └── imageWorker.ts          # Worker proses anak TypeScript
├── dist/                           # JavaScript yang dikompilasi
├── package.json
├── tsconfig.json
└── env.example
```

## 🔧 Pengembangan

### Menambah Fitur Baru
1. Tambahkan command di file `src/index.ts`
2. Tambahkan callback handler jika diperlukan
3. Update types di `src/types.ts` jika diperlukan
4. Test perubahan dengan `npm run dev`

### Scripts yang Tersedia
- `npm run dev` - Jalankan dalam mode development dengan auto-restart
- `npm run build` - Kompilasi TypeScript ke JavaScript
- `npm start` - Jalankan bot yang sudah dikompilasi
- `npm run watch` - Watch perubahan dan auto-restart (chart bot)

## 🔒 Keamanan

- ❌ Jangan commit file `.env` Anda
- 🔐 Jaga keamanan token bot Anda
- 🌍 Gunakan environment variables untuk data sensitif
- ⚡ Pertimbangkan rate limiting untuk penggunaan produksi

## 🚀 Deployment

### Development Lokal
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Deployment Server
1. Setup server dengan Node.js
2. Clone repository
3. Install dependencies
4. Setup environment variables
5. Build dan jalankan dengan PM2 atau supervisor lainnya

## 📚 Resource Pembelajaran

- [Dokumentasi Telegraf.js](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Dokumentasi TypeScript](https://www.typescriptlang.org/)
- [AmCharts Documentation](https://www.amcharts.com/docs/v4/)
- [Puppeteer Documentation](https://pptr.dev/)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -am 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Author

- Nama Author
- Email: email@example.com
- GitHub: [@username](https://github.com/username)

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Cek dokumentasi masing-masing bot di folder mereka
2. Buat issue di GitHub repository
3. Hubungi author melalui email

## 📝 Changelog

### v1.0.0
- Rilis awal dengan dua bot Telegram
- Bot base dengan fitur komprehensif
- Bot chart dengan subprocess processing
- Dokumentasi lengkap dalam bahasa Indonesia 