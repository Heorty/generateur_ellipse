const assert = require("assert");
const fs = require("fs");
const path = require("path");
const opentype = require("../vendor/opentype.min.js");
const XLSX = require("../vendor/xlsx.full.min.js");
const JSZip = require("../vendor/jszip.min.js");
const assets = require("../assets-data.js");
const engine = require("../svg-engine.js");
const dataIO = require("../data-io.js");

function extractAllCoordsFromPathD(d) {
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  assert(nums.length > 0, "Path d must contain coordinates");
  for (const n of nums) {
    assert(Number.isFinite(n), "Coordinate must be finite (no NaN/Infinity)");
  }
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pts.push([nums[i], nums[i + 1]]);
  }
  return pts;
}

function encodeWin1252(str) {
  const map = { "é": 0xe9, "è": 0xe8, "ê": 0xea, "É": 0xc9, "œ": 0x9c, "’": 0x92, "à": 0xe0 };
  const bytes = [];
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code < 128) bytes.push(code);
    else if (map[ch] !== undefined) bytes.push(map[ch]);
    else bytes.push(0x3f);
  }
  return Uint8Array.from(bytes).buffer;
}

async function run() {
  console.log("1. Testing Clun'sois TTF vectorization...");
  const font = engine.getFont(opentype, assets);
  const samples = [
    ".onscrit",
    ".onscrite",
    "vienne",
    "Echo",
    "devenu",
    "devenue",
    "Lépine",
    "Cœur-d'Été",
    "Archimède-Constantinople-28"
  ];
  for (const s of samples) {
    const d = engine.buildCenteredTextPath(font, s, 20, 70, 24);
    assert(d.length > 20, `Expected non-empty path for ${s}`);
    assert(!/NaN|Infinity|undefined/i.test(d), `Invalid number in path for ${s}`);
  }

  console.log("2. Testing CSV (UTF-8 ';', Win-1252 ';', ',') and Excel (.xlsx) import...");
  const csvUtf8 = "\uFEFFgenre;nom;buque\r\nF;Lépine;Étoile\r\nH;vienne;Echo\r\n";
  const rowsUtf8 = dataIO.parseSpreadsheetBuffer(
    new TextEncoder().encode(csvUtf8).buffer,
    "liste.csv",
    XLSX
  );
  assert.deepStrictEqual(rowsUtf8, [
    { genre: "F", nom: "Lépine", buque: "Étoile" },
    { genre: "M", nom: "vienne", buque: "Echo" }
  ]);

  const csvWin1252 = encodeWin1252("sexe;nom de famille;surnom\r\nFemme;Lépine;Étoile\r\nHomme;Dupont;Phénix\r\n");
  const rows1252 = dataIO.parseSpreadsheetBuffer(csvWin1252, "excel_fr.csv", XLSX);
  assert.deepStrictEqual(rows1252, [
    { genre: "F", nom: "Lépine", buque: "Étoile" },
    { genre: "M", nom: "Dupont", buque: "Phénix" }
  ]);

  const csvComma = 'genre,nom,buque\nF,"Cœur,Test",Zéphyr\n';
  const rowsComma = dataIO.parseSpreadsheetBuffer(
    new TextEncoder().encode(csvComma).buffer,
    "comma.csv",
    XLSX
  );
  assert.deepStrictEqual(rowsComma, [{ genre: "F", nom: "Cœur,Test", buque: "Zéphyr" }]);

  const xlsxBuf = dataIO.buildXlsxTemplateBuffer(XLSX);
  const rowsXlsx = dataIO.parseSpreadsheetBuffer(xlsxBuf, "modele.xlsx", XLSX);
  assert.strictEqual(rowsXlsx.length, dataIO.SAMPLE_ROWS.length);
  assert.deepStrictEqual(rowsXlsx[0], dataIO.SAMPLE_ROWS[0]);

  console.log("3. Testing multi-sheet layout, mirror symmetry, and laser SVG safety...");
  const tenPeople = [
    { genre: "M", nom: "vienne", buque: "Echo" },
    { genre: "F", nom: "Lépine", buque: "Étoile" },
    { genre: "M", nom: "Cœur-d'Été", buque: "Zéphyr" },
    { genre: "F", nom: "Archimède-Constantinople-Long", buque: "Super-Long-Buque-Test-28" },
    { genre: "M", nom: "Dupont", buque: "Phénix" },
    { genre: "F", nom: "Martin", buque: "Comète" },
    { genre: "M", nom: "Bernard", buque: "Titan" },
    { genre: "F", nom: "Durand", buque: "Lyre" },
    { genre: "M", nom: "Moreau", buque: "Orion" },
    { genre: "F", nom: "Petit", buque: "Vega" }
  ];

  const combos = [
    { flipAxis: "horizontal", orientation: "horizontal", expRot1: 0, expRot2: 0 },
    { flipAxis: "horizontal", orientation: "vertical", expRot1: 90, expRot2: 270 },
    { flipAxis: "vertical", orientation: "horizontal", expRot1: 0, expRot2: 180 },
    { flipAxis: "vertical", orientation: "vertical", expRot1: 90, expRot2: 90 }
  ];

  for (const combo of combos) {
    const settings = {
      sheetWidth: 300,
      sheetHeight: 200,
      sheetMargin: 10,
      markerPadding: 8,
      spacing: 4,
      flipAxis: combo.flipAxis,
      orientation: combo.orientation,
      workZoneMode: "tight"
    };
    const layout = engine.computePlanLayout(tenPeople, settings);
    assert(!layout.error, `Unexpected layout error: ${layout.error}`);
    assert(layout.sheets.length >= 2, `Expected >=2 sheets on 300x200 for 10 items, got ${layout.sheets.length}`);

    for (let sIdx = 0; sIdx < layout.sheets.length; sIdx++) {
      const sheet = layout.sheets[sIdx];
      const svg1 = engine.generateSheetSvg(layout, sIdx, 1, opentype, assets);
      const svg2 = engine.generateSheetSvg(layout, sIdx, 2, opentype, assets);

      // Zero <text>
      assert(!/<text[\s>]/i.test(svg1), "Step 1 SVG must not contain <text>");
      assert(!/<text[\s>]/i.test(svg2), "Step 2 SVG must not contain <text>");

      // No yellow or rogue stroke on engraving
      assert(!/#ffff00/i.test(svg1) && !/#ffff00/i.test(svg2), "Must not contain #ffff00");
      assert(!/stroke:#ff0000/i.test(svg1) && !/stroke:#ff0000/i.test(svg2), "Must not contain inline Amtrad's stroke:#ff0000");

      // Only #000000 in #gravure and #FF0000 in #marqueurs-reference / #decoupe-ellipses
      const grav1 = svg1.match(/<g id="gravure"[^>]*>([\s\S]*?)<\/g>\s*<g id="marqueurs-reference"/);
      assert(grav1, "Step 1 must have #gravure followed by #marqueurs-reference");
      assert(!/#ff0000/i.test(grav1[1]), "Step 1 #gravure must not contain #ff0000");
      const grav2 = svg2.match(/<g id="gravure"[^>]*>([\s\S]*?)<\/g>\s*<g id="marqueurs-reference"/);
      assert(grav2, "Step 2 must have #gravure followed by #marqueurs-reference");
      assert(!/#ff0000/i.test(grav2[1]), "Step 2 #gravure must not contain #ff0000");

      // Identical dimensions & viewBox
      const hdr1 = svg1.match(/<svg[^>]+>/)[0];
      const hdr2 = svg2.match(/<svg[^>]+>/)[0];
      const w1 = hdr1.match(/width="([^"]+)"/)[1];
      const h1 = hdr1.match(/height="([^"]+)"/)[1];
      const vb1 = hdr1.match(/viewBox="([^"]+)"/)[1];
      assert.strictEqual(w1, hdr2.match(/width="([^"]+)"/)[1], "Width must match between Step 1 and Step 2");
      assert.strictEqual(h1, hdr2.match(/height="([^"]+)"/)[1], "Height must match between Step 1 and Step 2");
      assert.strictEqual(vb1, hdr2.match(/viewBox="([^"]+)"/)[1], "viewBox must match between Step 1 and Step 2");

      // Ellipse cut counts
      assert.strictEqual((svg1.match(/<ellipse\b/g) || []).length, 0, "Step 1 must have 0 cut ellipses");
      assert.strictEqual(
        (svg2.match(/<ellipse\b/g) || []).length,
        sheet.placements.length,
        "Step 2 must have exact number of cut ellipses"
      );

      // Mirror coordinate symmetry & rotation checks
      for (const p of sheet.placements) {
        assert.strictEqual(p.step1.rot, combo.expRot1);
        assert.strictEqual(p.step2.rot, combo.expRot2);
        if (combo.flipAxis === "horizontal") {
          assert(Math.abs(p.step2.cx - (sheet.workW - p.step1.cx)) < 0.001, "Horizontal flip cx mismatch");
          assert(Math.abs(p.step2.cy - p.step1.cy) < 0.001, "Horizontal flip cy mismatch");
        } else {
          assert(Math.abs(p.step2.cx - p.step1.cx) < 0.001, "Vertical flip cx mismatch");
          assert(Math.abs(p.step2.cy - (sheet.workH - p.step1.cy)) < 0.001, "Vertical flip cy mismatch");
        }
      }
    }
  }

  console.log("4. Testing text bounds stay strictly inside 90x60 mm ellipse even for 29-char names...");
  const rx = 45;
  const ry = 30;
  for (const item of tenPeople) {
    for (const step of [1, 2]) {
      const face = engine.buildEllipseFaceElements(item, step, engine.DEFAULT_SETTINGS, font, assets);
      for (const d of face.engravingPaths) {
        const pts = extractAllCoordsFromPathD(d);
        for (const [x, y] of pts) {
          const norm = (x / rx) ** 2 + (y / ry) ** 2;
          assert(
            norm < 1.0,
            `Path point (${x}, ${y}) for '${item.nom}/${item.buque}' step ${step} exceeded ellipse boundary (norm=${norm.toFixed(3)})`
          );
        }
      }
    }
  }

  console.log("5. Testing ZIP archive generation...");
  const layoutZip = engine.computePlanLayout(tenPeople, {
    sheetWidth: 300,
    sheetHeight: 200
  });
  const zip = await dataIO.generateAllSheetsZip(layoutZip, engine, JSZip);
  const zipBytes = await zip.generateAsync({ type: "nodebuffer" });
  assert(zipBytes.length > 5000, "Generated ZIP should be non-trivial");
  const reloaded = await JSZip.loadAsync(zipBytes);
  const files = Object.keys(reloaded.files).sort();
  assert(files.includes("GUIDE_DECOUPE.txt"), "ZIP must include GUIDE_DECOUPE.txt");
  assert(files.includes("planche_01_etape1_nom_gravure.svg"), "ZIP must include sheet 1 step 1");
  assert(files.includes("planche_01_etape2_buque_gravure_decoupe.svg"), "ZIP must include sheet 1 step 2");
  assert(files.includes("planche_02_etape1_nom_gravure.svg"), "ZIP must include sheet 2 step 1");
  assert(files.includes("planche_02_etape2_buque_gravure_decoupe.svg"), "ZIP must include sheet 2 step 2");

  console.log("6. Testing real test.csv import, gender variants, and upload markup...");
  assert.strictEqual(dataIO.normalizeGender("F."), "F");
  assert.strictEqual(dataIO.normalizeGender("Mme."), "F");
  const testCsvPath = path.join(__dirname, "..", "test.csv");
  const testBuf = fs.readFileSync(testCsvPath);
  const testItems = dataIO.parseSpreadsheetBuffer(
    testBuf.buffer.slice(testBuf.byteOffset, testBuf.byteOffset + testBuf.byteLength),
    "test.csv",
    XLSX
  );
  assert.deepStrictEqual(testItems, [
    { genre: "M", nom: "vienne", buque: "Echo" },
    { genre: "M", nom: "barrau", buque: "harold" },
    { genre: "M", nom: "cure", buque: "Ragnarts" },
    { genre: "F", nom: "de trogoff", buque: "calypso" }
  ]);
  const testLayout = engine.computePlanLayout(testItems, engine.DEFAULT_SETTINGS);
  assert(!testLayout.error, "test.csv layout should have no error");
  const testSvg1 = engine.generateSheetSvg(testLayout, 0, 1, opentype, assets);
  const testSvg2 = engine.generateSheetSvg(testLayout, 0, 2, opentype, assets);
  assert(!/NaN|Infinity|undefined/i.test(testSvg1 + testSvg2), "test.csv SVGs must contain no NaN/Infinity");
  assert.strictEqual((testSvg2.match(/<ellipse\b/g) || []).length, 4, "test.csv Step 2 must have 4 cut ellipses");

  const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert(/<input[^>]*id="fileInput"/.test(indexHtml), "index.html must contain #fileInput");
  assert(/<label[^>]*id="fileDropzone"[^>]*for="fileInput"/.test(indexHtml), "#fileDropzone must be a label[for=fileInput]");
  assert(!/<label[^>]*id="fileDropzone"[\s\S]*?<input[^>]*id="fileInput"/.test(indexHtml), "#fileInput must not be nested inside #fileDropzone");

  const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert(!/fileDropzone\.addEventListener\(\s*["']click["']/.test(appJs), "app.js must not attach recursive click listener on fileDropzone");

  console.log("7. Testing full Greek alphabet, superscripts (ᵀ), and all 177 rows of import_decoupe_buques.csv...");
  const greekAndSup = "αβγδεζηθικλμνξοπρςστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩϕϱϖϵϑΩ∆⍴𝜏ᵀᵗ⁴⁰";
  assert.deepStrictEqual(
    engine.getMissingCharacters(font, greekAndSup, assets),
    [],
    "Full Greek alphabet + variants + superscripts must have 0 missing glyphs"
  );
  const dGreek = engine.buildCenteredTextPath(font, greekAndSup, 20, 70, 20, assets);
  assert(dGreek.length > 100 && !/NaN|Infinity|undefined/i.test(dGreek), "Full Greek path must be valid");

  const buquesPath = path.join(__dirname, "..", "import_decoupe_buques.csv");
  if (fs.existsSync(buquesPath)) {
    const bBuf = fs.readFileSync(buquesPath);
    const bItems = dataIO.parseSpreadsheetBuffer(
      bBuf.buffer.slice(bBuf.byteOffset, bBuf.byteOffset + bBuf.byteLength),
      "import_decoupe_buques.csv",
      XLSX
    );
    assert.strictEqual(bItems.length, 177, "Expected 177 rows in import_decoupe_buques.csv");
    for (const item of bItems) {
      assert.deepStrictEqual(
        engine.getMissingCharacters(font, item.nom, assets),
        [],
        `Missing glyph in nom '${item.nom}'`
      );
      assert.deepStrictEqual(
        engine.getMissingCharacters(font, item.buque, assets),
        [],
        `Missing glyph in buque '${item.buque}'`
      );
      for (const step of [1, 2]) {
        const face = engine.buildEllipseFaceElements(item, step, engine.DEFAULT_SETTINGS, font, assets);
        for (const d of face.engravingPaths) {
          for (const [x, y] of extractAllCoordsFromPathD(d)) {
            assert((x / rx) ** 2 + (y / ry) ** 2 < 1.0, `Point out of ellipse for '${item.nom}/${item.buque}'`);
          }
        }
      }
    }
    const bLayout = engine.computePlanLayout(bItems, engine.DEFAULT_SETTINGS);
    assert(!bLayout.error, "import_decoupe_buques layout should succeed");
    for (let i = 0; i < bLayout.sheets.length; i++) {
      const s1 = engine.generateSheetSvg(bLayout, i, 1, opentype, assets);
      const s2 = engine.generateSheetSvg(bLayout, i, 2, opentype, assets);
      assert(!/NaN|Infinity|undefined/i.test(s1 + s2), `Sheet ${i + 1} must have no NaN`);
    }
  }

  console.log("ALL VERIFICATION CHECKS PASSED (" + files.length + " files in ZIP).");
}

run().catch((err) => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
