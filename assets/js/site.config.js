/* ==========================================================================
   KONFIGURASI WEBSITE — ubah data di file ini saja.
   Setelah mengubah, tidak perlu build ulang. Cukup simpan & refresh.
   ========================================================================== */

window.SITE = {
  /* --- Identitas ------------------------------------------------------- */
  nama: "Baitul Qur'an Al-Hidayah",
  namaPendek: "BQ Al-Hidayah",
  url: "https://baitulquranalhidayah-sudo.github.io/tpa-alhidayah/",
  jenis: "Taman Pendidikan Al-Qur'an",
  tagline:
    "Membina generasi Qur'ani melalui pembelajaran membaca, memahami, dan menghafal Al-Qur'an dengan bimbingan yang ramah dan terarah.",
  tahunBerdiri: "", // contoh: "2015" — kosongkan jika belum ingin ditampilkan

  /* --- Alamat ---------------------------------------------------------- */
  alamat: {
    jalan: "Desa Keluang, Paser Jaya",
    kecamatan: "Kec. Kuaro",
    kabupaten: "Kab. Paser",
    provinsi: "Kalimantan Timur",
    negara: "Indonesia",
    // Link Share pin lokasi masjid (koordinat -1.867150, 116.121500).
    mapsUrl: "https://maps.app.goo.gl/vEmBk4E2YX44DeTn9",
  },

  /* --- Kontak ---------------------------------------------------------- */
  wa: {
    tampil: "0831-5314-5931", // admin utama (dipakai tombol & formulir)
    internasional: "6283153145931", // untuk wa.me (tanpa + dan tanpa 0 di depan)
  },
  // Daftar admin yang ditampilkan di halaman Kontak.
  admin: [
    {
      nama: "Nur Hidayat",
      wa: { tampil: "0831-5314-5931", internasional: "6283153145931" },
    },
    {
      nama: "Fatimah",
      wa: { tampil: "0831-6321-7023", internasional: "6283163217023" },
    },
  ],
  // Grup WhatsApp wali santri. Kosongkan ("") jika grup tidak dipakai.
  grupWa: "https://chat.whatsapp.com/F35Y5YqGXYaDK8jWjGnrtt",
  email: "", // kosongkan jika belum ada
  jamLayanan: "Senin–Rabu · ba'da Maghrib s.d. Isya (WITA)",

  /* --- Media sosial ---------------------------------------------------- */
  youtube: "https://www.youtube.com/@baitulquranalhidayah-e5h",
  // ID channel (bukan nama). Dipakai untuk embed dan tautan siaran langsung.
  youtubeChannelId: "UCFsJPrreyC_BqSk-N1XtHcg",
  // Playlist unggahan channel: ID channel diawali "UC" diganti "UU".
  youtubePlaylist: "UUFsJPrreyC_BqSk-N1XtHcg",
  // Video untuk gambar sampul pemutar (video terbaru).
  youtubeThumb: "IvZvck9q5XY",
  // Pemutaran di dalam halaman (embed). Channel ini saat ini menonaktifkan
  // pemutaran di situs lain, sehingga tombol putar membuka YouTube.
  // Aktifkan "Izinkan penyematan" di YouTube Studio, lalu ubah menjadi true.
  youtubeEmbed: false,
  instagram: "",
  facebook: "",

  /* --- Sumber data pendataan santri ------------------------------------
     "lokal"    : data contoh di assets/js/data.js (tanpa internet)
     "sheets"   : Google Sheets — cukup isi ID spreadsheet di bawah
     "firebase" : Firestore (aktifkan lewat blok firebase di bawah)

     Google Sheets cukup dibagikan "Anyone with the link → Viewer".
     Situs hanya menampilkan kolom yang aman publik (NIS, nama, kelas,
     status, capaian). Jangan menaruh alamat, HP wali, atau tanggal lahir.
  -------------------------------------------------------------------- */
  sumber: {
    mode: "sheets", // ganti ke "firebase" setelah Firestore siap
    sheets: {
      // Tempel ID spreadsheet (atau URL lengkapnya, otomatis diambil ID-nya).
      // Kosongkan untuk sementara memakai data identitas di data.js.
      id: "1o6K7IGqrvs8Dsq0XXSlw0Dpa_sEYzuZRhXwOPfACEPg",
      // Nama tab (bukan nama berkas) di dalam spreadsheet.
      tab: {
        santri: "Santri",
        absensi: "Kehadiran",
        progres: "Progres",
      },
      // Lama cache di browser (menit). Tombol "Perbarui data" menimpa cache ini.
      cacheMenit: 2,
    },
  },

  /* --- Firebase (opsional) --------------------------------------------
     Selama enabled = false, halaman Absensi & Progres memakai data contoh
     dari assets/js/data.js sehingga situs tetap jalan di GitHub Pages.
     Untuk mengaktifkan: buat project Firebase, aktifkan Firestore, lalu isi
     konfigurasi di bawah dan ubah enabled menjadi true.
  -------------------------------------------------------------------- */
  firebase: {
    enabled: false,
    config: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    },
  },
};
