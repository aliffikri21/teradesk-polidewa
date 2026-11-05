# AGENTS.md — Developer & AI Agent Context Guide

> Panduan ringkas arsitektur sistem, aturan teknis, dan konteks esensial proyek **TeraDesk** untuk agen AI dan pengembang.

---

## 📌 Ringkasan Proyek

- **Nama Proyek**: TeraDesk (TERAMEDIA, Politeknik Dewantara)
- **Fungsi**: Operating system & digital workspace keorganisasian terintegrasi (PAR, E-Arsip, Inventaris, Keuangan, Presensi, SDM, Helpdesk, Humas, KKM).
- **Pengembang**: Solo developer by **Alif Fikri Haykal** (NIM `23404053`, Teknologi Rekayasa Multimedia, UKM TERAMEDIA).
- **Tech Stack**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Apple SF Pro Display (`@qpokychuk/sf-pro-display`), Lucide React, Oxlint.

---

## ⚙️ Arsitektur Direktori & Konfigurasi Vite

⚠️ **PENTING**: File entry point HTML berada di `src/index.html` (BUKAN di root).
Konfigurasi `vite.config.js`:
```javascript
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
});
```
- **Dilarang** memindahkan `src/index.html` kembali ke root folder.
- Direktori asset publik berada di `public/` dan diakses langsung via path absolut root browser (misal: `/logo-teramedia.png` atau `/images/alip-credit.png`).

---

## 🧭 Sistem Navigasi & Routing

Routing dikelola melalui state React terpusat di `src/App.jsx` (`currentView: { page, serviceId }`):
1. `'landing'`: Landing page utama (`Hero.jsx`, `Features.jsx`, `AboutUs.jsx`, `Footer.jsx`).
2. `'portal'`: Portal pencarian dan katalog 11 modul layanan (`FeaturesPortal.jsx`).
3. `'login'`: Halaman autentikasi pengurus (`LoginPage.jsx`).
4. `'admin'`: Dashboard eksekutif (`AdminDashboardPage.jsx`). Pintasan akses: `Ctrl + Shift + D` atau path `/admin`.
5. `'service'`: Halaman detail modul layanan spesifik (`ServiceDispatcher.jsx` + `ServicePageLayout.jsx`).

### Aturan Autentikasi & Keamanan:
- Tamu yang mengakses `/admin`, `/portal`, atau `/service/:id` otomatis diarahkan ke halaman login.
- Sesi login aman bersifat ephemeral (disimpan di state memori). `sessionStorage.clear()` otomatis dieksekusi saat inisialisasi aplikasi untuk menjaga integritas demo.
- Kredensial default: **NIM**: `23404053` | **Password**: `admin` (Role: Demisioner Ketua Umum, `canAccessAdmin: true`).
- **Integrasi Landing ke Admin**: Formulir Kontak Kami di landing page terhubung 100% end-to-end ke tab 'Kotak Masuk Konsultasi' di Admin Dashboard via state `consultationMessages` dan localStorage (`teradesk_consultations_v1`).

---

## 📦 Katalog 11 Modul Layanan (Wajib Konsisten)

TeraDesk memiliki tepat **11 modul aktif**:
| ID Modul | Nama Layanan | Divisi Penanggung Jawab | File Komponen |
| :--- | :--- | :--- | :--- |
| `par` | Persetujuan Program Kerja (PAR) | BPH & Kesekretariatan | `src/components/services/ParServicePage.jsx` |
| `archive` | Digitalisasi Arsip & E-Surat | Kesekretariatan | `src/components/services/ArchiveServicePage.jsx` |
| `asset` | Digitalisasi Aset & Inventaris | Logistik & Operasional | `src/components/services/AssetServicePage.jsx` |
| `finance` | Kas & Reimbursement Anggaran | Bendahara & Keuangan | `src/components/services/FinanceServicePage.jsx` |
| `attendance` | Presensi Rapat & Kegiatan | Divisi Kaderisasi | `src/components/services/AttendanceServicePage.jsx` |
| `timeline` | Kalender & Timeline Proker | Internal & Manajemen Proker | `src/components/services/TimelineServicePage.jsx` |
| `hr` | Manajemen SDM & Pengurus | Litbang & SDM | `src/components/services/HrServicePage.jsx` |
| `helpdesk` | TeraHelpdesk Layanan Internal | Teknisi & Support Media | `src/components/services/HelpdeskServicePage.jsx` |
| `humas` | Humas & Hubungan Eksternal | Divisi Humas & Media | `src/components/services/HumasServicePage.jsx` |
| `kkm` | KKM (Kewirausahaan & Merchandise) | Divisi Dana Usaha (KKM) | `src/components/services/KkmServicePage.jsx` |
| `activity` | Arsip Kegiatan & Dokumentasi | Semua Divisi (Lintas Organisasi) | `src/components/services/ActivityArchiveServicePage.jsx` |

*Gunakan `featuresData.length` atau `allServices.length` untuk perhitungan jumlah modul secara dinamis.*

---

## 🎨 Asset Visual Aktif

Semua aset statis terkelola di dalam direktori `public/`:
- `public/logo-teramedia.png`: Logo brand TeraDesk & Favicon aplikasi.
- `public/images/img1.JPG`: Foto dokumentasi pada kartu preview Hero section.
- `public/images/alip-credit.png`: Foto profil pengembang pada Modal Developer Credits.
- `public/images/about/img1.webp` s/d `img5.webp`: Rangkaian foto marquee carousel section "Tentang Kami".
- **Higiene Asset**: Jangan meninggalkan file draft/uncompressed yang tidak direferensikan dalam kode sumber.

---

## 🛠️ Standar Kode & Verifikasi Wajib

Sebelum menyelesaikan tugas atau merge perubahan kode:
1. **Linter**: Wajib lolos tanpa peringatan/kesalahan.
   ```bash
   npm run lint
   ```
2. **Build**: Pastikan bundle Vite berhasil dikompilasi.
   ```bash
   npm run build
   ```
3. **Graphify Knowledge Graph**:
   Proyek menggunakan graphify di `graphify-out/`.
   - Gunakan `graphify query "<konsep>"` atau periksa wiki sebelum scanning kode manual berskala besar.
   - **Setelah mengubah file kode sumber**, selalu sinkronkan graph dengan:
     ```bash
     graphify update .
     ```

---

## ⚡ Cheat Sheet Perintah Terminal

```bash
npm run dev        # Menjalankan Vite dev server (http://localhost:5173/)
npm run lint       # Menjalankan oxlint (0 errors, 0 warnings)
npm run build      # Build bundler produksi ke direktori dist/
graphify update .  # Memperbarui knowledge graph proyek (AST-only)
```

