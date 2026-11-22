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
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const waLink = (text) =>
    "https://wa.me/" + SITE.wa.internasional + (text ? "?text=" + encodeURIComponent(text) : "");

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

    // Grup WhatsApp: sembunyikan seluruh blok bila tautan belum diisi.
    $$("a[data-grup-wa]").forEach((a) => a.href = SITE.grupWa || "#");
    $$("[data-grup-wa-box]").forEach((el) => el.classList.toggle("hidden", !SITE.grupWa));

    // Daftar admin di halaman Kontak.
    const daftarAdmin =
      Array.isArray(SITE.admin) && SITE.admin.length
        ? SITE.admin
        : [{ nama: "Admin", wa: SITE.wa || {} }];
    const adminList = $("#admin-wa-list");
    if (adminList) {
      adminList.innerHTML = daftarAdmin
        .map((a) => {
          const wa = a.wa || {};
          const nomor = wa.internasional || String(wa.tampil || "").replace(/\D/g, "").replace(/^0/, "62");
          const tampil = wa.tampil || nomor;
          return `<li><a href="https://wa.me/${esc(nomor)}" target="_blank" rel="noopener noreferrer" class="underline-offset-4 hover:text-white hover:underline">${esc(a.nama || "Admin")} — ${esc(tampil)}</a></li>`;
        })
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
          <p class="mt-0.5 text-sm font-medium text-brand-800">${esc(nilai)}</p>
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
      .map(
        (b, i) => `
      <article class="card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
        <div class="relative h-40 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500">
          <div class="pattern-dots absolute inset-0 opacity-70"></div>
          <span class="absolute left-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-900">${esc(b.kategori || "Informasi")}</span>
          <div class="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-gold-300 backdrop-blur">
            <i class="fa-regular fa-newspaper"></i>
          </div>
        </div>
        <div class="flex flex-1 flex-col p-6">
          <p class="text-xs text-brand-400"><i class="fa-regular fa-calendar mr-1.5"></i>${esc(tanggalPanjang(b.tanggal))}</p>
          <h3 class="mt-2 font-display text-xl font-semibold leading-snug text-brand-900">${esc(b.judul)}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-brand-600">${esc(b.ringkas)}</p>
          ${
            b.isi
              ? `<button type="button" class="mt-4 self-start text-sm font-semibold text-brand-700 hover:text-brand-600" data-berita="${i}">Baca selengkapnya <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></button>`
              : `<a href="#pendaftaran" class="mt-4 self-start text-sm font-semibold text-brand-700 hover:text-brand-600">Daftar sekarang <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></a>`
          }
        </div>
      </article>`
      )
      .join("");

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-berita]");
      if (!btn) return;
      const item = list[Number(btn.dataset.berita)];
      if (item && item.isi) openModal(item.judul, item.isi);
    });
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
          <img src="${esc(g.src)}" alt="${esc(g.judul || "Foto kegiatan")}" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
          <span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-3 text-left text-xs font-medium text-white">${esc(g.judul || "")}</span>
        </button>`
      )
      .join("");
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-galeri]");
      if (b) openModal("", `<img src='${b.dataset.galeri}' alt='Foto kegiatan' class='w-full rounded-xl'>`, true);
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

  async function cariSantri(nis, jenis) {
    const reader = await getFirestoreReader();
    if (reader) {
      const data = await reader(nis);
      return { data, riwayat: data ? [data] : [], sumber: "firebase" };
    }

    if (window.SUMBER && window.SUMBER.aktif()) {
      try {
        return await window.SUMBER.ambil(nis, jenis);
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
    const hitung = { Hadir: 0, Izin: 0, Sakit: 0, Alfa: 0 };
    sebulan.forEach((r) => {
      const k = String(r.status || "").toLowerCase();
      if (k === "hadir") hitung.Hadir++;
      else if (k === "izin") hitung.Izin++;
      else if (k === "sakit") hitung.Sakit++;
      else if (k === "alfa" || k === "alpa" || k === "alpha") hitung.Alfa++;
    });

    const label = new Date(+bulan.slice(0, 4), +bulan.slice(5, 7) - 1, 1).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    const kotak = [
      ["Hadir", "bg-emerald-50", "text-emerald-700", "text-emerald-600"],
      ["Izin", "bg-sky-50", "text-sky-700", "text-sky-600"],
      ["Sakit", "bg-amber-50", "text-amber-700", "text-amber-600"],
      ["Alfa", "bg-rose-50", "text-rose-700", "text-rose-600"],
    ]
      .map(
        ([nama, bg, kuat, lembut]) => `<div class="rounded-lg ${bg} px-2 py-2 text-center">
          <p class="text-lg font-bold leading-tight ${kuat}">${hitung[nama]}</p>
          <p class="text-[10px] font-semibold uppercase tracking-wide ${lembut}">${nama}</p>
        </div>`
      )
      .join("");

    el.innerHTML = `
      <p class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">Rekap ${esc(label)}</p>
      <div class="mt-2 grid grid-cols-4 gap-2">${kotak}</div>
      <p class="mt-2 text-[11px] text-brand-500">Dari ${sebulan.length} pertemuan tercatat.</p>`;
    el.classList.remove("hidden");
  }

  function aturCatatan(el, res) {
    if (!el) return;
    if (res.sumber === "sheets") {
      el.innerHTML =
        `<i class="fa-solid fa-circle-info mr-1.5 text-gold-600"></i>Sumber: Google Sheets` +
        (res.diperbarui ? ` · diperbarui ${esc(tanggalPanjang(res.diperbarui))}` : "");
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

  function bindLookup(formId, jenis) {
    const form = document.getElementById(formId);
    if (!form) return;
    const input = form.querySelector("input");
    const loading = $(jenis === "absensi" ? "#loading-absensi" : "#loading-progres");
    const result = $(jenis === "absensi" ? "#result-absensi" : "#result-progres");
    const notfound = $(jenis === "absensi" ? "#notfound-absensi" : "#notfound-progres");
    const riwayatEl = $(jenis === "absensi" ? "#riwayat-absensi" : "#riwayat-progres");
    const rekapEl = jenis === "absensi" ? $("#rekap-absensi") : null;
    const note = $(jenis === "absensi" ? "#note-absensi" : "#note-progres");
    const hint = $(jenis === "absensi" ? "#hint-absensi" : "#hint-progres");
    const refresh = $(jenis === "absensi" ? "#refresh-absensi" : "#refresh-progres");
    const nfText = notfound.querySelector("p");
    const nfPesanAsli = nfText.textContent;
    const sheetsAktif = !!(window.SUMBER && window.SUMBER.aktif());

    if (refresh) {
      refresh.classList.toggle("hidden", !sheetsAktif);
      refresh.addEventListener("click", () => {
        if (!input.value.trim()) {
          input.focus();
          return;
        }
        window.SUMBER.hapusCache();
        if (typeof form.requestSubmit === "function") form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });
    }

    if (hint) {
      hint.textContent = sheetsAktif
        ? "Masukkan NIS yang terdaftar. Klik Perbarui data bila baru saja ada perubahan."
        : "Masukkan NIS santri, contoh: 01.";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nis = (input.value || "").trim();
      if (!nis) return;
      loading.classList.remove("hidden");
      result.classList.add("hidden");
      notfound.classList.add("hidden");
      if (riwayatEl) riwayatEl.classList.add("hidden");
      if (rekapEl) rekapEl.classList.add("hidden");
      nfText.textContent = nfPesanAsli;

      let res;
      try {
        res = await cariSantri(nis, jenis);
      } catch (err) {
        console.error(err);
        res = { data: null };
        nfText.textContent = "Terjadi kesalahan saat mengambil data. Coba lagi.";
      }

      loading.classList.add("hidden");
      if (!res.data) {
        notfound.classList.remove("hidden");
        return;
      }

      const d = res.data;
      const belumAda = !d.tanggal;
      if (jenis === "absensi") {
        $("#res-nama-absensi").textContent = d.nama || "-";
        $("#res-nis-absensi").textContent = d.nis || nis;
        $("#res-kelas-absensi").textContent = d.kelas || "-";
        $("#date-absensi").textContent = belumAda ? "Belum ada catatan" : tanggalPanjang(d.tanggal);
        const badge = $("#res-status-absensi");
        badge.textContent = d.status || "Belum ada catatan";
        badge.className = "rounded-lg px-4 py-1 text-sm font-black uppercase " + kelasStatus(d.status);
      } else {
        $("#date-progres").textContent = belumAda ? "Belum ada catatan" : "Update: " + tanggalPanjang(d.tanggal);
        $("#res-nama-progres").textContent = d.nama || "-";
        $("#res-nis-progres").textContent = "NIS " + (d.nis || nis);
        $("#res-bacaan-progres").textContent = d.bacaan || (belumAda ? "Belum ada catatan" : "-");
        $("#res-catatan-progres").textContent = d.catatan
          ? `“${d.catatan}”`
          : belumAda
          ? "Belum ada catatan dari pengajar."
          : "-";
      }

      aturCatatan(note, res);
      renderRekap(rekapEl, res.riwayat);
      renderRiwayat(riwayatEl, res.riwayat, jenis);
      result.classList.remove("hidden");
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

      window.open(waLink(pesan), "_blank", "noopener");
    });
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

  /* --------------------------------------------------------------------
     Boot
  -------------------------------------------------------------------- */
  function boot() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    hydrateSite();
    initYoutubeEmbed();
    renderPengajar();
    renderJadwal();
    renderMateri();
    renderBerita();
    renderGaleri();
    bindMenus();
    bindPendaftaran();
    bindLookup("form-absensi", "absensi");
    bindLookup("form-progres", "progres");

    $("#modal")?.addEventListener("click", (e) => {
      if (e.target.id === "modal") closeModal();
    });
    $("#modal-close")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    $("#tahun-footer").textContent = new Date().getFullYear();
    bindRouter();
    onHashChange();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
