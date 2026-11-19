/* ==========================================================================
   DATA KONTEN — edit di sini untuk memperbarui isi website.
   ========================================================================== */

window.DATA = {
  /* --- Pengajar --------------------------------------------------------
     Tambah/hapus kartu sesuai kebutuhan. `inisial` dipakai jika foto kosong.
  -------------------------------------------------------------------- */
  pengajar: [
    {
      nama: "Nur Hidayat",
      peran: "Pengajar",
      bidang: "Bimbingan membaca Al-Qur'an",
      foto: "", // contoh: "assets/img/pengajar/nur-hidayat.jpg"
      inisial: "NH",
    },
    {
      nama: "Fatimah",
      peran: "Pengajar",
      bidang: "Bimbingan Iqra & hafalan",
      foto: "",
      inisial: "F",
    },
  ],

  /* --- Jadwal ----------------------------------------------------------
     Jadwal sementara di bawah ini dapat diubah kapan saja.
  -------------------------------------------------------------------- */
  jadwal: [
    { hari: "Senin – Kamis", waktu: "15.30 – 17.00", kegiatan: "Belajar Iqra, Al-Qur'an, dan setoran hafalan", kelas: "Semua kelas" },
    { hari: "Jumat", waktu: "—", kegiatan: "Libur", kelas: "—" },
    { hari: "Sabtu", waktu: "08.00 – 10.00", kegiatan: "Muroja'ah hafalan & pembinaan adab", kelas: "Semua kelas" },
    { hari: "Ahad", waktu: "—", kegiatan: "Libur", kelas: "—" },
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
      tanggal: "2026-11-19",
      kategori: "Pengumuman",
      judul: "Pendaftaran Santri Baru Dibuka",
      ringkas:
        "Pendaftaran santri baru Baitul Qur'an Al-Hidayah dibuka. Pendaftaran dapat dilakukan langsung melalui formulir online atau menghubungi admin.",
      isi: "",
    },
  ],

  /* --- Galeri ----------------------------------------------------------
     Isi dengan objek { src, judul } setelah foto tersedia.
     Contoh: { src: "assets/img/galeri/kegiatan-1.jpg", judul: "Kegiatan belajar" }
  -------------------------------------------------------------------- */
  galeri: [],

  /* --- Data santri (contoh) --------------------------------------------
     Dipakai halaman Absensi & Progres selama Firebase belum aktif.
     Ganti/hapus data contoh ini sebelum situs dipublikasikan luas.
  -------------------------------------------------------------------- */
  santri: [
    {
      nis: "101",
      nama: "Ahmad Fauzi",
      kelas: "Iqra 3",
      status: "Hadir",
      tanggal: "2026-11-19",
      bacaan: "Iqra 3 halaman 12",
      hafalan: "An-Nas s.d. Al-'Adiyat",
      catatan: "Bacaan sudah lancar, panjang pendek perlu diperhatikan.",
    },
    {
      nis: "102",
      nama: "Aisyah Putri",
      kelas: "Tahfidz",
      status: "Izin",
      tanggal: "2026-11-19",
      bacaan: "Al-Qur'an juz 30",
      hafalan: "An-Naba' s.d. Al-Infitar",
      catatan: "Izin karena kegiatan sekolah. Lanjutkan muroja'ah di rumah.",
    },
    {
      nis: "103",
      nama: "Budi Santoso",
      kelas: "Iqra 1",
      status: "Sakit",
      tanggal: "2026-11-19",
      bacaan: "Iqra 1 halaman 8",
      hafalan: "Al-Fatihah",
      catatan: "Sakit. Mohon istirahat dan menyusul setoran berikutnya.",
    },
  ],
};
