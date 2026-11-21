/* Import/Export CSV, Excel (.xlsx/.xls/.ods) et archive ZIP avec guide laser */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./vendor/xlsx.full.min.js"),
      require("./vendor/jszip.min.js"),
      require("./svg-engine.js")
    );
  } else {
    root.DataIO = factory(root.XLSX, root.JSZip, root.SvgEngine);
  }
})(typeof self !== "undefined" ? self : this, function (XLSXLib, JSZipLib, SvgEngineLib) {
  "use strict";

  const SAMPLE_ROWS = [
    { genre: "M", nom: "vienne", buque: "Echo" },
    { genre: "F", nom: "Martin", buque: "Comète" },
    { genre: "M", nom: "Dupont", buque: "Phénix" },
    { genre: "F", nom: "Lépine", buque: "Étoile" },
    { genre: "M", nom: "Bernard", buque: "Titan" },
    { genre: "M", nom: "Cœur-d'Été", buque: "Zéphyr" }
  ];

  function stripAccents(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /**
   * Normalise le genre vers "M" (homme -> .onscrit / devenu) ou "F" (femme -> .onscrite / devenue).
   */
  function normalizeGender(raw) {
    const clean = stripAccents(String(raw || "").trim().toLowerCase());
    if (
      clean === "f" ||
      clean === "femme" ||
      clean === "feminin" ||
      clean === "feminine" ||
      clean === "fille" ||
      clean === "female" ||
      clean === "mme" ||
      clean === "mlle" ||
      clean === "madame" ||
      clean === "2"
    ) {
      return "F";
    }
    return "M";
  }

  function detectCsvDelimiter(text) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const sample = lines.slice(0, 5).join("\n");
    const counts = {
      ";": (sample.match(/;/g) || []).length,
      ",": (sample.match(/,/g) || []).length,
      "\t": (sample.match(/\t/g) || []).length
    };
    if (counts[";"] >= counts[","] && counts[";"] >= counts["\t"] && counts[";"] > 0) return ";";
    if (counts["\t"] > counts[","] && counts["\t"] > 0) return "\t";
    return ",";
  }

  /**
   * Parse un texte CSV/TSV selon RFC 4180 avec détection automatique de séparateur.
   */
  function parseCsvText(rawText) {
    const text = String(rawText || "").replace(/^\uFEFF/, "");
    if (!text.trim()) return [];
    const delimiter = detectCsvDelimiter(text);
    const rows = [];
    let currentRow = [];
    let currentCell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            currentCell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          currentCell += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (ch === "\r" || ch === "\n") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += ch;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }
    return rows;
  }

  function decodeBufferSmart(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      return new TextDecoder("utf-8").decode(bytes.subarray(3));
    }
    const utf8 = new TextDecoder("utf-8").decode(bytes);
    if (utf8.includes("\uFFFD")) {
      try {
        return new TextDecoder("windows-1252").decode(bytes);
      } catch (_err) {
        return utf8;
      }
    }
    return utf8;
  }

  function mapMatrixToItems(matrix) {
    const nonEmptyRows = (matrix || []).filter(
      (r) => Array.isArray(r) && r.some((cell) => String(cell ?? "").trim() !== "")
    );
    if (nonEmptyRows.length === 0) return [];

    const headerAliases = {
      genre: ["genre", "sexe", "civilite", "h/f", "m/f", "g", "sex", "gender"],
      nom: ["nom", "nom de famille", "famille", "patronyme", "lastname", "last_name", "name"],
      buque: ["buque", "surnom", "pseudo", "nickname", "boquette"]
    };

    const firstRowNorm = nonEmptyRows[0].map((cell) =>
      stripAccents(String(cell ?? "").trim().toLowerCase()).replace(/[_-]+/g, " ")
    );

    const findCol = (aliases) =>
      firstRowNorm.findIndex((h) => aliases.includes(h) || aliases.some((a) => h.startsWith(a + " ")));

    let genreIdx = findCol(headerAliases.genre);
    let nomIdx = findCol(headerAliases.nom);
    let buqueIdx = findCol(headerAliases.buque);

    const hasHeader = genreIdx !== -1 || nomIdx !== -1 || buqueIdx !== -1;
    let startRow = 0;

    if (hasHeader) {
      startRow = 1;
      if (genreIdx === -1) genreIdx = 0;
      if (nomIdx === -1) nomIdx = 1;
      if (buqueIdx === -1) buqueIdx = 2;
    } else {
      genreIdx = 0;
      nomIdx = 1;
      buqueIdx = 2;
    }

    const items = [];
    for (let i = startRow; i < nonEmptyRows.length; i++) {
      const row = nonEmptyRows[i];
      const genreRaw = row[genreIdx] ?? "";
      const nom = String(row[nomIdx] ?? "").trim();
      const buque = String(row[buqueIdx] ?? "").trim();
      if (!nom && !buque) continue;
      items.push({
        genre: normalizeGender(genreRaw),
        nom,
        buque
      });
    }
    return items;
  }

  /**
   * Lit un fichier (.csv, .tsv, .txt, .xlsx, .xls, .ods) à partir d'un ArrayBuffer et retourne les items normalisés.
   */
  function parseSpreadsheetBuffer(arrayBuffer, fileName, xlsxOverride) {
    const lower = String(fileName || "").toLowerCase();
    if (lower.endsWith(".csv") || lower.endsWith(".tsv") || lower.endsWith(".txt")) {
      const text = decodeBufferSmart(arrayBuffer);
      const matrix = parseCsvText(text);
      return mapMatrixToItems(matrix);
    }

    const XLSX = xlsxOverride || XLSXLib;
    if (!XLSX) {
      throw new Error("Bibliothèque XLSX introuvable pour lire les fichiers Excel.");
    }
    const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    for (const name of wb.SheetNames) {
      const ws = wb.Sheets[name];
      const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      const items = mapMatrixToItems(matrix);
      if (items.length > 0) return items;
    }
    return [];
  }

  function buildCsvTemplateText() {
    const header = "genre;nom;buque";
    const lines = SAMPLE_ROWS.map((r) => `${r.genre === "F" ? "F" : "H"};${r.nom};${r.buque}`);
    return "\uFEFF" + [header, ...lines].join("\r\n") + "\r\n";
  }

  function buildXlsxTemplateBuffer(xlsxOverride) {
    const XLSX = xlsxOverride || XLSXLib;
    if (!XLSX) {
      throw new Error("Bibliothèque XLSX introuvable.");
    }
    const aoa = [
      ["genre", "nom", "buque"],
      ...SAMPLE_ROWS.map((r) => [r.genre === "F" ? "F" : "H", r.nom, r.buque])
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ellipses");
    return XLSX.write(wb, { bookType: "xlsx", type: "array" });
  }

  function buildLaserGuideText(layout) {
    const s = layout.settings;
    const flipDesc =
      s.flipAxis === "vertical"
        ? "Vertical (Haut <-> Bas : basculer la planche de haut en bas)"
        : "Horizontal (Gauche <-> Droite : retourner la planche comme une page de livre)";
    const originLabels = {
      "top-left": "Haut-Gauche",
      "bottom-left": "Bas-Gauche",
      "top-right": "Haut-Droite",
      "bottom-right": "Bas-Droite",
      center: "Centre"
    };

    const lines = [
      "================================================================",
      "GUIDE DE GRAVURE & DECOUPE LASER RECTO-VERSO — ELLIPSES BAPT'SS",
      "================================================================",
      "",
      `Dimensions d'une ellipse : ${s.ellipseWidth} x ${s.ellipseHeight} mm`,
      `Plaque MDF paramétrée    : ${s.sheetWidth} x ${s.sheetHeight} mm (marge ${s.sheetMargin} mm)`,
      `Nombre de planches       : ${layout.sheets.length}`,
      `Sens de retournement     : ${flipDesc}`,
      `Origine laser conseillée : ${originLabels[s.laserOrigin] || s.laserOrigin}`,
      "",
      "CONVENTION COULEURS LASER :",
      "  - Noir  (#000000) : Gravure (remplissage)",
      "  - Rouge (#FF0000) : Découpe",
      "",
      "PROCEDURE EN 2 ETAPES POUR CHAQUE PLANCHE :",
      "  1) Caler la planche de MDF sur le plateau (sans couper le contour extérieur).",
      "  2) Importer 'planche_XX_etape1_nom_gravure.svg' :",
      "     - Graver le calque noir (#000000) : '.onscrit[e] / Nom / devenu[e]'.",
      "     - Découper le calque rouge (#FF0000) : marqueurs de référence aux 4 coins.",
      "  3) Retourner la planche selon le sens configuré ci-dessus.",
      "     La zone de travail de chaque planche possède des marqueurs traversants",
      "     aux 4 coins exacts : utiliser le pointeur rouge du laser ou des piges",
      "     Ø 3 mm pour aligner l'origine exacte avant la passe 2.",
      "  4) Importer 'planche_XX_etape2_buque_gravure_decoupe.svg' :",
      "     - Graver le calque noir (#000000) : Buque + 2 Amtrad's.",
      "     - Découper le calque rouge (#FF0000) : ellipses finales.",
      "     (Désactiver si souhaité la re-découpe des marqueurs de référence.)",
      "",
      "DETAIL DES PLANCHES :"
    ];

    for (const sheet of layout.sheets) {
      const padNum = String(sheet.sheetNumber).padStart(2, "0");
      lines.push(
        `\n--- Planche ${padNum} : zone utile ${sheet.workW.toFixed(1)} x ${sheet.workH.toFixed(1)} mm (${sheet.placements.length} ellipse(s)) ---`
      );
      for (const p of sheet.placements) {
        lines.push(
          `  #${p.globalIndex + 1} [${p.item.genre === "F" ? "F" : "H"}] ${p.item.nom} / ${p.item.buque}`
        );
      }
    }
    return lines.join("\r\n") + "\r\n";
  }

  /**
   * Génère une archive .zip contenant toutes les planches (Étape 1 + Étape 2) + le guide texte.
   */
  async function generateAllSheetsZip(layout, engineOverride, jszipOverride) {
    if (!layout || layout.error) {
      throw new Error(layout && layout.error ? layout.error : "Mise en planche invalide.");
    }
    const engine = engineOverride || SvgEngineLib;
    const JSZip = jszipOverride || JSZipLib;
    if (!engine || !JSZip) {
      throw new Error("SvgEngine ou JSZip introuvable.");
    }

    const zip = new JSZip();
    for (let i = 0; i < layout.sheets.length; i++) {
      const pad = String(i + 1).padStart(2, "0");
      const svg1 = engine.generateSheetSvg(layout, i, 1);
      const svg2 = engine.generateSheetSvg(layout, i, 2);
      zip.file(`planche_${pad}_etape1_nom_gravure.svg`, svg1);
      zip.file(`planche_${pad}_etape2_buque_gravure_decoupe.svg`, svg2);
    }
    zip.file("GUIDE_DECOUPE.txt", buildLaserGuideText(layout));
    return zip;
  }

  return {
    SAMPLE_ROWS,
    normalizeGender,
    parseCsvText,
    mapMatrixToItems,
    parseSpreadsheetBuffer,
    buildCsvTemplateText,
    buildXlsxTemplateBuffer,
    buildLaserGuideText,
    generateAllSheetsZip
  };
});
