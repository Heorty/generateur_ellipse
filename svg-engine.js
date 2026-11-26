/* Moteur géométrique et générateur SVG vectoriel (gravure #000000, découpe #FF0000, zéro <text>) */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./vendor/opentype.min.js"),
      require("./assets-data.js")
    );
  } else {
    root.SvgEngine = factory(root.opentype, root.ELLIPSE_ASSETS);
  }
})(typeof self !== "undefined" ? self : this, function (opentypeLib, assetsData) {
  "use strict";

  const DEFAULT_SETTINGS = Object.freeze({
    // Dimensions de l'ellipse (mm)
    ellipseWidth: 90,
    ellipseHeight: 60,
    // Textes recto (étape 1)
    topTextMale: ".onscrit",
    topTextFemale: ".onscrite",
    bottomTextMale: "devenu",
    bottomTextFemale: "devenue",
    curvedFontSize: 8.5,
    topMargin: 3.2,
    bottomMargin: 3.2,
    topLetterSpacing: 0.25,
    bottomLetterSpacing: 0.35,
    // Tailles texte central et Amtrad's
    centerFontSize: 20,
    amtradsHeight: 13.5,
    amtradsEdgeMargin: 3.8,
    // Dimensions et mise en page de la plaque (mm)
    sheetWidth: 600,
    sheetHeight: 400,
    sheetMargin: 10,
    spacing: 4,
    markerPadding: 8,
    orientation: "horizontal", // "horizontal" (90x60) | "vertical" (60x90)
    workZoneMode: "tight", // "tight" | "full"
    // Alignement et marqueurs laser
    flipAxis: "horizontal", // "horizontal" (gauche <-> droite) | "vertical" (haut <-> bas)
    markerStyle: "corners_holes", // "corners_holes" | "corners" | "crosshairs"
    laserOrigin: "top-left", // "top-left" | "bottom-left" | "top-right" | "bottom-right" | "center"
    showSheetLabel: true
  });

  let cachedFont = null;

  function fmt(n) {
    const rounded = Math.round(n * 1000) / 1000;
    return Object.is(rounded, -0) ? "0" : String(rounded);
  }

  function decodeBase64ToArrayBuffer(base64) {
    if (typeof Buffer !== "undefined") {
      const buf = Buffer.from(base64, "base64");
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function getFont(opentypeOverride, assetsOverride) {
    if (cachedFont && !opentypeOverride && !assetsOverride) {
      return cachedFont;
    }
    const ot = opentypeOverride || opentypeLib;
    const assets = assetsOverride || assetsData;
    if (!ot || !assets || !assets.fontBase64) {
      throw new Error("Bibliothèque opentype.js ou données de police introuvables.");
    }
    const ab = decodeBase64ToArrayBuffer(assets.fontBase64);
    const font = ot.parse(ab);
    if (!opentypeOverride && !assetsOverride) {
      cachedFont = font;
    }
    return font;
  }

  function getAssets(assetsOverride) {
    return assetsOverride || assetsData;
  }

  function mergeSettings(partial) {
    const merged = Object.assign({}, DEFAULT_SETTINGS, partial || {});
    const numericKeys = [
      "ellipseWidth",
      "ellipseHeight",
      "curvedFontSize",
      "topMargin",
      "bottomMargin",
      "topLetterSpacing",
      "bottomLetterSpacing",
      "centerFontSize",
      "amtradsHeight",
      "amtradsEdgeMargin",
      "sheetWidth",
      "sheetHeight",
      "sheetMargin",
      "spacing",
      "markerPadding"
    ];
    for (const key of numericKeys) {
      const val = Number(merged[key]);
      merged[key] = Number.isFinite(val) ? val : DEFAULT_SETTINGS[key];
    }
    merged.ellipseWidth = Math.max(20, merged.ellipseWidth);
    merged.ellipseHeight = Math.max(20, merged.ellipseHeight);
    merged.sheetWidth = Math.max(30, merged.sheetWidth);
    merged.sheetHeight = Math.max(30, merged.sheetHeight);
    merged.sheetMargin = Math.max(0, merged.sheetMargin);
    merged.spacing = Math.max(0, merged.spacing);
    merged.markerPadding = Math.max(0, merged.markerPadding);
    merged.curvedFontSize = Math.max(2, merged.curvedFontSize);
    merged.centerFontSize = Math.max(4, merged.centerFontSize);
    merged.amtradsHeight = Math.max(3, merged.amtradsHeight);
    return merged;
  }

  function commandsToD(commands, transformFn) {
    let out = "";
    for (let i = 0; i < commands.length; i++) {
      const c = commands[i];
      if (c.type === "M") {
        const p = transformFn(c.x, c.y);
        out += `M${fmt(p.x)} ${fmt(p.y)}`;
      } else if (c.type === "L") {
        const p = transformFn(c.x, c.y);
        out += `L${fmt(p.x)} ${fmt(p.y)}`;
      } else if (c.type === "Q") {
        const p1 = transformFn(c.x1, c.y1);
        const p = transformFn(c.x, c.y);
        out += `Q${fmt(p1.x)} ${fmt(p1.y)} ${fmt(p.x)} ${fmt(p.y)}`;
      } else if (c.type === "C") {
        const p1 = transformFn(c.x1, c.y1);
        const p2 = transformFn(c.x2, c.y2);
        const p = transformFn(c.x, c.y);
        out += `C${fmt(p1.x)} ${fmt(p1.y)} ${fmt(p2.x)} ${fmt(p2.y)} ${fmt(p.x)} ${fmt(p.y)}`;
      } else if (c.type === "Z") {
        out += "Z";
      }
    }
    return out;
  }

  /**
   * Tables de correspondance pour les exposants, variantes mathématiques et lettres grecques Clun'sois.
   */
  const SUPERSCRIPT_MAP = {
    "\u1D40": { ch: "T", scale: 0.58 }, // ᵀ (t transposé)
    "\u1D57": { ch: "t", scale: 0.62 }, // ᵗ
    "\u2070": { ch: "0", scale: 0.58 }, // ⁰
    "\u2074": { ch: "4", scale: 0.58 }, // ⁴
    "\u2075": { ch: "5", scale: 0.58 }, // ⁵
    "\u2076": { ch: "6", scale: 0.58 }, // ⁶
    "\u2077": { ch: "7", scale: 0.58 }, // ⁷
    "\u2078": { ch: "8", scale: 0.58 }, // ⁸
    "\u2079": { ch: "9", scale: 0.58 }, // ⁹
    "\u207A": { ch: "+", scale: 0.58 }, // ⁺
    "\u207B": { ch: "-", scale: 0.58 }, // ⁻
    "\u207C": { ch: "=", scale: 0.58 }, // ⁼
    "\u207D": { ch: "(", scale: 0.58 }, // ⁽
    "\u207E": { ch: ")", scale: 0.58 }, // ⁾
    "\u207F": { ch: "n", scale: 0.62 }, // ⁿ
    "\u2071": { ch: "i", scale: 0.62 }, // ⁱ
    "\u1D43": { ch: "a", scale: 0.62 }, // ᵃ
    "\u1D47": { ch: "b", scale: 0.62 }, // ᵇ
    "\u1D9C": { ch: "c", scale: 0.62 }, // ᶜ
    "\u1D48": { ch: "d", scale: 0.62 }, // ᵈ
    "\u1D49": { ch: "e", scale: 0.62 }, // ᵉ
    "\u1DA0": { ch: "f", scale: 0.62 }, // ᶠ
    "\u1D4D": { ch: "g", scale: 0.62 }, // ᵍ
    "\u02B0": { ch: "h", scale: 0.62 }, // ʰ
    "\u02B2": { ch: "j", scale: 0.62 }, // ʲ
    "\u1D4F": { ch: "k", scale: 0.62 }, // ᵏ
    "\u02E1": { ch: "l", scale: 0.62 }, // ˡ
    "\u1D50": { ch: "m", scale: 0.62 }, // ᵐ
    "\u1D52": { ch: "o", scale: 0.62 }, // ᵒ
    "\u1D56": { ch: "p", scale: 0.62 }, // ᵖ
    "\u02B3": { ch: "r", scale: 0.62 }, // ʳ
    "\u02E2": { ch: "s", scale: 0.62 }, // ˢ
    "\u1D58": { ch: "u", scale: 0.62 }, // ᵘ
    "\u1D5B": { ch: "v", scale: 0.62 }, // ᵛ
    "\u02B7": { ch: "w", scale: 0.62 }, // ʷ
    "\u02E3": { ch: "x", scale: 0.62 }, // ˣ
    "\u02B8": { ch: "y", scale: 0.62 }, // ʸ
    "\u1DBB": { ch: "z", scale: 0.62 }, // ᶻ
    "\u1D2C": { ch: "A", scale: 0.58 }, // ᴬ
    "\u1D2E": { ch: "B", scale: 0.58 }, // ᴮ
    "\u1D30": { ch: "D", scale: 0.58 }, // ᴰ
    "\u1D31": { ch: "E", scale: 0.58 }, // ᴱ
    "\u1D33": { ch: "G", scale: 0.58 }, // ᴳ
    "\u1D34": { ch: "H", scale: 0.58 }, // ᴴ
    "\u1D35": { ch: "I", scale: 0.58 }, // ᴵ
    "\u1D36": { ch: "J", scale: 0.58 }, // ᴶ
    "\u1D37": { ch: "K", scale: 0.58 }, // ᴷ
    "\u1D38": { ch: "L", scale: 0.58 }, // ᴸ
    "\u1D39": { ch: "M", scale: 0.58 }, // ᴹ
    "\u1D3A": { ch: "N", scale: 0.58 }, // ᴺ
    "\u1D3C": { ch: "O", scale: 0.58 }, // ᴼ
    "\u1D3E": { ch: "P", scale: 0.58 }, // ᴾ
    "\u1D3F": { ch: "R", scale: 0.58 }, // ᴿ
    "\u1D41": { ch: "U", scale: 0.58 }, // ᵁ
    "\u2C7D": { ch: "V", scale: 0.58 }, // ⱽ
    "\u1D42": { ch: "W", scale: 0.58 }  // ᵂ
  };

  const SUBSCRIPT_MAP = {
    "\u2080": { ch: "0", scale: 0.58 },
    "\u2081": { ch: "1", scale: 0.58 },
    "\u2082": { ch: "2", scale: 0.58 },
    "\u2083": { ch: "3", scale: 0.58 },
    "\u2084": { ch: "4", scale: 0.58 },
    "\u2085": { ch: "5", scale: 0.58 },
    "\u2086": { ch: "6", scale: 0.58 },
    "\u2087": { ch: "7", scale: 0.58 },
    "\u2088": { ch: "8", scale: 0.58 },
    "\u2089": { ch: "9", scale: 0.58 }
  };

  const VARIANT_CHAR_MAP = {
    "\u2374": "\u03C1", // ⍴ (APL rho) -> ρ
    "\u03D5": "\u03C6", // ϕ -> φ
    "\u03F1": "\u03C1", // ϱ -> ρ
    "\u03D6": "\u03C0", // ϖ -> π
    "\u2126": "\u03A9", // Ω -> Ω
    "\u2206": "\u0394", // ∆ -> Δ
    "\u2205": "\u00D8", // ∅ -> Ø
    "\u2032": "'",      // ′ -> '
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2212": "-"
  };

  // Lettres grecques déjà dessinées dans clunsois_complet.ttf (plan de codage Argadz) + homoglyphes majuscules
  const CLUNSOIS_GREEK_MAP = {
    "\u03C6": "\u201A", // φ -> ‚ (#100)
    "\u03A6": "\u201A", // Φ -> ‚ (#100)
    "\u03C4": "\u2022", // τ -> • (#99)
    "\u03C1": "\u0161", // ρ -> š (#120)
    "\u03C7": "\u20AC", // χ -> € (#98)
    "\u03A7": "\u20AC", // Χ -> € (#98)
    "\u03C8": "\u0160", // ψ -> Š (#106)
    "\u03A8": "\u0160", // Ψ -> Š (#106)
    "\u03BC": "\u00B5", // μ -> µ (#143)
    "\u03A0": "\u00DD", // Π -> Ý (#183)
    "\u03C0": "\u00DE", // π -> Þ (#184)
    "\u03B2": "\u00DF", // β -> ß (#185)
    "\u03A9": "\u00FE", // Ω -> þ (#216)
    "\u0391": "A",      // Α -> A
    "\u0392": "B",      // Β -> B
    "\u0395": "E",      // Ε -> E
    "\u0396": "Z",      // Ζ -> Z
    "\u0397": "H",      // Η -> H
    "\u0399": "I",      // Ι -> I
    "\u039A": "K",      // Κ -> K
    "\u039C": "M",      // Μ -> M
    "\u039D": "N",      // Ν -> N
    "\u039F": "O",      // Ο -> O
    "\u03A1": "P",      // Ρ -> P
    "\u03A4": "T",      // Τ -> T
    "\u03A5": "Y"       // Υ -> Y
  };

  function resolveCharRuns(font, ch, assets, depth) {
    const level = depth || 0;
    const unitsPerEm = font.unitsPerEm || 2048;

    // 1. Glyphe natif Clun'sois
    const direct = font.charToGlyph(ch);
    if (direct && direct.index !== 0) {
      return [
        {
          kind: "font",
          glyph: direct,
          scale: 1,
          dyNorm: 0,
          advanceNorm: (direct.advanceWidth || 0) / unitsPerEm,
          missing: false
        }
      ];
    }

    // 2. Exposants et indices Unicode (ex. ᵀ t transposé, ⁴..⁹)
    const sup = SUPERSCRIPT_MAP[ch];
    if (sup) {
      const baseGlyph = font.charToGlyph(sup.ch);
      if (baseGlyph && baseGlyph.index !== 0) {
        const bb = baseGlyph.getPath(0, 0, 1).getBoundingBox();
        const topY = Number.isFinite(bb.y1) ? bb.y1 : -0.715;
        return [
          {
            kind: "font",
            glyph: baseGlyph,
            scale: sup.scale,
            dyNorm: -0.719 - topY * sup.scale,
            advanceNorm: ((baseGlyph.advanceWidth || 0) / unitsPerEm) * sup.scale,
            missing: false
          }
        ];
      }
    }

    const sub = SUBSCRIPT_MAP[ch];
    if (sub) {
      const baseGlyph = font.charToGlyph(sub.ch);
      if (baseGlyph && baseGlyph.index !== 0) {
        return [
          {
            kind: "font",
            glyph: baseGlyph,
            scale: sub.scale,
            dyNorm: 0.18,
            advanceNorm: ((baseGlyph.advanceWidth || 0) / unitsPerEm) * sub.scale,
            missing: false
          }
        ];
      }
    }

    // 3. Variantes mathématiques / APL / symboles
    if (level < 3) {
      if (VARIANT_CHAR_MAP[ch]) {
        return resolveCharRuns(font, VARIANT_CHAR_MAP[ch], assets, level + 1);
      }
      const cp = ch.codePointAt(0);
      if (cp >= 0x1d400 && cp <= 0x1d7ff) {
        const nfkd = ch.normalize("NFKD");
        if (nfkd && nfkd !== ch) {
          const out = [];
          for (const part of Array.from(nfkd)) {
            out.push(...resolveCharRuns(font, part, assets, level + 1));
          }
          return out;
        }
      }
    }

    // 4. Lettres grecques natives de clunsois_complet.ttf
    if (CLUNSOIS_GREEK_MAP[ch]) {
      const mappedGlyph = font.charToGlyph(CLUNSOIS_GREEK_MAP[ch]);
      if (mappedGlyph && mappedGlyph.index !== 0) {
        return [
          {
            kind: "font",
            glyph: mappedGlyph,
            scale: 1,
            dyNorm: 0,
            advanceNorm: (mappedGlyph.advanceWidth || 0) / unitsPerEm,
            missing: false
          }
        ];
      }
    }

    // 5. Glyphes grecs de repli embarqués (NotoSans-Regular normalisé 2048 UPM)
    const fallbackMap = assets && assets.fallbackGlyphs;
    if (fallbackMap && fallbackMap[ch]) {
      const fb = fallbackMap[ch];
      return [
        {
          kind: "fallback",
          fallbackGlyph: fb,
          scale: 1,
          dyNorm: 0,
          advanceNorm: (fb.advanceWidth || 0) / 2048,
          missing: false
        }
      ];
    }

    // 6. Repli de compatibilité NFKC (ex. ligatures)
    if (level < 3) {
      const nfkc = ch.normalize("NFKC");
      if (nfkc && nfkc !== ch) {
        const out = [];
        for (const part of Array.from(nfkc)) {
          out.push(...resolveCharRuns(font, part, assets, level + 1));
        }
        return out;
      }
    }

    // 7. Repli ultime .notdef
    return [
      {
        kind: "font",
        glyph: direct,
        scale: 1,
        dyNorm: 0,
        advanceNorm: ((direct && direct.advanceWidth) || 0) / unitsPerEm,
        missing: true
      }
    ];
  }

  function resolveTextRuns(font, text, assets) {
    const runs = [];
    for (const ch of Array.from(text || "")) {
      runs.push(...resolveCharRuns(font, ch, assets, 0));
    }
    return runs;
  }

  function getMissingCharacters(font, text, assetsOverride) {
    const assets = getAssets(assetsOverride);
    const missing = [];
    for (const ch of Array.from(text || "")) {
      if (/\s/.test(ch) || ch === "\uFEFF") continue;
      const runs = resolveCharRuns(font, ch, assets, 0);
      if (runs.some((r) => r.missing)) {
        missing.push(ch);
      }
    }
    return missing;
  }

  function getRunCommands(run, fontSize, offsetX, offsetY) {
    const size = fontSize * run.scale;
    const dx = offsetX || 0;
    const dy = (offsetY || 0) + run.dyNorm * fontSize;
    if (run.kind === "fallback") {
      const sc = size / 2048;
      return run.fallbackGlyph.commands.map((c) => {
        const out = { type: c.type };
        if (c.x !== undefined) out.x = c.x * sc + dx;
        if (c.y !== undefined) out.y = c.y * sc + dy;
        if (c.x1 !== undefined) out.x1 = c.x1 * sc + dx;
        if (c.y1 !== undefined) out.y1 = c.y1 * sc + dy;
        if (c.x2 !== undefined) out.x2 = c.x2 * sc + dx;
        if (c.y2 !== undefined) out.y2 = c.y2 * sc + dy;
        return out;
      });
    }
    return run.glyph.getPath(dx, dy, size).commands;
  }

  function computeCommandsBBox(commands) {
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    const include = (x, y) => {
      if (x < x1) x1 = x;
      if (x > x2) x2 = x;
      if (y < y1) y1 = y;
      if (y > y2) y2 = y;
    };
    for (let i = 0; i < commands.length; i++) {
      const c = commands[i];
      if (c.x !== undefined && c.y !== undefined) include(c.x, c.y);
      if (c.x1 !== undefined && c.y1 !== undefined) include(c.x1, c.y1);
      if (c.x2 !== undefined && c.y2 !== undefined) include(c.x2, c.y2);
    }
    return { x1, y1, x2, y2 };
  }

  function composeRuns(font, runs, fontSize) {
    const commands = [];
    const scale = fontSize / (font.unitsPerEm || 2048);
    let cursor = 0;
    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const cmds = getRunCommands(run, fontSize, cursor, 0);
      for (let j = 0; j < cmds.length; j++) commands.push(cmds[j]);
      cursor += run.advanceNorm * fontSize;
      if (i < runs.length - 1) {
        const next = runs[i + 1];
        if (run.kind === "font" && next.kind === "font" && run.scale === 1 && next.scale === 1) {
          cursor += font.getKerningValue(run.glyph, next.glyph) * scale;
        }
      }
    }
    return { commands, bbox: computeCommandsBBox(commands) };
  }

  /**
   * Vectorise un texte droit centré autour de (0, 0) avec réduction auto si dépassement.
   */
  function buildCenteredTextPath(font, text, defaultFontSize, maxWidth, maxHeight, assetsOverride) {
    const clean = (text || "").trim();
    if (!clean) return "";

    const assets = getAssets(assetsOverride);
    const runs = resolveTextRuns(font, clean, assets);
    if (!runs.length) return "";

    let fontSize = defaultFontSize;
    let composed = composeRuns(font, runs, fontSize);
    let bb = composed.bbox;
    const w = bb.x2 - bb.x1;
    const h = bb.y2 - bb.y1;

    if ((w > maxWidth || h > maxHeight) && w > 0 && h > 0) {
      const scale = Math.min(maxWidth / w, maxHeight / h);
      fontSize = Math.max(2.5, defaultFontSize * scale);
      composed = composeRuns(font, runs, fontSize);
      bb = composed.bbox;
    }

    if (!composed.commands.length || !Number.isFinite(bb.x1)) {
      return "";
    }

    const dx = -(bb.x1 + bb.x2) / 2;
    const dy = -(bb.y1 + bb.y2) / 2;
    return commandsToD(composed.commands, (x, y) => ({ x: x + dx, y: y + dy }));
  }

  /**
   * Construit une table d'abscisse curviligne sur l'ellipse (rx, ry) sur [thetaStart, thetaEnd].
   */
  function buildArcLookup(rx, ry, thetaStart, thetaEnd, steps) {
    const n = steps || 360;
    const thetas = new Float64Array(n + 1);
    const arcs = new Float64Array(n + 1);
    const dTheta = (thetaEnd - thetaStart) / n;
    let prevX = rx * Math.cos(thetaStart);
    let prevY = ry * Math.sin(thetaStart);
    thetas[0] = thetaStart;
    arcs[0] = 0;

    for (let i = 1; i <= n; i++) {
      const t = thetaStart + i * dTheta;
      const x = rx * Math.cos(t);
      const y = ry * Math.sin(t);
      const ds = Math.hypot(x - prevX, y - prevY);
      thetas[i] = t;
      arcs[i] = arcs[i - 1] + ds;
      prevX = x;
      prevY = y;
    }

    const totalLen = arcs[n];
    const centerS = totalLen / 2;

    function thetaAtSignedS(signedS) {
      const target = Math.max(0, Math.min(totalLen, centerS + signedS));
      let lo = 0;
      let hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (arcs[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      if (lo === 0) return thetas[0];
      const s0 = arcs[lo - 1];
      const s1 = arcs[lo];
      const frac = s1 > s0 ? (target - s0) / (s1 - s0) : 0;
      return thetas[lo - 1] + frac * (thetas[lo] - thetas[lo - 1]);
    }

    return { totalLen, thetaAtSignedS };
  }

  /**
   * Vectorise un texte courbé le long de l'arc supérieur ('top') ou inférieur ('bottom') de l'ellipse.
   */
  function buildCurvedTextPath(font, text, baseFontSize, rxArc, ryArc, placement, letterSpacingMm, assetsOverride) {
    const clean = (text || "").trim();
    if (!clean) return "";

    const assets = getAssets(assetsOverride);
    const runs = resolveTextRuns(font, clean, assets);
    if (!runs.length) return "";

    const safeRx = Math.max(4, rxArc);
    const safeRy = Math.max(4, ryArc);

    // Pour 'top', centré à -PI/2 (de -PI à 0, angle croissant).
    // Pour 'bottom', centré à +PI/2 (de +PI à 0, angle décroissant pour lire de gauche à droite à l'endroit).
    const lookup =
      placement === "top"
        ? buildArcLookup(safeRx, safeRy, -Math.PI, 0, 360)
        : buildArcLookup(safeRx, safeRy, Math.PI, 0, 360);

    function measureAt(size) {
      const scale = size / (font.unitsPerEm || 2048);
      const advs = [];
      const steps = [];
      let total = 0;
      for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        const adv = run.advanceNorm * size;
        advs.push(adv);
        let step = adv;
        if (i < runs.length - 1) {
          const next = runs[i + 1];
          const kern =
            run.kind === "font" && next.kind === "font" && run.scale === 1 && next.scale === 1
              ? font.getKerningValue(run.glyph, next.glyph) * scale
              : 0;
          step += kern + letterSpacingMm;
        }
        steps.push(step);
        total += step;
      }
      return { advs, steps, total };
    }

    let fontSize = baseFontSize;
    let metrics = measureAt(fontSize);
    const maxArcSpan = lookup.totalLen * 0.84;
    if (metrics.total > maxArcSpan && metrics.total > 0) {
      fontSize = Math.max(2.5, baseFontSize * (maxArcSpan / metrics.total));
      metrics = measureAt(fontSize);
    }

    let cursor = -metrics.total / 2;
    let dOut = "";

    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const adv = metrics.advs[i];
      const sCenter = cursor + adv / 2;
      const theta = lookup.thetaAtSignedS(sCenter);

      const px = safeRx * Math.cos(theta);
      const py = safeRy * Math.sin(theta);

      let tx, ty;
      if (placement === "top") {
        tx = -safeRx * Math.sin(theta);
        ty = safeRy * Math.cos(theta);
      } else {
        tx = safeRx * Math.sin(theta);
        ty = -safeRy * Math.cos(theta);
      }

      const alpha = Math.atan2(ty, tx);
      const cosA = Math.cos(alpha);
      const sinA = Math.sin(alpha);
      const halfAdv = adv / 2;

      const cmds = getRunCommands(run, fontSize, 0, 0);
      if (cmds.length) {
        dOut += commandsToD(cmds, (x, y) => {
          const lx = x - halfAdv;
          const ly = y;
          return {
            x: px + lx * cosA - ly * sinA,
            y: py + lx * sinA + ly * cosA
          };
        });
      }

      cursor += metrics.steps[i];
    }

    return dOut;
  }

  /**
   * Construit les éléments SVG locaux d'une ellipse centrée en (0, 0).
   */
  function buildEllipseFaceElements(item, step, settings, font, assets) {
    const s = mergeSettings(settings);
    const rx = s.ellipseWidth / 2;
    const ry = s.ellipseHeight / 2;
    const scaleFactor = Math.min(s.ellipseWidth / 90, s.ellipseHeight / 60);
    const isFemale = item && item.genre === "F";

    if (step === 1) {
      const topText = isFemale ? s.topTextFemale : s.topTextMale;
      const bottomText = isFemale ? s.bottomTextFemale : s.bottomTextMale;

      const capHeightRatio =
        font.tables && font.tables.os2 && font.tables.os2.sCapHeight
          ? font.tables.os2.sCapHeight / font.unitsPerEm
          : 0.72;
      const capHeightMm = s.curvedFontSize * capHeightRatio;

      const dTop = s.topMargin + capHeightMm;
      const dBot = s.bottomMargin;

      const topD = buildCurvedTextPath(
        font,
        topText,
        s.curvedFontSize,
        rx - dTop,
        ry - dTop,
        "top",
        s.topLetterSpacing,
        assets
      );
      const bottomD = buildCurvedTextPath(
        font,
        bottomText,
        s.curvedFontSize,
        rx - dBot,
        ry - dBot,
        "bottom",
        s.bottomLetterSpacing,
        assets
      );
      const nomD = buildCenteredTextPath(
        font,
        item && item.nom ? item.nom : "",
        s.centerFontSize,
        s.ellipseWidth * 0.78,
        s.ellipseHeight * 0.4,
        assets
      );

      const engravingPaths = [topD, nomD, bottomD].filter(Boolean);
      return {
        engravingPaths,
        engravingGroups: [],
        cutEllipse: null
      };
    }

    // Étape 2 : Verso (Buque + 2 Amtrad's orientés à l'endroit + découpe ellipse rouge)
    const amtrads = assets.amtrads;
    const vb = amtrads.viewBox;
    const targetH = Math.min(s.amtradsHeight, s.ellipseHeight * 0.28);
    const scale = targetH / vb.height;
    const targetW = vb.width * scale;
    const edgeMargin = Math.min(s.amtradsEdgeMargin, s.ellipseHeight * 0.12);

    const topAmtradsCy = -ry + edgeMargin + targetH / 2;
    const botAmtradsCy = ry - edgeMargin - targetH / 2;
    const centerAvailableH = Math.max(6, (botAmtradsCy - targetH / 2) - (topAmtradsCy + targetH / 2) - 4 * scaleFactor);

    const buqueD = buildCenteredTextPath(
      font,
      item && item.buque ? item.buque : "",
      s.centerFontSize,
      s.ellipseWidth * 0.78,
      Math.min(s.ellipseHeight * 0.34, centerAvailableH),
      assets
    );

    const makeAmtradsTransform = (cyPos) => {
      const tx = -vb.x * scale - targetW / 2;
      const ty = -vb.y * scale + cyPos - targetH / 2;
      return `translate(${fmt(tx)},${fmt(ty)}) scale(${fmt(scale)})`;
    };

    const engravingGroups = [
      { transform: makeAmtradsTransform(topAmtradsCy), paths: amtrads.paths },
      { transform: makeAmtradsTransform(botAmtradsCy), paths: amtrads.paths }
    ];

    return {
      engravingPaths: buqueD ? [buqueD] : [],
      engravingGroups,
      cutEllipse: { rx, ry }
    };
  }

  /**
   * Calcule la pagination et les coordonnées exactes sur chaque planche pour Étape 1 et Étape 2.
   */
  function computePlanLayout(items, settings) {
    const s = mergeSettings(settings);
    const list = Array.isArray(items) ? items : [];
    const isHorizontal = s.orientation !== "vertical";
    const cellW = isHorizontal ? s.ellipseWidth : s.ellipseHeight;
    const cellH = isHorizontal ? s.ellipseHeight : s.ellipseWidth;

    const usableW = s.sheetWidth - 2 * s.sheetMargin - 2 * s.markerPadding;
    const usableH = s.sheetHeight - 2 * s.sheetMargin - 2 * s.markerPadding;

    const cols = Math.max(0, Math.floor((usableW + s.spacing) / (cellW + s.spacing)));
    const rows = Math.max(0, Math.floor((usableH + s.spacing) / (cellH + s.spacing)));
    const capacity = cols * rows;

    if (cols === 0 || rows === 0) {
      return {
        error: `Plaque trop petite (${s.sheetWidth}×${s.sheetHeight} mm) pour placer une ellipse (${cellW}×${cellH} mm) avec marges (${s.sheetMargin} mm) et dégagement marqueurs (${s.markerPadding} mm).`,
        settings: s,
        cols,
        rows,
        capacity: 0,
        cellW,
        cellH,
        sheets: []
      };
    }

    const sheets = [];
    const totalSheets = list.length === 0 ? 1 : Math.ceil(list.length / capacity);

    for (let sheetIdx = 0; sheetIdx < totalSheets; sheetIdx++) {
      const slice = list.slice(sheetIdx * capacity, (sheetIdx + 1) * capacity);
      const count = slice.length;
      const actualCols = count === 0 ? 1 : Math.min(cols, count);
      const actualRows = count === 0 ? 1 : Math.ceil(count / cols);

      let workW, workH, offsetX, offsetY;
      if (s.workZoneMode === "full") {
        workW = s.sheetWidth - 2 * s.sheetMargin;
        workH = s.sheetHeight - 2 * s.sheetMargin;
        const fullGridW = cols * cellW + (cols - 1) * s.spacing;
        const fullGridH = rows * cellH + (rows - 1) * s.spacing;
        offsetX = (workW - fullGridW) / 2;
        offsetY = (workH - fullGridH) / 2;
      } else {
        const gridW = actualCols * cellW + (actualCols - 1) * s.spacing;
        const gridH = actualRows * cellH + (actualRows - 1) * s.spacing;
        workW = gridW + 2 * s.markerPadding;
        workH = gridH + 2 * s.markerPadding;
        offsetX = s.markerPadding;
        offsetY = s.markerPadding;
      }

      const rot1 = isHorizontal ? 0 : 90;
      const rot2 =
        s.flipAxis === "vertical"
          ? isHorizontal
            ? 180
            : 90
          : isHorizontal
          ? 0
          : 270;

      const placements = slice.map((item, localIdx) => {
        const col = localIdx % cols;
        const row = Math.floor(localIdx / cols);
        const cx1 = offsetX + col * (cellW + s.spacing) + cellW / 2;
        const cy1 = offsetY + row * (cellH + s.spacing) + cellH / 2;
        const cx2 = s.flipAxis === "vertical" ? cx1 : workW - cx1;
        const cy2 = s.flipAxis === "vertical" ? workH - cy1 : cy1;

        return {
          globalIndex: sheetIdx * capacity + localIdx,
          localIndex: localIdx,
          col,
          row,
          item,
          step1: { cx: cx1, cy: cy1, rot: rot1 },
          step2: { cx: cx2, cy: cy2, rot: rot2 }
        };
      });

      sheets.push({
        sheetIndex: sheetIdx,
        sheetNumber: sheetIdx + 1,
        workW,
        workH,
        cols: actualCols,
        rows: actualRows,
        placements
      });
    }

    return {
      error: null,
      settings: s,
      cols,
      rows,
      capacity,
      cellW,
      cellH,
      sheets
    };
  }

  /**
   * Génère les marqueurs de référence symétriques touchant exactement [0, workW] x [0, workH].
   */
  function buildReferenceMarkersMarkup(workW, workH, markerStyle) {
    const len = Math.min(8, workW / 4, workH / 4);
    const parts = [];

    if (markerStyle === "crosshairs") {
      const r = 1.5;
      const arm = 3;
      const corners = [
        [arm, arm],
        [workW - arm, arm],
        [arm, workH - arm],
        [workW - arm, workH - arm]
      ];
      for (const [cx, cy] of corners) {
        parts.push(
          `<path d="M${fmt(cx - arm)} ${fmt(cy)}L${fmt(cx + arm)} ${fmt(cy)}M${fmt(cx)} ${fmt(cy - arm)}L${fmt(cx)} ${fmt(cy + arm)}"/>`
        );
        parts.push(`<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}"/>`);
      }
    } else {
      // "corners" ou "corners_holes" : 4 équerres touchant les 4 coins exacts
      const cornerD =
        `M0 ${fmt(len)}L0 0L${fmt(len)} 0` +
        `M${fmt(workW - len)} 0L${fmt(workW)} 0L${fmt(workW)} ${fmt(len)}` +
        `M0 ${fmt(workH - len)}L0 ${fmt(workH)}L${fmt(len)} ${fmt(workH)}` +
        `M${fmt(workW - len)} ${fmt(workH)}L${fmt(workW)} ${fmt(workH)}L${fmt(workW)} ${fmt(workH - len)}`;
      parts.push(`<path d="${cornerD}"/>`);

      if (markerStyle !== "corners") {
        const holeOffset = Math.min(4, workW / 6, workH / 6);
        const holeR = 1.5; // diamètre 3 mm
        const holes = [
          [holeOffset, holeOffset],
          [workW - holeOffset, holeOffset],
          [holeOffset, workH - holeOffset],
          [workW - holeOffset, workH - holeOffset]
        ];
        for (const [hx, hy] of holes) {
          parts.push(`<circle cx="${fmt(hx)}" cy="${fmt(hy)}" r="${fmt(holeR)}"/>`);
        }
      }
    }

    return `<g id="marqueurs-reference" fill="none" stroke="#FF0000" stroke-width="0.1">\n    ${parts.join("\n    ")}\n  </g>`;
  }

  /**
   * Construit l'étiquette vectorisée de planche/face hors de la zone d'ellipses et des coins.
   */
  function buildSheetLabelPath(font, text, settings, workW) {
    if (!settings.showSheetLabel || settings.markerPadding < 5 || workW < 50) {
      return "";
    }
    const labelSize = Math.min(3.2, settings.markerPadding * 0.48);
    const p = font.getPath(text, 0, 0, labelSize);
    const bb = p.getBoundingBox();
    if (!p.commands.length || !Number.isFinite(bb.x1)) return "";
    const startX = 11;
    const dx = startX - bb.x1;
    const targetCenterY = Math.min(4.2, settings.markerPadding * 0.5);
    const dy = targetCenterY - (bb.y1 + bb.y2) / 2;
    return commandsToD(p.commands, (x, y) => ({ x: x + dx, y: y + dy }));
  }

  function renderPlacementEngravingMarkup(placement, step, settings, font, assets, extraAttrs) {
    const pos = step === 1 ? placement.step1 : placement.step2;
    const face = buildEllipseFaceElements(placement.item, step, settings, font, assets);
    const transform =
      pos.rot === 0
        ? `translate(${fmt(pos.cx)},${fmt(pos.cy)})`
        : `translate(${fmt(pos.cx)},${fmt(pos.cy)}) rotate(${pos.rot})`;

    const lines = [];
    for (const d of face.engravingPaths) {
      lines.push(`<path d="${d}"/>`);
    }
    for (const grp of face.engravingGroups) {
      const inner = grp.paths.map((d) => `<path d="${d}"/>`).join("");
      lines.push(`<g transform="${grp.transform}">${inner}</g>`);
    }
    const attrStr = extraAttrs ? ` ${extraAttrs}` : "";
    return `<g transform="${transform}"${attrStr}>${lines.join("")}</g>`;
  }

  function renderPlacementCutMarkup(placement, step, settings, extraAttrs) {
    const pos = step === 1 ? placement.step1 : placement.step2;
    const rx = settings.ellipseWidth / 2;
    const ry = settings.ellipseHeight / 2;
    const transform =
      pos.rot === 0
        ? `translate(${fmt(pos.cx)},${fmt(pos.cy)})`
        : `translate(${fmt(pos.cx)},${fmt(pos.cy)}) rotate(${pos.rot})`;
    const attrStr = extraAttrs ? ` ${extraAttrs}` : "";
    return `<ellipse cx="0" cy="0" rx="${fmt(rx)}" ry="${fmt(ry)}" transform="${transform}"${attrStr}/>`;
  }

  /**
   * Génère le SVG final prêt pour la découpeuse laser (Step 1 ou Step 2).
   * Strictement 2 couleurs (#000000 gravure, #FF0000 découpe), zéro <text>.
   */
  function generateSheetSvg(layoutResult, sheetIndex, step, opentypeOverride, assetsOverride) {
    if (layoutResult.error) {
      throw new Error(layoutResult.error);
    }
    const sheet = layoutResult.sheets[sheetIndex];
    if (!sheet) {
      throw new Error(`Planche ${sheetIndex + 1} introuvable.`);
    }

    const font = getFont(opentypeOverride, assetsOverride);
    const assets = getAssets(assetsOverride);
    const s = layoutResult.settings;
    const { workW, workH, placements } = sheet;

    const engravingItems = [];
    const labelText = `P${sheet.sheetNumber} - F${step}`;
    const labelD = buildSheetLabelPath(font, labelText, s, workW);
    if (labelD) {
      engravingItems.push(`<path id="etiquette-planche" d="${labelD}"/>`);
    }

    for (const p of placements) {
      engravingItems.push(renderPlacementEngravingMarkup(p, step, s, font, assets, ""));
    }

    const markersSvg = buildReferenceMarkersMarkup(workW, workH, s.markerStyle);

    let cutEllipsesSvg = "";
    if (step === 2 && placements.length > 0) {
      const cutItems = placements.map((p) => renderPlacementCutMarkup(p, 2, s, ""));
      cutEllipsesSvg = `\n  <g id="decoupe-ellipses" fill="none" stroke="#FF0000" stroke-width="0.1">\n    ${cutItems.join("\n    ")}\n  </g>`;
    }

    return [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(workW)}mm" height="${fmt(workH)}mm" viewBox="0 0 ${fmt(workW)} ${fmt(workH)}">`,
      `  <g id="gravure" fill="#000000" stroke="none">`,
      `    ${engravingItems.join("\n    ")}`,
      `  </g>`,
      `  ${markersSvg}${cutEllipsesSvg}`,
      `</svg>`
    ].join("\n");
  }

  function getLaserOriginCoords(workW, workH, origin) {
    switch (origin) {
      case "bottom-left":
        return { x: 0, y: workH };
      case "top-right":
        return { x: workW, y: 0 };
      case "bottom-right":
        return { x: workW, y: workH };
      case "center":
        return { x: workW / 2, y: workH / 2 };
      case "top-left":
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Génère un SVG enrichi pour l'aperçu UI (plaque MDF, guides pointillés, réticule laser, superposition).
   */
  function generatePreviewSvg(layoutResult, sheetIndex, viewMode, renderTheme, selectedGlobalIdx, opentypeOverride, assetsOverride) {
    if (layoutResult.error) return "";
    const sheet = layoutResult.sheets[sheetIndex];
    if (!sheet) return "";

    const font = getFont(opentypeOverride, assetsOverride);
    const assets = getAssets(assetsOverride);
    const s = layoutResult.settings;
    const { workW, workH, placements } = sheet;

    const padX = s.sheetMargin;
    const padY = s.sheetMargin;
    const totalW = Math.max(s.sheetWidth, workW + 2 * padX);
    const totalH = Math.max(s.sheetHeight, workH + 2 * padY);
    const workX = s.workZoneMode === "full" ? s.sheetMargin : s.sheetMargin;
    const workY = s.workZoneMode === "full" ? s.sheetMargin : s.sheetMargin;

    const isMdf = renderTheme !== "laser";
    const bgColor = isMdf ? "#d6a468" : "#ffffff";
    const strokeEngrave = isMdf ? "#3b2109" : "#000000";
    const boardBorder = isMdf ? "#8c5c2b" : "#94a3b8";

    const defs = isMdf
      ? `<defs>
    <linearGradient id="mdfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#deb075"/>
      <stop offset="50%" stop-color="#cfa064"/>
      <stop offset="100%" stop-color="#c49357"/>
    </linearGradient>
    <pattern id="gridMm" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(90,55,20,0.09)" stroke-width="0.35"/>
    </pattern>
  </defs>`
      : `<defs>
    <pattern id="gridMm" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(148,163,184,0.22)" stroke-width="0.35"/>
    </pattern>
  </defs>`;

    const boardRect = `<rect x="0" y="0" width="${fmt(totalW)}" height="${fmt(totalH)}" rx="2" fill="${isMdf ? "url(#mdfGrad)" : bgColor}" stroke="${boardBorder}" stroke-width="0.6"/>
  <rect x="0" y="0" width="${fmt(totalW)}" height="${fmt(totalH)}" fill="url(#gridMm)"/>`;

    const workZoneBox = `<rect x="${fmt(workX)}" y="${fmt(workY)}" width="${fmt(workW)}" height="${fmt(workH)}" fill="none" stroke="rgba(37,99,235,0.45)" stroke-width="0.4" stroke-dasharray="3 2"/>`;

    const origin = getLaserOriginCoords(workW, workH, s.laserOrigin);
    const ox = workX + origin.x;
    const oy = workY + origin.y;
    const originMarker = `<g pointer-events="none">
    <circle cx="${fmt(ox)}" cy="${fmt(oy)}" r="3.4" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="0.65"/>
    <circle cx="${fmt(ox)}" cy="${fmt(oy)}" r="1.1" fill="#2563eb"/>
  </g>`;

    const markersRaw = buildReferenceMarkersMarkup(workW, workH, s.markerStyle).replace(
      'stroke-width="0.1"',
      'stroke-width="0.55"'
    );

    let contentLayers = "";

    if (viewMode === "overlay") {
      // Superposition Recto (Étape 1) + Verso dé-retourné (Étape 2) pour prouver la coïncidence
      const flipTransform =
        s.flipAxis === "vertical"
          ? `translate(0,${fmt(workH)}) scale(1,-1)`
          : `translate(${fmt(workW)},0) scale(-1,1)`;

      const step1Engrave = placements
        .map((p) => {
          const isSel = p.globalIndex === selectedGlobalIdx;
          const attr = `class="preview-ellipse-hit${isSel ? " is-selected" : ""}" data-global-index="${p.globalIndex}" data-step="1"`;
          return renderPlacementEngravingMarkup(p, 1, s, font, assets, attr);
        })
        .join("\n      ");

      const step2Engrave = placements
        .map((p) => renderPlacementEngravingMarkup(p, 2, s, font, assets, ""))
        .join("\n      ");

      const step2Cuts = placements
        .map((p) => renderPlacementCutMarkup(p, 2, s, ""))
        .join("\n      ");

      contentLayers = `
    <g fill="${strokeEngrave}" stroke="none" opacity="0.88">
      ${step1Engrave}
    </g>
    <g transform="${flipTransform}">
      <g fill="#0284c7" stroke="none" opacity="0.52">
        ${step2Engrave}
      </g>
      <g fill="none" stroke="#dc2626" stroke-width="0.55">
        ${step2Cuts}
      </g>
    </g>`;
    } else {
      const step = viewMode === "step2" ? 2 : 1;
      const labelD = buildSheetLabelPath(font, `P${sheet.sheetNumber} - F${step}`, s, workW);
      const labelEl = labelD ? `<path d="${labelD}"/>` : "";

      const engraveList = placements
        .map((p) => {
          const isSel = p.globalIndex === selectedGlobalIdx;
          const attr = `class="preview-ellipse-hit${isSel ? " is-selected" : ""}" data-global-index="${p.globalIndex}" data-step="${step}"`;
          return renderPlacementEngravingMarkup(p, step, s, font, assets, attr);
        })
        .join("\n      ");

      const cutsList = placements
        .map((p) => {
          const isSel = p.globalIndex === selectedGlobalIdx;
          const attr = `class="preview-ellipse-hit${isSel ? " is-selected" : ""}" data-global-index="${p.globalIndex}" data-step="${step}"`;
          return renderPlacementCutMarkup(p, step, s, attr);
        })
        .join("\n      ");

      const cutGroup =
        step === 2
          ? `<g fill="none" stroke="#dc2626" stroke-width="0.55">${cutsList}</g>`
          : `<g fill="none" stroke="rgba(180,35,24,0.45)" stroke-width="0.35" stroke-dasharray="2.4 1.8">${cutsList}</g>`;

      contentLayers = `
    ${cutGroup}
    <g fill="${strokeEngrave}" stroke="none">
      ${labelEl}
      ${engraveList}
    </g>`;
    }

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${fmt(totalW + 8)} ${fmt(totalH + 8)}" class="sheet-preview-svg">`,
      `  ${defs}`,
      `  ${boardRect}`,
      `  ${workZoneBox}`,
      `  <g transform="translate(${fmt(workX)},${fmt(workY)})">`,
      `    ${contentLayers}`,
      `    ${markersRaw}`,
      `  </g>`,
      `  ${originMarker}`,
      `</svg>`
    ].join("\n");
  }

  /**
   * Génère un aperçu 1:1 d'une seule ellipse (Recto ou Verso).
   */
  function generateSingleEllipsePreviewSvg(item, step, settings, renderTheme, opentypeOverride, assetsOverride) {
    const s = mergeSettings(settings);
    const font = getFont(opentypeOverride, assetsOverride);
    const assets = getAssets(assetsOverride);
    const rx = s.ellipseWidth / 2;
    const ry = s.ellipseHeight / 2;
    const isMdf = renderTheme !== "laser";
    const fillBg = isMdf ? "#d9a96d" : "#ffffff";
    const fillInk = isMdf ? "#3b2109" : "#000000";
    const strokeCut = step === 2 ? "#dc2626" : "#94a3b8";
    const dash = step === 2 ? "" : ' stroke-dasharray="2.5 1.8"';

    const face = buildEllipseFaceElements(item, step, s, font, assets);
    const pathsHtml = face.engravingPaths.map((d) => `<path d="${d}"/>`).join("");
    const groupsHtml = face.engravingGroups
      .map((g) => `<g transform="${g.transform}">${g.paths.map((d) => `<path d="${d}"/>`).join("")}</g>`)
      .join("");

    const pad = 4;
    const vbX = -rx - pad;
    const vbY = -ry - pad;
    const vbW = s.ellipseWidth + pad * 2;
    const vbH = s.ellipseHeight + pad * 2;

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vbX)} ${fmt(vbY)} ${fmt(vbW)} ${fmt(vbH)}" class="single-ellipse-svg">`,
      `  <ellipse cx="0" cy="0" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="${fillBg}" stroke="${strokeCut}" stroke-width="0.55"${dash}/>`,
      `  <g fill="${fillInk}" stroke="none">${pathsHtml}${groupsHtml}</g>`,
      `</svg>`
    ].join("\n");
  }

  return {
    DEFAULT_SETTINGS,
    mergeSettings,
    getFont,
    getMissingCharacters,
    buildCenteredTextPath,
    buildCurvedTextPath,
    buildEllipseFaceElements,
    computePlanLayout,
    generateSheetSvg,
    generatePreviewSvg,
    generateSingleEllipsePreviewSvg
  };
});
