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
      slug: "siaran-langsung-vdo-ninja",
      tanggal: "2026-11-25",
      kategori: "Pengumuman",
      judul: "Siaran Langsung YouTube Dinonaktifkan — Kami Beralih ke vdo.ninja",
      gambar: "assets/img/berita/blokir.png",
      ringkas:
        "Live streaming di akun YouTube Baitul Qur'an Al-Hidayah sedang dinonaktifkan sampai waktu yang tidak menentu. Untuk sementara, siaran langsung kami jalankan lewat vdo.ninja.",
      isi:
        "Dengan mengucap Bismillahirrahmanirrahim, kami sampaikan pengumuman yang mungkin sudah beberapa hari ini Anda perhatikan: siaran langsung Baitul Qur'an Al-Hidayah melalui YouTube untuk sementara tidak dapat kami jalankan.\n\n" +
        "Kami memahami ini bukan kabar yang menyenangkan. Bagi sebagian wali santri, menonton tasmi' hafalan atau acara TPQ lewat YouTube sudah menjadi kebiasaan. Karena itu, kami ingin menjelaskan apa yang sebenarnya terjadi dengan terus terang, bukan sekadar menghilangkan tombol siaran tanpa penjelasan.\n\n" +
        "## Mengapa siaran YouTube dihentikan\n\n" +
        "Kegiatan kami sebagian besar melibatkan santri yang masih di bawah umur. YouTube memiliki kebijakan khusus untuk konten yang menampilkan anak-anak, termasuk pembatasan usia dan pembatasan terkait perlindungan anak. Ketika siaran kami menampilkan kegiatan santri secara langsung, sistem menilai sebagian tayangan masuk dalam kategori yang sensitif dan akhirnya ditandai sebagai pelanggaran kebijakan.\n\n" +
        "Dampaknya, fitur live streaming pada akun kami dinonaktifkan. Kami belum bisa memastikan kapan pengaktifan kembali akan dilakukan, karena proses banding dan peninjauan sepenuhnya berada di luar kendali kami. Bisa jadi singkat, bisa jadi memakan waktu lebih lama. Karena itu kami memilih untuk tidak memberi janji waktu yang belum pasti.\n\n" +
        "Satu hal yang ingin kami tegaskan: ini bukan karena niat kami melanggar aturan. Kami sedang belajar menyesuaikan cara menyiarkan kegiatan anak-anak agar tetap aman, nyaman, dan sesuai ketentuan platform. Mohon maaf atas ketidaknyamanan yang timbul dari perubahan ini.\n\n" +
        "## Alternatif sementara: vdo.ninja\n\n" +
        "Supaya wali santri tetap bisa mengikuti kegiatan, untuk sementara kami memakai vdo.ninja sebagai pengganti YouTube Live. Singkatnya, vdo.ninja adalah layanan siaran audio dan video secara langsung yang berjalan langsung di peramban. Tidak perlu mengunduh aplikasi, tidak perlu membuat akun untuk menonton, dan yang dibutuhkan hanyalah tautan ruang siaran.\n\n" +
        "Pembawa acara membagikan satu tautan untuk penonton. Siapa pun yang memiliki tautan itu bisa membuka halaman siaran dan menonton apa yang sedang berlangsung secara realtime, hampir tanpa jeda. Karena sifatnya yang sederhana, layanan ini cocok untuk kegiatan kecil seperti setoran hafalan, tasmi', atau pertemuan singkat di TPQ.\n\n" +
        "Berbeda dengan YouTube, vdo.ninja tidak menyimpan siaran sebagai video publik di kanal kami. Jadi setelah siaran selesai, tautan tidak lagi menampilkan acara tersebut. Ini justru kami nilai lebih aman untuk kegiatan yang melibatkan anak-anak.\n\n" +
        "## Cara menonton siaran sekarang\n\n" +
        "Buka menu Siaran Langsung di website ini. Halaman akan mengambil tautan terbaru secara otomatis saat dibuka. Bila Anda membuka halaman ini sebelum tautan dipasang, tekan tombol Perbarui setelah admin memasang tautan siaran.\n\n" +
        "- Buka menu Siaran Langsung di website Baitul Qur'an Al-Hidayah.\n" +
        "- Tunggu beberapa saat sampai pemutar menampilkan siaran.\n" +
        "- Bila belum muncul, tekan tombol Perbarui.\n" +
        "- Gunakan koneksi internet yang stabil dan siapkan headset agar suara jelas.\n" +
        "- Tombol Buka di vdo.ninja tersedia bila Anda ingin membuka pemutar di jendela terpisah.\n\n" +
        "Tautan penonton berubah setiap kali kami mengadakan siaran. Admin menyimpan tautan yang aktif di spreadsheet internal, lalu website otomatis menampilkannya. Setelah acara selesai, tautan dinonaktifkan supaya tidak menampilkan siaran lama.\n\n" +
        "## Komitmen kami\n\n" +
        "Kami sedang menyiapkan mekanisme yang lebih rapi untuk siaran ke depan, termasuk kemungkinan kembali ke YouTube bila akun kami sudah dipulihkan. Blok pemutar YouTube masih kami simpan di kode website dan akan diaktifkan kembali ketika saatnya tiba.\n\n" +
        "Terima kasih atas pengertian dan doa Anda. Kami mohon maaf atas ketidaknyamanan ini, dan insyaAllah kegiatan belajar serta setoran hafalan tetap berjalan seperti biasa. Silakan hubungi admin lewat tombol Tanya Admin bila Anda mengalami kendala mengakses siaran.",
    },
    {
      slug: "peluncuran-website",
      tanggal: "2026-11-22",
      kategori: "Pengumuman",
      judul: "Peluncuran Perdana Website Baitul Qur'an Al-Hidayah",
      gambar: "assets/img/berita/launching-website.webp",
      ringkas:
        "Malam ini website resmi Baitul Qur'an Al-Hidayah diluncurkan. Ini adalah versi pertama (beta) dan masih terus kami sempurnakan.",
      isi:
        "Dengan mengucap Bismillahirrahmanirrahim, malam ini kami mencatat sebuah langkah kecil yang insyaAllah membawa manfaat besar: hadirnya website resmi Baitul Qur'an Al-Hidayah. Website ini dapat diakses oleh siapa saja, kapan saja, dan kami harapkan menjadi rumah digital bagi seluruh informasi tentang TPQ kita.\n\n" +
        "Selama ini, sebagian besar informasi disampaikan lewat percakapan WhatsApp, pengumuman lisan, atau poster yang dibagikan dari wali ke wali. Cara itu tidak salah, namun informasi mudah tersebar dan sulit ditemukan kembali. Lewat website ini, kami ingin menyediakan satu tempat resmi yang dapat dijadikan rujukan bersama.\n\n" +
        "## Kenapa website ini dibuat\n\n" +
        "Baitul Qur'an Al-Hidayah terus bertumbuh. Jumlah santri bertambah, kegiatan semakin beragam, dan kebutuhan akan informasi yang jelas juga ikut meningkat. Wali santri perlu mengetahui jadwal mengaji, cara pendaftaran, dokumentasi kegiatan, serta layanan apa saja yang tersedia tanpa harus menanyakan satu per satu.\n\n" +
        "Di sisi lain, pengajar dan admin juga memerlukan satu wadah untuk menata informasi agar tidak berulang kali menjawab pertanyaan yang sama. Website ini kami bangun dengan niat tersebut: memudahkan komunikasi, merapikan data, dan membuat lembaga lebih mudah dikenal oleh masyarakat luas.\n\n" +
        "## Apa yang bisa ditemukan di website ini\n\n" +
        "Beberapa halaman yang sudah tersedia antara lain:\n\n" +
        "- Profil dan program — gambaran umum TPQ serta program Iqra, Tahsin, dan Tahfidz Juz Amma.\n" +
        "- Jadwal mengaji — kegiatan rutin Senin sampai Rabu, Maghrib hingga Isya waktu WITA.\n" +
        "- Cek absensi dan progres — pencatatan kehadiran serta bacaan santri lewat nomor induk (NIS).\n" +
        "- Galeri dan dokumentasi — foto-foto kegiatan belajar dan acara santri.\n" +
        "- Materi belajar — berkas yang dapat diunduh dan dicetak di rumah.\n" +
        "- Pendaftaran dan Tanya Admin — dua jalur komunikasi langsung dengan pengelola.\n\n" +
        "Kami juga menyiapkan tombol pembaruan data agar informasi yang ditampilkan selalu segar. Data santri, kehadiran, dan progres saat ini dikelola melalui spreadsheet yang dapat diperbarui oleh admin, dengan rencana perpindahan ke sistem yang lebih terarah di kemudian hari.\n\n" +
        "## Masih tahap beta\n\n" +
        "Perlu kami sampaikan dengan terus terang: website ini masih dalam tahap beta atau versi awal. Beberapa bagian mungkin belum sempurna. Ada halaman yang sedang diisi, ada tampilan yang masih kami rapikan, dan ada data yang baru akan muncul setelah dicatat oleh pengajar.\n\n" +
        "Kami memilih untuk meluncurkan lebih awal agar wali santri bisa mulai memakainya dan memberi masukan sejak awal. Dengan begitu, perbaikan yang kami lakukan benar-benar menjawab kebutuhan yang ada, bukan sekadar perkiraan kami saja.\n\n" +
        "## Cara menyampaikan masukan\n\n" +
        "Silakan gunakan menu Tanya Admin yang tersedia di beberapa bagian website. Isi nama, tempat, dan catatan yang ingin disampaikan, lalu pilih admin yang dihubungi: Nur Hidayat atau Fatimah. Pesan Anda akan langsung terbuka di WhatsApp dan sampai kepada kami.\n\n" +
        "Saran, koreksi, laporan foto yang belum tampil, atau pertanyaan apa pun sangat kami hargai. Masukan dari wali santri adalah bahan bakar untuk membuat website ini lebih berguna bagi semua.\n\n" +
        "## Penutup\n\n" +
        "Terima kasih atas kepercayaan, doa, dan dukungan yang selama ini diberikan kepada Baitul Qur'an Al-Hidayah. Semoga website ini menjadi jembatan yang mempermudah silaturahmi antara TPQ, wali santri, dan masyarakat.\n\n" +
        "Kami mohon maaf apabila masih ada kekurangan. Kami akan terus menyempurnakannya, insyaAllah, pelan-pelan tapi pasti.",
    },
    {
      slug: "pendaftaran-santri",
      tanggal: "2026-11-19",
      kategori: "Pengumuman",
      judul: "Cara Pendaftaran Santri Baru — Online dan Offline",
      gambar: "assets/img/berita/pendaftaran-santri.webp",
      ringkas:
        "Baitul Qur'an Al-Hidayah menerima pendaftaran santri baru secara online lewat website atau WhatsApp, dan secara offline dengan datang langsung ke TPQ.",
      isi:
        "Pendaftaran santri baru Baitul Qur'an Al-Hidayah dibuka. Kami memahami bahwa setiap keluarga memiliki situasi yang berbeda. Karena itu, tersedia dua jalur pendaftaran: online dari rumah dan offline dengan datang langsung ke lokasi. Pilih cara yang paling nyaman bagi Anda.\n\n" +
        "## Jalur online: lewat website\n\n" +
        "Jika Anda ingin mengisi data lebih dulu dengan tenang, gunakan halaman Pendaftaran di website ini. Isi formulir dengan data santri dan wali, lalu tekan tombol Kirim via WhatsApp. Setelah itu, pilih admin penerima pesan: Nur Hidayat atau Fatimah.\n\n" +
        "Data yang diminta meliputi nama santri sesuai akta atau Kartu Keluarga, jenis kelamin, tanggal lahir, nama wali, nomor WhatsApp wali, alamat, program yang diminati, sekolah formal, serta catatan tambahan bila ada.\n\n" +
        "## Jalur online: lewat WhatsApp langsung\n\n" +
        "Bagi yang ingin bertanya dulu atau langsung berbicara dengan admin, gunakan tombol Chat Admin untuk Daftar. Pesan template pendaftaran akan terbuka di WhatsApp. Pilih salah satu admin, lalu lengkapi data yang masih kosong langsung di percakapan.\n\n" +
        "Nomor admin yang dapat dihubungi:\n\n" +
        "- Nur Hidayat — 0831-5314-5931\n" +
        "- Fatimah — 0831-6321-7023\n\n" +
        "Admin akan membantu jadwal, persyaratan, dan tindak lanjut pendaftaran. Jangan ragu untuk bertanya apabila ada bagian yang kurang jelas.\n\n" +
        "## Jalur offline: datang langsung ke TPQ\n\n" +
        "Bagi wali santri yang berada di sekitar lokasi, Anda dapat datang langsung ke Baitul Qur'an Al-Hidayah di Desa Keluang, Kecamatan Kuaro, Kabupaten Paser, Kalimantan Timur. Tombol Lihat Peta di artikel ini akan membuka titik lokasi di Google Maps.\n\n" +
        "Waktu yang tepat untuk bertemu pengajar dan admin adalah saat kegiatan mengaji berlangsung, yaitu Senin sampai Rabu setelah Maghrib hingga menjelang Isya waktu WITA. Saat datang, siapkan data santri dan wali seperti yang tercantum di atas. Panitia akan membantu pengisian di lokasi.\n\n" +
        "## Setelah pendaftaran\n\n" +
        "Baik melalui website, WhatsApp, maupun langsung datang, proses selanjutnya tetap dibantu oleh admin. Kami akan menginformasikan jadwal dan hal-hal yang perlu disiapkan sebelum santri mulai mengaji.\n\n" +
        "Apabila ada pertanyaan sebelum mendaftar, silakan gunakan menu Tanya Admin. Kami dengan senang hati membantu.",
    },
  ],

  /* --- Galeri ----------------------------------------------------------
     Sengaja dikosongkan dulu: halaman menampilkan "Galeri segera hadir".
     Nanti cukup isi array ini; foto diletakkan di assets/img/kegiatan/.
     Klik foto untuk membuka versi besar di modal.
  -------------------------------------------------------------------- */
  galeri: [],

  /* --- Data santri ------------------------------------------------------
     Cadangan bila Google Sheets / Firebase belum aktif atau gagal dimuat.
     Sumber utama diatur di site.config.js → sumber.

     NIS memakai nomor urut 01–15. Nama & kelas di bawah ini diselaraskan
     dengan tab "Santri" pada spreadsheet. Saat Sheets aktif, situs selalu
     memakai nama terbaru dari spreadsheet, bukan daftar ini.
  -------------------------------------------------------------------- */
  santri: [
    { nis: "01", nama: "Galih Pambudy", kelas: "SD Kelas 6" },
    { nis: "02", nama: "Ahmad Azzam Putra", kelas: "SD Kelas 6" },
    { nis: "03", nama: "Sayyid Ammar Susanto", kelas: "SD Kelas 4" },
    { nis: "04", nama: "Adam", kelas: "TK Nol Kecil" },
    { nis: "05", nama: "Afkar Gilang Sanjaya", kelas: "SMP/MTs Kelas 1" },
    { nis: "06", nama: "Fauzan", kelas: "SMA/SMK/MA Kelas 1" },
    { nis: "07", nama: "Tole", kelas: "SD Kelas 2" },
    { nis: "08", nama: "Fatih", kelas: "TK Nol Kecil" },
    { nis: "09", nama: "Rafael", kelas: "SD Kelas 5" },
    { nis: "10", nama: "Arsaka", kelas: "TK Nol Kecil" },
    { nis: "11", nama: "Aca", kelas: "TK Nol Kecil" },
    { nis: "12", nama: "Aisyah farisa Sanjaya", kelas: "SD Kelas 1" },
    { nis: "13", nama: "Alya", kelas: "SD Kelas 3" },
    { nis: "14", nama: "Alma", kelas: "Belum Sekolah" },
    { nis: "15", nama: "Soraya", kelas: "SD Kelas 1" },
  ],
};
