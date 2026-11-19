/* ==========================================================================
   KONFIGURASI WEBSITE — ubah data di file ini saja.
   Setelah mengubah, tidak perlu build ulang. Cukup simpan & refresh.
   ========================================================================== */

window.SITE = {
  /* --- Identitas ------------------------------------------------------- */
  nama: "Baitul Qur'an Al-Hidayah",
  namaPendek: "BQ Al-Hidayah",
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
    // Ganti dengan link "Share" pin lokasi dari Google Maps agar titiknya tepat.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Desa+Keluang+Kecamatan+Kuaro+Kabupaten+Paser+Kalimantan+Timur",
  },

  /* --- Kontak ---------------------------------------------------------- */
  wa: {
    tampil: "0831-5314-5931", // tampilan di layar
    internasional: "6283153145931", // untuk wa.me (tanpa + dan tanpa 0 di depan)
  },
  // Grup WhatsApp wali santri. Kosongkan ("") jika grup tidak dipakai.
  grupWa: "https://chat.whatsapp.com/F35Y5YqGXYaDK8jWjGnrtt",
  email: "", // kosongkan jika belum ada
  jamLayanan: "Senin–Kamis 15.30–17.00 WITA · Sabtu 08.00–10.00 WITA",

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
