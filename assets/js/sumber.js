/* ==========================================================================
   SUMBER DATA PENDATAAN SANTRI
   --------------------------------------------------------------------------
   Satu pintu untuk mengambil data absensi & progres. Urutan yang dipakai:
     1. Firebase Firestore  (bila SITE.firebase.enabled = true)
     2. Google Sheets       (bila SITE.sumber.mode = "sheets" dan ID terisi)
     3. Data identitas lokal (assets/js/data.js)

   Bentuk tab yang didukung:
     • Tab log     : nis | tanggal | status | keterangan
                     nis | tanggal | bacaan | catatan
                     nis | nama | tanggal | bacaan | catatan
                     nis | nama | jenis kelamin | kelas | tanggal | kehadiran
     • Tab matriks : tanggal | 01 | 02 | 03 | …   (isi H/I/S/A)
                     (baris berisi nama di bawah header diabaikan otomatis)

   Kolom "kehadiran" dibaca sebagai status. Nilai Hadir/Sakit/Izin/Alpa
   diterima apa adanya; H/I/S/A juga dikenal. Baris tanpa tanggal diabaikan.

   Google Sheets dibaca lewat endpoint "gviz" (CSV) sehingga spreadsheet
   cukup dibagikan "Anyone with the link → Viewer" (tanpa server, tanpa API key).
   ========================================================================== */
window.SUMBER = (function () {
  "use strict";

  const SITE = window.SITE || {};
  const cfg = SITE.sumber || {};
  const sc = cfg.sheets || {};

  const MODE = cfg.mode || "lokal";
  const ID = idSpreadsheet(sc.id);
  const TAB = {
    santri: (sc.tab && sc.tab.santri) || "Santri",
    absensi: (sc.tab && sc.tab.absensi) || "Kehadiran",
    progres: (sc.tab && sc.tab.progres) || "Progres",
  };
  const CACHE_MENIT = Number(sc.cacheMenit) >= 0 ? Number(sc.cacheMenit) : 5;

  /* --- Util ----------------------------------------------------------- */

  /** Ambil ID dari URL spreadsheet lengkap bila pengguna menempel URL. */
  function idSpreadsheet(v) {
    const s = String(v || "").trim();
    if (!s) return "";
    const m = s.match(/\/d\/([a-zA-Z0-9-_]{20,})/);
    return m ? m[1] : s;
  }

  /** Parser CSV RFC 4180 sederhana (mendukung tanda kutip & koma di dalam sel). */
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let dalamKutip = false;
    const s = String(text || "").replace(/^\uFEFF/, "");

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (dalamKutip) {
        if (c === '"') {
          if (s[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            dalamKutip = false;
          }
        } else {
          field += c;
        }
      } else if (c === '"') {
        dalamKutip = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field !== "" || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows.filter((r) => r.some((v) => String(v).trim() !== ""));
  }

  /** "No Induk" → "no induk" agar nama kolom tidak sensitif format. */
  function kunci(v) {
    return String(v == null ? "" : v)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const ALIAS = {
    nis: ["nis", "no induk", "nomor induk", "no induk santri", "nomor induk santri", "kode", "kode santri", "id"],
    nama: ["nama", "nama santri", "nama lengkap"],
    kelas: ["kelas", "level", "kelas level"],
    aktif: ["aktif", "status aktif"],
    tanggal: ["tanggal", "tgl", "hari tanggal", "waktu"],
    status: ["status", "kehadiran", "status kehadiran"],
    keterangan: ["keterangan", "ket", "alasan"],
    bacaan: ["bacaan", "capaian bacaan", "materi bacaan"],
    catatan: ["catatan", "catatan pengajar", "note", "keterangan"],
  };

  function ambilKolom(obj, nama) {
    const daftar = ALIAS[nama] || [nama];
    for (const a of daftar) {
      const k = kunci(a);
      if (Object.prototype.hasOwnProperty.call(obj, k) && String(obj[k]).trim() !== "") return obj[k];
    }
    return "";
  }

  /** Terima 2026-11-22, 22/11/2026, 22-11-2026, atau teks tanggal lain. */
  function parseTanggal(v) {
    const s = String(v || "").trim();
    if (!s) return null;
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
    if (m) {
      let a = +m[1];
      let b = +m[2];
      let y = +m[3];
      if (y < 100) y += 2000;
      // Indonesia memakai hari/bulan/tahun. Jika angka kedua > 12, berarti
      // formatnya bulan/hari/tahun (mis. 11/22/2026).
      let hari = a;
      let bulan = b;
      if (b > 12 && a <= 12) {
        hari = b;
        bulan = a;
      }
      return new Date(y, bulan - 1, hari);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function isoTanggal(d) {
    if (!d) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  /** "01" dan "1" dianggap NIS yang sama; kode non-angka tidak diubah. */
  function normalNis(v) {
    return String(v == null ? "" : v)
      .trim()
      .toLowerCase()
      .replace(/^0+(?=\d)/, "");
  }

  /** Header matriks boleh berupa "01" atau "01 - Galih". */
  function nisDariHeader(v) {
    const s = String(v || "").trim();
    const m = s.match(/^0*(\d+)/);
    return m ? normalNis(m[1]) : normalNis(s);
  }

  const STATUS_KODE = {
    h: "Hadir",
    hadir: "Hadir",
    i: "Izin",
    izin: "Izin",
    s: "Sakit",
    sakit: "Sakit",
    a: "Alfa",
    alfa: "Alfa",
    alpha: "Alfa",
    alpa: "Alpa", // tanpa kabar — ejaan yang dipakai di template
  };

  function statusDari(v) {
    const asli = String(v == null ? "" : v).trim();
    if (!asli) return "";
    return STATUS_KODE[asli.toLowerCase()] || asli;
  }

  /* --- Cache ---------------------------------------------------------- */

  function kunciCache(tab) {
    return `sumber:${ID}:${tab}`;
  }

  function bacaCache(tab) {
    try {
      const raw = sessionStorage.getItem(kunciCache(tab));
      if (!raw) return null;
      const isi = JSON.parse(raw);
      if (!isi || typeof isi.waktu !== "number") return null;
      if (Date.now() - isi.waktu > CACHE_MENIT * 60000) return null;
      return isi;
    } catch (err) {
      return null;
    }
  }

  function tulisCache(tab, data) {
    try {
      sessionStorage.setItem(kunciCache(tab), JSON.stringify(data));
    } catch (err) {
      /* mode privat / kuota penuh — abaikan, cukup pakai memori */
    }
  }

  const memori = new Map();

  /** Bersihkan cache supaya pencarian berikutnya benar-benar mengambil data baru. */
  function hapusCache() {
    memori.clear();
    try {
      const awalan = `sumber:${ID}:`;
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(awalan))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch (err) {
      /* sessionStorage tidak tersedia — cache memori sudah ikut dibersihkan */
    }
  }

  /* --- Ambil satu tab (tabel mentah) ---------------------------------- */

  function urlTab(tab) {
    return (
      "https://docs.google.com/spreadsheets/d/" +
      encodeURIComponent(ID) +
      "/gviz/tq?tqx=out:csv&headers=1&sheet=" +
      encodeURIComponent(tab)
    );
  }

  async function muatTabel(tab) {
    if (memori.has(tab)) return memori.get(tab);

    const cache = bacaCache(tab);
    if (cache) {
      memori.set(tab, cache);
      return cache;
    }

    const res = await fetch(urlTab(tab), { cache: "no-store", credentials: "omit" });
    if (!res.ok) throw new Error(`Sheets "${tab}" tidak dapat dibaca (HTTP ${res.status}).`);

    const teks = await res.text();
    if (/^\s*<(!doctype|html)/i.test(teks)) {
      throw new Error(`Sheets "${tab}" belum dibagikan untuk publik.`);
    }

    const data = { waktu: Date.now(), rows: parseCsv(teks) };
    memori.set(tab, data);
    tulisCache(tab, data);
    return data;
  }

  /** Ubah tabel berheader menjadi objek per baris (format log). */
  function keObjek(rows) {
    if (!rows.length) return [];
    const header = rows[0].map(kunci);
    return rows.slice(1).map((r, i) => {
      const obj = {};
      header.forEach((h, j) => {
        if (h) obj[h] = String(r[j] == null ? "" : r[j]).trim();
      });
      const d = parseTanggal(ambilKolom(obj, "tanggal"));
      return {
        _i: i,
        _ms: d ? d.getTime() : 0,
        nis: ambilKolom(obj, "nis"),
        nama: ambilKolom(obj, "nama"),
        kelas: ambilKolom(obj, "kelas"),
        aktif: ambilKolom(obj, "aktif"),
        tanggal: isoTanggal(d),
        status: statusDari(ambilKolom(obj, "status")),
        keterangan: ambilKolom(obj, "keterangan"),
        bacaan: ambilKolom(obj, "bacaan"),
        catatan: ambilKolom(obj, "catatan"),
      };
    });
  }

  /** Tab absensi boleh berbentuk log (kolom nis) atau matriks (kolom NIS). */
  function apakahLog(rows) {
    if (!rows || !rows.length) return true;
    return rows[0].map(kunci).includes("nis");
  }

  /** Ubah tabel matriks (tanggal × santri) menjadi baris log per santri. */
  function keMatriks(rows) {
    if (rows.length < 2) return [];
    const header = rows[0].map((v) => String(v == null ? "" : v).trim());
    const kolom = [];
    header.forEach((h, j) => {
      if (j === 0) return; // kolom pertama = tanggal
      const nis = nisDariHeader(h);
      if (nis) kolom.push({ j, nis });
    });

    const hasil = [];
    let urut = 0;
    rows.slice(1).forEach((r) => {
      const d = parseTanggal(r[0]);
      if (!d) return; // baris nama / baris kosong
      const tanggal = isoTanggal(d);
      kolom.forEach(({ j, nis }) => {
        const status = statusDari(r[j]);
        if (!status) return; // sel kosong = belum dicatat
        hasil.push({
          _i: urut++,
          _ms: d.getTime(),
          nis,
          nama: "",
          kelas: "",
          aktif: "Ya",
          tanggal,
          status,
          keterangan: "",
          bacaan: "",
          catatan: "",
        });
      });
    });
    return hasil;
  }

  /** Tab master santri; opsional — bila belum ada, situs tetap jalan. */
  async function muatSantri() {
    const peta = new Map();
    let data;
    try {
      data = await muatTabel(TAB.santri);
    } catch (err) {
      console.warn("[sumber] Tab santri tidak terbaca:", err.message);
      return peta;
    }
    keObjek(data.rows).forEach((r) => {
      const nis = String(r.nis || "").trim();
      if (!nis) return;
      if (/^(tidak|no|n|0|false|nonaktif)$/i.test(String(r.aktif || "").trim())) return;
      peta.set(normalNis(nis), { nis, nama: r.nama || "", kelas: r.kelas || "" });
    });
    return peta;
  }

  /* --- API publik ----------------------------------------------------- */

  function aktif() {
    return MODE === "sheets" && !!ID;
  }

  function mode() {
    return MODE;
  }

  /**
   * Ambil data satu santri.
   * @param {string} nis
   * @param {"absensi"|"progres"} jenis
   * @returns {Promise<{data: object|null, riwayat: object[], sumber: string, diperbarui: string}>}
   */
  async function ambil(nis, jenis) {
    if (!aktif()) throw new Error("Sumber Google Sheets belum diaktifkan.");

    const cari = normalNis(nis);
    const tab = jenis === "progres" ? TAB.progres : TAB.absensi;

    const [master, tabel] = await Promise.all([muatSantri(), muatTabel(tab)]);

    const baris = (apakahLog(tabel.rows) ? keObjek(tabel.rows) : keMatriks(tabel.rows))
      // Baris yang tanggalnya sudah diisi tetapi status/bacaannya masih kosong
      // berarti belum dicatat — jangan tampil sebagai catatan kosong / Alpa.
      .filter((r) => (jenis === "progres" ? !!(r.bacaan || r.catatan) : !!r.status))
      // Baris contoh di template belum bertanggal; jangan dianggap catatan.
      .filter((r) => !!r.tanggal)
      .filter((r) => normalNis(r.nis) === cari)
      .sort((a, b) => b._ms - a._ms || b._i - a._i);

    const m = master.get(cari) || {};
    const riwayat = baris.map((r) => {
      const dasar = {
        nis: m.nis || String(r.nis || nis).trim(),
        // Nama & kelas mengikuti tab yang sedang dibuka (Kehadiran/Progres),
        // karena di situlah pengajar mengisi data. Tab Santri hanya cadangan
        // bila kolom nama di tab tersebut kosong.
        nama: r.nama || m.nama || "",
        kelas: r.kelas || m.kelas || "",
        tanggal: r.tanggal,
      };
      if (jenis === "progres") {
        return { ...dasar, bacaan: r.bacaan, catatan: r.catatan };
      }
      return { ...dasar, status: r.status, keterangan: r.keterangan || r.catatan };
    });

    const diperbarui = isoTanggal(new Date(tabel.waktu));

    // Santri sudah terdaftar tetapi belum punya catatan pada tab ini:
    // tetap tampilkan identitasnya, bukan "data tidak ditemukan".
    if (!riwayat.length) {
      if (!m.nis) return { data: null, riwayat: [], sumber: "sheets", diperbarui };
      const kosong =
        jenis === "progres"
          ? { nis: m.nis, nama: m.nama, kelas: m.kelas, tanggal: "", bacaan: "", catatan: "" }
          : { nis: m.nis, nama: m.nama, kelas: m.kelas, tanggal: "", status: "", keterangan: "" };
      return { data: kosong, riwayat: [], sumber: "sheets", diperbarui };
    }

    return {
      data: riwayat[0],
      riwayat,
      sumber: "sheets",
      diperbarui,
    };
  }

  return { aktif, mode, ambil, hapusCache, _parseCsv: parseCsv, _parseTanggal: parseTanggal, _keMatriks: keMatriks };
})();
