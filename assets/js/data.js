/* ==========================================================================
   DATA KONTEN — edit di sini untuk memperbarui isi website.
   ========================================================================== */

window.DATA = {
  /* --- Pengajar --------------------------------------------------------
     Tambah/hapus kartu sesuai kebutuhan. `inisial` dipakai jika foto kosong.
     Klik foto kartu untuk membuka biodata. Isi `bio`, `pendidikan`, dan
     `pengalaman` bila tersedia — kosongkan bila belum ada informasi.
  -------------------------------------------------------------------- */
  pengajar: [
    {
      nama: "Nur Hidayat",
      peran: "Pengajar",
      bidang: "Bimbingan membaca Al-Qur'an",
      foto: "assets/img/pengajar/nur-hidayat.webp",
      inisial: "NH",
      pendidikan: "Universitas Terbuka — Ilmu Hukum, Semester 7\nPernah menempuh pendidikan di Ponpes Almadaniyah Jaro",
      pengalaman: "",
      bio: "",
    },
    {
      nama: "Fatimah",
      peran: "Pengajar",
      bidang: "Bimbingan Iqra & hafalan",
      foto: "assets/img/pengajar/fatimah.webp",
      inisial: "F",
      pendidikan: "",
      pengalaman: "",
      bio: "",
    },
  ],

  /* --- Jadwal ----------------------------------------------------------
     Jadwal sementara di bawah ini dapat diubah kapan saja.
  -------------------------------------------------------------------- */
  jadwal: [
    { hari: "Senin – Rabu", waktu: "Maghrib – Isya", kegiatan: "Belajar Iqra & Al-Qur'an (wajib)", kelas: "Semua kelas" },
    { hari: "Kamis – Ahad", waktu: "—", kegiatan: "Libur", kelas: "—" },
  ],

  /* --- Materi unduhan --------------------------------------------------
     Letakkan file di assets/dokumen/ lalu tulis namanya di `file`.
     Kosongkan `file` untuk menandai "segera hadir".
  -------------------------------------------------------------------- */
  materi: [
    {
      judul: "Buku Prestasi Iqra",
      deskripsi: "Lembar catatan capaian belajar Iqra untuk santri.",
      file: "assets/dokumen/Buku Prestasi Iqra - Baitul Quran Al Hidayah.docx",
      tipe: "DOCX",
    },
    {
      judul: "Buku Prestasi Al-Qur'an",
      deskripsi: "Lembar catatan capaian bacaan Al-Qur'an untuk santri.",
      file: "assets/dokumen/Buku Prestasi Al-Qur'an - Baitul Quran Al Hidayah.docx",
      tipe: "DOCX",
    },
    {
      judul: "Buku Setoran Juz Amma",
      deskripsi: "Lembar setoran hafalan 37 surah Juz Amma dan surah tambahan.",
      file: "assets/dokumen/Buku Setoran Juz Amma - Baitul Quran Al Hidayah.docx",
      tipe: "DOCX",
    },
    {
      judul: "Panduan Makhorijul Huruf",
      deskripsi: "Ringkasan tempat keluarnya huruf hijaiyah.",
      file: "",
      tipe: "PDF",
    },
  ],

  /* --- Berita / pengumuman --------------------------------------------
     Tambah objek baru di urutan paling atas agar tampil pertama.
  -------------------------------------------------------------------- */
  berita: [
    {
      tanggal: "2026-11-22",
      kategori: "Pengumuman",
      judul: "Peluncuran Perdana Website Baitul Qur'an Al-Hidayah",
      ringkas:
        "Malam ini website resmi Baitul Qur'an Al-Hidayah diluncurkan. Ini adalah versi pertama (beta) dan masih terus kami sempurnakan.",
      isi:
        "Dengan mengucap Bismillah, malam ini kami meluncurkan website resmi Baitul Qur'an Al-Hidayah.\n\n" +
        "Website ini masih dalam tahap beta. Beberapa fitur, tampilan, dan data masih kami rapikan dari waktu ke waktu.\n\n" +
        "Kami mohon doa, dukungan, dan masukan dari wali santri serta sahabat sekalian. Silakan gunakan menu Tanya Admin untuk menyampaikan saran atau laporan.\n\n" +
        "Terima kasih atas kepercayaan dan dukungannya.",
    },
    {
      tanggal: "2026-11-19",
      kategori: "Pengumuman",
      judul: "Pendaftaran Santri Baru Dibuka",
      ringkas:
        "Pendaftaran santri baru Baitul Qur'an Al-Hidayah dibuka. Pendaftaran dapat dilakukan langsung melalui formulir online atau menghubungi admin.",
      isi: "",
    },
  ],

  /* --- Galeri ----------------------------------------------------------
     Foto kegiatan ada di assets/img/kegiatan/ (kegiatan-1 … kegiatan-5.webp).
     Klik foto untuk membuka versi besar di modal.
  -------------------------------------------------------------------- */
  galeri: [
    { src: "assets/img/kegiatan/kegiatan-1.webp", judul: "Kegiatan belajar Al-Qur'an" },
    { src: "assets/img/kegiatan/kegiatan-2.webp", judul: "Kegiatan belajar Al-Qur'an" },
    { src: "assets/img/kegiatan/kegiatan-3.webp", judul: "Kegiatan belajar Al-Qur'an" },
    { src: "assets/img/kegiatan/kegiatan-4.webp", judul: "Kegiatan belajar Al-Qur'an" },
    { src: "assets/img/kegiatan/kegiatan-5.webp", judul: "Kegiatan belajar Al-Qur'an" },
  ],

  /* --- Data santri ------------------------------------------------------
     Cadangan bila Google Sheets / Firebase belum aktif atau gagal dimuat.
     Sumber utama diatur di site.config.js → sumber.

     NIS memakai nomor urut 01–15. Data absensi & progres sengaja dikosongkan
     karena akan diisi lewat spreadsheet (tab Absensi & Progres).
  -------------------------------------------------------------------- */
  santri: [
    { nis: "01", nama: "Galih", kelas: "" },
    { nis: "02", nama: "Azam", kelas: "" },
    { nis: "03", nama: "Amar", kelas: "" },
    { nis: "04", nama: "Adam", kelas: "" },
    { nis: "05", nama: "Gilang", kelas: "" },
    { nis: "06", nama: "Fauzan", kelas: "" },
    { nis: "07", nama: "Tole", kelas: "" },
    { nis: "08", nama: "Fatih", kelas: "" },
    { nis: "09", nama: "Rafael", kelas: "" },
    { nis: "10", nama: "Asaka", kelas: "" },
    { nis: "11", nama: "Aca", kelas: "" },
    { nis: "12", nama: "Aisyah", kelas: "" },
    { nis: "13", nama: "Alya", kelas: "" },
    { nis: "14", nama: "Alma", kelas: "" },
    { nis: "15", nama: "Soraya", kelas: "" },
  ],
};
