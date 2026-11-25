/* ==========================================================================
   Logika website: navigasi, render konten, form WhatsApp, cek santri.
   ========================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE || {};
  const DATA = window.DATA || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ROUTES = {
    beranda: { title: "Beranda" },
    profil: { title: "Profil" },
    program: { title: "Program" },
    pengajar: { title: "Pengajar" },
    jadwal: { title: "Jadwal" },
    galeri: { title: "Galeri" },
    berita: { title: "Berita" },
    materi: { title: "Materi" },
    absensi: { title: "Cek Absensi" },
    progres: { title: "Cek Progres" },
    live: { title: "Siaran Langsung" },
    pendaftaran: { title: "Pendaftaran" },
    kontak: { title: "Kontak" },
  };

  /* --------------------------------------------------------------------
     Util
  -------------------------------------------------------------------- */
  const rupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");
  const tanggalPanjang = (iso) => {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };
  const jamPembaruan = (ms) => {
    if (!ms) return "";
    return new Date(ms).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const waLink = (text, nomor) =>
    "https://wa.me/" +
    (nomor || SITE.wa.internasional) +
    (text ? "?text=" + encodeURIComponent(text) : "");

  /* --------------------------------------------------------------------
     Isi data kontak ke seluruh halaman
  -------------------------------------------------------------------- */
  function hydrateSite() {
    $$("[data-site='nama']").forEach((el) => (el.textContent = SITE.nama));
    $$("[data-site='namaPendek']").forEach((el) => (el.textContent = SITE.namaPendek));
    $$("[data-site='jenis']").forEach((el) => (el.textContent = SITE.jenis));
    $$("[data-site='tagline']").forEach((el) => (el.textContent = SITE.tagline));
    $$("[data-site='wa']").forEach((el) => (el.textContent = SITE.wa.tampil));
    $$("[data-site='jam']").forEach((el) => (el.textContent = SITE.jamLayanan));
    $$("[data-site='alamat1']").forEach(
      (el) => (el.textContent = `${SITE.alamat.jalan}, ${SITE.alamat.kecamatan}`)
    );
    $$("[data-site='alamat2']").forEach(
      (el) => (el.textContent = `${SITE.alamat.kabupaten}, ${SITE.alamat.provinsi}`)
    );
    $$("[data-site='tahun']").forEach((el) => (el.textContent = new Date().getFullYear()));
    $$("a[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa || "")));
    $$("a[data-pilih-admin]").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        bukaPilihanAdmin(a.dataset.pesan || "");
      })
    );
    $$("a[data-maps]").forEach((a) => (a.href = SITE.alamat.mapsUrl));

    // YouTube: pakai link channel bila ada, jika belum arahkan ke pencarian.
    const yt = SITE.youtube || "https://www.youtube.com/results?search_query=Baitul+Quran+Al+Hidayah";
    $$("a[data-youtube]").forEach((a) => {
      a.href = yt;
      if (!SITE.youtube) a.title = "Cari channel di YouTube";
    });
    $$("a[data-youtube-live]").forEach((a) => {
      a.href = SITE.youtube
        ? SITE.youtube.replace(/\/+$/, "") + "/live"
        : "https://www.youtube.com/results?search_query=Baitul+Quran+Al+Hidayah+live";
    });

    // Saweria: kartu donasi disembunyikan bila tautan belum diisi.
    $$("a[data-saweria]").forEach((a) => (a.href = SITE.saweria || "#"));
    $$("[data-saweria-box]").forEach((el) => el.classList.toggle("hidden", !SITE.saweria));

    // DANA: QR bisa diklik untuk diperbesar, tombol membuka tautan DANA.
    $$("a[data-dana]").forEach((a) => (a.href = SITE.dana || "#"));
    $$("[data-dana-box]").forEach((el) => el.classList.toggle("hidden", !SITE.dana));
    $$("[data-dana-qr]").forEach((b) => b.addEventListener("click", bukaQrDana));

    // Grup WhatsApp: sembunyikan seluruh blok bila tautan belum diisi.
    $$("a[data-grup-wa]").forEach((a) => a.href = SITE.grupWa || "#");
    $$("[data-grup-wa-box]").forEach((el) => el.classList.toggle("hidden", !SITE.grupWa));

    // Daftar admin: dipakai di Kontak, kartu Pendaftaran, dan footer.
    const daftarAdmin =
      Array.isArray(SITE.admin) && SITE.admin.length
        ? SITE.admin
        : [{ nama: "Admin", wa: SITE.wa || {} }];
    const infoAdmin = daftarAdmin.map((a) => {
      const wa = a.wa || {};
      const nomor = wa.internasional || String(wa.tampil || "").replace(/\D/g, "").replace(/^0/, "62");
      return { nama: a.nama || "Admin", nomor, tampil: wa.tampil || nomor };
    });
    const tautanAdmin = (i, kelas) =>
      `<a href="https://wa.me/${esc(infoAdmin[i].nomor)}" target="_blank" rel="noopener noreferrer" class="${kelas}">${esc(infoAdmin[i].nama)} — ${esc(infoAdmin[i].tampil)}</a>`;

    const adminList = $("#admin-wa-list");
    if (adminList) {
      adminList.innerHTML = infoAdmin
        .map((_, i) => `<li>${tautanAdmin(i, "underline-offset-4 hover:text-white hover:underline")}</li>`)
        .join("");
    }
    const adminFooter = $("#footer-wa-list");
    if (adminFooter) {
      adminFooter.innerHTML = infoAdmin
        .map((_, i) => `<span class="block">${tautanAdmin(i, "hover:text-white")}</span>`)
        .join("");
    }
    const adminPendaftaran = $("#admin-wa-pendaftaran");
    if (adminPendaftaran) {
      adminPendaftaran.innerHTML = infoAdmin
        .map((_, i) => `<div>${tautanAdmin(i, "text-brand-700 underline-offset-2 hover:text-brand-900 hover:underline")}</div>`)
        .join("");
    }

    $$("[data-sosial]").forEach((el) => {
      const key = el.dataset.sosial;
      const url = SITE[key];
      if (url) {
        el.href = url;
        el.classList.remove("hidden");
      } else {
        el.remove();
      }
    });
  }

  /* --------------------------------------------------------------------
     Router (hash)
  -------------------------------------------------------------------- */
  let topLockUntil = 0;

  function lockTop(ms) {
    topLockUntil = performance.now() + (ms || 400);
    window.scrollTo(0, 0);
  }

  function navigate(id, opts) {
    const target = ROUTES[id] ? id : "beranda";
    $$(".page-section").forEach((s) => s.classList.remove("active"));
    const section = document.getElementById(target);
    if (section) section.classList.add("active");

    // Muat tabel absensi saat halaman Cek Absensi dibuka (data maks. 1 menit).
    if (target === "absensi") {
      const basi = !tabelAbsensiData || Date.now() - tabelAbsensiWaktu > 60000;
      if (basi) muatTabelAbsensi(true, nisTersorot);
    }

    // Tautan siaran vdo.ninja diambil baru setiap halaman live dibuka.
    if (target === "live") muatLive(true);

    $$("[data-route]").forEach((el) => {
      const on = el.dataset.route === target;
      el.classList.toggle("nav-link-active", on);
      if (el.hasAttribute("aria-current")) {
        if (on) el.setAttribute("aria-current", "page");
        else el.removeAttribute("aria-current");
      }
    });

    document.title = `${ROUTES[target].title} — ${SITE.nama}`;
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", `${ROUTES[target].title} ${SITE.nama} — ${SITE.tagline}`);

    closeMenus();
    if (!opts || opts.scroll !== false) lockTop();
    const heading = section && section.querySelector("h1, h2");
    if (heading && opts && opts.focus) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function onHashChange() {
    const id = (location.hash || "#beranda").replace("#", "");
    navigate(id, { focus: true });
  }

  /* Navigasi memakai pushState agar browser tidak melompat ke elemen anchor. */
  function bindRouter() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!ROUTES[id] || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
      navigate(id, { focus: true });
    });

    window.addEventListener("popstate", () => {
      navigate((location.hash || "#beranda").replace("#", ""), { focus: true });
    });

    // Jika pengguna mengetik/mengubah hash langsung di address bar.
    window.addEventListener("hashchange", onHashChange);

    // Browser dapat menggulir ke anchor saat halaman pertama dimuat atau saat
    // hash diubah dari address bar. Selama jeda singkat setelah navigasi,
    // gulirkan kembali ke atas.
    window.addEventListener(
      "scroll",
      () => {
        if (performance.now() < topLockUntil) window.scrollTo(0, 0);
      },
      { passive: true }
    );

    window.addEventListener("load", () => {
      if (location.hash) setTimeout(() => window.scrollTo(0, 0), 80);
    });
  }

  /* --------------------------------------------------------------------
     Menu
  -------------------------------------------------------------------- */
  function closeMenus() {
    const panel = $("#mobile-panel");
    if (panel) {
      panel.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      const btn = $("#menu-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
    closeDropdown();
  }

  function closeDropdown() {
    const dd = $("#dropdown-layanan");
    if (!dd) return;
    dd.classList.add("hidden");
    const btn = $("#dropdown-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function bindMenus() {
    const btn = $("#menu-btn");
    const panel = $("#mobile-panel");
    if (btn && panel) {
      btn.addEventListener("click", () => {
        const open = panel.classList.toggle("hidden");
        document.body.classList.toggle("overflow-hidden", !open);
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
      $("#mobile-backdrop")?.addEventListener("click", closeMenus);
    }

    const ddBtn = $("#dropdown-btn");
    const dd = $("#dropdown-layanan");
    if (ddBtn && dd) {
      ddBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const hidden = dd.classList.toggle("hidden");
        ddBtn.setAttribute("aria-expanded", hidden ? "false" : "true");
      });
      document.addEventListener("click", (e) => {
        if (!dd.contains(e.target) && e.target !== ddBtn) closeDropdown();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenus();
    });
  }

  /* --------------------------------------------------------------------
     Render: pengajar, jadwal, materi, berita, galeri
  -------------------------------------------------------------------- */
  function renderPengajar() {
    const wrap = $("#grid-pengajar");
    if (!wrap) return;
    const list = DATA.pengajar || [];
    if (!list.length) {
      wrap.innerHTML = `<p class="text-brand-500">Data pengajar belum tersedia.</p>`;
      return;
    }
    wrap.innerHTML = list
      .map(
        (p, i) => `
      <article class="card overflow-hidden text-center transition hover:-translate-y-1 hover:shadow-soft">
        <button type="button" data-pengajar="${i}" aria-label="Lihat biodata ${esc(p.nama)}" class="group relative block h-44 w-full bg-gradient-to-br from-brand-800 to-brand-600">
          <div class="pattern-dots absolute inset-0 opacity-60"></div>
          ${
            p.foto
              ? `<img src="${esc(p.foto)}" alt="Foto ${esc(p.nama)}" class="absolute inset-0 h-full w-full object-cover object-top" loading="lazy">`
              : `<span class="absolute inset-0 flex items-center justify-center font-display text-5xl text-gold-300/80">${esc(p.inisial || "")}</span>`
          }
          <span class="absolute inset-x-0 bottom-0 bg-brand-950/70 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"><i class="fa-solid fa-expand mr-1"></i>Lihat biodata</span>
        </button>
        <div class="p-6">
          <h3 class="font-display text-xl font-semibold text-brand-900">${esc(p.nama)}</h3>
          <p class="mt-1 text-sm font-medium text-gold-700">${esc(p.peran || "Pengajar")}</p>
          <p class="mt-3 text-sm text-brand-600">${esc(p.bidang || "")}</p>
        </div>
      </article>`
      )
      .join("");

    wrap.querySelectorAll("[data-pengajar]").forEach((btn) => {
      btn.addEventListener("click", () => bukaBiodata(Number(btn.dataset.pengajar)));
    });
  }

  /** Modal foto + biodata pengajar. */
  function bukaBiodata(i) {
    const p = (DATA.pengajar || [])[i];
    if (!p) return;

    const foto = p.foto
      ? `<img src="${esc(p.foto)}" alt="Foto ${esc(p.nama)}" class="mx-auto max-h-[42vh] w-auto rounded-xl object-contain">`
      : `<div class="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-800 font-display text-3xl text-gold-300">${esc(p.inisial || "")}</div>`;

    const rincian = [
      ["Peran", p.peran],
      ["Bidang", p.bidang],
      ["Pendidikan", p.pendidikan],
      ["Pengalaman", p.pengalaman],
    ]
      .filter(([, v]) => v && String(v).trim())
      .map(
        ([label, nilai]) => `<div class="rounded-lg bg-brand-50/70 px-3 py-2">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-brand-400">${esc(label)}</p>
          <p class="mt-0.5 whitespace-pre-line text-sm font-medium text-brand-800">${esc(nilai)}</p>
        </div>`
      )
      .join("");

    const bio = p.bio
      ? `<div class="mt-5 border-t border-brand-100 pt-4">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">Biodata</p>
          <p class="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-brand-600">${esc(p.bio)}</p>
        </div>`
      : `<p class="mt-5 border-t border-brand-100 pt-4 text-xs italic text-brand-400">Biodata lengkap belum tersedia.</p>`;

    openModal(
      p.nama,
      `<div class="text-center">${foto}</div>
       <div class="mt-5 grid gap-2 sm:grid-cols-2">${rincian}</div>
       ${bio}`,
      true
    );
  }

  function renderJadwal() {
    const body = $("#body-jadwal");
    if (!body) return;
    body.innerHTML = (DATA.jadwal || [])
      .map((j) => {
        const libur = j.waktu === "—";
        return `<tr class="${libur ? "bg-brand-50/60 text-brand-400" : "hover:bg-brand-50/50"}">
          <td class="whitespace-nowrap px-5 py-4 font-medium ${libur ? "" : "text-brand-900"}">${esc(j.hari)}</td>
          <td class="whitespace-nowrap px-5 py-4 ${libur ? "" : "text-brand-700"}">${esc(j.waktu)}</td>
          <td class="px-5 py-4 ${libur ? "" : "text-brand-800"}">${esc(j.kegiatan)}</td>
          <td class="whitespace-nowrap px-5 py-4 text-sm ${libur ? "" : "text-brand-500"}">${esc(j.kelas)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderMateri() {
    const wrap = $("#grid-materi");
    if (!wrap) return;
    wrap.innerHTML = (DATA.materi || [])
      .map((m) => {
        const ada = !!m.file;
        const aksi = ada
          ? `<a href="${esc(m.file)}" download class="btn-gold !px-4 !py-2 text-xs"><i class="fa-solid fa-download"></i> Unduh</a>`
          : `<span class="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-400"><i class="fa-regular fa-clock"></i> Segera</span>`;
        return `<article class="card flex items-start gap-4 p-5 transition hover:shadow-soft">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <i class="fa-solid ${m.tipe === "DOCX" ? "fa-file-word" : "fa-file-pdf"} text-xl"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-brand-900">${esc(m.judul)}</h3>
            <p class="mt-1 text-sm leading-relaxed text-brand-500">${esc(m.deskripsi || "")}</p>
            <div class="mt-3 flex items-center gap-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">${esc(m.tipe || "FILE")}</span>
              ${aksi}
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderBerita() {
    const wrap = $("#grid-berita");
    if (!wrap) return;
    const list = DATA.berita || [];
    if (!list.length) {
      wrap.innerHTML = `<div class="card p-10 text-center text-brand-500">Belum ada berita. Silakan cek kembali nanti.</div>`;
      return;
    }
    wrap.innerHTML = list
      .map((b) => {
        const href = b.slug ? `berita/${encodeURIComponent(b.slug)}/` : "berita/";
        return `
      <a href="${esc(href)}" class="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
        <div class="relative h-40 overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500">
          ${
            b.gambar
              ? `<img src="${esc(b.gambar)}" alt="${esc(b.judul)}" loading="lazy" class="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105">`
              : `<div class="pattern-dots absolute inset-0 opacity-70"></div>`
          }
          <span class="absolute left-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-900">${esc(b.kategori || "Informasi")}</span>
          <div class="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-gold-300 backdrop-blur">
            <i class="fa-regular fa-newspaper"></i>
          </div>
        </div>
        <div class="flex flex-1 flex-col p-6">
          <p class="text-xs text-brand-400"><i class="fa-regular fa-calendar mr-1.5"></i>${esc(tanggalPanjang(b.tanggal))}</p>
          <h3 class="mt-2 font-display text-xl font-semibold leading-snug text-brand-900">${esc(b.judul)}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-brand-600">${esc(b.ringkas)}</p>
          <span class="mt-4 self-start text-sm font-semibold text-brand-700 group-hover:text-brand-600">Baca selengkapnya <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></span>
        </div>
      </a>`;
      })
      .join("");
  }

  function renderGaleri() {
    const grid = $("#grid-galeri");
    const empty = $("#galeri-kosong");
    if (!grid) return;
    const list = DATA.galeri || [];
    if (!list.length) {
      empty?.classList.remove("hidden");
      grid.classList.add("hidden");
      return;
    }
    empty?.classList.add("hidden");
    grid.classList.remove("hidden");
    grid.innerHTML = list
      .map(
        (g) => `<button type="button" class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-100" data-galeri="${esc(g.src)}">
          <img src="${esc(g.src)}" alt="${esc(g.judul || "Foto kegiatan")}" loading="lazy" class="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105">
          <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-3 text-left text-xs font-medium text-white">${esc(g.judul || "")}</span>
        </button>`
      )
      .join("");
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-galeri]");
      if (b) openModal("", `<img src='${b.dataset.galeri}' alt='Foto kegiatan' class='mx-auto max-h-[70vh] w-auto rounded-xl object-contain'>`, true);
    });
  }

  /* --------------------------------------------------------------------
     Modal
  -------------------------------------------------------------------- */
  function openModal(title, html, raw) {
    const m = $("#modal");
    if (!m) return;
    $("#modal-title").textContent = title || "";
    $("#modal-title").classList.toggle("hidden", !title);
    $("#modal-body")[raw ? "innerHTML" : "textContent"] = html;
    m.classList.remove("hidden");
    m.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    $("#modal-close")?.focus();
  }
  function closeModal() {
    const m = $("#modal");
    if (!m) return;
    m.classList.add("hidden");
    m.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  /** Perbesar QR DANA; tombol di dalam modal membuka tautan DANA. */
  function bukaQrDana() {
    const tautan = SITE.dana || "";
    const lanjut = tautan
      ? `<a href="${esc(tautan)}" target="_blank" rel="noopener" class="btn-gold mt-4"><i class="fa-solid fa-up-right-from-square"></i> Buka DANA</a>`
      : "";
    openModal(
      "Sedekah via DANA",
      `<div class="text-center">
        <img src="assets/img/qr/dana.png" alt="QR DANA untuk sedekah" class="mx-auto max-w-sm rounded-xl bg-white p-3">
        <p class="mt-3 text-xs text-brand-500">Pindai dengan aplikasi DANA, atau buka langsung lewat tombol di bawah.</p>
        ${lanjut}
      </div>`,
      true
    );
  }

  /** Modal pilih admin: dipakai tombol Tanya Admin dan Kirim via WhatsApp. */
  function bukaPilihanAdmin(pesan) {
    const daftar =
      Array.isArray(SITE.admin) && SITE.admin.length
        ? SITE.admin
        : [{ nama: "Admin", wa: SITE.wa || {} }];

    const kartu = daftar
      .map((a) => {
        const wa = a.wa || {};
        const nomor =
          wa.internasional || String(wa.tampil || "").replace(/\D/g, "").replace(/^0/, "62");
        const tampil = wa.tampil || nomor;
        return `<button type="button" data-admin-pilih="${esc(nomor)}" class="flex w-full items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white p-4 text-left transition hover:border-gold-500 hover:bg-gold-50 focus:border-gold-500 focus:outline-none">
          <span>
            <span class="block font-semibold text-brand-900">${esc(a.nama || "Admin")}</span>
            <span class="mt-0.5 block text-xs text-brand-500">${esc(tampil)}</span>
          </span>
          <span class="shrink-0 rounded-lg bg-brand-800 px-3 py-2 text-xs font-semibold text-white"><i class="fa-brands fa-whatsapp mr-1"></i>Chat</span>
        </button>`;
      })
      .join("");

    // Tombol Tanya Admin: minta nama, tempat, dan catatan dulu.
    // Formulir pendaftaran sudah punya pesan sendiri, jadi langsung pilih admin.
    const butuhForm = !pesan;
    const formTanya = butuhForm
      ? `<form id="form-tanya-admin" class="space-y-3">
          <div>
            <label class="label" for="ta-nama">Nama <span class="text-rose-500">*</span></label>
            <input class="input" id="ta-nama" name="nama" required maxlength="80" placeholder="Nama Anda">
          </div>
          <div>
            <label class="label" for="ta-tempat">Tempat <span class="text-rose-500">*</span></label>
            <input class="input" id="ta-tempat" name="tempat" required maxlength="100" placeholder="Contoh: Desa Keluang, Kuaro">
          </div>
          <div>
            <label class="label" for="ta-catatan">Catatan <span class="text-rose-500">*</span></label>
            <textarea class="input min-h-[88px]" id="ta-catatan" name="catatan" required maxlength="400" placeholder="Tulis pertanyaan atau pesan yang ingin disampaikan"></textarea>
          </div>
        </form>`
      : "";

    const isi = `${
      butuhForm
        ? `<p class="mb-4 text-sm leading-relaxed text-brand-600">Isi data berikut, lalu pilih admin. Pesan langsung terbuka di WhatsApp.</p>`
        : `<p class="mb-4 text-sm leading-relaxed text-brand-600">Pilih admin penerima pesan pendaftaran Anda.</p>`
    }${formTanya}<div class="mt-4 space-y-2">${kartu}</div>`;

    openModal(pesan ? "Kirim pesan ke admin" : "Hubungi admin", isi, true);

    $$("#modal-body [data-admin-pilih]").forEach((btn) => {
      btn.addEventListener("click", () => {
        let isiPesan = pesan;
        if (butuhForm) {
          const form = $("#form-tanya-admin");
          if (form && !form.reportValidity()) return;
          const nilai = (id) => ($(id)?.value || "").trim();
          isiPesan = [
            "*PESAN DARI WEBSITE BAITUL QUR'AN AL-HIDAYAH*",
            "",
            `Nama    : ${nilai("#ta-nama")}`,
            `Tempat  : ${nilai("#ta-tempat")}`,
            `Catatan : ${nilai("#ta-catatan")}`,
            "",
            "Mohon balasannya. Terima kasih.",
          ].join("\n");
        }
        closeModal();
        window.open(waLink(isiPesan, btn.dataset.adminPilih), "_blank", "noopener");
      });
    });
  }

  /* --------------------------------------------------------------------
     Cek santri: Firebase → Google Sheets → data contoh lokal
  -------------------------------------------------------------------- */
  let firestoreReader = null;
  let firestoreTried = false;

  async function getFirestoreReader() {
    if (!SITE.firebase || !SITE.firebase.enabled) return null;
    if (firestoreTried) return firestoreReader;
    firestoreTried = true;
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js");
      const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
      const app = initializeApp(SITE.firebase.config);
      const db = getFirestore(app);
      firestoreReader = async (nis) => {
        const snap = await getDoc(doc(db, "santri", String(nis)));
        return snap.exists() ? snap.data() : null;
      };
      return firestoreReader;
    } catch (err) {
      console.error("Firebase gagal dimuat:", err);
      return null;
    }
  }

  /** "01" dan "1" dianggap NIS yang sama. */
  const normalNis = (v) =>
    String(v == null ? "" : v)
      .trim()
      .toLowerCase()
      .replace(/^0+(?=\d)/, "");

  function cariLokal(nis) {
    const cari = normalNis(nis);
    const local = (DATA.santri || []).find((s) => normalNis(s.nis) === cari);
    if (!local) return { data: null, riwayat: [], sumber: "lokal" };
    // data.js hanya menyimpan identitas santri, belum ada catatan pertemuan.
    return { data: local, riwayat: [local], sumber: "lokal" };
  }

  async function cariSantri(nis, jenis, paksa) {
    const reader = await getFirestoreReader();
    if (reader) {
      const data = await reader(nis);
      return { data, riwayat: data ? [data] : [], sumber: "firebase" };
    }

    if (window.SUMBER && window.SUMBER.aktif()) {
      try {
        return await window.SUMBER.ambil(nis, jenis, !!paksa);
      } catch (err) {
        // Sheets belum dibagikan / offline: situs tetap jalan dengan data contoh.
        console.warn("Google Sheets gagal dimuat, memakai data contoh:", err);
      }
    }

    return cariLokal(nis);
  }

  function kelasStatus(status) {
    const s = String(status || "").toLowerCase();
    if (s === "hadir") return "bg-emerald-100 text-emerald-700";
    if (s === "izin") return "bg-sky-100 text-sky-700";
    if (s === "sakit") return "bg-amber-100 text-amber-700";
    if (s === "alfa" || s === "alpa" || s === "alpha") return "bg-rose-100 text-rose-700";
    return "bg-brand-100 text-brand-600";
  }

  function renderRiwayat(el, list, jenis) {
    if (!el) return;
    const rows = (list || []).slice(0, 5);
    if (rows.length < 2) {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    const isi = rows
      .map((r) => {
        const tanggal = `<span class="shrink-0 text-brand-500">${esc(tanggalPanjang(r.tanggal))}</span>`;
        if (jenis === "progres") {
          return `<li class="rounded-lg bg-brand-50/70 px-3 py-2">
            <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
              ${tanggal}
              <span class="font-semibold text-brand-800">${esc(r.bacaan || "-")}</span>
            </div>
            ${r.catatan ? `<p class="mt-1 text-[11px] text-brand-500">${esc(r.catatan)}</p>` : ""}
          </li>`;
        }
        return `<li class="flex items-center justify-between gap-3 rounded-lg bg-brand-50/70 px-3 py-2 text-xs">
          ${tanggal}
          <span class="rounded px-2 py-0.5 text-[11px] font-bold uppercase ${kelasStatus(r.status)}">${esc(r.status || "-")}</span>
        </li>`;
      })
      .join("");

    el.innerHTML = `
      <p class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">Riwayat 5 pertemuan terakhir</p>
      <ul class="mt-2 space-y-1.5">${isi}</ul>`;
    el.classList.remove("hidden");
  }

  /** Ringkasan kehadiran bulan terakhir yang tercatat. */
  function renderRekap(el, riwayat) {
    if (!el) return;
    const list = riwayat || [];
    const terakhir = list[0];
    if (!terakhir || !terakhir.tanggal) {
      el.innerHTML = "";
      el.classList.add("hidden");
      return;
    }

    const bulan = terakhir.tanggal.slice(0, 7);
    const sebulan = list.filter((r) => String(r.tanggal || "").slice(0, 7) === bulan);
    const hitung = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 };
    sebulan.forEach((r) => {
      const k = String(r.status || "").toLowerCase();
      if (k === "hadir") hitung.Hadir++;
      else if (k === "izin") hitung.Izin++;
      else if (k === "sakit") hitung.Sakit++;
      else if (k === "alfa" || k === "alpa" || k === "alpha") hitung.Alpa++;
    });

    const label = new Date(+bulan.slice(0, 4), +bulan.slice(5, 7) - 1, 1).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    const kotak = [
      ["Hadir", "bg-emerald-50", "text-emerald-700", "text-emerald-600"],
      ["Izin", "bg-sky-50", "text-sky-700", "text-sky-600"],
      ["Sakit", "bg-amber-50", "text-amber-700", "text-amber-600"],
      ["Alpa", "bg-rose-50", "text-rose-700", "text-rose-600"],
    ]
      .map(
        ([nama, bg, kuat, lembut]) => `<div class="rounded-lg ${bg} px-2 py-2 text-center">
          <p class="text-lg font-bold leading-tight ${kuat}">${hitung[nama]}</p>
          <p class="text-[10px] font-semibold uppercase tracking-wide ${lembut}">${nama}</p>
        </div>`
      )
      .join("");

    const total = sebulan.length;
    const persen = total ? Math.round((hitung.Hadir / total) * 100) : 0;
    el.innerHTML = `
      <p class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">Rekap ${esc(label)}</p>
      <div class="mt-2 grid grid-cols-4 gap-2">${kotak}</div>
      <p class="mt-3 text-sm font-semibold text-brand-800">Hadir ${hitung.Hadir} kali dari ${total} pertemuan (${persen}%)</p>
      <p class="mt-1 text-[11px] text-brand-500">Rekap bulan ini dihitung otomatis dari tab Kehadiran.</p>`;
    el.classList.remove("hidden");
  }

  /* --------------------------------------------------------------------
     Tabel absensi pertemuan terbaru (realtime dari spreadsheet)
  -------------------------------------------------------------------- */
  let tabelAbsensiData = null;
  let tabelAbsensiWaktu = 0;
  let nisTersorot = "";

  function isoHariIni() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function renderTabelAbsensi(data, nis) {
    const wrap = $("#tabel-absensi-wrap");
    if (!wrap) return;
    const body = $("#tabel-absensi-body");
    const isi = $("#tabel-absensi-isi");
    const kosong = $("#tabel-absensi-kosong");
    const loading = $("#tabel-absensi-loading");
    const judulTanggal = $("#tabel-absensi-tanggal");
    const ringkasEl = $("#tabel-absensi-ringkas");
    const note = $("#tabel-absensi-note");
    const daftar = (data && data.daftar) || [];
    const cari = normalNis(nis || "");
    const adaData = !!(data && data.tanggal);

    loading.classList.add("hidden");
    wrap.classList.remove("hidden");

    if (!daftar.length) {
      isi.classList.add("hidden");
      kosong.classList.remove("hidden");
      judulTanggal.textContent = "";
      return;
    }

    kosong.classList.add("hidden");

    judulTanggal.textContent = adaData
      ? (data.tanggal === isoHariIni() ? "Hari ini, " : "Pertemuan terakhir, ") +
        tanggalPanjang(data.tanggal)
      : "Belum ada pertemuan tercatat";

    const hitung = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0 };
    daftar.forEach((r) => {
      const s = String(r.status || "").toLowerCase();
      if (s === "hadir") hitung.Hadir++;
      else if (s === "izin") hitung.Izin++;
      else if (s === "sakit") hitung.Sakit++;
      else if (s === "alfa" || s === "alpa" || s === "alpha") hitung.Alpa++;
    });
    const tercatat = daftar.filter((r) => r.status).length;

    ringkasEl.innerHTML = [
      ["Hadir", "bg-emerald-50", "text-emerald-700"],
      ["Izin", "bg-sky-50", "text-sky-700"],
      ["Sakit", "bg-amber-50", "text-amber-700"],
      ["Alpa", "bg-rose-50", "text-rose-700"],
    ]
      .map(
        ([nama, bg, warna]) => `<div class="rounded-lg ${bg} px-3 py-2 text-center">
          <p class="text-lg font-bold leading-tight ${warna}">${hitung[nama]}</p>
          <p class="text-[10px] font-semibold uppercase tracking-wide ${warna}">${nama}</p>
        </div>`
      )
      .join("");

    body.innerHTML = daftar
      .map((r) => {
        const status = r.status || "Belum dicatat";
        const warna = r.status ? kelasStatus(r.status) : "bg-brand-50 text-brand-500";
        const sorot = cari && normalNis(r.nis) === cari ? "bg-gold-50" : "";
        return `<tr class="${sorot}">
          <td class="whitespace-nowrap px-4 py-2.5 font-semibold text-brand-700">${esc(r.nis || "-")}</td>
          <td class="px-4 py-2.5 text-brand-900">${esc(r.nama || "-")}</td>
          <td class="px-4 py-2.5 text-brand-600">${esc(r.kelas || "-")}</td>
          <td class="px-4 py-2.5"><span class="whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-bold uppercase ${warna}">${esc(status)}</span></td>
        </tr>`;
      })
      .join("");

    const sumber = data.sumber === "sheets" ? "Google Sheets" : "data lokal";
    note.innerHTML =
      `<i class="fa-solid fa-circle-info mr-1.5 text-gold-600"></i>Sumber: ${esc(sumber)}` +
      (data.diperbaruiPada
        ? ` · diperbarui pukul ${esc(jamPembaruan(data.diperbaruiPada))}`
        : data.diperbarui
        ? ` · diperbarui ${esc(tanggalPanjang(data.diperbarui))}`
        : "") +
      ` · ${tercatat} dari ${daftar.length} santri tercatat. Data hanya dapat diubah admin melalui spreadsheet.`;
  }

  let tabelMemuat = false;

  async function muatTabelAbsensi(paksa, nis, senyap) {
    const wrap = $("#tabel-absensi-wrap");
    if (!wrap || tabelMemuat) return;
    tabelMemuat = true;
    const loading = $("#tabel-absensi-loading");
    const isi = $("#tabel-absensi-isi");
    const kosong = $("#tabel-absensi-kosong");

    if (!senyap) {
      wrap.classList.remove("hidden");
      loading.classList.remove("hidden");
      isi.classList.add("hidden");
      kosong.classList.add("hidden");
    }

    try {
      if (!window.SUMBER || !window.SUMBER.aktif()) {
        const daftar = (DATA.santri || []).map((s) => ({
          nis: s.nis,
          nama: s.nama,
          kelas: s.kelas,
          status: "",
          keterangan: "",
        }));
        tabelAbsensiData = { tanggal: "", daftar, sumber: "lokal", diperbarui: "" };
        tabelAbsensiWaktu = Date.now();
        renderTabelAbsensi(tabelAbsensiData, nis);
        return;
      }

      const data = await window.SUMBER.tabelAbsensi(!!paksa);
      tabelAbsensiData = data;
      tabelAbsensiWaktu = Date.now();
      renderTabelAbsensi(data, nis);
    } catch (err) {
      console.warn("Tabel absensi gagal dimuat:", err);
      if (!senyap) {
        loading.classList.add("hidden");
        isi.classList.add("hidden");
        kosong.classList.remove("hidden");
        kosong.textContent = "Tabel absensi belum dapat dimuat. Klik Perbarui untuk mencoba lagi.";
      }
    } finally {
      tabelMemuat = false;
    }
  }

  function bindTabelAbsensi() {
    const btn = $("#toggle-tabel-absensi");
    const isi = $("#tabel-absensi-isi");
    if (btn && isi) {
      btn.addEventListener("click", () => {
        const buka = isi.classList.contains("hidden");
        isi.classList.toggle("hidden", !buka);
        btn.setAttribute("aria-expanded", String(buka));
        const label = btn.querySelector("span");
        if (label) label.textContent = buka ? "Sembunyikan tabel" : "Lihat tabel";
      });
    }
    $("#refresh-tabel-absensi")?.addEventListener("click", () => {
      muatTabelAbsensi(true, nisTersorot);
    });
  }

  function aturCatatan(el, res) {
    if (!el) return;
    if (res.sumber === "sheets") {
      el.innerHTML =
        `<i class="fa-solid fa-circle-info mr-1.5 text-gold-600"></i>Sumber: Google Sheets` +
        (res.diperbaruiPada
          ? ` · diperbarui pukul ${esc(jamPembaruan(res.diperbaruiPada))}`
          : res.diperbarui
          ? ` · diperbarui ${esc(tanggalPanjang(res.diperbarui))}`
          : "");
      el.classList.remove("hidden");
    } else if (res.sumber === "lokal") {
      el.innerHTML = res.data && res.data.tanggal
        ? `<i class="fa-solid fa-circle-info mr-1.5 text-gold-600"></i>Data di atas berasal dari arsip lokal situs.`
        : `<i class="fa-solid fa-circle-info mr-1.5 text-gold-600"></i>Catatan pertemuan belum tersambung. Yang tampil baru identitas santri.`;
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }

  // Registry supaya hasil pencarian yang sedang tampil bisa disegarkan otomatis.
  const pencarian = { absensi: null, progres: null };
  const lookupTerakhir = { absensi: "", progres: "" };
  const lookupMemuat = { absensi: false, progres: false };

  function bindLookup(formId, jenis) {
    const form = document.getElementById(formId);
    if (!form) return;
    const input = form.querySelector("input");
    const loading = $(jenis === "absensi" ? "#loading-absensi" : "#loading-progres");
    const result = $(jenis === "absensi" ? "#result-absensi" : "#result-progres");
    const notfound = $(jenis === "absensi" ? "#notfound-absensi" : "#notfound-progres");
    // Riwayat hanya dipakai Cek Progres; Cek Absensi cukup rekap + tabel hari ini.
    const riwayatEl = jenis === "progres" ? $("#riwayat-progres") : null;
    const rekapElNode = jenis === "absensi" ? $("#rekap-absensi") : null;
    const note = $(jenis === "absensi" ? "#note-absensi" : "#note-progres");
    const hint = $(jenis === "absensi" ? "#hint-absensi" : "#hint-progres");
    const refresh = $(jenis === "absensi" ? "#refresh-absensi" : "#refresh-progres");
    const nfText = notfound.querySelector("p");
    const nfPesanAsli = nfText.textContent;
    const sheetsAktif = !!(window.SUMBER && window.SUMBER.aktif());

    async function jalankan(nis, senyap) {
      nis = String(nis || "").trim();
      if (!nis || lookupMemuat[jenis]) return;
      lookupMemuat[jenis] = true;

      if (!senyap) {
        loading.classList.remove("hidden");
        result.classList.add("hidden");
        notfound.classList.add("hidden");
        if (riwayatEl) riwayatEl.classList.add("hidden");
        if (rekapElNode) rekapElNode.classList.add("hidden");
        nfText.textContent = nfPesanAsli;
      }

      let res;
      try {
        // Selalu paksa data baru: spreadsheet bisa berubah kapan saja.
        res = await cariSantri(nis, jenis, true);
      } catch (err) {
        console.error(err);
        res = { data: null };
        if (!senyap) nfText.textContent = "Terjadi kesalahan saat mengambil data. Coba lagi.";
      } finally {
        lookupMemuat[jenis] = false;
      }

      if (!res.data) {
        result.classList.add("hidden");
        notfound.classList.remove("hidden");
        return;
      }

      lookupTerakhir[jenis] = nis;
      const d = res.data;
      const belumAda = !d.tanggal;
      if (jenis === "absensi") {
        $("#res-nama-absensi").textContent = d.nama || "-";
        $("#res-nis-absensi").textContent = d.nis || nis;
        $("#res-kelas-absensi").textContent = d.kelas || "-";
        $("#date-absensi").textContent = belumAda ? "Belum ada catatan" : tanggalPanjang(d.tanggal);
        const badge = $("#res-status-absensi");
        badge.textContent = d.status || (belumAda ? "Belum ada catatan" : "Belum dicatat");
        badge.className =
          "rounded-lg px-4 py-1 text-sm font-black uppercase " + kelasStatus(d.status);
      } else {
        $("#date-progres").textContent = belumAda ? "Belum ada catatan" : "Update: " + tanggalPanjang(d.tanggal);
        $("#res-nama-progres").textContent = d.nama || "-";
        $("#res-nis-progres").textContent = "NIS " + (d.nis || nis);
        $("#res-bacaan-progres").textContent = d.bacaan || "Belum ada catatan";
        $("#res-catatan-progres").textContent = d.catatan
          ? `“${d.catatan}”`
          : "Belum ada catatan dari pengajar.";
      }

      aturCatatan(note, res);
      renderRekap(rekapElNode, res.riwayat);
      renderRiwayat(riwayatEl, res.riwayat, jenis);
      result.classList.remove("hidden");
      if (jenis === "absensi") {
        nisTersorot = normalNis(d.nis || nis);
        if (tabelAbsensiData) renderTabelAbsensi(tabelAbsensiData, nisTersorot);
        if (!senyap) muatTabelAbsensi(true, nisTersorot, true);
      }
      if (!senyap) result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    pencarian[jenis] = jalankan;

    if (refresh) {
      refresh.classList.toggle("hidden", !sheetsAktif);
      refresh.addEventListener("click", () => {
        const nis = (input.value || "").trim();
        if (!nis) {
          input.focus();
          return;
        }
        if (window.SUMBER && window.SUMBER.aktif()) window.SUMBER.hapusCache();
        jalankan(nis, false);
        if (jenis === "absensi") muatTabelAbsensi(true, normalNis(nis), true);
      });
    }

    if (hint) {
      hint.textContent = sheetsAktif
        ? "Masukkan NIS santri. Data diperbarui otomatis dari spreadsheet."
        : "Masukkan NIS santri, contoh: 01.";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      jalankan((input.value || "").trim(), false);
    });
  }

  /* --------------------------------------------------------------------
     Pembaruan otomatis (tanpa reload) saat halaman aktif.
  -------------------------------------------------------------------- */
  function segarkanHalamanAktif() {
    if (document.hidden) return;
    const aktif = $(".page-section.active");
    const id = aktif && aktif.id;
    if (id === "absensi") muatTabelAbsensi(true, nisTersorot, true);
    if (pencarian[id] && lookupTerakhir[id]) pencarian[id](lookupTerakhir[id], true);
  }

  function bindAutoRefresh() {
    setInterval(segarkanHalamanAktif, 30000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) segarkanHalamanAktif();
    });
  }

  /* --------------------------------------------------------------------
     Form pendaftaran -> WhatsApp
  -------------------------------------------------------------------- */
  function bindPendaftaran() {
    const form = $("#form-daftar");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const get = (name) => (form.elements[name]?.value || "").trim();
      const pesan = [
        "*PENDAFTARAN SANTRI BARU*",
        SITE.nama,
        "",
        `Nama santri     : ${get("nama")}`,
        `Jenis kelamin   : ${get("jk")}`,
        `Tanggal lahir   : ${get("lahir")}`,
        `Nama wali       : ${get("wali")}`,
        `WhatsApp wali   : ${get("wa")}`,
        `Alamat          : ${get("alamat")}`,
        `Program         : ${get("program")}`,
        `Sekolah formal  : ${get("sekolah") || "-"}`,
        `Catatan         : ${get("catatan") || "-"}`,
        "",
        "Mohon informasi jadwal dan persyaratan pendaftaran. Terima kasih.",
      ].join("\n");

      bukaPilihanAdmin(pesan);
    });
  }

  /* --------------------------------------------------------------------
     Siaran langsung vdo.ninja — tautan diambil dari tab "Live" sheets.
  -------------------------------------------------------------------- */
  let liveMemuat = false;

  function vdoKosong(judul, keterangan) {
    const box = $("#vdo-penonton");
    if (!box) return;
    box.innerHTML = `
      <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl text-gold-300"><i class="fa-solid fa-tower-broadcast"></i></span>
        <p class="font-display text-lg font-semibold text-white">${esc(judul)}</p>
        <p class="max-w-sm text-sm leading-relaxed text-brand-200">${esc(keterangan)}</p>
      </div>`;
  }

  async function muatLive(paksa) {
    const box = $("#vdo-penonton");
    if (!box || liveMemuat) return;
    liveMemuat = true;

    const badge = $("#vdo-badge");
    const buka = $("#vdo-buka");
    const info = $("#vdo-info");
    badge?.classList.add("hidden");
    buka?.classList.add("hidden");
    info?.classList.add("hidden");
    box.innerHTML = `
      <div class="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-gold-400"></i>
        <p class="text-sm text-brand-200">Memuat jadwal siaran…</p>
      </div>`;

    try {
      if (!window.SUMBER || !window.SUMBER.aktif()) {
        vdoKosong("Belum ada siaran langsung", "Tautan siaran akan tersedia menjelang kegiatan.");
        return;
      }

      const hasil = await window.SUMBER.live(paksa !== false);
      if (!hasil) {
        vdoKosong(
          "Belum ada siaran langsung",
          "Tautan siaran akan tersedia menjelang kegiatan. Tekan Perbarui setelah admin memasang tautan."
        );
        return;
      }

      // src diisi lewat properti DOM, bukan string HTML, agar tautan dari sheet
      // tidak bisa menyuntikkan atribut lain ke halaman.
      const frame = document.createElement("iframe");
      frame.src = hasil.link;
      frame.title = hasil.judul || "Siaran langsung vdo.ninja";
      frame.className = "absolute inset-0 h-full w-full";
      frame.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      box.replaceChildren(frame);

      if (buka) {
        buka.href = hasil.link;
        buka.classList.remove("hidden");
      }
      badge?.classList.remove("hidden");

      const judul = $("#vdo-judul");
      const keterangan = $("#vdo-keterangan");
      if (judul && keterangan && info) {
        judul.textContent = hasil.judul;
        keterangan.textContent = hasil.keterangan;
        info.classList.remove("hidden");
      }
    } catch (err) {
      console.warn("[live] Tab Live tidak terbaca:", err.message);
      vdoKosong(
        "Belum ada siaran langsung",
        "Tautan siaran belum tersedia. Tekan Perbarui bila admin sudah memasang tautan."
      );
    } finally {
      liveMemuat = false;
    }
  }

  /* --------------------------------------------------------------------
     Pemutar YouTube (click-to-play, privasi lebih aman)
  -------------------------------------------------------------------- */
  function initYoutubeEmbed() {
    const box = document.getElementById("yt-player");
    if (!box) return;

    const thumb = box.querySelector("[data-yt-thumb]");
    if (thumb) {
      if (SITE.youtubeThumb) {
        thumb.src = "https://i.ytimg.com/vi/" + SITE.youtubeThumb + "/hqdefault.jpg";
      } else {
        thumb.remove();
      }
    }

    const btn = box.querySelector("[data-yt-play]");
    if (!btn) return;

    btn.addEventListener("click", () => {
      // Channel ini menonaktifkan penyematan; buka YouTube agar tidak muncul
      // kotak "Video tidak tersedia". Bisa diubah lewat youtubeEmbed.
      if (!SITE.youtubeEmbed) {
        window.open(SITE.youtube, "_blank", "noopener");
        return;
      }

      const base = "https://www.youtube-nocookie.com/embed/";
      let src;
      if (SITE.youtubePlaylist) {
        src = base + "videoseries?list=" + encodeURIComponent(SITE.youtubePlaylist) + "&autoplay=1&rel=0";
      } else if (SITE.youtubeThumb) {
        src = base + encodeURIComponent(SITE.youtubeThumb) + "?autoplay=1&rel=0";
      } else {
        window.open(SITE.youtube, "_blank", "noopener");
        return;
      }

      const frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Video Baitul Qur'an Al-Hidayah";
      frame.className = "absolute inset-0 h-full w-full";
      frame.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";

      box.replaceChildren(frame);
    });
  }

  function bindModal() {
    $("#modal")?.addEventListener("click", (e) => {
      if (e.target.id === "modal") closeModal();
    });
    $("#modal-close")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* --------------------------------------------------------------------
     Boot
  -------------------------------------------------------------------- */
  function boot() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    hydrateSite();
    bindMenus();
    bindModal();

    // Halaman artikel/arsip berita memakai header & footer yang sama, tetapi
    // tidak memakai router hash beranda. Judul halaman tidak boleh ditimpa.
    if (document.body.dataset.page === "artikel") return;

    initYoutubeEmbed();
    renderPengajar();
    renderJadwal();
    renderMateri();
    renderBerita();
    renderGaleri();
    bindPendaftaran();
    bindLookup("form-absensi", "absensi");
    bindLookup("form-progres", "progres");
    bindTabelAbsensi();
    bindAutoRefresh();
    $("#vdo-refresh")?.addEventListener("click", () => muatLive(true));

    $("#tahun-footer").textContent = new Date().getFullYear();
    bindRouter();
    onHashChange();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
