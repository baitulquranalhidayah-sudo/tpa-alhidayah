# Website Baitul Qur'an Al-Hidayah

Situs resmi **Taman Pendidikan Al-Qur'an Baitul Qur'an Al-Hidayah**
Desa Keluang, Paser Jaya, Kec. Kuaro, Kab. Paser, Kalimantan Timur.

Dibangun sebagai situs statis (satu halaman dengan navigasi hash) sehingga dapat
di-host gratis di GitHub Pages, tanpa server dan tanpa biaya bulanan.

---

## 1. Struktur berkas

```
tpa-alhidayah/
├─ index.html                 ← halaman utama (beranda + semua section)
├─ 404.html                   ← halaman galat
├─ berita/                    ← halaman berita full-page (hasil generate)
│  ├─ index.html              ← arsip semua berita
│  ├─ peluncuran-website/     ← halaman artikel peluncuran
│  └─ pendaftaran-santri/     ← halaman artikel pendaftaran
├─ assets/
│  ├─ css/style.css           ← hasil build Tailwind (jangan diedit manual)
│  ├─ js/site.config.js       ← DATA KONTAK & IDENTITAS  ← paling sering diedit
│  ├─ js/data.js              ← pengajar, jadwal, materi, berita, galeri, santri
│  ├─ js/sumber.js            ← pengambil data absensi/progres (Sheets/Firebase)
│  ├─ js/app.js               ← logika navigasi & formulir
│  ├─ img/logo/               ← logo-full, logo-mark, og-image
│  ├─ img/icons/              ← favicon, icon-192/512, apple-touch-icon
│  ├─ img/pengajar/           ← foto Nur Hidayat & Fatimah (webp)
│  ├─ img/kegiatan/           ← foto galeri (kegiatan-1 … 5.webp)
│  ├─ img/berita/             ← gambar artikel (webp)
│  └─ dokumen/                ← berkas unduhan (buku prestasi)
├─ src/input.css              ← sumber CSS (Tailwind)
├─ tailwind.config.js         ← palet warna & font
├─ tools/make-logo.py         ← pembuat ulang aset logo dari file sumber
├─ tools/build-berita.mjs     ← generator halaman berita
└─ .github/workflows/deploy.yml ← deploy otomatis ke GitHub Pages
```

---

## 2. Mengubah konten

### a. Kontak, alamat, identitas
Buka `assets/js/site.config.js`, ubah bagian berikut:

| Variabel | Keterangan |
|---|---|
| `url` | alamat lengkap situs, dipakai canonical & OG tiap artikel |
| `wa.tampil` | nomor admin utama yang tampil di tombol & formulir |
| `wa.internasional` | untuk tautan WhatsApp, contoh `6283153145931` |
| `admin` | daftar admin (nama + nomor) yang tampil di halaman Kontak |
| `grupWa` | tautan grup WhatsApp wali santri; kosongkan bila tidak dipakai |
| `youtube` | tautan channel YouTube |
| `youtubeChannelId` | ID channel (`UC…`) untuk keperluan embed |
| `youtubePlaylist` | ID playlist unggahan (`UU…`) yang diputar di halaman Siaran Langsung |
| `youtubeThumb` | ID video untuk gambar sampul pemutar |
| `youtubeEmbed` | `true` bila video boleh diputar di dalam situs (lihat catatan di bawah) |
| `saweria` | tautan Saweria untuk sedekah/donasi; kartu di halaman Siaran Langsung otomatis tersembunyi bila dikosongkan |
| `dana` | tautan minta/sedekah DANA; kartu QR di halaman Siaran Langsung otomatis tersembunyi bila dikosongkan. QR disimpan di `assets/img/qr/dana.png`. QR dibuat ulang agar berisi tautan `m.dana.id` di atas — QR lama dari aplikasi berisi `qr.dana.id/...` yang sudah tidak ditemukan saat dipindai |
| `alamat.mapsUrl` | tempel tautan *Share* pin lokasi dari Google Maps |
| `jamLayanan` | jam layanan, saat ini Senin–Rabu · ba'da Maghrib s.d. Isya |

Setelah disimpan, cukup refresh browser.

> **Catatan penyematan YouTube.** Saat ini channel menonaktifkan pemutaran di
> situs lain, sehingga tombol putar membuka YouTube. Agar video bisa diputar
> langsung di halaman Siaran Langsung: buka YouTube Studio → **Konten** → pilih
> video → **Detail** → *Tampilkan lebih banyak* → centang **Izinkan penyematan**
> → simpan. Setelah itu ubah `youtubeEmbed` menjadi `true` di `site.config.js`.

> **Siaran langsung.** Karena akun YouTube Baitul Qur'an Al-Hidayah sedang
> mengalami kendala untuk *live streaming*, halaman **Siaran Langsung** untuk
> sementara memakai **vdo.ninja**. Blok YouTube tetap disimpan di
> `index.html` dalam keadaan tersembunyi (`#live-youtube`) untuk dipakai nanti.

### b. Pengajar, jadwal, materi, berita, galeri
Semua ada di `assets/js/data.js`. Contoh menambah pengajar:

```js
pengajar: [
  {
    nama: "Nur Hidayat",
    peran: "Pengajar",
    bidang: "Bimbingan membaca Al-Qur'an",
    foto: "assets/img/pengajar/nur-hidayat.webp",
    inisial: "NH",
    pendidikan: "",   // opsional
    pengalaman: "",   // opsional
    bio: "",          // opsional, tampil di modal saat foto diklik
  },
],
```

Klik foto pengajar untuk membuka modal berisi foto besar, peran, bidang,
pendidikan, pengalaman, dan biodata. Field yang kosong tidak ditampilkan;
bila `bio` kosong, modal menuliskan "Biodata lengkap belum tersedia".

Galeri sengaja **dikosongkan dulu** (`galeri: []`), sehingga halaman
menampilkan kartu "Galeri segera hadir". Nanti cukup isi array ini:

```js
galeri: [
  { src: "assets/img/kegiatan/kegiatan-1.webp", judul: "Setoran hafalan" },
],
```

Letakkan foto di `assets/img/kegiatan/`. Setelah `galeri` terisi, kartu
"Galeri segera hadir" otomatis berganti menjadi grid foto. Klik foto untuk
membukanya dalam ukuran penuh. Foto sebaiknya WebP agar ukurannya ringan.

#### Berita: halaman penuh per artikel

Tiap berita punya halaman HTML sendiri di folder `berita/<slug>/`, plus arsip
di `berita/index.html`. Kartu berita di beranda menuju ke halaman tersebut
(bukan lagi modal).

Menambah berita baru:

1. Tambah objek di `DATA.berita` (`assets/js/data.js`) dengan `slug` unik,
   misalnya `slug: "ramadhan-1448"`.
2. Isi `judul`, `tanggal`, `kategori`, `ringkas`, `gambar`, dan `isi`.
3. Di `isi`, gunakan `## Judul` untuk subjudul dan `- item` untuk daftar.
4. Jalankan generator:

   ```bash
   npm run build:berita
   ```

5. Commit hasil generate beserta perubahan `data.js`.

Generator juga mengisi canonical, OG, schema.org Article, breadcrumb, tombol
bagikan, Tanya Admin, dan artikel terkait. Jalankan ulang generator setiap kali
mengubah `data.js` atau ingin menyelaraskan header/footer artikel dengan beranda.

Artikel pendaftaran otomatis mendapat tiga tombol: daftar lewat website, chat
admin dengan template pesan pendaftaran, dan lihat peta untuk datang langsung.

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
  contoh `https://USERNAME.github.io/tpa-alhidayah/assets/img/logo/og-image.jpg`

Ini membuat gambar pratinjau muncul saat tautan dibagikan di WhatsApp/Facebook.

---

## 5. Data absensi & progres

Halaman **Absensi** dan **Progres** mengambil data dari salah satu sumber berikut
(diatur di `site.config.js` → `sumber.mode`):

| Mode | Keterangan |
|---|---|
| `"lokal"` | Data identitas di `assets/js/data.js` (15 santri, NIS 01–15). Tanpa internet, tanpa setup. |
| `"sheets"` | **Google Sheets** — dipakai sekarang untuk pendataan harian. |
| `"firebase"` | Firestore. Aktifkan blok `firebase` (lihat bagian b). |

Bila sumber yang dipilih gagal dimuat (offline, sheet belum dibagikan), situs
otomatis kembali ke data identitas di `data.js` dan menampilkan keterangan kecil
di bawah hasil.

### a. Google Sheets (pendataan sementara, tanpa server)

**Struktur spreadsheet — 3 tab yang dibaca situs** (nama tab harus sama dengan
`site.config.js`; tab `Petunjuk` boleh ada tetapi tidak dibaca):

**Tab `Santri`** — data induk, diisi sekali:

| nis | nama | jenis kelamin | kelas | aktif |
|---|---|---|---|---|
| 01 | Galih Pambudy | Laki-laki | SD Kelas 6 | Ya |

**Tab `Rekab Absen`** — log absensi harian, satu set baris per pertemuan
(Senin–Rabu, Maghrib–Isya). Ini satu-satunya sumber data absensi:

| nis | nama | jenis kelamin | kelas | tanggal | kehadiran |
|---|---|---|---|---|---|
| 01 | Galih Pambudy | Laki-laki | SD Kelas 6 | 2026-11-24 | Hadir |
| 02 | Ahmad Azzam Putra | Laki-laki | SD Kelas 6 | 2026-11-24 | Izin |
| … | … | … | | … | … |
| 15 | Soraya | Perempuan | SD Kelas 1 | 2026-11-24 | Alpa |

- `kehadiran` berisi dropdown **Hadir / Sakit / Izin / Alpa**
  (H/I/S/A juga dikenal). Alpa = tanpa kabar.
- Isi `tanggal` dengan format `YYYY-MM-DD` atau `DD/MM/YYYY`.
- Untuk pertemuan berikutnya: salin 15 baris ke bawah, ganti tanggalnya,
  lalu pilih status baru.
- Baris tanpa tanggal atau tanpa status diabaikan (belum dicatat, bukan Alpa).
- Kolom `nis` **boleh kosong**. Situs mencocokkan NIS dari `nama` ke tab
  `Santri`. Bila ada kolom `nis`, nilainya tetap dipakai.
- Nama dan kelas di tab ini yang tampil di hasil **Cek Absensi**; tab `Santri`
  hanya cadangan bila kolomnya kosong.
- Situs menampilkan **tabel pertemuan terbaru** (ringkasan Hadir/Izin/Sakit/Alpa
  + tabel yang bisa dibuka) dan **rekap bulan berjalan** yang dihitung otomatis
  dari log ini — tidak perlu membuat rekap manual.

**Tab `Progres`** — daftar 15 santri, satu baris setiap pertemuan:

| nis | nama | tanggal | bacaan | catatan |
|---|---|---|---|---|
| 01 | Galih | 2026-11-02 | Iqra 3 hlm. 12 | Lancar, makhraj perlu diperbaiki |
| 02 | Azam | 2026-11-02 | Iqra 1 hlm. 4 | Masih belajar makhraj |

- Kolom `nama` di tab ini yang tampil di hasil **Cek Progres**; tab `Santri`
  hanya cadangan bila kolomnya kosong.
- `tanggal` sebaiknya diformat `YYYY-MM-DD`. Format `DD/MM/YYYY` juga diterima.
- NIS boleh ditulis `01` atau `1` — situs menganggapnya sama.
- NIS boleh kosong di tab `Rekab Absen` (dicocokkan dari nama). Di tab
  `Progres`, NIS tetap disarankan diisi agar riwayatnya tidak tertukar.
- **Cek Absensi** menampilkan status terbaru, **rekap kehadiran bulan berjalan**
  (Hadir/Izin/Sakit/Alpa), dan tabel pertemuan terbaru; daftar riwayat tidak
  ditampilkan agar kartu tetap ringkas. **Cek Progres** menampilkan capaian
  terbaru dan 5 riwayat terakhir. Santri yang belum punya catatan tetap tampil
  dengan keterangan "Belum ada catatan", bukan "data tidak ditemukan".

**Tab `Live`** — tautan siaran vdo.ninja (satu baris per rencana siaran):

| status | judul | link | keterangan |
|---|---|---|---|
| aktif | Tasmi' Hafalan | `https://vdo.ninja/?view=ABCD1234` | Mulai 19.30 WITA |
| nonaktif | Acara sebelumnya | `https://vdo.ninja/?view=XYZ999` | — |

- Cara pakai: buat room di vdo.ninja → isi `link` dengan **tautan penonton**
  (`?view=...`) → tulis `aktif` pada kolom `status`. Selesai siaran, ubah
  `status` menjadi `nonaktif`. Cukup satu baris berstatus `aktif`.
- Boleh juga menulis **kode room saja** (mis. `ABCD1234`) tanpa `https://...`;
  situs akan membuatkan tautan penontonnya.
- Situs mengambil tautan setiap halaman Siaran Langsung dibuka dan lewat
  tombol **Perbarui** (tidak memakai cache 2 menit). Bila tidak ada baris
  `aktif`, halaman menampilkan "Belum ada siaran langsung".
- **Penting:** jangan pernah menaruh tautan `?push=`, director, atau password
  di sheet. Tautan itu memberi orang lain kendali atas siaran. Situs otomatis
  membuang parameter selain `view`/`room`.
- Template siap pakai: `assets/dokumen/Template Pendataan Santri.xlsx`
  (sudah berisi 15 santri di tab `Santri`, `Rekab Absen`, dan `Progres`; unggah
  ke Google Drive → buka dengan Google Sheets → *Save as Google Sheets*).

**Langkah mengaktifkan:**

1. Buat spreadsheet dengan tab `Santri`, `Rekab Absen`, `Progres`, dan `Live`
   (atau unggah template yang sudah siap pakai).
2. **Share** → *General access* → **Anyone with the link** → **Viewer**.
3. Salin ID dari URL:
   `https://docs.google.com/spreadsheets/d/`**`ID_PANJANG_INI`**`/edit`
4. Buka `assets/js/site.config.js`, isi:
   ```js
   sumber: {
     mode: "sheets",
     sheets: { id: "ID_PANJANG_INI", tab: { santri: "Santri", absensi: "Rekab Absen", progres: "Progres", live: "Live" }, cacheMenit: 2 },
   },
   ```
5. Simpan, refresh situs. Perubahan di spreadsheet otomatis terbaca
   (paling lambat 2 menit karena cache; tombol **Perbarui** pada tabel absensi
   mengambil data terbaru seketika).

> **Privasi.** Spreadsheet yang dibagikan "Anyone with the link" dapat dibaca
> siapa pun yang memiliki tautannya. Karena itu isi hanya NIS, nama, jenis
> kelamin, kelas, status, dan capaian. **Jangan** menaruh alamat, nomor HP wali,
> atau tanggal lahir di spreadsheet ini. Begitu pula pada tab `Live`, jangan
> menaruh tautan `push`/director vdo.ninja.

### b. Firebase (nanti, setelah siap)

Struktur data dibuat sama dengan tab di atas, sehingga pindah sumber tidak
mengubah tampilan:

1. Buka <https://console.firebase.google.com> → **Add project**.
2. **Build → Firestore Database → Create database** (mode *production*).
3. **Project settings → Your apps → Web app** → salin `firebaseConfig`.
4. Tempel ke `assets/js/site.config.js`, ubah `enabled: false` menjadi `true`,
   lalu ubah `sumber.mode` menjadi `"firebase"`.
5. Atur *Rules* Firestore (hanya baca):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{koleksi}/{dokumen} {
      allow read: if koleksi in ["santri", "kehadiran", "progres"];
      allow write: if false;
    }
  }
}
```

6. Buat koleksi `santri` (ID dokumen = NIS, field `nama`, `kelas`), koleksi
   `kehadiran` (field `nis`, `tanggal`, `status`) dan `progres` (field `nis`,
   `tanggal`, `bacaan`, `catatan`).

> Jangan menyimpan alamat, nomor HP, atau tanggal lahir di koleksi ini karena
> dapat dibaca publik. Cukup nama, kelas, status, dan capaian.

---

## 6. Yang masih perlu dilengkapi

- [x] Isi `sumber.sheets.id` dengan ID spreadsheet pendataan santri
- [x] Tautan channel YouTube (`site.config.js` → `youtube`)
- [x] Tautan pin Google Maps (`site.config.js` → `alamat.mapsUrl`)
- [x] `canonical` dan `og:image` sudah memakai domain GitHub Pages
- [x] Foto Nur Hidayat (`assets/img/pengajar/nur-hidayat.webp`)
- [x] Foto Fatimah (`assets/img/pengajar/fatimah.webp`)
- [ ] Foto kegiatan (`assets/img/kegiatan/` + `data.js` → `galeri`) — sengaja
      dikosongkan dulu; halaman menampilkan "Galeri segera hadir"
- [x] Aset dirapikan jadi 5 folder: `logo`, `icons`, `pengajar`, `kegiatan`, `berita`
- [x] Berita tambahan + halaman penuh (`data.js` → `berita`, `berita/`)
- [ ] Alamat surel, Instagram, Facebook (opsional)

### Catatan operasional: kehadiran & progres

Data absensi **dibaca langsung dari tab `Rekab Absen`**, data progres dari tab
`Progres`, bukan disalin ke dalam kode. Pengajar cukup mengisi baris di sheet;
situs otomatis menampilkan perubahannya. Halaman **Cek Absensi** memuat ulang
tabel setiap dibuka (data dianggap basi setelah 1 menit), dan tombol
**Perbarui** mengambil data terbaru seketika. Tombol **Perbarui data** pada form
pencarian juga membersihkan cache sebelum mencari.

Saat halaman Cek Absensi dibuka, tampil ringkasan Hadir/Izin/Sakit/Alpa untuk
pertemuan terbaru. Tombol **Lihat tabel** membuka tabel lengkap 15 santri
(baris santri yang dicari disorot). Rekap bulan berjalan dihitung otomatis dari
seluruh log `Rekab Absen` — tidak ada tab rekap manual yang perlu diisi.

Nama dan kelas pada hasil **Cek Absensi** diambil dari tab `Rekab Absen`,
sedangkan **Cek Progres** dari tab `Progres`. Bila kolom nama kosong, situs
memakai nama dari tab `Santri` sebagai cadangan. Karena tab `Rekab Absen`
saat ini belum punya kolom `nis`, NIS dicocokkan dari nama; bila kolom `nis`
ditambahkan kemudian, situs akan memakainya. Daftar `santri` di
`assets/js/data.js` hanya cadangan saat Sheets gagal dimuat.

Saat ini `Rekab Absen` berisi pertemuan 23–24/11/2026 dan `Progres` berisi
catatan untuk NIS 01–03. Santri yang belum punya baris tercatat tetap tampil
dengan identitasnya dan keterangan "Belum ada catatan".

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
- Gambar berita "Cara Pendaftaran Santri Baru — Online dan Offline" bersumber dari **Openverse**,
  lisensi **CC0 1.0**: *Writing in Notebook at Desk* oleh Image Catalog via
  Flickr — https://www.flickr.com/photos/132795455@N08/18692128651
- Gambar berita peluncuran adalah tangkapan layar website ini sendiri.
