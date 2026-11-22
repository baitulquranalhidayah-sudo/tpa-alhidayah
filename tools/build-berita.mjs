/* ==========================================================================
   Generator halaman berita statis.

   Sumber: assets/js/data.js → DATA.berita
   Hasil : berita/index.html + berita/<slug>/index.html

   Jalankan: npm run build:berita
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const baca = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

function muat(rel, kunci) {
  const konteks = { window: {} };
  vm.runInNewContext(baca(rel), konteks, { filename: rel });
  return konteks.window[kunci];
}

const SITE = muat("assets/js/site.config.js", "SITE") || {};
const DATA = muat("assets/js/data.js", "DATA") || {};
const berita = Array.isArray(DATA.berita) ? DATA.berita : [];

const BASE_URL = String(SITE.url || "https://baitulquranalhidayah-sudo.github.io/tpa-alhidayah/").replace(/\/+$/, "") + "/";
const mutlak = (p) => new URL(String(p || "").replace(/^\/+/, ""), BASE_URL).href;

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function tanggalPanjang(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return String(iso);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

function estimasi(isi) {
  const kata = String(isi || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(kata / 200))} menit baca`;
}

/*## → <h2>, "- " → <li>, sisanya → <p> */
function isiKeHtml(isi) {
  const baris = String(isi || "").replace(/\r/g, "").split("\n");
  const hasil = [];
  let paragraf = [];
  let daftar = [];

  const tutupParagraf = () => {
    if (!paragraf.length) return;
    hasil.push(`<p class="mt-4 text-[15px] leading-8 text-brand-600">${esc(paragraf.join(" "))}</p>`);
    paragraf = [];
  };
  const tutupDaftar = () => {
    if (!daftar.length) return;
    hasil.push(
      `<ul class="mt-4 space-y-2 text-[15px] leading-8 text-brand-600">${daftar
        .map((x) => `<li class="flex gap-2"><span class="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"></span><span>${esc(x)}</span></li>`)
        .join("")}</ul>`
    );
    daftar = [];
  };

  for (const mentah of baris) {
    const bar = mentah.trim();
    if (!bar) {
      tutupParagraf();
      tutupDaftar();
    } else if (bar.startsWith("## ")) {
      tutupParagraf();
      tutupDaftar();
      hasil.push(`<h2 class="mt-10 font-display text-2xl font-semibold leading-snug text-brand-900">${esc(bar.slice(3))}</h2>`);
    } else if (bar.startsWith("- ")) {
      tutupParagraf();
      daftar.push(bar.slice(2));
    } else {
      tutupDaftar();
      paragraf.push(bar);
    }
  }
  tutupParagraf();
  tutupDaftar();
  return hasil.join("\n        ");
}

function header() {
  return `<!-- Bar atas -->
  <div class="hidden bg-brand-950 text-[13px] text-brand-200 md:block">
    <div class="container-bq flex items-center justify-between py-2">
      <p class="flex items-center gap-2">
        <i class="fa-solid fa-location-dot text-gold-500"></i>
        <span data-site="alamat1"></span><span class="text-brand-500">·</span><span data-site="alamat2"></span>
      </p>
      <p class="flex items-center gap-4">
        <span class="flex items-center gap-2"><i class="fa-regular fa-clock text-gold-500"></i><span data-site="jam"></span></span>
        <a data-pilih-admin href="#" class="flex items-center gap-2 font-medium text-white transition hover:text-gold-300">
          <i class="fa-brands fa-whatsapp text-gold-500"></i><span>Hubungi admin</span>
        </a>
      </p>
    </div>
  </div>

  <header class="sticky top-0 z-50 bg-brand-800/95 shadow-soft backdrop-blur">
    <div class="container-bq flex items-center justify-between gap-4 py-3">
      <a href="index.html#beranda" class="flex items-center gap-3" aria-label="Beranda Baitul Qur'an Al-Hidayah">
        <img src="assets/img/logo/logo-mark.png" alt="Logo Baitul Qur'an Al-Hidayah" width="44" height="44" class="h-11 w-11 rounded-full ring-1 ring-gold-500/40">
        <span class="leading-tight">
          <span class="block font-display text-lg font-semibold text-white sm:text-xl">Baitul Qur'an</span>
          <span class="block text-[11px] font-medium uppercase tracking-[.2em] text-gold-400">Al-Hidayah</span>
        </span>
      </a>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
        <a href="index.html#beranda" class="nav-link">Beranda</a>
        <a href="index.html#profil" class="nav-link">Profil</a>
        <a href="index.html#program" class="nav-link">Program</a>
        <a href="index.html#jadwal" class="nav-link">Jadwal</a>
        <a href="index.html#galeri" class="nav-link">Galeri</a>
        <a href="berita/" class="nav-link text-gold-300">Berita</a>
        <div class="relative">
          <button id="dropdown-btn" type="button" class="nav-link flex items-center gap-1.5" aria-expanded="false" aria-haspopup="true">
            Layanan <i class="fa-solid fa-chevron-down text-[10px] opacity-70"></i>
          </button>
          <div id="dropdown-layanan" class="absolute right-0 top-full z-50 mt-2 hidden w-52 overflow-hidden rounded-xl border border-brand-100 bg-white py-1.5 shadow-card">
            <a href="index.html#pengajar" class="block px-4 py-2.5 text-sm text-brand-800 hover:bg-brand-50">Pengajar</a>
            <a href="index.html#materi" class="block px-4 py-2.5 text-sm text-brand-800 hover:bg-brand-50">Materi Belajar</a>
            <a href="index.html#absensi" class="block px-4 py-2.5 text-sm text-brand-800 hover:bg-brand-50">Cek Absensi</a>
            <a href="index.html#progres" class="block px-4 py-2.5 text-sm text-brand-800 hover:bg-brand-50">Cek Progres</a>
            <a href="index.html#live" class="block px-4 py-2.5 text-sm text-brand-800 hover:bg-brand-50">Siaran Langsung</a>
          </div>
        </div>
        <a href="index.html#pendaftaran" class="btn-gold ml-2 !px-5 !py-2.5"><i class="fa-solid fa-user-plus text-xs"></i> Daftar</a>
      </nav>

      <button id="menu-btn" type="button" class="rounded-lg p-2.5 text-2xl text-white transition hover:bg-white/10 lg:hidden" aria-expanded="false" aria-controls="mobile-panel" aria-label="Buka menu">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

    <div id="mobile-panel" class="hidden lg:hidden">
      <div id="mobile-backdrop" class="fixed inset-0 top-0 z-40 bg-brand-950/60"></div>
      <nav class="relative z-50 max-h-[calc(100vh-70px)] overflow-y-auto border-t border-white/10 bg-brand-900 px-4 py-4" aria-label="Navigasi mobile">
        <div class="grid gap-1 text-sm">
          <a href="index.html#beranda" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Beranda</a>
          <a href="index.html#profil" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Profil</a>
          <a href="index.html#program" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Program</a>
          <a href="index.html#jadwal" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Jadwal</a>
          <a href="index.html#galeri" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Galeri</a>
          <a href="berita/" class="rounded-lg px-3 py-3 text-gold-300 hover:bg-white/10">Berita</a>
          <p class="mt-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-widest text-gold-400">Layanan</p>
          <a href="index.html#pengajar" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Pengajar</a>
          <a href="index.html#materi" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Materi Belajar</a>
          <a href="index.html#absensi" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Cek Absensi</a>
          <a href="index.html#progres" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Cek Progres</a>
          <a href="index.html#live" class="rounded-lg px-3 py-3 text-white/90 hover:bg-white/10">Siaran Langsung</a>
          <a href="index.html#pendaftaran" class="btn-gold mt-3"><i class="fa-solid fa-user-plus text-xs"></i> Daftar Santri Baru</a>
        </div>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="mt-16 bg-brand-950 text-brand-200">
    <div class="container-bq grid gap-10 py-12 md:grid-cols-3">
      <div>
        <div class="flex items-center gap-3">
          <img src="assets/img/logo/logo-mark.png" alt="Logo" class="h-12 w-12 rounded-full ring-1 ring-gold-500/40">
          <div>
            <p class="font-display text-lg font-semibold text-white" data-site="nama"></p>
            <p class="text-xs uppercase tracking-[.18em] text-gold-500" data-site="jenis"></p>
          </div>
        </div>
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-brand-300" data-site="tagline"></p>
      </div>
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-[.18em] text-gold-500">Tautan</h2>
        <ul class="mt-4 grid gap-3 text-sm">
          <li><a href="index.html#profil" class="hover:text-white">Profil</a></li>
          <li><a href="index.html#program" class="hover:text-white">Program</a></li>
          <li><a href="index.html#jadwal" class="hover:text-white">Jadwal</a></li>
          <li><a href="berita/" class="hover:text-white">Berita</a></li>
          <li><a href="index.html#pendaftaran" class="hover:text-white">Pendaftaran</a></li>
        </ul>
      </div>
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-[.18em] text-gold-500">Kontak</h2>
        <ul class="mt-4 space-y-3 text-sm">
          <li class="flex gap-2.5"><i class="fa-solid fa-location-dot mt-1 text-gold-600"></i><span><span data-site="alamat1"></span><br><span data-site="alamat2"></span></span></li>
          <li class="flex gap-2.5"><i class="fa-brands fa-whatsapp mt-1 text-gold-600"></i><span id="footer-wa-list"></span></li>
          <li class="flex gap-2.5"><i class="fa-regular fa-clock mt-1 text-gold-600"></i><span data-site="jam"></span></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="container-bq flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
        <p>© <span data-site="tahun"></span> <span data-site="nama"></span>. Seluruh hak cipta dilindungi.</p>
        <p>Desa Keluang · Kec. Kuaro · Kab. Paser · Kalimantan Timur</p>
      </div>
    </div>
  </footer>`;
}

function modal() {
  return `<div id="modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-brand-950/70 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
      <div class="flex items-start justify-between gap-4">
        <h2 id="modal-title" class="font-display text-lg font-semibold text-brand-900"></h2>
        <button id="modal-close" type="button" class="rounded-lg p-1.5 text-brand-400 hover:bg-brand-50 hover:text-brand-700" aria-label="Tutup">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
      <div id="modal-body" class="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-600"></div>
    </div>
  </div>`;
}

function dokumen({ base, title, description, canonical, gambar, tipe, published, isi, skema, skip }) {
  const aman = (s) => String(s || "").replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${esc(base)}">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#113D40">
  <link rel="canonical" href="${esc(canonical)}">

  <meta property="og:type" content="${esc(tipe)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="${esc(SITE.nama || "")}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(gambar)}">
  <meta property="og:locale" content="id_ID">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:image" content="${esc(gambar)}">
  ${published ? `<meta property="article:published_time" content="${esc(published)}">` : ""}

  <link rel="icon" href="assets/img/icons/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" href="assets/img/icons/icon-192.png">
  <link rel="apple-touch-icon" href="assets/img/icons/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <link rel="stylesheet" href="assets/css/style.css">

  <script type="application/ld+json">${aman(JSON.stringify(skema))}</script>
</head>
<body data-page="artikel" class="flex min-h-screen flex-col bg-cream text-brand-900">
  <a href="${esc(skip || canonical + "#artikel")}" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-brand-900">Lewati ke konten</a>
  ${header()}
  <main id="artikel" class="flex-grow">
    ${isi}
  </main>
  ${footer()}
  ${modal()}

  <script src="assets/js/site.config.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
`;
}

/* --- Kartu artikel untuk halaman arsip --------------------------------- */
function kartu(b) {
  const href = b.slug ? `berita/${encodeURIComponent(b.slug)}/` : "berita/";
  return `<a href="${esc(href)}" class="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
    <div class="relative h-44 overflow-hidden bg-brand-800">
      ${b.gambar ? `<img src="${esc(b.gambar)}" alt="${esc(b.judul)}" loading="lazy" class="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105">` : `<div class="pattern-dots absolute inset-0 opacity-70"></div>`}
      <span class="absolute left-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-900">${esc(b.kategori || "Informasi")}</span>
    </div>
    <div class="flex flex-1 flex-col p-6">
      <p class="text-xs text-brand-400"><i class="fa-regular fa-calendar mr-1.5"></i>${esc(tanggalPanjang(b.tanggal))}</p>
      <h2 class="mt-2 font-display text-xl font-semibold leading-snug text-brand-900">${esc(b.judul)}</h2>
      <p class="mt-3 flex-1 text-sm leading-relaxed text-brand-600">${esc(b.ringkas)}</p>
      <span class="mt-4 self-start text-sm font-semibold text-brand-700 group-hover:text-brand-600">Baca selengkapnya <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></span>
    </div>
  </a>`;
}

/* --- Halaman arsip ------------------------------------------------------ */
function tulisArsip() {
  const canonical = mutlak("berita/");
  const isi = `<div class="container-bq py-12">
      <nav class="text-xs text-brand-400">
        <a href="index.html#beranda" class="hover:text-brand-700">Beranda</a>
        <span class="mx-2">/</span><span class="text-brand-700">Berita</span>
      </nav>
      <div class="mt-6 max-w-2xl">
        <span class="text-xs font-semibold uppercase tracking-[.2em] text-gold-600">Kabar terbaru</span>
        <h1 class="mt-2 font-display text-3xl font-semibold text-brand-900 sm:text-4xl">Berita &amp; Pengumuman</h1>
        <p class="mt-3 leading-relaxed text-brand-600">Informasi, pengumuman, dan catatan perkembangan Baitul Qur'an Al-Hidayah.</p>
      </div>
      <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">${berita.map(kartu).join("")}</div>
    </div>`;

  const html = dokumen({
    base: "../",
    title: `Berita & Pengumuman — ${SITE.nama || ""}`,
    description: `Berita dan pengumuman ${SITE.nama || ""}.`,
    canonical,
    gambar: mutlak("assets/img/logo/og-image.jpg"),
    tipe: "website",
    published: "",
    isi,
    skip: `${canonical}#artikel`,
    skema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Berita & Pengumuman",
      url: canonical,
      publisher: { "@type": "EducationalOrganization", name: SITE.nama || "" },
    },
  });
  fs.mkdirSync(path.join(ROOT, "berita"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "berita/index.html"), html);
  console.log("✓ berita/index.html");
}

/* --- Halaman artikel ---------------------------------------------------- */
function tulisArtikel(b) {
  if (!b.slug) {
    console.warn(`! lewati "${b.judul}" karena slug kosong`);
    return;
  }
  const slug = encodeURIComponent(b.slug);
  const canonical = mutlak(`berita/${slug}/`);
  const gambar = mutlak(b.gambar || "assets/img/logo/og-image.jpg");
  const judul = b.judul || "Berita";
  const deskripsi = b.ringkas || "";
  const shareText = `${judul} — ${SITE.nama || ""}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${canonical}`)}`;
  const related = berita.filter((x) => x.slug !== b.slug).slice(0, 2);

  const pesanDaftar = [
    "*PENDAFTARAN SANTRI BARU*",
    SITE.nama || "",
    "",
    "Nama santri     :",
    "Jenis kelamin   :",
    "Tanggal lahir   :",
    "Nama wali       :",
    "WhatsApp wali   :",
    "Alamat          :",
    "Program         :",
    "Sekolah formal  :",
    "Catatan         :",
    "",
    "Mohon informasi jadwal dan persyaratan pendaftaran. Terima kasih.",
  ].join("\n");
  const pesanDaftarAttr = esc(pesanDaftar).replace(/\n/g, "&#10;");

  const jalurPendaftaran =
    b.slug === "pendaftaran-santri"
      ? `<section class="mt-10 rounded-2xl border border-gold-200 bg-gold-50 p-6">
          <h2 class="font-display text-xl font-semibold text-brand-900">Pilih jalur pendaftaran</h2>
          <p class="mt-2 text-sm leading-relaxed text-brand-600">Website, WhatsApp, atau datang langsung — semuanya kami bantu.</p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a href="index.html#pendaftaran" class="btn-gold"><i class="fa-solid fa-pen-to-square text-xs"></i> Daftar lewat website</a>
            <a data-pilih-admin href="#" data-pesan="${pesanDaftarAttr}" class="btn-primary"><i class="fa-brands fa-whatsapp"></i> Chat Admin untuk Daftar</a>
            <a data-maps href="#" target="_blank" rel="noopener" class="btn-ghost"><i class="fa-solid fa-map-location-dot"></i> Lihat Peta / Datang Langsung</a>
          </div>
        </section>`
      : "";

  const isi = `<div class="container-bq py-8">
      <nav class="text-xs text-brand-400">
        <a href="index.html#beranda" class="hover:text-brand-700">Beranda</a>
        <span class="mx-2">/</span>
        <a href="berita/" class="hover:text-brand-700">Berita</a>
        <span class="mx-2">/</span><span class="text-brand-700">${esc(judul)}</span>
      </nav>

      <article class="mx-auto max-w-3xl">
        <header class="pt-10 text-center">
          <span class="inline-flex rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-900">${esc(b.kategori || "Informasi")}</span>
          <h1 class="mt-5 font-display text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">${esc(judul)}</h1>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-500">${esc(deskripsi)}</p>
          <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-brand-400">
            <span><i class="fa-regular fa-calendar mr-1.5"></i>${esc(tanggalPanjang(b.tanggal))}</span>
            <span class="text-brand-200">·</span>
            <span><i class="fa-regular fa-clock mr-1.5"></i>${esc(estimasi(b.isi))}</span>
            <span class="text-brand-200">·</span>
            <span><i class="fa-regular fa-user mr-1.5"></i>${esc(SITE.namaPendek || SITE.nama || "Admin")}</span>
          </div>
        </header>

        ${b.gambar ? `<figure class="mt-8 overflow-hidden rounded-2xl shadow-soft"><img src="${esc(b.gambar)}" alt="${esc(judul)}" class="w-full object-cover"><figcaption class="bg-white px-4 py-3 text-center text-xs text-brand-400">Dokumentasi Baitul Qur'an Al-Hidayah</figcaption></figure>` : ""}

        <div class="mt-10 rounded-2xl border border-brand-100 bg-white p-6 sm:p-8">
          ${isiKeHtml(b.isi)}
          ${jalurPendaftaran}
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-800 p-5 text-white">
          <p class="text-sm font-medium"><i class="fa-solid fa-share-nodes mr-2 text-gold-400"></i>Manfaat artikel ini? Bagikan ke keluarga dan sahabat.</p>
          <a href="${esc(shareUrl)}" target="_blank" rel="noopener" class="btn-gold !py-2.5"><i class="fa-brands fa-whatsapp"></i> Bagikan</a>
        </div>

        <aside class="mt-6 rounded-2xl border border-brand-100 bg-white p-6">
          <h2 class="font-display text-lg font-semibold text-brand-900">Ada yang ingin ditanyakan?</h2>
          <p class="mt-2 text-sm leading-relaxed text-brand-600">Tim admin siap membantu soal pendaftaran, jadwal, atau hal lainnya.</p>
          <a data-pilih-admin href="#" class="btn-primary mt-4"><i class="fa-brands fa-whatsapp"></i> Tanya Admin</a>
        </aside>
      </article>

      ${
        related.length
          ? `<section class="mx-auto mt-14 max-w-5xl">
              <h2 class="font-display text-xl font-semibold text-brand-900">Baca juga</h2>
              <div class="mt-5 grid gap-5 sm:grid-cols-2">${related.map(kartu).join("")}</div>
              <div class="mt-6 text-center"><a href="berita/" class="text-sm font-semibold text-brand-700 hover:text-brand-600">Lihat semua berita <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></a></div>
            </section>`
          : ""
      }
    </div>`;

  const html = dokumen({
    base: "../../",
    title: `${judul} — ${SITE.nama || ""}`,
    description: deskripsi,
    canonical,
    gambar,
    tipe: "article",
    published: b.tanggal ? `${b.tanggal}T00:00:00+08:00` : "",
    isi,
    skip: `${canonical}#artikel`,
    skema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: judul,
      description: deskripsi,
      image: gambar,
      datePublished: b.tanggal || "",
      mainEntityOfPage: canonical,
      author: { "@type": "Organization", name: SITE.nama || "" },
      publisher: { "@type": "EducationalOrganization", name: SITE.nama || "" },
    },
  });

  const folder = path.join(ROOT, "berita", b.slug);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "index.html"), html);
  console.log(`✓ berita/${b.slug}/index.html`);
}

tulisArsip();
berita.forEach(tulisArtikel);
