(() => {
  'use strict';

  const DEFAULT_FONT = 'Clunsois';
  const STORAGE_KEY = 'ellipse_baptss_state_v1';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const BUILTIN_FONTS = [
    { name: 'Clunsois', source: 'Défaut / Locale' },
    { name: 'Zagoth', source: 'Proposée / Locale' },
    { name: 'Cinzel', source: 'Google Fonts' },
    { name: 'UnifrakturMaguntia', source: 'Google Fonts' },
    { name: 'MedievalSharp', source: 'Google Fonts' },
    { name: 'Audiowide', source: 'Google Fonts' },
    { name: 'Orbitron', source: 'Google Fonts' },
    { name: 'Rochester', source: 'Google Fonts' },
    { name: 'Playfair Display', source: 'Google Fonts' },
    { name: 'Inter', source: 'Google Fonts' },
  ];

  const PRESETS = {
    ahclam: {
      topText: 'La très méprisable .orde 2.26 demande aux très vénérables',
      topTextFont: DEFAULT_FONT,
      topTextSize: 22,
      bottomText: 'La permission d’usiner des visites pendant leur Baptême',
      bottomTextFont: DEFAULT_FONT,
      bottomTextSize: 22,
      centerTopLabel: '',
      centerTopLabelFont: DEFAULT_FONT,
      centerTopLabelSize: 20,
      centerLogoDataUrl: '',
      centerLogoWidth: 150,
      centerLogoHeight: 130,
      centerLogoOffsetY: -10,
      centerBottomLabel: 'Ahclam',
      centerBottomLabelFont: DEFAULT_FONT,
      centerBottomLabelSize: 26,
      ellipseColor: '#000000',
      ellipseBorderColor: '#000000',
      textColor: '#FFFFFF',
      slideBackgroundColor: '#FFFFFF',
      showDimensions: true,
      widthLabel: '15 alloufs',
      heightLabel: '10 alloufs',
      showMachiningNote: true,
      machiningNote:
        '.ai : Cette ellipse doit être usinée dans un bois d’une épaisseur d’1/6 allouf, peinte en noir, les buquages doivent être peints en blanc.',
      sortMode: 'first-number',
      layoutDirection: 'ccw-top-left',
      ringRadiusX: 292,
      ringRadiusY: 145,
      zidents: [
        { id: 'z1', buque: 'aLYONKa', famss: '8-139', buqueFont: 'Cinzel', famssFont: DEFAULT_FONT, buqueSize: 16, famssSize: 15 },
        { id: 'z2', buque: 'Goudale', famss: '11', buqueFont: 'Rochester', famssFont: DEFAULT_FONT, buqueSize: 19, famssSize: 15 },
        { id: 'z3', buque: 'TisTou', famss: '27', buqueFont: 'Orbitron', famssFont: DEFAULT_FONT, buqueSize: 15, famssSize: 15 },
        { id: 'z4', buque: 'VERMITH(Arts)', famss: '42', buqueFont: 'Cinzel', famssFont: DEFAULT_FONT, buqueSize: 15, famssSize: 15 },
        { id: 'z5', buque: 'Nidaveli', famss: '51', buqueFont: 'MedievalSharp', famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 15 },
        { id: 'z6', buque: 'Geox', famss: '56-159', buqueFont: 'Inter', famssFont: DEFAULT_FONT, buqueSize: 16, famssSize: 15 },
        { id: 'z7', buque: 'Teqpaf', famss: '58-10', buqueFont: 'UnifrakturMaguntia', famssFont: DEFAULT_FONT, buqueSize: 18, famssSize: 15 },
        { id: 'z8', buque: 'Arren', famss: '61', buqueFont: 'Playfair Display', famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 15 },
        { id: 'z9', buque: 'MASHPROW', famss: '109', buqueFont: 'Audiowide', famssFont: DEFAULT_FONT, buqueSize: 14, famssSize: 15 },
        { id: 'z10', buque: 'Pompl(Arts)', famss: '19-115', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 16, famssSize: 15 },
        { id: 'z11', buque: 'Echo', famss: '151', buqueFont: 'Audiowide', famssFont: DEFAULT_FONT, buqueSize: 16, famssSize: 16 },
      ],
    },
    elec: {
      topText: 'La très méprisable .orde 2.26 demande aux très vénérables',
      topTextFont: DEFAULT_FONT,
      topTextSize: 22,
      bottomText: 'La permission d’usiner la boquette ÉLEC pour leur Baptême',
      bottomTextFont: DEFAULT_FONT,
      bottomTextSize: 22,
      centerTopLabel: '',
      centerTopLabelFont: DEFAULT_FONT,
      centerTopLabelSize: 20,
      centerLogoDataUrl: '',
      centerLogoWidth: 160,
      centerLogoHeight: 130,
      centerLogoOffsetY: -12,
      centerBottomLabel: '›ÉLEC',
      centerBottomLabelFont: 'Audiowide',
      centerBottomLabelSize: 30,
      ellipseColor: '#000000',
      ellipseBorderColor: '#000000',
      textColor: '#FFFFFF',
      slideBackgroundColor: '#FFFFFF',
      showDimensions: true,
      widthLabel: '15 alloufs',
      heightLabel: '10 alloufs',
      showMachiningNote: true,
      machiningNote:
        '.ai : Cette ellipse doit être usinée dans un bois d’une épaisseur d’1/6 allouf, peint en noir, les buquages doivent être peints en blanc et rouge et l’éclair en jaune.',
      sortMode: 'first-number',
      layoutDirection: 'two-columns',
      ringRadiusX: 280,
      ringRadiusY: 120,
      zidents: [
        { id: 'e1', buque: 'Guethenoc', famss: '84', buqueFont: 'MedievalSharp', famssFont: DEFAULT_FONT, buqueSize: 18, famssSize: 18 },
        { id: 'e2', buque: 'Echo', famss: '151', buqueFont: 'Audiowide', famssFont: DEFAULT_FONT, buqueSize: 18, famssSize: 18 },
        { id: 'e3', buque: 'CHACH', famss: '164', buqueFont: 'Orbitron', famssFont: 'UnifrakturMaguntia', buqueSize: 16, famssSize: 18 },
      ],
    },
    ct: {
      topText: 'La très méprisable .orde 2.26 demande au',
      topTextFont: DEFAULT_FONT,
      topTextSize: 22,
      bottomText: 'La permission d’usiner les symboles Trad’s',
      bottomTextFont: DEFAULT_FONT,
      bottomTextSize: 22,
      centerTopLabel: 'TRÈS VÉNÉRABLE',
      centerTopLabelFont: DEFAULT_FONT,
      centerTopLabelSize: 22,
      centerLogoDataUrl: '',
      centerLogoWidth: 170,
      centerLogoHeight: 110,
      centerLogoOffsetY: 0,
      centerBottomLabel: 'du Tabagn’s de Clun’s',
      centerBottomLabelFont: DEFAULT_FONT,
      centerBottomLabelSize: 20,
      ellipseColor: '#000000',
      ellipseBorderColor: '#000000',
      textColor: '#D4AF37',
      slideBackgroundColor: '#FFFFFF',
      showDimensions: true,
      widthLabel: '15 alloufs',
      heightLabel: '10 alloufs',
      showMachiningNote: true,
      machiningNote:
        '.ai : Cette ellipse doit être usinée dans un bois d’une épaisseur d’1/6 allouf, peint en noir, les buquages doivent être peints en doré.',
      sortMode: 'first-number',
      layoutDirection: 'two-columns',
      ringRadiusX: 285,
      ringRadiusY: 125,
      zidents: [
        { id: 'c1', buque: 'Arion', famss: '26', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 17 },
        { id: 'c2', buque: 'Rapido', famss: '60', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 17 },
        { id: 'c3', buque: 'Calypso', famss: '119-34', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 17 },
        { id: 'c4', buque: 'Polar', famss: '135', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 17 },
        { id: 'c5', buque: 'Halifax', famss: '178', buqueFont: DEFAULT_FONT, famssFont: DEFAULT_FONT, buqueSize: 17, famssSize: 17 },
      ],
    },
  };

  let state = {
    config: structuredClone(PRESETS.ahclam),
    customFonts: [], // { name, source, dataUrl? }
  };
  let selectedZidentId = null;
  let activeGuides = { v: [], h: [] }; // { pos, type: 'align'|'sym'|'center' }

  const loadedGoogleFonts = new Set(BUILTIN_FONTS.filter((f) => f.source === 'Google Fonts').map((f) => f.name));

  // ---------- Helpers ----------
  function getAllFonts() {
    const map = new Map();
    for (const f of BUILTIN_FONTS) map.set(f.name, f);
    for (const f of state.customFonts) map.set(f.name, f);
    return Array.from(map.values());
  }

  function getFontFamilyStack(fontName) {
    if (!fontName || fontName === DEFAULT_FONT) {
      return `'Clunsois', 'Cinzel', 'Playfair Display', Georgia, serif`;
    }
    if (fontName === 'Zagoth') {
      return `'Zagoth', 'Zagots', 'Cinzel', Georgia, serif`;
    }
    return `'${fontName}', 'Clunsois', 'Cinzel', sans-serif`;
  }

  function loadGoogleFont(fontName) {
    const clean = fontName.trim();
    if (!clean) return;
    if (!loadedGoogleFonts.has(clean)) {
      loadedGoogleFonts.add(clean);
      const familyParam = encodeURIComponent(clean).replace(/%20/g, '+');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;600;700&display=swap`;
      document.head.appendChild(link);
    }
    if (!state.customFonts.some((f) => f.name === clean) && !BUILTIN_FONTS.some((f) => f.name === clean)) {
      state.customFonts.push({ name: clean, source: 'Google Fonts' });
    }
  }

  function parseFamssNumbers(famss) {
    const matches = String(famss || '').match(/\d+/g);
    return matches ? matches.map((n) => parseInt(n, 10)) : [];
  }

  function getSortedZidents() {
    const { zidents, sortMode } = state.config;
    if (sortMode === 'manual') return zidents;

    return [...zidents].sort((a, b) => {
      const numsA = parseFamssNumbers(a.famss);
      const numsB = parseFamssNumbers(b.famss);
      const keyA = numsA.length ? (sortMode === 'first-number' ? numsA[0] : numsA[numsA.length - 1]) : Infinity;
      const keyB = numsB.length ? (sortMode === 'first-number' ? numsB[0] : numsB[numsB.length - 1]) : Infinity;
      if (keyA !== keyB) return keyA - keyB;

      const len = Math.max(numsA.length, numsB.length);
      for (let i = 0; i < len; i++) {
        const va = numsA[i] ?? -1;
        const vb = numsB[i] ?? -1;
        if (va !== vb) return va - vb;
      }
      return (a.buque || '').localeCompare(b.buque || '', 'fr');
    });
  }

  function computeZidentPositions(zidents) {
    const count = zidents.length;
    if (count === 0) return [];
    const cx = 640;
    const cy = 350;
    const rx = Number(state.config.ringRadiusX) || 290;
    const ry = Number(state.config.ringRadiusY) || 140;
    const dir = state.config.layoutDirection;

    if (dir === 'bottom-only') {
      const rows = count <= 4 ? 1 : count <= 10 ? 2 : 3;
      const results = [];
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        const remaining = count - idx;
        const rowsLeft = rows - r;
        const perRow = Math.ceil(remaining / rowsLeft);
        const y = rows === 1 ? cy + 132 : cy + 92 + (r / (rows - 1)) * 78;
        // Max half-width inside ellipse at this y (ellipse rx=405, ry=270)
        const dy = (y - cy) / 270;
        const maxHalfW = Math.min(rx, 340 * Math.sqrt(Math.max(0.18, 1 - dy * dy)));

        for (let c = 0; c < perRow; c++) {
          const z = zidents[idx++];
          const t = perRow === 1 ? 0 : (c / (perRow - 1)) * 2 - 1; // -1..1
          const x = cx + t * maxHalfW * 0.85;
          // Slight gentle arc on single/bottom rows
          const arcLift = (1 - t * t) * 14;
          results.push({
            x: x + (z.offsetX || 0),
            y: y + arcLift + (z.offsetY || 0),
          });
        }
      }
      return results;
    }

    if (dir === 'two-columns') {
      const leftCount = Math.ceil(count / 2);
      const rightCount = count - leftCount;
      return zidents.map((z, i) => {
        const isLeft = i < leftCount;
        const colIdx = isLeft ? i : i - leftCount;
        const colTotal = isLeft ? leftCount : rightCount;
        const t = colTotal <= 1 ? 0.5 : colIdx / (colTotal - 1);
        const y = cy - ry * 0.75 + t * (ry * 1.5);
        const dyNorm = (y - cy) / (ry || 1);
        const xCurve = Math.sqrt(Math.max(0.3, 1 - dyNorm * dyNorm * 0.45));
        const x = isLeft ? cx - rx * 0.88 * xCurve : cx + rx * 0.88 * xCurve;
        return {
          x: x + (z.offsetX || 0),
          y: y + (z.offsetY || 0),
        };
      });
    }

    const startAngle = (-142 * Math.PI) / 180;
    const stepSign = dir === 'ccw-top-left' ? -1 : 1;
    return zidents.map((z, idx) => {
      const angle = startAngle + stepSign * (idx / count) * Math.PI * 2;
      return {
        x: cx + Math.cos(angle) * rx + (z.offsetX || 0),
        y: cy + Math.sin(angle) * ry + (z.offsetY || 0),
      };
    });
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors if very large logos are uploaded
    }
  }

  async function restoreCustomFontFaces() {
    for (const f of state.customFonts) {
      if (f.source === 'Google Fonts') {
        loadGoogleFont(f.name);
      } else if (f.dataUrl) {
        try {
          const ff = new FontFace(f.name, `url(${f.dataUrl})`);
          await ff.load();
          document.fonts.add(ff);
        } catch {
          // Ignore invalid font data
        }
      }
    }
  }

  function loadInitialState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.config && Array.isArray(parsed.config.zidents)) {
          state = parsed;
          return;
        }
      }
    } catch {
      // Fallback to preset
    }
  }

  // ---------- SVG Rendering ----------
  function el(tag, attrs = {}, textContent) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v !== undefined && v !== null) {
        node.setAttribute(k, String(v));
      }
    }
    if (textContent !== undefined) {
      node.textContent = textContent;
    }
    return node;
  }

  function renderSvg() {
    const svg = document.getElementById('ellipseSvg');
    svg.innerHTML = '';

    const cfg = state.config;
    const cx = 640;
    const cy = 350;
    const rx = 405;
    const ry = 270; // 15:10 ratio (405 / 270 = 1.5)

    // <defs> with custom @font-face + curved text paths
    const defs = el('defs');
    const styleEl = el('style');
    const fontFaceRules = state.customFonts
      .filter((f) => f.dataUrl)
      .map((f) => `@font-face { font-family: '${f.name}'; src: url('${f.dataUrl}'); }`)
      .join('\n');
    styleEl.textContent = fontFaceRules;
    defs.appendChild(styleEl);

    // Top arc (left to right over the top)
    const topArcRx = 365;
    const topArcRy = 228;
    defs.appendChild(
      el('path', {
        id: 'topArcPath',
        d: `M ${cx - topArcRx},${cy} A ${topArcRx},${topArcRy} 0 0,1 ${cx + topArcRx},${cy}`,
        fill: 'none',
      })
    );

    // Bottom arc (left to right under the bottom)
    const botArcRx = 372;
    const botArcRy = 236;
    defs.appendChild(
      el('path', {
        id: 'bottomArcPath',
        d: `M ${cx - botArcRx},${cy} A ${botArcRx},${botArcRy} 0 0,0 ${cx + botArcRx},${cy}`,
        fill: 'none',
      })
    );

    // Ellipse background gradient (linear or radial, smooth or hard-split bands)
    if (cfg.ellipseUseGradient) {
      const stops = getEffectiveGradientStops(cfg);
      const isRadial = cfg.ellipseGradientType === 'radial';
      let gradEl;
      if (isRadial) {
        gradEl = el('radialGradient', {
          id: 'ellipseGrad',
          cx: '50%',
          cy: '50%',
          r: '55%',
        });
      } else {
        const angle = ((Number(cfg.ellipseGradientAngle ?? 135) - 90) * Math.PI) / 180;
        const x1 = 50 - Math.cos(angle) * 50;
        const y1 = 50 - Math.sin(angle) * 50;
        const x2 = 50 + Math.cos(angle) * 50;
        const y2 = 50 + Math.sin(angle) * 50;
        gradEl = el('linearGradient', {
          id: 'ellipseGrad',
          x1: `${x1.toFixed(1)}%`,
          y1: `${y1.toFixed(1)}%`,
          x2: `${x2.toFixed(1)}%`,
          y2: `${y2.toFixed(1)}%`,
        });
      }
      for (const s of stops) {
        gradEl.appendChild(el('stop', { offset: `${s.offset}%`, 'stop-color': s.color }));
      }
      defs.appendChild(gradEl);
    }

    // Per-zident gradients
    const sortedForGrads = getSortedZidents();
    sortedForGrads.forEach((z) => {
      if (z.useGradient) {
        const lg = el('linearGradient', {
          id: `zgrad_${z.id}`,
          x1: '0%',
          y1: '0%',
          x2: '100%',
          y2: '0%',
        });
        lg.appendChild(el('stop', { offset: '0%', 'stop-color': z.buqueColor || z.color || cfg.textColor || '#FFFFFF' }));
        lg.appendChild(el('stop', { offset: '100%', 'stop-color': z.famssColor || z.gradColor2 || '#EAB308' }));
        defs.appendChild(lg);
      }
    });

    svg.appendChild(defs);

    // Slide background
    svg.appendChild(
      el('rect', {
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        fill: cfg.slideBackgroundColor || '#FFFFFF',
      })
    );

    // Main Ellipse
    svg.appendChild(
      el('ellipse', {
        cx,
        cy,
        rx,
        ry,
        fill: cfg.ellipseUseGradient ? 'url(#ellipseGrad)' : cfg.ellipseColor || '#000000',
        stroke: cfg.ellipseBorderColor || '#000000',
        'stroke-width': 2,
        class: 'svg-clickable',
        'data-edit-tab': 'style',
        'data-edit-field': 'ellipseColor',
      })
    );

    // Dimensions (Alloufs)
    if (cfg.showDimensions) {
      const dimColor = '#1E293B';
      // Horizontal dimension line above ellipse
      const hY = cy - ry - 26;
      svg.appendChild(el('line', { x1: cx - rx, y1: hY, x2: cx + rx, y2: hY, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(el('line', { x1: cx - rx, y1: hY - 7, x2: cx - rx, y2: hY + 7, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(el('line', { x1: cx + rx, y1: hY - 7, x2: cx + rx, y2: hY + 7, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(
        el(
          'text',
          {
            x: cx,
            y: hY - 12,
            fill: dimColor,
            'text-anchor': 'middle',
            'font-size': 18,
            'font-family': getFontFamilyStack(DEFAULT_FONT),
            class: 'svg-clickable',
            'data-edit-tab': 'style',
            'data-edit-field': 'widthLabel',
          },
          cfg.widthLabel || '15 alloufs'
        )
      );

      // Vertical dimension line left of ellipse
      const vX = cx - rx - 40;
      svg.appendChild(el('line', { x1: vX, y1: cy - ry, x2: vX, y2: cy + ry, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(el('line', { x1: vX - 7, y1: cy - ry, x2: vX + 7, y2: cy - ry, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(el('line', { x1: vX - 7, y1: cy + ry, x2: vX + 7, y2: cy + ry, stroke: dimColor, 'stroke-width': 2 }));
      svg.appendChild(
        el(
          'text',
          {
            x: vX - 16,
            y: cy,
            fill: dimColor,
            'text-anchor': 'middle',
            'font-size': 18,
            'font-family': getFontFamilyStack(DEFAULT_FONT),
            transform: `rotate(-90 ${vX - 16} ${cy})`,
            class: 'svg-clickable',
            'data-edit-tab': 'style',
            'data-edit-field': 'heightLabel',
          },
          cfg.heightLabel || '10 alloufs'
        )
      );
    }

    // Machining note (.ai)
    if (cfg.showMachiningNote && cfg.machiningNote) {
      const words = cfg.machiningNote.trim().split(/\s+/);
      const lines = [];
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).trim().length > 92) {
          lines.push(current.trim());
          current = w;
        } else {
          current = (current + ' ' + w).trim();
        }
      }
      if (current) lines.push(current);

      const noteY = cy + ry + 34;
      lines.forEach((line, i) => {
        svg.appendChild(
          el(
            'text',
            {
              x: cx,
              y: noteY + i * 22,
              fill: '#1E293B',
              'text-anchor': 'middle',
              'font-size': 16,
              'font-family': getFontFamilyStack(DEFAULT_FONT),
              class: 'svg-clickable',
              'data-edit-tab': 'style',
              'data-edit-field': 'machiningNote',
            },
            line
          )
        );
      });
    }

    // Top curved text
    if (cfg.topText) {
      const topTextEl = el('text', {
        fill: cfg.topTextColor || cfg.textColor || '#FFFFFF',
        'font-size': cfg.topTextSize || 22,
        'font-family': getFontFamilyStack(cfg.topTextFont),
        class: 'svg-clickable',
        'data-edit-tab': 'texts',
        'data-edit-field': 'topText',
      });
      const tp = el(
        'textPath',
        {
          href: '#topArcPath',
          startOffset: '50%',
          'text-anchor': 'middle',
        },
        cfg.topText
      );
      topTextEl.appendChild(tp);
      svg.appendChild(topTextEl);
    }

    // Bottom curved text
    if (cfg.bottomText) {
      const botTextEl = el('text', {
        fill: cfg.bottomTextColor || cfg.textColor || '#FFFFFF',
        'font-size': cfg.bottomTextSize || 22,
        'font-family': getFontFamilyStack(cfg.bottomTextFont),
        class: 'svg-clickable',
        'data-edit-tab': 'texts',
        'data-edit-field': 'bottomText',
      });
      const tp = el(
        'textPath',
        {
          href: '#bottomArcPath',
          startOffset: '50%',
          'text-anchor': 'middle',
        },
        cfg.bottomText
      );
      botTextEl.appendChild(tp);
      svg.appendChild(botTextEl);
    }

    // Center content
    const logoW = Number(cfg.centerLogoWidth) || 150;
    const logoH = Number(cfg.centerLogoHeight) || 130;
    const logoY = cy - logoH / 2 + (Number(cfg.centerLogoOffsetY) || 0);

    if (cfg.centerTopLabel) {
      svg.appendChild(
        el(
          'text',
          {
            x: cx,
            y: logoY - 14,
            fill: cfg.textColor || '#FFFFFF',
            'text-anchor': 'middle',
            'font-size': cfg.centerTopLabelSize || 20,
            'font-family': getFontFamilyStack(cfg.centerTopLabelFont),
            'font-weight': '600',
            class: 'svg-clickable',
            'data-edit-tab': 'texts',
            'data-edit-field': 'centerTopLabel',
          },
          cfg.centerTopLabel
        )
      );
    }

    if (cfg.centerLogoDataUrl) {
      svg.appendChild(
        el('image', {
          href: cfg.centerLogoDataUrl,
          x: cx - logoW / 2,
          y: logoY,
          width: logoW,
          height: logoH,
          preserveAspectRatio: 'xMidYMid meet',
          class: 'svg-clickable',
          'data-edit-tab': 'texts',
          'data-edit-field': 'btnUploadCenterLogo',
        })
      );
    } else {
      const ph = el('g', {
        class: 'svg-clickable export-hidden',
        'data-edit-tab': 'texts',
        'data-edit-field': 'btnUploadCenterLogo',
      });
      ph.appendChild(
        el('rect', {
          x: cx - 72,
          y: cy - 52,
          width: 144,
          height: 70,
          rx: 8,
          fill: 'rgba(255,255,255,0.05)',
          stroke: 'rgba(255,255,255,0.28)',
          'stroke-dasharray': '5 4',
        })
      );
      ph.appendChild(
        el(
          'text',
          {
            x: cx,
            y: cy - 13,
            fill: 'rgba(255,255,255,0.6)',
            'text-anchor': 'middle',
            'font-size': 12,
            'font-family': 'Inter, sans-serif',
          },
          '+ Logo central'
        )
      );
      svg.appendChild(ph);
    }

    if (cfg.centerBottomLabel) {
      const labelY = cfg.centerLogoDataUrl ? logoY + logoH + 26 : cy + 38;
      svg.appendChild(
        el(
          'text',
          {
            x: cx,
            y: labelY,
            fill: cfg.textColor || '#FFFFFF',
            'text-anchor': 'middle',
            'font-size': cfg.centerBottomLabelSize || 24,
            'font-family': getFontFamilyStack(cfg.centerBottomLabelFont),
            'font-weight': '600',
            class: 'svg-clickable',
            'data-edit-tab': 'texts',
            'data-edit-field': 'centerBottomLabel',
          },
          cfg.centerBottomLabel
        )
      );
    }

    // Zidents
    const sorted = getSortedZidents();
    const positions = computeZidentPositions(sorted);

    sorted.forEach((z, idx) => {
      const pos = positions[idx];
      const g = el('g', {
        class: 'zident-draggable',
        'data-zident-id': z.id,
        transform: `translate(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`,
      });

      const baseFill = z.color || cfg.textColor || '#FFFFFF';
      const buqueFill = z.useGradient ? `url(#zgrad_${z.id})` : z.buqueColor || baseFill;
      const famssFill = z.useGradient ? `url(#zgrad_${z.id})` : z.famssColor || baseFill;
      const buqueSize = Number(z.buqueSize) || 16;
      const famssSize = Number(z.famssSize) || 15;
      const hasLogo = Boolean(z.famssLogoDataUrl);

      if (hasLogo) {
        const iconSize = Number(z.famssLogoSize) || 26;
        g.appendChild(
          el(
            'text',
            {
              x: -6,
              y: 5,
              fill: buqueFill,
              'text-anchor': 'end',
              'font-size': buqueSize,
              'font-family': getFontFamilyStack(z.buqueFont),
            },
            z.buque
          )
        );
        g.appendChild(
          el('image', {
            href: z.famssLogoDataUrl,
            x: 2,
            y: -iconSize / 2,
            width: iconSize,
            height: iconSize,
            preserveAspectRatio: 'xMidYMid meet',
          })
        );
      } else {
        const textNode = el('text', {
          x: 0,
          y: 5,
          fill: baseFill,
          'text-anchor': 'middle',
        });

        textNode.appendChild(
          el(
            'tspan',
            {
              fill: buqueFill,
              'font-size': buqueSize,
              'font-family': getFontFamilyStack(z.buqueFont),
            },
            z.buque
          )
        );

        if (z.famss) {
          textNode.appendChild(
            el(
              'tspan',
              {
                fill: famssFill,
                'font-size': famssSize,
                'font-family': getFontFamilyStack(z.famssFont),
              },
              ` ${z.famss}`
            )
          );
        }

        g.appendChild(textNode);
      }

      svg.appendChild(g);
    });

    // Alignment & symmetry guides (only visible while dragging, hidden in exports)
    if (activeGuides.v.length || activeGuides.h.length) {
      const guidesGroup = el('g', { class: 'export-hidden', 'pointer-events': 'none' });
      for (const g of activeGuides.v) {
        guidesGroup.appendChild(
          el('line', {
            x1: g.pos,
            y1: cy - ry,
            x2: g.pos,
            y2: cy + ry,
            stroke: g.type === 'sym' ? '#FACC15' : '#38BDF8',
            'stroke-width': 1.25,
            'stroke-dasharray': '5 4',
          })
        );
      }
      for (const g of activeGuides.h) {
        guidesGroup.appendChild(
          el('line', {
            x1: cx - rx,
            y1: g.pos,
            x2: cx + rx,
            y2: g.pos,
            stroke: g.type === 'sym' ? '#FACC15' : '#38BDF8',
            'stroke-width': 1.25,
            'stroke-dasharray': '5 4',
          })
        );
      }
      svg.appendChild(guidesGroup);
    }
  }

  // ---------- Drag & Drop + Alignment/Symmetry Guides + Click-to-Edit ----------
  function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === `panel-${tabName}`);
    });
  }

  function focusEditorField(tabName, fieldId) {
    switchTab(tabName);
    const elField = document.getElementById(fieldId);
    if (!elField) return;
    elField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    elField.focus();
    elField.classList.remove('field-highlight');
    void elField.offsetWidth;
    elField.classList.add('field-highlight');
    setTimeout(() => elField.classList.remove('field-highlight'), 850);
  }

  function setupSvgDrag() {
    const svg = document.getElementById('ellipseSvg');
    let dragging = null;

    function clientToSvg(clientX, clientY) {
      const rect = svg.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 1280,
        y: ((clientY - rect.top) / rect.height) * 720,
      };
    }

    svg.addEventListener('pointerdown', (e) => {
      const target = e.target.closest('.zident-draggable');
      if (target) {
        const id = target.getAttribute('data-zident-id');
        const zident = state.config.zidents.find((z) => z.id === id);
        if (!zident) return;

        const pt = clientToSvg(e.clientX, e.clientY);
        selectedZidentId = zident.id;
        switchTab('zidents');
        highlightSelectedZidentCard();

        const sorted = getSortedZidents();
        const positions = computeZidentPositions(sorted);
        const myIdx = sorted.findIndex((z) => z.id === id);
        const myPos = positions[myIdx];
        const otherPositions = positions.filter((_, i) => i !== myIdx);

        dragging = {
          zident,
          startX: pt.x,
          startY: pt.y,
          baseX: myPos.x - (zident.offsetX || 0),
          baseY: myPos.y - (zident.offsetY || 0),
          origOffsetX: zident.offsetX || 0,
          origOffsetY: zident.offsetY || 0,
          otherPositions,
          moved: false,
        };
        svg.setPointerCapture(e.pointerId);
        return;
      }

      const clickable = e.target.closest('.svg-clickable');
      if (clickable) {
        const tab = clickable.getAttribute('data-edit-tab');
        const field = clickable.getAttribute('data-edit-field');
        if (tab && field) {
          focusEditorField(tab, field);
        }
      }
    });

    svg.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const pt = clientToSvg(e.clientX, e.clientY);
      const dx = pt.x - dragging.startX;
      const dy = pt.y - dragging.startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragging.moved = true;

      let targetX = dragging.baseX + dragging.origOffsetX + dx;
      let targetY = dragging.baseY + dragging.origOffsetY + dy;

      activeGuides = { v: [], h: [] };
      const snapEnabled = document.getElementById('enableSnapGuides')?.checked !== false;

      if (snapEnabled) {
        const SNAP = 7;
        const cx = 640;
        const cy = 350;

        const vCandidates = [{ pos: cx, type: 'center' }];
        const hCandidates = [{ pos: cy, type: 'center' }];
        for (const op of dragging.otherPositions) {
          vCandidates.push({ pos: op.x, type: 'align' });
          vCandidates.push({ pos: cx + (cx - op.x), type: 'sym' });
          hCandidates.push({ pos: op.y, type: 'align' });
          hCandidates.push({ pos: cy + (cy - op.y), type: 'sym' });
        }

        let bestV = null;
        let bestVDiff = SNAP + 1;
        for (const c of vCandidates) {
          const diff = Math.abs(targetX - c.pos);
          if (diff < bestVDiff) {
            bestVDiff = diff;
            bestV = c;
          }
        }
        if (bestV) {
          targetX = bestV.pos;
          activeGuides.v.push(bestV);
        }

        let bestH = null;
        let bestHDiff = SNAP + 1;
        for (const c of hCandidates) {
          const diff = Math.abs(targetY - c.pos);
          if (diff < bestHDiff) {
            bestHDiff = diff;
            bestH = c;
          }
        }
        if (bestH) {
          targetY = bestH.pos;
          activeGuides.h.push(bestH);
        }
      }

      dragging.zident.offsetX = Math.round(targetX - dragging.baseX);
      dragging.zident.offsetY = Math.round(targetY - dragging.baseY);
      renderSvg();
    });

    svg.addEventListener('pointerup', () => {
      if (dragging) {
        const wasClick = !dragging.moved;
        const zId = dragging.zident.id;
        dragging = null;
        activeGuides = { v: [], h: [] };
        saveState();
        renderSvg();
        if (wasClick) {
          const card = document.querySelector(`.zident-card[data-zident-id="${zId}"] input[type="text"]`);
          if (card) card.focus();
        }
      }
    });
  }

  // ---------- UI Rendering & Bindings ----------
  function populateFontSelect(selectEl, selectedValue) {
    const fonts = getAllFonts();
    selectEl.innerHTML = '';
    for (const f of fonts) {
      const opt = document.createElement('option');
      opt.value = f.name;
      opt.textContent = f.name;
      if (f.name === selectedValue) opt.selected = true;
      selectEl.appendChild(opt);
    }
  }

  function refreshAllFontSelects() {
    document.querySelectorAll('select.font-select').forEach((sel) => {
      const targetKey = sel.id;
      if (targetKey && state.config[targetKey] !== undefined) {
        populateFontSelect(sel, state.config[targetKey]);
      }
    });
    renderFontsList();
  }

  function renderFontsList() {
    const list = document.getElementById('fontsList');
    const fonts = getAllFonts();
    document.getElementById('fontCount').textContent = String(fonts.length);
    list.innerHTML = '';
    for (const f of fonts) {
      const li = document.createElement('li');
      const nameSpan = document.createElement('span');
      nameSpan.textContent = f.name;
      nameSpan.style.fontFamily = getFontFamilyStack(f.name);
      const tag = document.createElement('span');
      tag.className = 'font-tag';
      tag.textContent = f.source;
      li.append(nameSpan, tag);
      list.appendChild(li);
    }
  }

  function renderZidentsList() {
    const container = document.getElementById('zidentsList');
    const zidents = getSortedZidents();
    document.getElementById('zidentCount').textContent = String(zidents.length);
    container.innerHTML = '';

    zidents.forEach((z, idx) => {
      const card = document.createElement('div');
      card.className = 'zident-card' + (z.id === selectedZidentId ? ' selected' : '');
      card.dataset.zidentId = z.id;

      const top = document.createElement('div');
      top.className = 'zident-card-top';

      const badge = document.createElement('span');
      badge.className = 'zident-badge';
      badge.textContent = `#${idx + 1} — ${z.buque || 'Sans buque'}`;

      const controls = document.createElement('div');
      controls.className = 'zident-controls';

      const upBtn = document.createElement('button');
      upBtn.className = 'icon-btn';
      upBtn.textContent = '↑';
      upBtn.title = 'Monter';
      upBtn.disabled = idx === 0;
      upBtn.onclick = () => moveZident(z.id, -1);

      const downBtn = document.createElement('button');
      downBtn.className = 'icon-btn';
      downBtn.textContent = '↓';
      downBtn.title = 'Descendre';
      downBtn.disabled = idx === zidents.length - 1;
      downBtn.onclick = () => moveZident(z.id, 1);

      controls.append(upBtn, downBtn);

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn btn-danger';
      delBtn.textContent = 'Suppr.';
      delBtn.onclick = () => {
        state.config.zidents = state.config.zidents.filter((item) => item.id !== z.id);
        saveState();
        renderZidentsList();
        renderSvg();
      };
      controls.appendChild(delBtn);

      top.append(badge, controls);
      card.appendChild(top);

      // Buque + Fam'ss inputs
      const row1 = document.createElement('div');
      row1.className = 'grid-2';

      const buqueField = document.createElement('label');
      buqueField.className = 'field';
      buqueField.innerHTML = '<span>Buque (surnom)</span>';
      const buqueInput = document.createElement('input');
      buqueInput.type = 'text';
      buqueInput.value = z.buque;
      buqueInput.oninput = () => {
        z.buque = buqueInput.value;
        badge.textContent = `#${idx + 1} — ${z.buque || 'Sans buque'}`;
        saveState();
        renderSvg();
      };
      buqueField.appendChild(buqueInput);

      const famssField = document.createElement('label');
      famssField.className = 'field';
      famssField.innerHTML = "<span>Fam'ss (ex: 151, 15-106)</span>";
      const famssInput = document.createElement('input');
      famssInput.type = 'text';
      famssInput.value = z.famss;
      famssInput.oninput = () => {
        z.famss = famssInput.value;
        saveState();
        renderSvg();
      };
      famssInput.onchange = () => {
        if (state.config.sortMode !== 'manual') {
          renderZidentsList();
        }
      };
      famssField.appendChild(famssInput);

      row1.append(buqueField, famssField);
      card.appendChild(row1);

      // Fonts + sizes
      const row2 = document.createElement('div');
      row2.className = 'grid-2';

      const bFontField = document.createElement('label');
      bFontField.className = 'field';
      bFontField.innerHTML = '<span>Police de buque</span>';
      const bFontSel = document.createElement('select');
      populateFontSelect(bFontSel, z.buqueFont);
      bFontSel.onchange = () => {
        z.buqueFont = bFontSel.value;
        saveState();
        renderSvg();
      };
      bFontField.appendChild(bFontSel);

      const fFontField = document.createElement('label');
      fFontField.className = 'field';
      fFontField.innerHTML = "<span>Police de fam'ss</span>";
      const fFontSel = document.createElement('select');
      populateFontSelect(fFontSel, z.famssFont);
      fFontSel.onchange = () => {
        z.famssFont = fFontSel.value;
        saveState();
        renderSvg();
      };
      fFontField.appendChild(fFontSel);

      row2.append(bFontField, fFontField);
      card.appendChild(row2);

      // Sizes + Logo de fam'ss
      const row3 = document.createElement('div');
      row3.className = 'grid-2';

      const bSizeField = document.createElement('label');
      bSizeField.className = 'field';
      bSizeField.innerHTML = `<span>Taille buque (${z.buqueSize || 16})</span>`;
      const bSizeRange = document.createElement('input');
      bSizeRange.type = 'range';
      bSizeRange.min = '10';
      bSizeRange.max = '30';
      bSizeRange.value = String(z.buqueSize || 16);
      bSizeRange.oninput = () => {
        z.buqueSize = Number(bSizeRange.value);
        bSizeField.querySelector('span').textContent = `Taille buque (${z.buqueSize})`;
        saveState();
        renderSvg();
      };
      bSizeField.appendChild(bSizeRange);

      const fSizeField = document.createElement('label');
      fSizeField.className = 'field';
      fSizeField.innerHTML = `<span>Taille fam'ss (${z.famssSize || 15})</span>`;
      const fSizeRange = document.createElement('input');
      fSizeRange.type = 'range';
      fSizeRange.min = '10';
      fSizeRange.max = '30';
      fSizeRange.value = String(z.famssSize || 15);
      fSizeRange.oninput = () => {
        z.famssSize = Number(fSizeRange.value);
        fSizeField.querySelector('span').textContent = `Taille fam'ss (${z.famssSize})`;
        saveState();
        renderSvg();
      };
      fSizeField.appendChild(fSizeRange);

      row3.append(bSizeField, fSizeField);
      card.appendChild(row3);

      // Logo de fam'ss upload
      const logoRow = document.createElement('div');
      logoRow.className = 'famss-logo-row';
      const logoBtn = document.createElement('button');
      logoBtn.className = 'btn btn-secondary btn-sm';
      logoBtn.textContent = z.famssLogoDataUrl ? "Changer logo fam'ss" : "Logo de fam'ss (image)";
      const fileInp = document.createElement('input');
      fileInp.type = 'file';
      fileInp.accept = 'image/*';
      fileInp.hidden = true;
      logoBtn.onclick = () => fileInp.click();
      fileInp.onchange = () => {
        const file = fileInp.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          z.famssLogoDataUrl = String(reader.result);
          saveState();
          renderZidentsList();
          renderSvg();
        };
        reader.readAsDataURL(file);
      };
      logoRow.append(logoBtn, fileInp);

      if (z.famssLogoDataUrl) {
        const img = document.createElement('img');
        img.className = 'famss-thumb';
        img.src = z.famssLogoDataUrl;
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-ghost btn-sm';
        clearBtn.textContent = 'Retirer logo';
        clearBtn.onclick = () => {
          delete z.famssLogoDataUrl;
          saveState();
          renderZidentsList();
          renderSvg();
        };
        logoRow.append(img, clearBtn);
      }

      // Bicolore (buqueColor + famssColor) + gradient toggle
      const buqueColorInp = document.createElement('input');
      buqueColorInp.type = 'color';
      buqueColorInp.value = z.buqueColor || z.color || state.config.textColor || '#FFFFFF';
      buqueColorInp.title = 'Couleur de la buque';
      buqueColorInp.style.width = '32px';
      buqueColorInp.style.height = '26px';
      buqueColorInp.oninput = () => {
        z.buqueColor = buqueColorInp.value;
        saveState();
        renderSvg();
      };

      const famssColorInp = document.createElement('input');
      famssColorInp.type = 'color';
      famssColorInp.value = z.famssColor || z.gradColor2 || z.color || state.config.textColor || '#FFFFFF';
      famssColorInp.title = "Couleur de la fam'ss (bicolore) ou fin de dégradé";
      famssColorInp.style.width = '32px';
      famssColorInp.style.height = '26px';
      famssColorInp.oninput = () => {
        z.famssColor = famssColorInp.value;
        saveState();
        renderSvg();
      };

      const gradToggle = document.createElement('label');
      gradToggle.className = 'checkbox-field';
      gradToggle.style.fontSize = '11.5px';
      const gradCb = document.createElement('input');
      gradCb.type = 'checkbox';
      gradCb.checked = Boolean(z.useGradient);
      gradCb.onchange = () => {
        z.useGradient = gradCb.checked;
        saveState();
        renderSvg();
      };
      const gradLbl = document.createElement('span');
      gradLbl.textContent = 'Dégradé';
      gradToggle.append(gradCb, gradLbl);

      logoRow.append(buqueColorInp, famssColorInp, gradToggle);

      if (z.color || z.buqueColor || z.famssColor || z.useGradient) {
        const resetColorBtn = document.createElement('button');
        resetColorBtn.className = 'btn btn-ghost btn-sm';
        resetColorBtn.textContent = 'Couleur auto';
        resetColorBtn.onclick = () => {
          delete z.color;
          delete z.buqueColor;
          delete z.famssColor;
          delete z.gradColor2;
          delete z.useGradient;
          saveState();
          renderZidentsList();
          renderSvg();
        };
        logoRow.appendChild(resetColorBtn);
      }

      card.appendChild(logoRow);
      container.appendChild(card);
    });
  }

  function highlightSelectedZidentCard() {
    document.querySelectorAll('.zident-card').forEach((card) => {
      const isSelected = card.dataset.zidentId === selectedZidentId;
      card.classList.toggle('selected', isSelected);
      if (isSelected) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function parseBulkZidents(rawText) {
    return rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(.+?)\s+(\d+(?:-\d+)*)$/);
        const buque = match ? match[1].trim() : line;
        const famss = match ? match[2].trim() : '';
        return {
          id: 'z_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
          buque,
          famss,
          buqueFont: DEFAULT_FONT,
          famssFont: DEFAULT_FONT,
          buqueSize: 16,
          famssSize: 15,
        };
      });
  }

  function moveZident(id, delta) {
    if (state.config.sortMode !== 'manual') {
      state.config.zidents = getSortedZidents();
      state.config.sortMode = 'manual';
      const sortSelect = document.getElementById('sortMode');
      if (sortSelect) sortSelect.value = 'manual';
    }
    const idx = state.config.zidents.findIndex((z) => z.id === id);
    if (idx < 0) return;
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= state.config.zidents.length) return;
    const arr = state.config.zidents;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    saveState();
    renderZidentsList();
    renderSvg();
  }

  function syncFormFromConfig() {
    const cfg = state.config;
    refreshAllFontSelects();

    const valueIds = [
      'topText',
      'topTextFont',
      'topTextSize',
      'bottomText',
      'bottomTextFont',
      'bottomTextSize',
      'centerTopLabel',
      'centerTopLabelFont',
      'centerTopLabelSize',
      'centerLogoWidth',
      'centerLogoHeight',
      'centerLogoOffsetY',
      'centerBottomLabel',
      'centerBottomLabelFont',
      'centerBottomLabelSize',
      'ellipseColor',
      'ellipseGradientType',
      'ellipseGradientMode',
      'ellipseGradientAngle',
      'ellipseBorderColor',
      'textColor',
      'topTextColor',
      'bottomTextColor',
      'slideBackgroundColor',
      'widthLabel',
      'heightLabel',
      'machiningNote',
      'sortMode',
      'layoutDirection',
      'ringRadiusX',
      'ringRadiusY',
    ];

    for (const id of valueIds) {
      const node = document.getElementById(id);
      if (node && cfg[id] !== undefined) {
        node.value = String(cfg[id]);
      }
    }

    document.getElementById('ellipseUseGradient').checked = Boolean(cfg.ellipseUseGradient);
    document.getElementById('ellipseGradientType').value = cfg.ellipseGradientType || 'linear';
    document.getElementById('ellipseGradientMode').value = cfg.ellipseGradientMode || 'smooth';
    document.getElementById('ellipseGradientAngle').value = String(cfg.ellipseGradientAngle ?? 135);
    document.getElementById('topTextColor').value = cfg.topTextColor || cfg.textColor || '#FFFFFF';
    document.getElementById('bottomTextColor').value = cfg.bottomTextColor || cfg.textColor || '#FFFFFF';
    document.getElementById('showDimensions').checked = Boolean(cfg.showDimensions);
    document.getElementById('showMachiningNote').checked = Boolean(cfg.showMachiningNote);
    renderGradStopsList();
    updateGradientControlsVisibility();

    updateSliderLabels();
    renderZidentsList();
    renderSvg();
  }

  function ensureGradientStops(cfg) {
    if (!Array.isArray(cfg.ellipseGradientStops) || cfg.ellipseGradientStops.length < 2) {
      cfg.ellipseGradientStops = [
        { color: cfg.ellipseColor || '#000000', offset: 0 },
        { color: cfg.ellipseColor2 || '#1E293B', offset: 100 },
      ];
    }
    return cfg.ellipseGradientStops;
  }

  function getEffectiveGradientStops(cfg) {
    const raw = [...ensureGradientStops(cfg)].sort((a, b) => a.offset - b.offset);
    if (cfg.ellipseGradientMode !== 'hard-split') {
      return raw;
    }

    // Hard-split bands: if first stop is at 0, split at midpoints; otherwise treat each offset as band end
    const result = [];
    const useMidpoints = raw[0].offset === 0;
    let prev = 0;
    for (let i = 0; i < raw.length; i++) {
      const end =
        i === raw.length - 1
          ? 100
          : useMidpoints
            ? Math.round((raw[i].offset + raw[i + 1].offset) / 2)
            : raw[i].offset;
      result.push({ color: raw[i].color, offset: prev });
      result.push({ color: raw[i].color, offset: end });
      prev = end;
    }
    return result;
  }

  function renderGradStopsList() {
    const container = document.getElementById('gradStopsList');
    if (!container) return;
    const cfg = state.config;
    const stops = ensureGradientStops(cfg);
    container.innerHTML = '';

    stops.forEach((s, idx) => {
      const row = document.createElement('div');
      row.className = 'grad-stop-row';

      const colorInp = document.createElement('input');
      colorInp.type = 'color';
      colorInp.value = s.color;
      colorInp.oninput = () => {
        s.color = colorInp.value;
        saveState();
        renderSvg();
      };

      const rangeInp = document.createElement('input');
      rangeInp.type = 'range';
      rangeInp.min = '0';
      rangeInp.max = '100';
      rangeInp.value = String(s.offset);

      const pctSpan = document.createElement('span');
      pctSpan.className = 'grad-stop-pct';
      pctSpan.textContent = `${s.offset}%`;

      rangeInp.oninput = () => {
        s.offset = Number(rangeInp.value);
        pctSpan.textContent = `${s.offset}%`;
        saveState();
        renderSvg();
      };

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn btn-danger';
      delBtn.textContent = '×';
      delBtn.title = 'Supprimer cette couleur';
      delBtn.disabled = stops.length <= 2;
      delBtn.onclick = () => {
        cfg.ellipseGradientStops.splice(idx, 1);
        saveState();
        renderGradStopsList();
        renderSvg();
      };

      row.append(colorInp, rangeInp, pctSpan, delBtn);
      container.appendChild(row);
    });
  }

  function updateGradientControlsVisibility() {
    const cfg = state.config;
    const show = Boolean(cfg.ellipseUseGradient);
    document.getElementById('ellipseGradientPanel').classList.toggle('hidden', !show);
    const isRadial = cfg.ellipseGradientType === 'radial';
    document.getElementById('ellipseGradAngleWrap').classList.toggle('hidden', !show || isRadial);
  }

  function updateSliderLabels() {
    const cfg = state.config;
    document.getElementById('valRingX').textContent = String(cfg.ringRadiusX);
    document.getElementById('valRingY').textContent = String(cfg.ringRadiusY);
    document.getElementById('valTopSize').textContent = String(cfg.topTextSize);
    document.getElementById('valBottomSize').textContent = String(cfg.bottomTextSize);
    document.getElementById('valLogoW').textContent = String(cfg.centerLogoWidth);
    document.getElementById('valLogoH').textContent = String(cfg.centerLogoHeight);
    document.getElementById('valLogoY').textContent = String(cfg.centerLogoOffsetY);
    document.getElementById('valCenterTopSize').textContent = String(cfg.centerTopLabelSize);
    document.getElementById('valCenterBottomSize').textContent = String(cfg.centerBottomLabelSize);
    document.getElementById('valGradAngle').textContent = String(cfg.ellipseGradientAngle ?? 135);
  }

  function bindInputs() {
    // Tabs
    document.querySelectorAll('.tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
      });
    });

    // Config simple bindings
    const bindInput = (id, isNumber = false, rerenderList = false) => {
      const node = document.getElementById(id);
      const evt = node.tagName === 'SELECT' ? 'change' : 'input';
      node.addEventListener(evt, () => {
        state.config[id] = isNumber ? Number(node.value) : node.value;
        updateSliderLabels();
        saveState();
        if (rerenderList) renderZidentsList();
        renderSvg();
      });
    };

    bindInput('topText');
    bindInput('topTextFont');
    bindInput('topTextSize', true);
    bindInput('bottomText');
    bindInput('bottomTextFont');
    bindInput('bottomTextSize', true);
    bindInput('centerTopLabel');
    bindInput('centerTopLabelFont');
    bindInput('centerTopLabelSize', true);
    bindInput('centerLogoWidth', true);
    bindInput('centerLogoHeight', true);
    bindInput('centerLogoOffsetY', true);
    bindInput('centerBottomLabel');
    bindInput('centerBottomLabelFont');
    bindInput('centerBottomLabelSize', true);
    bindInput('ellipseColor');
    bindInput('ellipseGradientAngle', true);
    document.getElementById('ellipseGradientType').addEventListener('change', (e) => {
      state.config.ellipseGradientType = e.target.value;
      updateGradientControlsVisibility();
      saveState();
      renderSvg();
    });
    document.getElementById('ellipseGradientMode').addEventListener('change', (e) => {
      state.config.ellipseGradientMode = e.target.value;
      saveState();
      renderSvg();
    });
    document.getElementById('btnAddGradStop').addEventListener('click', () => {
      const stops = ensureGradientStops(state.config);
      stops.push({ color: '#D4AF37', offset: 50 });
      saveState();
      renderGradStopsList();
      renderSvg();
    });
    document.getElementById('btnGradPreset2').addEventListener('click', () => {
      state.config.ellipseGradientMode = 'hard-split';
      state.config.ellipseGradientStops = [
        { color: state.config.ellipseColor || '#000000', offset: 50 },
        { color: '#D4AF37', offset: 100 },
      ];
      document.getElementById('ellipseGradientMode').value = 'hard-split';
      saveState();
      renderGradStopsList();
      renderSvg();
    });
    document.getElementById('btnGradPreset3').addEventListener('click', () => {
      state.config.ellipseGradientMode = 'hard-split';
      state.config.ellipseGradientStops = [
        { color: state.config.ellipseColor || '#000000', offset: 33 },
        { color: '#1E3A8A', offset: 67 },
        { color: '#D4AF37', offset: 100 },
      ];
      document.getElementById('ellipseGradientMode').value = 'hard-split';
      saveState();
      renderGradStopsList();
      renderSvg();
    });
    bindInput('ellipseBorderColor');
    document.getElementById('textColor').addEventListener('input', (e) => {
      state.config.textColor = e.target.value;
      state.config.topTextColor = e.target.value;
      state.config.bottomTextColor = e.target.value;
      document.getElementById('topTextColor').value = e.target.value;
      document.getElementById('bottomTextColor').value = e.target.value;
      saveState();
      renderSvg();
    });
    bindInput('topTextColor');
    bindInput('bottomTextColor');
    bindInput('slideBackgroundColor');
    document.getElementById('ellipseUseGradient').addEventListener('change', (e) => {
      state.config.ellipseUseGradient = e.target.checked;
      updateGradientControlsVisibility();
      saveState();
      renderSvg();
    });
    bindInput('widthLabel');
    bindInput('heightLabel');
    bindInput('machiningNote');
    bindInput('sortMode', false, true);
    bindInput('layoutDirection');
    bindInput('ringRadiusX', true);
    bindInput('ringRadiusY', true);

    document.getElementById('showDimensions').addEventListener('change', (e) => {
      state.config.showDimensions = e.target.checked;
      saveState();
      renderSvg();
    });
    document.getElementById('showMachiningNote').addEventListener('change', (e) => {
      state.config.showMachiningNote = e.target.checked;
      saveState();
      renderSvg();
    });

    // Add Zident
    document.getElementById('btnAddZident').addEventListener('click', () => {
      state.config.zidents.push({
        id: 'z_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        buque: 'Nouveau',
        famss: '100',
        buqueFont: DEFAULT_FONT,
        famssFont: DEFAULT_FONT,
        buqueSize: 16,
        famssSize: 15,
      });
      saveState();
      renderZidentsList();
      renderSvg();
    });

    // Bulk import zidents
    const bulkBox = document.getElementById('bulkImportBox');
    const bulkText = document.getElementById('bulkImportText');
    document.getElementById('btnToggleBulk').addEventListener('click', () => {
      bulkBox.classList.toggle('hidden');
    });
    document.getElementById('btnBulkAppend').addEventListener('click', () => {
      const items = parseBulkZidents(bulkText.value);
      if (!items.length) return;
      state.config.zidents.push(...items);
      bulkText.value = '';
      bulkBox.classList.add('hidden');
      saveState();
      renderZidentsList();
      renderSvg();
    });
    document.getElementById('btnBulkReplace').addEventListener('click', () => {
      const items = parseBulkZidents(bulkText.value);
      if (!items.length) return;
      state.config.zidents = items;
      bulkText.value = '';
      bulkBox.classList.add('hidden');
      saveState();
      renderZidentsList();
      renderSvg();
    });

    // Reset manual offsets
    document.getElementById('btnResetOffsets').addEventListener('click', () => {
      state.config.zidents.forEach((z) => {
        delete z.offsetX;
        delete z.offsetY;
      });
      saveState();
      renderSvg();
    });

    // Re-sort by fam'ss
    document.getElementById('btnResortFamss').addEventListener('click', () => {
      if (state.config.sortMode === 'manual') {
        state.config.sortMode = 'first-number';
        document.getElementById('sortMode').value = 'first-number';
      }
      state.config.zidents = getSortedZidents();
      saveState();
      renderZidentsList();
      renderSvg();
    });

    // Center logo upload
    const centerLogoInput = document.getElementById('centerLogoInput');
    document.getElementById('btnUploadCenterLogo').addEventListener('click', () => centerLogoInput.click());
    centerLogoInput.addEventListener('change', () => {
      const file = centerLogoInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        state.config.centerLogoDataUrl = String(reader.result);
        saveState();
        renderSvg();
      };
      reader.readAsDataURL(file);
    });
    document.getElementById('btnClearCenterLogo').addEventListener('click', () => {
      state.config.centerLogoDataUrl = '';
      saveState();
      renderSvg();
    });

    // Local font & DaFont (.zip, .ttf, .otf, .woff) upload + drag & drop
    const fontFileInput = document.getElementById('fontFileInput');
    const fontDropzone = document.getElementById('fontDropzone');
    const fontStatus = document.getElementById('fontUploadStatus');

    document.getElementById('btnSearchDafont').addEventListener('click', () => {
      const q = document.getElementById('dafontSearchInput').value.trim();
      const url = q
        ? `https://www.dafont.com/fr/search.php?q=${encodeURIComponent(q)}`
        : 'https://www.dafont.com/fr/';
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    document.getElementById('btnUploadFont').addEventListener('click', () => fontFileInput.click());
    fontFileInput.addEventListener('change', async () => {
      await handleFontFiles(Array.from(fontFileInput.files || []));
      fontFileInput.value = '';
    });

    fontDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fontDropzone.classList.add('drag-over');
    });
    fontDropzone.addEventListener('dragleave', () => {
      fontDropzone.classList.remove('drag-over');
    });
    fontDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      fontDropzone.classList.remove('drag-over');
      await handleFontFiles(Array.from(e.dataTransfer?.files || []));
    });

    async function handleFontFiles(files) {
      if (!files.length) return;
      const imported = [];
      for (const file of files) {
        if (/\.zip$/i.test(file.name)) {
          const buf = await file.arrayBuffer();
          const extracted = await extractFontsFromZip(buf);
          for (const item of extracted) {
            await registerFontDataUrl(item.name, item.dataUrl, 'DaFont (.zip)');
            imported.push(item.name);
          }
        } else if (/\.(ttf|otf|woff2?)$/i.test(file.name)) {
          const baseName = file.name.replace(/\.(ttf|otf|woff2?)$/i, '').trim() || 'CustomFont';
          const dataUrl = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.onerror = () => reject(r.error);
            r.readAsDataURL(file);
          });
          await registerFontDataUrl(baseName, dataUrl, 'Importée');
          imported.push(baseName);
        }
      }
      if (imported.length) {
        fontStatus.textContent = `Polices importées : ${imported.join(', ')}`;
        saveState();
        refreshAllFontSelects();
        renderZidentsList();
        renderSvg();
      } else {
        fontStatus.textContent = 'Aucune police (.ttf, .otf, .woff) trouvée dans ce fichier.';
      }
    }

    async function registerFontDataUrl(rawFontName, dataUrl, sourceLabel) {
      const fontName = rawFontName.replace(/['"]/g, '').trim() || 'CustomFont';
      const ff = new FontFace(fontName, `url(${dataUrl})`);
      await ff.load();
      document.fonts.add(ff);
      state.customFonts = state.customFonts.filter((f) => f.name !== fontName);
      state.customFonts.push({ name: fontName, source: sourceLabel, dataUrl });
    }

    // Google font loader
    document.getElementById('btnAddGoogleFont').addEventListener('click', () => {
      const inp = document.getElementById('googleFontInput');
      const name = inp.value.trim();
      if (!name) return;
      loadGoogleFont(name);
      inp.value = '';
      saveState();
      refreshAllFontSelects();
      renderZidentsList();
      renderSvg();
    });

    // Presets
    document.getElementById('presetSelect').addEventListener('change', (e) => {
      const preset = PRESETS[e.target.value];
      if (!preset) return;
      state.config = structuredClone(preset);
      saveState();
      syncFormFromConfig();
    });

    // Save / Load JSON
    document.getElementById('btnSaveJson').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'ellipse-projet.json');
    });

    const jsonInput = document.getElementById('jsonFileInput');
    document.getElementById('btnLoadJson').addEventListener('click', () => jsonInput.click());
    jsonInput.addEventListener('change', () => {
      const file = jsonInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (parsed?.config?.zidents) {
            state = parsed;
            await restoreCustomFontFaces();
            saveState();
            syncFormFromConfig();
          }
        } catch {
          alert('Fichier JSON invalide.');
        }
      };
      reader.readAsText(file);
    });

    function getCleanSvgString() {
      const svg = document.getElementById('ellipseSvg').cloneNode(true);
      svg.querySelectorAll('.export-hidden').forEach((n) => n.remove());
      return new XMLSerializer().serializeToString(svg);
    }

    // Export SVG
    document.getElementById('btnExportSvg').addEventListener('click', () => {
      const source = '<?xml version="1.0" encoding="UTF-8"?>\n' + getCleanSvgString();
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      downloadBlob(blob, 'ellipse-demande.svg');
    });

    // Export PNG (2560x1440)
    document.getElementById('btnExportPng').addEventListener('click', () => {
      const svgStr = getCleanSvgString();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 2560;
        canvas.height = 1440;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) downloadBlob(pngBlob, 'ellipse-demande.png');
        }, 'image/png');
      };
      img.src = url;
    });

    // Print / PDF
    document.getElementById('btnPrintPdf').addEventListener('click', () => {
      window.print();
    });

    // Export PPTX
    document.getElementById('btnExportPptx').addEventListener('click', () => {
      const blob = buildPptxBlob();
      downloadBlob(blob, 'ellipse-demande.pptx');
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Minimal zero-dependency ZIP extractor for DaFont archives (.ttf / .otf / .woff / .woff2).
   */
  async function extractFontsFromZip(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8');

    // Locate End of Central Directory (0x06054b50)
    let eocdOffset = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }
    if (eocdOffset < 0) return [];

    const totalEntries = view.getUint16(eocdOffset + 10, true);
    let cdOffset = view.getUint32(eocdOffset + 16, true);
    const fonts = [];

    for (let i = 0; i < totalEntries; i++) {
      if (view.getUint32(cdOffset, true) !== 0x02014b50) break;
      const method = view.getUint16(cdOffset + 10, true);
      const compSize = view.getUint32(cdOffset + 20, true);
      const nameLen = view.getUint16(cdOffset + 28, true);
      const extraLen = view.getUint16(cdOffset + 30, true);
      const commentLen = view.getUint16(cdOffset + 32, true);
      const localOffset = view.getUint32(cdOffset + 42, true);
      const fileName = decoder.decode(bytes.subarray(cdOffset + 46, cdOffset + 46 + nameLen));
      cdOffset += 46 + nameLen + extraLen + commentLen;

      if (!/\.(ttf|otf|woff2?)$/i.test(fileName) || fileName.startsWith('__MACOSX')) {
        continue;
      }

      if (view.getUint32(localOffset, true) !== 0x04034b50) continue;
      const lNameLen = view.getUint16(localOffset + 26, true);
      const lExtraLen = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + lNameLen + lExtraLen;
      const compData = bytes.subarray(dataStart, dataStart + compSize);

      let rawBytes;
      if (method === 0) {
        rawBytes = compData;
      } else if (method === 8 && typeof DecompressionStream !== 'undefined') {
        const ds = new DecompressionStream('deflate-raw');
        const writer = ds.writable.getWriter();
        await writer.write(compData);
        await writer.close();
        const ab = await new Response(ds.readable).arrayBuffer();
        rawBytes = new Uint8Array(ab);
      } else {
        continue;
      }

      const ext = fileName.split('.').pop().toLowerCase();
      const mime = ext === 'otf' ? 'font/otf' : ext === 'woff' ? 'font/woff' : ext === 'woff2' ? 'font/woff2' : 'font/ttf';
      const dataUrl = await blobToDataUrl(new Blob([rawBytes], { type: mime }));
      const baseName = fileName.split('/').pop().replace(/\.(ttf|otf|woff2?)$/i, '').trim() || 'DaFont';
      fonts.push({ name: baseName, dataUrl });
    }
    return fonts;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  // ---------- Native PPTX Export (Zero-Dependency OpenXML + ZIP) ----------
  function escXml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function hexNoHash(color, fallback = '000000') {
    const clean = String(color || '').replace('#', '').trim();
    return /^[0-9a-fA-F]{6}$/.test(clean) ? clean.toUpperCase() : fallback;
  }

  function dataUrlToBytes(dataUrl) {
    const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    const mime = match[1].toLowerCase();
    const ext = mime.includes('png')
      ? 'png'
      : mime.includes('svg')
        ? 'svg'
        : mime.includes('jpeg') || mime.includes('jpg')
          ? 'jpg'
          : 'png';
    const bin = atob(match[2]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { ext, bytes };
  }

  function buildPptxBlob() {
    const cfg = state.config;
    const EMU = 9525; // 12192000 / 1280 = 6858000 / 720
    const cx = 640;
    const cy = 350;
    const rx = 405;
    const ry = 270;

    const mediaFiles = []; // { name, ext, bytes, rId }
    const slideRels = [
      `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>`,
    ];

    function addMedia(dataUrl) {
      const parsed = dataUrlToBytes(dataUrl);
      if (!parsed) return null;
      const idx = mediaFiles.length + 1;
      const rId = `rIdImg${idx}`;
      const name = `image${idx}.${parsed.ext}`;
      mediaFiles.push({ name, ext: parsed.ext, bytes: parsed.bytes, rId });
      slideRels.push(
        `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${name}"/>`
      );
      return rId;
    }

    let shapeId = 2;
    const shapes = [];

    // 1. Main Ellipse (solid or multi-stop gradient / split bands)
    let ellipseFillXml;
    if (cfg.ellipseUseGradient) {
      const stops = getEffectiveGradientStops(cfg);
      const gsXml = stops
        .map((s) => `<a:gs pos="${Math.round(s.offset * 1000)}"><a:srgbClr val="${hexNoHash(s.color, '000000')}"/></a:gs>`)
        .join('');
      const dirXml =
        cfg.ellipseGradientType === 'radial'
          ? `<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>`
          : `<a:lin ang="${Math.round((Number(cfg.ellipseGradientAngle ?? 135) % 360) * 60000)}" scaled="1"/>`;
      ellipseFillXml = `<a:gradFill><a:gsLst>${gsXml}</a:gsLst>${dirXml}</a:gradFill>`;
    } else {
      ellipseFillXml = `<a:solidFill><a:srgbClr val="${hexNoHash(cfg.ellipseColor, '000000')}"/></a:solidFill>`;
    }

    shapes.push(`<p:sp>
      <p:nvSpPr><p:cNvPr id="${shapeId++}" name="MainEllipse"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
      <p:spPr>
        <a:xfrm><a:off x="${(cx - rx) * EMU}" y="${(cy - ry) * EMU}"/><a:ext cx="${rx * 2 * EMU}" cy="${ry * 2 * EMU}"/></a:xfrm>
        <a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>
        ${ellipseFillXml}
        <a:ln w="25400"><a:solidFill><a:srgbClr val="${hexNoHash(cfg.ellipseBorderColor, '000000')}"/></a:solidFill></a:ln>
      </p:spPr>
    </p:sp>`);

    // Helper for simple text box
    function makeTextBox(name, x, y, w, h, runs, opts = {}) {
      const align = opts.align || 'ctr';
      const vert = opts.vert ? ` vert="${opts.vert}"` : '';
      const runsXml = runs
        .map((r) => {
          const sz = Math.round((r.size || 16) * 75);
          const color = hexNoHash(r.color || cfg.textColor, 'FFFFFF');
          const font = escXml(r.font || DEFAULT_FONT);
          const bold = r.bold ? ' b="1"' : '';
          return `<a:r><a:rPr lang="fr-FR" sz="${sz}"${bold}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${font}"/></a:rPr><a:t>${escXml(r.text)}</a:t></a:r>`;
        })
        .join('');
      return `<p:sp>
        <p:nvSpPr><p:cNvPr id="${shapeId++}" name="${escXml(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="${Math.round(x * EMU)}" y="${Math.round(y * EMU)}"/><a:ext cx="${Math.round(w * EMU)}" cy="${Math.round(h * EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>
        <p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"${vert}/><a:lstStyle/><a:p><a:pPr algn="${align}"/>${runsXml}</a:p></p:txBody>
      </p:sp>`;
    }

    function makePic(name, rId, x, y, w, h) {
      return `<p:pic>
        <p:nvPicPr><p:cNvPr id="${shapeId++}" name="${escXml(name)}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
        <p:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
        <p:spPr><a:xfrm><a:off x="${Math.round(x * EMU)}" y="${Math.round(y * EMU)}"/><a:ext cx="${Math.round(w * EMU)}" cy="${Math.round(h * EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
      </p:pic>`;
    }

    // 2. Curved Top & Bottom Text (PowerPoint WordArt textArchUp / textArchDown)
    if (cfg.topText) {
      const sz = Math.round((cfg.topTextSize || 22) * 75);
      const color = hexNoHash(cfg.topTextColor || cfg.textColor, 'FFFFFF');
      const font = escXml(cfg.topTextFont || DEFAULT_FONT);
      shapes.push(`<p:sp>
        <p:nvSpPr><p:cNvPr id="${shapeId++}" name="TopArcText"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="${(cx - 385) * EMU}" y="${(cy - 255) * EMU}"/><a:ext cx="${770 * EMU}" cy="${300 * EMU}"/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>
        <p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0"><a:prstTxWarp prst="textArchUp"><a:avLst/></a:prstTxWarp></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="fr-FR" sz="${sz}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${font}"/></a:rPr><a:t>${escXml(cfg.topText)}</a:t></a:r></a:p></p:txBody>
      </p:sp>`);
    }

    if (cfg.bottomText) {
      const sz = Math.round((cfg.bottomTextSize || 22) * 75);
      const color = hexNoHash(cfg.bottomTextColor || cfg.textColor, 'FFFFFF');
      const font = escXml(cfg.bottomTextFont || DEFAULT_FONT);
      shapes.push(`<p:sp>
        <p:nvSpPr><p:cNvPr id="${shapeId++}" name="BottomArcText"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="${(cx - 385) * EMU}" y="${(cy - 45) * EMU}"/><a:ext cx="${770 * EMU}" cy="${300 * EMU}"/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>
        <p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0"><a:prstTxWarp prst="textArchDown"><a:avLst/></a:prstTxWarp></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="fr-FR" sz="${sz}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${font}"/></a:rPr><a:t>${escXml(cfg.bottomText)}</a:t></a:r></a:p></p:txBody>
      </p:sp>`);
    }

    // 3. Center Logo & Labels
    const logoW = Number(cfg.centerLogoWidth) || 150;
    const logoH = Number(cfg.centerLogoHeight) || 130;
    const logoY = cy - logoH / 2 + (Number(cfg.centerLogoOffsetY) || 0);

    if (cfg.centerTopLabel) {
      shapes.push(
        makeTextBox('CenterTopLabel', cx - 220, logoY - 40, 440, 34, [
          { text: cfg.centerTopLabel, font: cfg.centerTopLabelFont, size: cfg.centerTopLabelSize || 20, bold: true },
        ])
      );
    }

    if (cfg.centerLogoDataUrl) {
      const rId = addMedia(cfg.centerLogoDataUrl);
      if (rId) {
        shapes.push(makePic('CenterLogo', rId, cx - logoW / 2, logoY, logoW, logoH));
      }
    }

    if (cfg.centerBottomLabel) {
      const labelY = cfg.centerLogoDataUrl ? logoY + logoH + 6 : cy - 16;
      shapes.push(
        makeTextBox('CenterBottomLabel', cx - 240, labelY, 480, 38, [
          { text: cfg.centerBottomLabel, font: cfg.centerBottomLabelFont, size: cfg.centerBottomLabelSize || 24, bold: true },
        ])
      );
    }

    // 4. Zidents
    const sorted = getSortedZidents();
    const positions = computeZidentPositions(sorted);
    sorted.forEach((z, idx) => {
      const pos = positions[idx];
      const baseColor = z.color || cfg.textColor;
      const bColor = z.buqueColor || baseColor;
      const fColor = z.famssColor || baseColor;
      if (z.famssLogoDataUrl) {
        const iconSize = Number(z.famssLogoSize) || 26;
        const rId = addMedia(z.famssLogoDataUrl);
        shapes.push(
          makeTextBox(`Zident_${idx + 1}`, pos.x - 140, pos.y - 18, 134, 36, [
            { text: z.buque, font: z.buqueFont, size: z.buqueSize || 16, color: bColor },
          ], { align: 'r' })
        );
        if (rId) {
          shapes.push(makePic(`ZidentLogo_${idx + 1}`, rId, pos.x + 2, pos.y - iconSize / 2, iconSize, iconSize));
        }
      } else {
        const runs = [{ text: z.buque, font: z.buqueFont, size: z.buqueSize || 16, color: bColor }];
        if (z.famss) {
          runs.push({ text: ` ${z.famss}`, font: z.famssFont, size: z.famssSize || 15, color: fColor });
        }
        shapes.push(makeTextBox(`Zident_${idx + 1}`, pos.x - 130, pos.y - 18, 260, 36, runs));
      }
    });

    // 5. Dimensions & Machining Note
    if (cfg.showDimensions) {
      const dimHex = '1E293B';
      const hY = cy - ry - 26;
      shapes.push(`<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${shapeId++}" name="DimH"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm><a:off x="${(cx - rx) * EMU}" y="${hY * EMU}"/><a:ext cx="${rx * 2 * EMU}" cy="0"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="19050"><a:solidFill><a:srgbClr val="${dimHex}"/></a:solidFill></a:ln></p:spPr></p:cxnSp>`);
      shapes.push(
        makeTextBox('WidthLabel', cx - 100, hY - 32, 200, 26, [
          { text: cfg.widthLabel || '15 alloufs', font: DEFAULT_FONT, size: 18, color: dimHex },
        ])
      );

      const vX = cx - rx - 40;
      shapes.push(`<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${shapeId++}" name="DimV"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm><a:off x="${vX * EMU}" y="${(cy - ry) * EMU}"/><a:ext cx="0" cy="${ry * 2 * EMU}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="19050"><a:solidFill><a:srgbClr val="${dimHex}"/></a:solidFill></a:ln></p:spPr></p:cxnSp>`);
      shapes.push(
        makeTextBox('HeightLabel', vX - 38, cy - 80, 32, 160, [
          { text: cfg.heightLabel || '10 alloufs', font: DEFAULT_FONT, size: 18, color: dimHex },
        ], { vert: 'vert270' })
      );
    }

    if (cfg.showMachiningNote && cfg.machiningNote) {
      shapes.push(
        makeTextBox('MachiningNote', cx - 480, cy + ry + 18, 960, 54, [
          { text: cfg.machiningNote, font: DEFAULT_FONT, size: 15, color: '1E293B' },
        ])
      );
    }

    const bgHex = hexNoHash(cfg.slideBackgroundColor, 'FFFFFF');

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="${bgHex}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${shapes.join('\n      ')}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;

    const mediaExtTypes = Array.from(new Set(mediaFiles.map((m) => m.ext)))
      .map((ext) => {
        const ct = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : 'image/png';
        return `<Default Extension="${ext}" ContentType="${ct}"/>`;
      })
      .join('');

    const files = [
      {
        path: '[Content_Types].xml',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${mediaExtTypes}
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
</Types>`,
      },
      {
        path: '_rels/.rels',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`,
      },
      {
        path: 'ppt/presentation.xml',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst><p:sldId id="256" r:id="rId2"/></p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`,
      },
      {
        path: 'ppt/_rels/presentation.xml.rels',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
</Relationships>`,
      },
      {
        path: 'ppt/slideMasters/slideMaster1.xml',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>
</p:sldMaster>`,
      },
      {
        path: 'ppt/slideMasters/_rels/slideMaster1.xml.rels',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`,
      },
      {
        path: 'ppt/slideLayouts/slideLayout1.xml',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1">
  <p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sldLayout>`,
      },
      {
        path: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`,
      },
      {
        path: 'ppt/theme/theme1.xml',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Default">
  <a:themeElements>
    <a:clrScheme name="Default">
      <a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="1E293B"/></a:dk2><a:lt2><a:srgbClr val="F1F5F9"/></a:lt2>
      <a:accent1><a:srgbClr val="3B82F6"/></a:accent1><a:accent2><a:srgbClr val="EAB308"/></a:accent2>
      <a:accent3><a:srgbClr val="10B981"/></a:accent3><a:accent4><a:srgbClr val="F97316"/></a:accent4>
      <a:accent5><a:srgbClr val="8B5CF6"/></a:accent5><a:accent6><a:srgbClr val="EC4899"/></a:accent6>
      <a:hlink><a:srgbClr val="3B82F6"/></a:hlink><a:folHlink><a:srgbClr val="6366F1"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Default"><a:majorFont><a:latin typeface="Clunsois"/></a:majorFont><a:minorFont><a:latin typeface="Clunsois"/></a:minorFont></a:fontScheme>
    <a:fmtScheme name="Default"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>
  </a:themeElements>
</a:theme>`,
      },
      {
        path: 'ppt/slides/slide1.xml',
        data: slideXml,
      },
      {
        path: 'ppt/slides/_rels/slide1.xml.rels',
        data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${slideRels.join('\n  ')}
</Relationships>`,
      },
    ];

    for (const m of mediaFiles) {
      files.push({ path: `ppt/media/${m.name}`, data: m.bytes });
    }

    const zipBytes = createZip(files);
    return new Blob([zipBytes], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
  }

  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function createZip(entries) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.path);
      const dataBytes = typeof entry.data === 'string' ? encoder.encode(entry.data) : entry.data;
      const crc = crc32(dataBytes);
      const size = dataBytes.length;

      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(8, 0, true); // stored
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, nameBytes.length, true);
      localHeader.set(nameBytes, 30);

      localParts.push(localHeader, dataBytes);

      const centralHeader = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(centralHeader.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(10, 0, true); // stored
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint32(42, offset, true);
      centralHeader.set(nameBytes, 46);

      centralParts.push(centralHeader);
      offset += localHeader.length + size;
    }

    const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);

    const totalLen = offset + centralSize + 22;
    const out = new Uint8Array(totalLen);
    let pos = 0;
    for (const p of localParts) {
      out.set(p, pos);
      pos += p.length;
    }
    for (const p of centralParts) {
      out.set(p, pos);
      pos += p.length;
    }
    out.set(eocd, pos);
    return out;
  }

  // ---------- Init ----------
  async function init() {
    loadInitialState();
    await restoreCustomFontFaces();
    bindInputs();
    setupSvgDrag();
    syncFormFromConfig();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
