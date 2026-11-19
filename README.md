# Website Baitul Qur'an Al-Hidayah

Situs resmi **Taman Pendidikan Al-Qur'an Baitul Qur'an Al-Hidayah**
Desa Keluang, Paser Jaya, Kec. Kuaro, Kab. Paser, Kalimantan Timur.

Dibangun sebagai situs statis (satu halaman dengan navigasi hash) sehingga dapat
di-host gratis di GitHub Pages, tanpa server dan tanpa biaya bulanan.

---

## 1. Struktur berkas

```
tpa-alhidayah/
├─ index.html                 ← seluruh halaman
├─ 404.html                   ← halaman galat
├─ assets/
│  ├─ css/style.css           ← hasil build Tailwind (jangan diedit manual)
│  ├─ js/site.config.js       ← DATA KONTAK & IDENTITAS  ← paling sering diedit
│  ├─ js/data.js              ← pengajar, jadwal, materi, berita, galeri, santri
│  ├─ js/app.js               ← logika navigasi & formulir
│  ├─ img/                    ← logo, favicon, og-image
│  └─ dokumen/                ← berkas unduhan (buku prestasi)
├─ src/input.css              ← sumber CSS (Tailwind)
├─ tailwind.config.js         ← palet warna & font
├─ tools/make-logo.py         ← pembuat ulang aset logo dari file sumber
└─ .github/workflows/deploy.yml ← deploy otomatis ke GitHub Pages
```

---

## 2. Mengubah konten

### a. Kontak, alamat, identitas
Buka `assets/js/site.config.js`, ubah bagian berikut:

| Variabel | Keterangan |
|---|---|
| `wa.tampil` | nomor yang tampil di layar, contoh `0831-5345-931` |
| `wa.internasional` | untuk tautan WhatsApp, contoh `628315345931` |
| `alamat.mapsUrl` | tempel tautan *Share* pin lokasi dari Google Maps |
| `jamLayanan` | jam operasional |
| `youtube` | tautan channel, contoh `https://youtube.com/@namaChannel` |

Setelah disimpan, cukup refresh browser.

### b. Pengajar, jadwal, materi, berita, galeri
Semua ada di `assets/js/data.js`. Contoh menambah pengajar:

```js
pengajar: [
  { nama: "Nur Hidayat", peran: "Pengajar", bidang: "Al-Qur'an", foto: "", inisial: "NH" },
],
```

Menambah foto galeri:

```js
galeri: [
  { src: "assets/img/galeri/kegiatan-1.jpg", judul: "Setoran hafalan" },
],
```

Letakkan foto di `assets/img/galeri/`. Setelah `galeri` terisi, tampilan
"Galeri segera hadir" otomatis berganti menjadi grid foto.

### c. Teks panjang (visi, misi, profil)
Diedit langsung di `index.html` pada bagian `<section id="profil">`.

---

## 3. Menjalankan di komputer

```bash
npm install
npm run build:css     # membuat assets/css/style.css
npm run serve         # buka http://localhost:8080
```

Saat mengedit tampilan, jalankan `npm run watch:css` di terminal terpisah agar
CSS langsung diperbarui.

> Catatan: `assets/css/style.css` **wajib** ikut di-commit. GitHub Pages tidak
> menjalankan npm; build dilakukan oleh GitHub Actions saat deploy.

---

## 4. Deploy ke GitHub Pages (pertama kali)

### Langkah 0 — buat akun
1. Buka <https://github.com/signup>
2. Daftar dengan email, verifikasi email.

### Langkah 1 — buat repositori
1. Buka <https://github.com/new>
2. Nama: `tpa-alhidayah`
3. Pilih **Public** → **Create repository**

### Langkah 2 — unggah kode
Di terminal, dari folder proyek:

```bash
git init
git add .
git commit -m "Website Baitul Qur'an Al-Hidayah"
git branch -M main
git remote add origin https://github.com/USERNAME/tpa-alhidayah.git
git push -u origin main
```

Ganti `USERNAME` dengan nama pengguna GitHub Anda. Saat diminta kata sandi,
gunakan **Personal Access Token** (Settings → Developer settings → Personal
access tokens → Tokens (classic) → Generate new token → centang `repo`),
bukan kata sandi akun.

### Langkah 3 — aktifkan Pages
1. Buka repositori → **Settings** → **Pages**
2. Bagian **Build and deployment** → Source: **GitHub Actions**
3. Buka tab **Actions**, tunggu proses *Deploy ke GitHub Pages* selesai (±1 menit)

Situs aktif di:

```
https://USERNAME.github.io/tpa-alhidayah/
```

### Langkah 4 — setelah ada perubahan
```bash
git add .
git commit -m "Perbarui jadwal"
git push
```
GitHub Actions akan membangun ulang dan menerbitkan versi terbaru otomatis.

### Langkah 5 — rapikan tautan absolut (opsional, untuk pratinjau WhatsApp)
Setelah alamat situs diketahui, ganti `https://USERNAME.github.io/tpa-alhidayah/`
di dua tempat pada `index.html`:

- `<link rel="canonical" ...>`
- `<meta property="og:image" ...>` → jadikan URL lengkap,
  contoh `https://USERNAME.github.io/tpa-alhidayah/assets/img/og-image.jpg`

Ini membuat gambar pratinjau muncul saat tautan dibagikan di WhatsApp/Facebook.

---

## 5. Data absensi & progres

Saat ini halaman **Absensi** dan **Progres** memakai data contoh di
`assets/js/data.js` (NIS 101–103) dengan keterangan "data contoh" pada hasil.

### Mengaktifkan Firebase (opsional)
1. Buka <https://console.firebase.google.com> → **Add project**.
2. **Build → Firestore Database → Create database** (mode *production*).
3. **Project settings → Your apps → Web app** → salin `firebaseConfig`.
4. Tempel ke `assets/js/site.config.js`, ubah `enabled: false` menjadi `true`.
5. Atur *Rules* Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /santri/{nis} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

6. Tambah dokumen pada koleksi `santri`, dengan **ID dokumen = NIS**:

| Field | Contoh |
|---|---|
| `nama` | Ahmad Fauzi |
| `nis` | 101 |
| `kelas` | Iqra 3 |
| `status` | Hadir / Izin / Sakit / Alfa |
| `tanggal` | 2026-11-19 |
| `bacaan` | Iqra 3 halaman 12 |
| `hafalan` | An-Nas s.d. Al-'Adiyat |
| `catatan` | Bacaan sudah lancar… |

> Jangan menyimpan alamat, nomor HP, atau tanggal lahir di koleksi ini karena
> dapat dibaca publik. Cukup nama, kelas, status, dan capaian.

---

## 6. Yang masih perlu dilengkapi

- [ ] Tautan channel YouTube (`site.config.js` → `youtube`)
- [ ] Tautan pin Google Maps (`site.config.js` → `alamat.mapsUrl`)
- [ ] Foto kegiatan (`assets/img/galeri/` + `data.js` → `galeri`)
- [ ] Jadwal final (`data.js` → `jadwal`) — saat ini jadwal sementara
- [ ] Foto pengajar (`data.js` → `pengajar[].foto`)
- [ ] Berita tambahan (`data.js` → `berita`)
- [ ] Alamat surel, Instagram, Facebook (opsional)
- [ ] Ganti `USERNAME` pada `canonical` dan `og:image`

---

## 7. Catatan teknis

- Palet warna diambil dari logo: `#113D40` (hijau tua), `#497264`,
  `#D5AD67` (emas), `#FBF9EC` (krem). Ubah di `tailwind.config.js`.
- Navigasi memakai hash (`#profil`, `#absensi`, …) agar dapat dibagikan dan
  tombol *Back* berfungsi.
- Font: Inter (isi), Playfair Display (judul), Amiri (teks Arab) — dimuat dari
  Google Fonts.
- Ikon: Font Awesome 6 (CDN).
- Logo aset dibuat ulang dengan `python3 tools/make-logo.py` dari berkas sumber
  di `Gambar/`.
