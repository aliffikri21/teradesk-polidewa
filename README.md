# TeraDesk — Digital Workspace & Operating System Organisasi

Platform manajemen, administrasi, dan koordinasi digital terintegrasi untuk **TERAMEDIA** (Teknologi Rekayasa Multimedia, Politeknik Dewantara). Dirancang untuk mendigitalisasi alur kerja organisasi dari pengajuan program kerja, surat-menyurat, inventaris alat, keuangan, presensi, hingga log aktivitas real-time berbasis cloud.

---

## 🌟 Fitur Utama

### 1. Landing Page Modern & Responsif
- **Hero Section**: Preview interaktif kartu program kerja, arsip administrasi, metrik performa, dan profil pimpinan organisasi (responsif untuk Smartphone, Tablet, hingga Desktop).
- **Fitur Unggulan**: Grid 11 modul layanan organisasi dengan akses langsung ke workspace masing-masing.
- **Tentang Kami**: Profil organisasi TERAMEDIA dilengkapi *auto-scrolling marquee carousel* dokumentasi kegiatan terkompresi WebP.
- **Footer & Developer Credits**: Navigasi lengkap, tautan sosial media resmi Instagram ([@teramedia.polidewa](https://www.instagram.com/teramedia.polidewa)), newsletter, serta modal interaktif **Developer Credit** bergaya *clean white dashboard*.
- **Formulir Kontak & Konsultasi**: Form interaktif modal kontak publik yang tersinkronisasi secara real-time ke panel admin dashboard dan Cloud Firestore.

### 2. Portal Katalog 11 Layanan Organisasi
Satu ekosistem kerja digital terpusat mencakup 11 modul siap pakai:
1. **PAR (Program Approval Request)**: Alur persetujuan proposal berjenjang (Panitia ➔ Kadiv ➔ BPH ➔ Pembina) dengan live tracking SLA dan barcode digital.
2. **Digitalisasi Arsip & E-Surat**: Penyimpanan cloud surat masuk/keluar, SK, LPJ, dan generator nomor surat otomatis anti-bentrok.
3. **Digitalisasi Aset & Inventaris**: Katalog alat multimedia (kamera, lighting, mic, proyektor) dengan peminjaman dan tracking ketersediaan.
4. **Kas & Reimbursement Anggaran**: Pencatatan kas, upload bukti transfer/nota via smartphone, dan monitoring pagu belanja per divisi.
5. **Presensi Rapat & Kegiatan**: QR code dinamis, validasi GPS radius lokasi kegiatan, dan ekspor rekap absensi.
6. **Timeline & Kalender Kegiatan**: Roadmap kalender kerja terpadu dengan sinkronisasi Google Calendar dan notifikasi deadline.
7. **Manajemen SDM & Kaderisasi**: Database pengurus/kader, riwayat divisi, kepengurusan demisioner, rapor kader, dan scoring kinerja terpadu.
8. **TeraHelpdesk & Layanan Internal**: Sistem tiket pengaduan teknis alat, konsultasi divisi, dan bantuan operasional.
9. **Humas & Kemitraan Eksternal**: Pengelolaan database media partner, sponsorship, relasi stakeholder, dan surat audiensi.
10. **KKM (Kewirausahaan & Merchandise)**: Etalase merchandise resmi organisasi, pemesanan jaket/kaos proker, dan pencatatan laba usaha mahasiswa.
11. **Arsip Kegiatan & Dokumentasi**: Repositori arsip kegiatan terlaksana untuk seluruh divisi (tanggal, lokasi, jumlah partisipan, dokumentasi visual, dan unduh berkas LPJ resmi).

### 3. Dashboard Admin Eksekutif & Manajemen Data (`/admin`)
- Pintasan keyboard cepat: `Ctrl + Shift + D` untuk akses instan admin console.
- **Log Aktivitas & Jejak Audit (Audit Trail Console)**:
  - Pemantauan terpusat siapa saja pengurus yang baru login (Nama, NIM, Jabatan, Divisi, Level Akses) dengan timestamp presisi jam:menit:detik serta tanggal.
  - Rekaman setiap aksi submit formulir di seluruh TeraDesk (Konsultasi, Timeline Proker, PAR, mutasi akun, dll.).
  - 3 Metric Cards: Total Jejak Audit, Aktivitas Login Pengurus, dan Submit Modul & Formulir.
  - Filter pills cepat: `Semua Aktivitas`, `Aktivitas Login`, `Submit Modul`, dan `Sistem & Akun`.
  - Live search instan dan fitur **Ekspor JSON**, **Reset Log**, serta **Bersihkan Log**.
- **Kotak Masuk Konsultasi (Inbox Kontak)**: Integrasi end-to-end formulir konsultasi landing page publik, counter unread real-time, filter status (Baru, Diproses, Selesai), detail pesan interaktif, dan aksi respon langsung.
- **Manajemen Program Kerja**: Input proker baru, edit data, filter kategori per divisi, dan toggle pin ke Hero showcase.
- **Manajemen Akun Pengurus**: Tambah akun, reset password, atur hak akses admin (`canAccessAdmin`), dan ekspor data akun JSON.
- **Status Modul Layanan**: Kontrol operasional real-time status modul (*Online* / *Maintenance*).
- **Executive Metrics**: Monitoring performa pengajuan proposal, serapan anggaran kas, utilisasi inventaris, dan audit log.

### 4. Database Cloud Firestore & Sinkronisasi Real-Time Multi-Perangkat
- Menggunakan **Google Firebase (Cloud Firestore)** untuk sinkronisasi data antar-perangkat secara instan via listener WebSocket (`onSnapshot`).
- **Arsitektur Hybrid**:
  - Jika konfigurasi Firebase aktif di `.env.local` / Vercel, data otomatis tersinkronisasi antar-HP dan laptop anggota secara live.
  - Jika offline atau belum terkonfigurasi, aplikasi tetap berjalan mulus dengan fallback lokal (`localStorage`).
- Koleksi Cloud Firestore:
  - `activity_logs`: Jejak audit login pengurus dan submit modul organisasi.
  - `consultations`: Pesan formulir konsultasi dari landing page ke admin dashboard.

### 5. Sistem Autentikasi & Keamanan Sesi (`/login`)
- Validasi hak akses berbasis peran (Role-Based Access Control).
- Kredensial Pengembang Resmi:
  - **NIM**: `23404053`
  - **Kata Sandi**: `admin`
  - **Role**: Demisioner Ketua Umum (`canAccessAdmin: true`).
- Sesi login aman berbasis memori (`sessionStorage` otomatis di-clear saat refresh untuk integritas keamanan demo).

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vite.dev/) |
| **Database & Cloud Sync** | [Google Firebase Cloud Firestore](https://firebase.google.com/) (`firebase` v11+) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Typography** | Apple SF Pro Display (`@qpokychuk/sf-pro-display`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Linter** | [Oxlint](https://oxc.rs/) |
| **Hosting Deployment** | [Vercel](https://vercel.com/) (Konfigurasi `vercel.json` SPA routing) |

---

## 📁 Struktur Direktori

```text
teradesk-ui-slicing/
├── public/
│   ├── images/
│   │   ├── about/              # Asset WebP carousel Tentang Kami (img1.webp - img5.webp)
│   │   ├── alip-credit.png     # Foto profil Developer Credits
│   │   └── img1.JPG            # Foto dokumentasi Hero section
│   └── logo-teramedia.png      # Favicon dan logo resmi brand
├── src/
│   ├── assets/                 # Font SF Pro Display & asset statis
│   ├── components/
│   │   ├── admin/              # AdminDashboardPage.jsx (Executive Console & Audit Log)
│   │   ├── auth/               # Komponen autentikasi tambahan
│   │   ├── services/           # 11 halaman modul layanan & ServicePageLayout.jsx
│   │   ├── AboutUs.jsx         # Section profil organisasi & marquee carousel
│   │   ├── ContactModal.jsx    # Modal kontak interaktif
│   │   ├── Features.jsx        # Grid fitur layanan landing page
│   │   ├── FeaturesPortal.jsx  # Portal pencarian & katalog 11 modul
│   │   ├── Footer.jsx          # Footer & Modal Developer Credit
│   │   ├── Hero.jsx            # Responsive Hero section & dynamic showcase
│   │   ├── LoginPage.jsx       # Form autentikasi pengurus
│   │   └── Navbar.jsx          # Header navigasi utama responsif
│   ├── data/
│   │   ├── defaultAccounts.js      # Master data akun pengurus awal
│   │   ├── defaultActivityLogs.js  # Master data riwayat audit log awal
│   │   ├── defaultConsultations.js # Master data pesan konsultasi awal
│   │   └── defaultProker.js        # Master data program kerja terintegrasi
│   ├── services/
│   │   ├── firebase.js             # Inisialisasi Firebase & Cloud Firestore
│   │   ├── activityLogService.js   # Service CRUD & onSnapshot log aktivitas
│   │   └── consultationService.js  # Service CRUD & onSnapshot kotak masuk konsultasi
│   ├── App.jsx                 # Router aplikasi, state sinkronisasi & bus data
│   ├── index.css               # Konfigurasi Tailwind v4 & font SF Pro
│   ├── index.html              # Entry point HTML aplikasi (Vite root: 'src')
│   └── main.jsx                # React root mount
├── .env.example                # Panduan template environment variable Firebase
├── package.json
├── vercel.json                 # Rewrite rule SPA routing untuk deploy Vercel
└── vite.config.js              # Konfigurasi Vite (root: 'src', outDir: '../dist')
```

---

## 💻 Panduan Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Lingkungan Firebase (Opsional untuk Sinkronisasi Cloud)
Salin file `.env.example` menjadi `.env.local` di root folder proyek:
```bash
cp .env.example .env.local
```
Lengkapi nilai konfigurasi dari **Firebase Console ➔ Project Settings ➔ Web App (`</>`)**:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=teradesk-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=teradesk-xxxx
VITE_FIREBASE_STORAGE_BUCKET=teradesk-xxxx.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Aplikasi dapat diakses di browser pada:
- **Lokal**: `http://localhost:5173/`
- **Jaringan HP (Satu Wi-Fi)**: Periksa alamat IP yang ditampilkan Vite (misal: `http://192.168.x.x:5173/`).

### 4. Pengecekan Kualitas Kode (Linting)
```bash
npm run lint
```

### 5. Build untuk Produksi
```bash
npm run build
```
Hasil build produksi siap deploy akan tersimpan pada direktori `dist/`.

---

## 🚀 Panduan Deployment ke Vercel

TeraDesk sudah dilengkapi file [vercel.json](file:///d:/VSCode/teradesk-ui-slicing/vercel.json) sehingga rute SPA (`/admin`, `/login`, dll.) tidak akan error 404 saat di-refresh.

1. Push repository ke GitHub.
2. Di dashboard [Vercel](https://vercel.com/), pilih **Add New ➔ Project**, lalu impor repository ini.
3. Pada pengaturan proyek:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Di bagian **Environment Variables**, tambahkan variabel `VITE_FIREBASE_*` dari file `.env.local` Anda.
5. Klik **Deploy**. Website TeraDesk akan langsung online dan dapat diakses bersama oleh seluruh anggota organisasi.

---

## 👨‍💻 Informasi Pengembang

- **Developer**: Solo developer by **Alif Fikri Haykal**
- **NIM**: `23404053`
- **Program Studi**: Teknologi Rekayasa Multimedia
- **Organisasi**: UKM TERAMEDIA, Politeknik Dewantara

---

## 📄 Hak Cipta

© 2026 **TERAMEDIA Politeknik Dewantara** — Hak Cipta Dilindungi.
