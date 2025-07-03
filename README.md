# BTT - Bot Telegram TypeScript

Proyek koleksi bot Telegram yang dibangun dengan TypeScript, menampilkan berbagai fitur dan kemampuan bot Telegram modern.

## 📁 Struktur Proyek

Proyek ini terdiri dari tiga bot Telegram yang berbeda:

### 🤖 bot-telegram-base
Bot Telegram komprehensif yang mendemonstrasikan semua fitur dasar dan metode yang tersedia dalam framework Telegraf.js.

### 📊 bot-telegram-with-subs-proc  
Bot Telegram khusus untuk menghasilkan grafik menggunakan AmCharts v4 dan Puppeteer dengan pemrosesan gambar berbasis subprocess.

### 🗄️ bot-telegram-postgres
Bot Telegram canggih yang menghasilkan grafik menggunakan AmCharts v4 dengan data dari PostgreSQL, mendukung SSH tunneling dan arsitektur chart yang dapat digunakan kembali.

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

### 📊 Bot Telegram Chart (Subprocess)

**Lokasi:** `bot-telegram-with-subs-proc/`

Bot khusus untuk menghasilkan dan mengirim grafik dengan pemrosesan subprocess:

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

### 🗄️ Bot Telegram PostgreSQL

**Lokasi:** `bot-telegram-postgres/`

Bot canggih untuk menghasilkan grafik dengan data dari database PostgreSQL:

#### Fitur Utama:
- **Multiple Chart Types**: Grafik garis, kolom, dan area
- **PostgreSQL Integration**: Koneksi langsung ke database dengan connection pooling
- **SSH Tunnel Support**: Koneksi database yang aman melalui SSH tunneling
- **Operator-based Legends**: Legend otomatis dengan kode warna untuk operator telekomunikasi
- **Reusable Architecture**: Arsitektur chart modular yang mendukung data-driven dan HTML template
- **Performance**: Rendering chart berbasis Puppeteer dengan isolasi subprocess

#### Teknologi:
- TypeScript
- Telegraf.js
- PostgreSQL (pg)
- AmCharts v4
- Puppeteer
- SSH2 (untuk tunneling)
- Connection pooling

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

#### Untuk Bot Telegram Chart (Subprocess):
```bash
cd bot-telegram-with-subs-proc
```

#### Untuk Bot Telegram PostgreSQL:
```bash
cd bot-telegram-postgres
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

# Edit file .env dan tambahkan konfigurasi yang diperlukan
```

#### Konfigurasi Environment untuk Bot PostgreSQL:
```env
# Telegram Bot Token
BOT_TOKEN=your_telegram_bot_token_here

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
DB_SSH_PRIVATE_KEY=
DB_SSH_PASSPHRASE=
DB_LOCAL_PORT=15432

# Optional: Set to true for development mode
NODE_ENV=development
```

### 5. Build dan Jalankan Bot

#### Mode Development:
```bash
# Build terlebih dahulu (khusus untuk chart bot dan postgres bot)
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

### Bot Telegram Chart (Subprocess)
- `/start` - Pesan selamat datang dan perintah yang tersedia
- `/help` - Informasi bantuan
- `/chart` - Menghasilkan grafik garis dengan data acak

### Bot Telegram PostgreSQL
- `/start` - Pesan selamat datang dan overview perintah
- `/help` - Bantuan detail dan instruksi penggunaan
- `/chart` - Menghasilkan grafik contoh dengan data acak
- `/latency [region] [node]` - Menampilkan data latency jaringan untuk 30 hari terakhir

#### Penggunaan Perintah Latency:
```bash
# Default: SUMBAGSEL region, 4G node
/latency

# Specify region dan node
/latency SUMBAGSEL 4G

# Different region
/latency JABAR 3G
```

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

### Bot Telegram Chart (Subprocess)
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

### Bot Telegram PostgreSQL
```
bot-telegram-postgres/
├── src/
│   ├── index.ts                    # Entry point bot utama
│   ├── services/
│   │   ├── ChartProcessor.ts       # Layanan pemrosesan chart modular
│   │   ├── DatabaseService.ts      # Layanan koneksi database
│   │   └── SSHTunnelService.ts     # Layanan SSH tunneling
│   └── workers/
│       └── chartWorker.ts          # Worker proses anak untuk chart
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
- `npm run watch` - Watch perubahan dan auto-restart (chart bot dan postgres bot)

## 🔒 Keamanan

- ❌ Jangan commit file `.env` Anda
- 🔐 Jaga keamanan token bot Anda
- 🌍 Gunakan environment variables untuk data sensitif
- ⚡ Pertimbangkan rate limiting untuk penggunaan produksi
- 🔑 Untuk bot PostgreSQL, gunakan SSH key authentication untuk tunneling

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
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SSH2 Documentation](https://github.com/mscdex/ssh2)

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -am 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Author

- Egie Sugina
- Email: Egie Sugina
- GitHub: [@EgieSugina](https://github.com/EgieSugina)

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

### v1.1.0
- Menambahkan bot-telegram-postgres
- Integrasi PostgreSQL dengan SSH tunneling
- Arsitektur chart modular yang dapat digunakan kembali
- Support multiple chart types (line, column, area)
- Operator-based legends untuk data telekomunikasi 