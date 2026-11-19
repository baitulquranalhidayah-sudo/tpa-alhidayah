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
    tampil: "0831-5345-931", // tampilan di layar
    internasional: "628315345931", // untuk wa.me (tanpa + dan tanpa 0 di depan)
  },
  email: "", // kosongkan jika belum ada
  jamLayanan: "Senin–Kamis 15.30–17.00 WITA · Sabtu 08.00–10.00 WITA",

  /* --- Media sosial ---------------------------------------------------- */
  youtube: "", // isi link channel, contoh: "https://youtube.com/@baitulquranalhidayah"
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
