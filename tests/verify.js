const assert = require("assert");
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

  console.log("ALL VERIFICATION CHECKS PASSED (" + files.length + " files in ZIP).");
}

run().catch((err) => {
  console.error("VERIFICATION FAILED:", err);
  process.exit(1);
});
