# TeraDesk — Digital Workspace & Operating System Organisasi

Platform manajemen, administrasi, dan koordinasi digital terintegrasi untuk **TERAMEDIA** (Teknologi Rekayasa Multimedia, Politeknik Dewantara). Dirancang untuk mendigitalisasi alur kerja organisasi dari pengajuan program kerja, surat-menyurat, inventaris alat, keuangan, hingga presensi kegiatan.

---

## 🌟 Fitur Utama

### 1. Landing Page Modern & Responsif
- **Hero Section**: Preview interaktif kartu program kerja, arsip administrasi, metrik performa, dan profil pimpinan organisasi (responsif untuk Smartphone, Tablet, hingga Desktop).
- **Fitur Unggulan**: Grid 10 modul layanan organisasi dengan akses langsung ke workspace masing-masing.
- **Tentang Kami**: Profil organisasi TERAMEDIA dilengkapi *auto-scrolling marquee carousel* dokumentasi kegiatan terkompresi WebP.
- **Footer & Developer Credits**: Navigasi lengkap, newsletter, call-to-action, serta modal interaktif **Developer Credit** bergaya *clean white dashboard*.

### 2. Portal Katalog 10 Layanan Organisasi
Satu ekosistem kerja digital terpusat mencakup 10 modul siap pakai:
1. **PAR (Program Approval Request)**: Alur persetujuan proposal berjenjang (Panitia ➔ Kadiv ➔ BPH ➔ Pembina) dengan live tracking SLA dan barcode digital.
2. **Digitalisasi Arsip & E-Surat**: Penyimpanan cloud surat masuk/keluar, SK, LPJ, dan generator nomor surat otomatis anti-bentrok.
3. **Digitalisasi Aset & Inventaris**: Katalog alat multimedia (kamera, lighting, mic, proyektor) dengan peminjaman dan tracking ketersediaan.
4. **Kas & Reimbursement Anggaran**: Pencatatan kas, upload bukti transfer/nota via smartphone, dan monitoring pagu belanja per divisi.
5. **Presensi Rapat & Kegiatan**: QR code dinamis, validasi GPS radius lokasi kegiatan, dan ekspor rekap absensi.
6. **Timeline & Kalender Kegiatan**: Roadmap kalender kerja terpadu dengan sinkronisasi Google Calendar dan notifikasi deadline.
7. **Manajemen SDM & Kaderisasi**: Database anggota/kader, riwayat divisi, kepengurusan demisioner, dan rekam jejak kontribusi.
8. **TeraHelpdesk & Layanan Internal**: Sistem tiket pengaduan teknis alat, konsultasi divisi, dan bantuan operasional.
9. **Humas & Kemitraan Eksternal**: Pengelolaan database media partner, sponsorship, relasi stakeholder, dan surat audiensi.
10. **KKM (Kewirausahaan & Merchandise)**: Etalase merchandise resmi organisasi, pemesanan jaket/kaos proker, dan pencatatan laba usaha mahasiswa.

### 3. Dashboard Admin Eksekutif & Manajemen Data (`/admin`)
- Pintasan keyboard cepat: `Ctrl + Shift + D` untuk akses instan admin console.
- **Manajemen Program Kerja**: Input proker baru, edit data, filter kategori per divisi, dan toggle pin ke Hero showcase.
- **Manajemen Akun Pengurus**: Tambah akun, reset password, atur hak akses admin (`canAccessAdmin`), dan ekspor data akun JSON.
- **Status Modul Layanan**: Kontrol operasional real-time status modul (*Online* / *Maintenance*).
- **Executive Metrics**: Monitoring performa pengajuan proposal, serapan anggaran kas, utilisasi inventaris, dan audit log.

### 4. Sistem Autentikasi & Keamanan Sesi (`/login`)
- Validasi hak akses berbasis peran (Role-Based Access Control).
- Sesi login aman berbasis memori (`sessionStorage` otomatis di-clear saat refresh untuk integritas keamanan demo).

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Typography** | Apple SF Pro Display (`@qpokychuk/sf-pro-display`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 📁 Struktur Direktori

```text
teradesk-ui-slicing/
├── public/
│   ├── images/
│   │   ├── about/          # Asset webp carousel Tentang Kami (img1.webp - img4.webp)
│   │   ├── alip-credit.png # Foto profil Developer Credits
│   │   └── img1.JPG        # Foto dokumentasi Hero section
│   └── logo-teramedia.png  # Favicon dan logo resmi brand
├── src/
│   ├── assets/             # Asset statis tambahan
│   ├── components/
│   │   ├── admin/          # AdminDashboardPage.jsx (Executive Console)
│   │   ├── services/       # 10 service page modul & ServicePageLayout.jsx
│   │   ├── AboutUs.jsx     # Section profil organisasi & marquee carousel
│   │   ├── ContactModal.jsx# Modal kontak interaktif
│   │   ├── Features.jsx    # Grid 10 fitur layanan landing page
│   │   ├── FeaturesPortal.jsx # Portal pencarian & katalog 10 modul
│   │   ├── Footer.jsx      # Footer & Modal Developer Credit
│   │   ├── Hero.jsx        # Responsive Hero section & dynamic showcase
│   │   └── LoginPage.jsx   # Form autentikasi pengurus
│   ├── data/
│   │   ├── defaultAccounts.js # Master data akun pengurus awal
│   │   └── defaultProker.js   # Master data program kerja terintegrasi
│   ├── App.jsx             # Router aplikasi & state autentikasi terpusat
│   ├── index.css           # Konfigurasi Tailwind v4 & font SF Pro
│   ├── index.html          # Entry point HTML aplikasi (Vite root: 'src')
│   └── main.jsx            # React root mount
├── package.json
└── vite.config.js          # Konfigurasi root, outDir, & publicDir
```

---

## 💻 Panduan Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server Development
```bash
npm run dev
```
Aplikasi dapat diakses di browser pada: `http://localhost:5173/`

### 3. Pengecekan Kualitas Kode (Linting)
```bash
npm run lint
```

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build produksi siap deploy akan tersimpan pada direktori `dist/`.

---

## 👨‍💻 Informasi Pengembang

- **Developer**: Solo developer by **Alif Fikri Haykal**
- **NIM**: `23404053`
- **Program Studi**: Teknologi Rekayasa Multimedia
- **Organisasi**: UKM TERAMEDIA, Politeknik Dewantara

---

## 📄 Hak Cipta

© 2026 **TERAMEDIA Politeknik Dewantara** — Hak Cipta Dilindungi.
