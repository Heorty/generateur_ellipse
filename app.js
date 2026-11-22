/* Logique d'interface et état du Générateur d'Ellipses Bapt'ss */
(function () {
  "use strict";

  const STORAGE_KEY = "baptss_ellipse_laser_v1";

  const state = {
    items: [],
    settings: Object.assign({}, window.SvgEngine.DEFAULT_SETTINGS),
    viewMode: "step1", // "step1" | "step2" | "overlay" | "detail"
    renderTheme: "mdf", // "mdf" | "laser"
    activeSheetIndex: 0,
    selectedItemIndex: 0,
    zoomMultiplier: 1,
    layout: null
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cacheElements() {
    const ids = [
      "statCount",
      "statSheets",
      "statWorkZone",
      "btnExportStep1",
      "btnExportStep2",
      "btnExportZip",
      "badgeRowCount",
      "fileDropzone",
      "fileInput",
      "btnTemplateCsv",
      "btnTemplateXlsx",
      "importNotice",
      "btnAddRow",
      "btnResetSamples",
      "btnClearRows",
      "itemsTableBody",
      "badgeCapacity",
      "inSheetWidth",
      "inSheetHeight",
      "inSheetMargin",
      "inSpacing",
      "inOrientation",
      "inWorkZoneMode",
      "inFlipAxis",
      "inMarkerStyle",
      "inLaserOrigin",
      "inShowSheetLabel",
      "alignGuideBox",
      "inEllipseWidth",
      "inEllipseHeight",
      "inTopMale",
      "inTopFemale",
      "inBottomMale",
      "inBottomFemale",
      "inCurvedFontSize",
      "inCenterFontSize",
      "inAmtradsHeight",
      "inMarkerPadding",
      "btnResetSettings",
      "sheetPagerGroup",
      "btnPrevSheet",
      "sheetPagerLabel",
      "btnNextSheet",
      "itemPagerGroup",
      "btnPrevItem",
      "itemPagerLabel",
      "btnNextItem",
      "btnThemeMdf",
      "btnThemeLaser",
      "zoomControlsGroup",
      "btnZoomOut",
      "btnZoomFit",
      "btnZoomIn",
      "zoomLabel",
      "previewLegend",
      "previewStage",
      "previewError",
      "sheetViewport",
      "svgZoomLayer",
      "detailViewport",
      "ellipseTooltip"
    ];
    for (const id of ids) {
      els[id] = $(id);
    }
  }

  function cloneSamples() {
    return window.DataIO.SAMPLE_ROWS.map((r) => ({ ...r }));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) {
          state.items = parsed.items.map((it) => ({
            genre: window.DataIO.normalizeGender(it.genre),
            nom: String(it.nom ?? ""),
            buque: String(it.buque ?? "")
          }));
        } else {
          state.items = cloneSamples();
        }
        if (parsed.settings && typeof parsed.settings === "object") {
          state.settings = window.SvgEngine.mergeSettings(parsed.settings);
        }
        return;
      }
    } catch (_err) {
      // Ignorer localStorage indisponible
    }
    state.items = cloneSamples();
    state.settings = window.SvgEngine.mergeSettings({});
  }

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: state.items,
          settings: state.settings
        })
      );
    } catch (_err) {
      // Ignorer quota / sandbox
    }
  }

  function showNotice(message, type) {
    if (!message) {
      els.importNotice.hidden = true;
      els.importNotice.textContent = "";
      return;
    }
    els.importNotice.hidden = false;
    els.importNotice.className = `notice ${type === "error" ? "is-error" : "is-success"}`;
    els.importNotice.textContent = message;
  }

  function syncSettingsToInputs() {
    const s = state.settings;
    els.inSheetWidth.value = s.sheetWidth;
    els.inSheetHeight.value = s.sheetHeight;
    els.inSheetMargin.value = s.sheetMargin;
    els.inSpacing.value = s.spacing;
    els.inOrientation.value = s.orientation;
    els.inWorkZoneMode.value = s.workZoneMode;
    els.inFlipAxis.value = s.flipAxis;
    els.inMarkerStyle.value = s.markerStyle;
    els.inLaserOrigin.value = s.laserOrigin;
    els.inShowSheetLabel.checked = Boolean(s.showSheetLabel);

    els.inEllipseWidth.value = s.ellipseWidth;
    els.inEllipseHeight.value = s.ellipseHeight;
    els.inTopMale.value = s.topTextMale;
    els.inTopFemale.value = s.topTextFemale;
    els.inBottomMale.value = s.bottomTextMale;
    els.inBottomFemale.value = s.bottomTextFemale;
    els.inCurvedFontSize.value = s.curvedFontSize;
    els.inCenterFontSize.value = s.centerFontSize;
    els.inAmtradsHeight.value = s.amtradsHeight;
    els.inMarkerPadding.value = s.markerPadding;

    document.querySelectorAll(".preset-chip").forEach((chip) => {
      const match =
        Number(chip.dataset.w) === s.sheetWidth && Number(chip.dataset.h) === s.sheetHeight;
      chip.classList.toggle("is-active", match);
    });
  }

  function readSettingsFromInputs() {
    state.settings = window.SvgEngine.mergeSettings({
      ...state.settings,
      sheetWidth: Number(els.inSheetWidth.value),
      sheetHeight: Number(els.inSheetHeight.value),
      sheetMargin: Number(els.inSheetMargin.value),
      spacing: Number(els.inSpacing.value),
      orientation: els.inOrientation.value,
      workZoneMode: els.inWorkZoneMode.value,
      flipAxis: els.inFlipAxis.value,
      markerStyle: els.inMarkerStyle.value,
      laserOrigin: els.inLaserOrigin.value,
      showSheetLabel: els.inShowSheetLabel.checked,
      ellipseWidth: Number(els.inEllipseWidth.value),
      ellipseHeight: Number(els.inEllipseHeight.value),
      topTextMale: els.inTopMale.value,
      topTextFemale: els.inTopFemale.value,
      bottomTextMale: els.inBottomMale.value,
      bottomTextFemale: els.inBottomFemale.value,
      curvedFontSize: Number(els.inCurvedFontSize.value),
      centerFontSize: Number(els.inCenterFontSize.value),
      amtradsHeight: Number(els.inAmtradsHeight.value),
      markerPadding: Number(els.inMarkerPadding.value)
    });
    document.querySelectorAll(".preset-chip").forEach((chip) => {
      const match =
        Number(chip.dataset.w) === state.settings.sheetWidth &&
        Number(chip.dataset.h) === state.settings.sheetHeight;
      chip.classList.toggle("is-active", match);
    });
    saveState();
    renderAll({ skipTable: true });
  }

  function renderTable() {
    const tbody = els.itemsTableBody;
    tbody.innerHTML = "";
    els.badgeRowCount.textContent = String(state.items.length);

    if (state.items.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 5;
      td.style.textAlign = "center";
      td.style.padding = "14px";
      td.style.color = "#64748b";
      td.textContent = "Aucune ellipse. Importez un Excel/CSV ou cliquez sur « + Ajouter ».";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    state.items.forEach((item, idx) => {
      const tr = document.createElement("tr");
      if (idx === state.selectedItemIndex) tr.classList.add("is-selected");

      const tdIdx = document.createElement("td");
      tdIdx.className = "col-idx";
      tdIdx.textContent = String(idx + 1);

      const tdGenre = document.createElement("td");
      tdGenre.className = "col-genre";
      const sel = document.createElement("select");
      sel.className = "cell-select";
      sel.innerHTML = '<option value="M">H</option><option value="F">F</option>';
      sel.value = item.genre === "F" ? "F" : "M";
      sel.addEventListener("change", () => {
        state.items[idx].genre = sel.value;
        saveState();
        renderAll({ skipTable: true });
      });
      tdGenre.appendChild(sel);

      const tdNom = document.createElement("td");
      const inNom = document.createElement("input");
      inNom.type = "text";
      inNom.className = "cell-input";
      inNom.value = item.nom;
      inNom.placeholder = "Nom";
      inNom.addEventListener("input", () => {
        state.items[idx].nom = inNom.value;
        saveState();
        renderAll({ skipTable: true });
      });
      tdNom.appendChild(inNom);

      const tdBuque = document.createElement("td");
      const inBuque = document.createElement("input");
      inBuque.type = "text";
      inBuque.className = "cell-input";
      inBuque.value = item.buque;
      inBuque.placeholder = "Buque";
      inBuque.addEventListener("input", () => {
        state.items[idx].buque = inBuque.value;
        saveState();
        renderAll({ skipTable: true });
      });
      tdBuque.appendChild(inBuque);

      const tdDel = document.createElement("td");
      tdDel.className = "col-del";
      const btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "btn-row-del";
      btnDel.title = "Supprimer cette ligne";
      btnDel.textContent = "×";
      btnDel.addEventListener("click", (e) => {
        e.stopPropagation();
        state.items.splice(idx, 1);
        if (state.selectedItemIndex >= state.items.length) {
          state.selectedItemIndex = Math.max(0, state.items.length - 1);
        }
        saveState();
        renderAll();
      });
      tdDel.appendChild(btnDel);

      tr.addEventListener("click", () => {
        state.selectedItemIndex = idx;
        if (state.layout && !state.layout.error && state.layout.capacity > 0) {
          state.activeSheetIndex = Math.floor(idx / state.layout.capacity);
        }
        updateTableSelectionHighlight();
        renderPreview();
      });

      tr.append(tdIdx, tdGenre, tdNom, tdBuque, tdDel);
      tbody.appendChild(tr);
    });
  }

  function updateTableSelectionHighlight() {
    const rows = els.itemsTableBody.querySelectorAll("tr");
    rows.forEach((r, i) => {
      r.classList.toggle("is-selected", i === state.selectedItemIndex);
    });
  }

  function updateStatsAndGuide(layout) {
    const count = state.items.length;
    els.statCount.textContent = `${count} ellipse${count > 1 ? "s" : ""}`;

    if (layout.error) {
      els.statSheets.textContent = "Erreur plaque";
      els.statWorkZone.textContent = "—";
      els.badgeCapacity.textContent = "0 / planche";
      els.btnExportStep1.disabled = true;
      els.btnExportStep2.disabled = true;
      els.btnExportZip.disabled = true;
      els.alignGuideBox.innerHTML = `<strong>Attention :</strong> ${escapeHtml(layout.error)}`;
      return;
    }

    const totalSheets = layout.sheets.length;
    const activeSheet = layout.sheets[state.activeSheetIndex] || layout.sheets[0];
    els.statSheets.textContent = `${totalSheets} planche${totalSheets > 1 ? "s" : ""}`;
    els.statWorkZone.textContent = `Zone ${activeSheet.workW.toFixed(0)}×${activeSheet.workH.toFixed(0)} mm`;
    els.badgeCapacity.textContent = `${layout.capacity} / planche (${layout.cols}×${layout.rows})`;

    const hasItems = count > 0;
    els.btnExportStep1.disabled = !hasItems;
    els.btnExportStep2.disabled = !hasItems;
    els.btnExportZip.disabled = !hasItems;

    const flipLabel =
      layout.settings.flipAxis === "vertical"
        ? "Haut ↔ Bas (bascule verticale)"
        : "Gauche ↔ Droite (comme une page)";
    const originNames = {
      "top-left": "Haut-Gauche",
      "bottom-left": "Bas-Gauche",
      "top-right": "Haut-Droite",
      "bottom-right": "Bas-Droite",
      center: "Centre"
    };

    els.alignGuideBox.innerHTML = `
      <strong>Procédure d'alignement (Planche ${activeSheet.sheetNumber}) :</strong>
      <ul>
        <li><strong>Marqueurs exacts :</strong> écartement <code>ΔX = ${activeSheet.workW.toFixed(1)} mm</code> × <code>ΔY = ${activeSheet.workH.toFixed(1)} mm</code>.</li>
        <li><strong>Origine laser :</strong> caler le pointeur sur <strong>${originNames[layout.settings.laserOrigin]}</strong>.</li>
        <li><strong>Passe 1 :</strong> graver les noms (noir) + découper les 4 marqueurs (rouge).</li>
        <li><strong>Retournement :</strong> retourner <strong>${flipLabel}</strong>, ré-aligner le pointeur sur les marqueurs puis lancer la <strong>Passe 2</strong>.</li>
      </ul>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applySheetZoom() {
    const layer = els.svgZoomLayer;
    const svg = layer.querySelector("svg");
    if (!svg) return;
    const stageRect = els.previewStage.getBoundingClientRect();
    const availW = Math.max(220, stageRect.width - 42);
    const availH = Math.max(220, stageRect.height - 42);

    const vb = svg.viewBox.baseVal;
    const ratio = vb && vb.width > 0 && vb.height > 0 ? vb.width / vb.height : 1.5;
    let fitW = availW;
    let fitH = fitW / ratio;
    if (fitH > availH) {
      fitH = availH;
      fitW = fitH * ratio;
    }

    const targetW = Math.max(120, Math.round(fitW * state.zoomMultiplier));
    svg.style.width = `${targetW}px`;
    svg.style.height = "auto";
    els.zoomLabel.textContent = `${Math.round(state.zoomMultiplier * 100)}%`;
  }

  function renderPreview() {
    const layout = state.layout;
    const isDetail = state.viewMode === "detail";

    els.sheetPagerGroup.hidden = isDetail;
    els.itemPagerGroup.hidden = !isDetail;
    els.zoomControlsGroup.hidden = isDetail;

    if (!layout || layout.error) {
      els.previewError.hidden = false;
      els.previewError.textContent = layout ? layout.error : "Erreur de calcul.";
      els.sheetViewport.hidden = true;
      els.detailViewport.hidden = true;
      return;
    }

    if (state.items.length === 0) {
      els.previewError.hidden = false;
      els.previewError.textContent =
        "Aucune ellipse dans la liste. Importez un fichier Excel/CSV ou ajoutez une ligne à gauche.";
      els.sheetViewport.hidden = true;
      els.detailViewport.hidden = true;
      return;
    }

    els.previewError.hidden = true;

    if (isDetail) {
      els.sheetViewport.hidden = true;
      els.detailViewport.hidden = false;
      if (state.selectedItemIndex >= state.items.length) {
        state.selectedItemIndex = Math.max(0, state.items.length - 1);
      }
      const item = state.items[state.selectedItemIndex];
      els.itemPagerLabel.textContent = `Ellipse ${state.selectedItemIndex + 1} / ${state.items.length}`;

      const svgRecto = window.SvgEngine.generateSingleEllipsePreviewSvg(
        item,
        1,
        state.settings,
        state.renderTheme
      );
      const svgVerso = window.SvgEngine.generateSingleEllipsePreviewSvg(
        item,
        2,
        state.settings,
        state.renderTheme
      );

      const topTxt = item.genre === "F" ? state.settings.topTextFemale : state.settings.topTextMale;
      const botTxt = item.genre === "F" ? state.settings.bottomTextFemale : state.settings.bottomTextMale;

      els.detailViewport.innerHTML = `
        <div class="detail-card">
          <div class="detail-card-head">
            <h3>Face 1 (Recto) — Gravure seule</h3>
            <span class="badge">${item.genre === "F" ? "Femme (F)" : "Homme (H)"}</span>
          </div>
          <div class="detail-card-sub">${escapeHtml(topTxt)} / <strong>${escapeHtml(item.nom || "—")}</strong> / ${escapeHtml(botTxt)} · ${state.settings.ellipseWidth}×${state.settings.ellipseHeight} mm</div>
          ${svgRecto}
        </div>
        <div class="detail-card">
          <div class="detail-card-head">
            <h3>Face 2 (Verso) — Gravure + Découpe</h3>
            <span class="badge">2 Amtrad's</span>
          </div>
          <div class="detail-card-sub">Buque : <strong>${escapeHtml(item.buque || "—")}</strong> · Découpe ellipse rouge (#FF0000)</div>
          ${svgVerso}
        </div>
      `;
      return;
    }

    els.detailViewport.hidden = true;
    els.sheetViewport.hidden = false;

    if (state.activeSheetIndex >= layout.sheets.length) {
      state.activeSheetIndex = Math.max(0, layout.sheets.length - 1);
    }
    els.sheetPagerLabel.textContent = `Planche ${state.activeSheetIndex + 1} / ${layout.sheets.length}`;
    els.btnPrevSheet.disabled = state.activeSheetIndex <= 0;
    els.btnNextSheet.disabled = state.activeSheetIndex >= layout.sheets.length - 1;

    const svgStr = window.SvgEngine.generatePreviewSvg(
      layout,
      state.activeSheetIndex,
      state.viewMode,
      state.renderTheme,
      state.selectedItemIndex
    );
    els.svgZoomLayer.innerHTML = svgStr;
    applySheetZoom();
    attachSvgHoverHandlers();
  }

  function attachSvgHoverHandlers() {
    const layout = state.layout;
    if (!layout || layout.error) return;
    const sheet = layout.sheets[state.activeSheetIndex];
    if (!sheet) return;

    const hits = els.svgZoomLayer.querySelectorAll(".preview-ellipse-hit");
    hits.forEach((node) => {
      node.addEventListener("mousemove", (e) => {
        const gIdx = Number(node.getAttribute("data-global-index"));
        const step = Number(node.getAttribute("data-step")) || 1;
        const p = sheet.placements.find((pl) => pl.globalIndex === gIdx);
        if (!p) return;
        const pos = step === 2 ? p.step2 : p.step1;
        els.ellipseTooltip.hidden = false;
        els.ellipseTooltip.style.left = `${e.clientX + 12}px`;
        els.ellipseTooltip.style.top = `${e.clientY + 12}px`;
        els.ellipseTooltip.innerHTML = `
          <strong>#${p.globalIndex + 1} — ${escapeHtml(p.item.nom || "—")} / ${escapeHtml(p.item.buque || "—")}</strong><br/>
          Genre : ${p.item.genre === "F" ? "F (.onscrite / devenue)" : "H (.onscrit / devenu)"}<br/>
          Centre zone : (${pos.cx.toFixed(1)}, ${pos.cy.toFixed(1)}) mm
        `;
      });

      node.addEventListener("mouseleave", () => {
        els.ellipseTooltip.hidden = true;
      });

      node.addEventListener("click", () => {
        const gIdx = Number(node.getAttribute("data-global-index"));
        if (Number.isFinite(gIdx)) {
          state.selectedItemIndex = gIdx;
          updateTableSelectionHighlight();
          renderPreview();
        }
      });
    });
  }

  function renderAll(options) {
    const opts = options || {};
    state.layout = window.SvgEngine.computePlanLayout(state.items, state.settings);
    if (!opts.skipTable) {
      renderTable();
    }
    updateStatsAndGuide(state.layout);
    renderPreview();
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readFileAsArrayBuffer(file) {
    if (typeof file.arrayBuffer === "function") {
      return file.arrayBuffer();
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Impossible de lire le fichier."));
      reader.readAsArrayBuffer(file);
    });
  }

  async function handleFileImport(file) {
    if (!file) return;
    try {
      const buf = await readFileAsArrayBuffer(file);
      const imported = window.DataIO.parseSpreadsheetBuffer(buf, file.name);
      if (!imported.length) {
        showNotice(`Aucune ligne exploitable trouvée dans « ${file.name} ».`, "error");
        return;
      }
      state.items = imported;
      state.selectedItemIndex = 0;
      state.activeSheetIndex = 0;
      saveState();
      renderAll();
      showNotice(`${imported.length} ellipse(s) importée(s) depuis « ${file.name} ».`, "success");
    } catch (err) {
      showNotice(`Erreur de lecture (${file.name}) : ${err.message}`, "error");
    }
  }

  function bindEvents() {
    // Empêche le navigateur d'ouvrir/télécharger le fichier si déposé hors de la zone
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => e.preventDefault());

    // Dropzone & File Input (label[for="fileInput"] gère le clic nativement sans récursion)
    els.fileDropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        els.fileInput.click();
      }
    });
    els.fileInput.addEventListener("change", async () => {
      const file = els.fileInput.files && els.fileInput.files[0];
      if (!file) return;
      try {
        await handleFileImport(file);
      } finally {
        els.fileInput.value = "";
      }
    });
    els.fileDropzone.addEventListener("dragenter", (e) => {
      e.preventDefault();
      els.fileDropzone.classList.add("is-dragover");
    });
    els.fileDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
      els.fileDropzone.classList.add("is-dragover");
    });
    els.fileDropzone.addEventListener("dragleave", (e) => {
      if (!e.relatedTarget || !els.fileDropzone.contains(e.relatedTarget)) {
        els.fileDropzone.classList.remove("is-dragover");
      }
    });
    els.fileDropzone.addEventListener("drop", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      els.fileDropzone.classList.remove("is-dragover");
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        await handleFileImport(file);
      }
    });

    // Templates
    els.btnTemplateCsv.addEventListener("click", () => {
      const text = window.DataIO.buildCsvTemplateText();
      triggerDownload(new Blob([text], { type: "text/csv;charset=utf-8" }), "modele_ellipses.csv");
    });
    els.btnTemplateXlsx.addEventListener("click", () => {
      const buf = window.DataIO.buildXlsxTemplateBuffer();
      triggerDownload(
        new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        "modele_ellipses.xlsx"
      );
    });

    // Table actions
    els.btnAddRow.addEventListener("click", () => {
      state.items.push({ genre: "M", nom: "", buque: "" });
      state.selectedItemIndex = state.items.length - 1;
      saveState();
      renderAll();
    });
    els.btnResetSamples.addEventListener("click", () => {
      state.items = cloneSamples();
      state.selectedItemIndex = 0;
      state.activeSheetIndex = 0;
      saveState();
      renderAll();
      showNotice("Liste d'exemples rechargée.", "success");
    });
    els.btnClearRows.addEventListener("click", () => {
      state.items = [];
      state.selectedItemIndex = 0;
      state.activeSheetIndex = 0;
      saveState();
      renderAll();
      showNotice("", "success");
    });

    // Presets
    document.querySelectorAll(".preset-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        els.inSheetWidth.value = chip.dataset.w;
        els.inSheetHeight.value = chip.dataset.h;
        readSettingsFromInputs();
      });
    });

    // Settings inputs
    const settingInputs = [
      els.inSheetWidth,
      els.inSheetHeight,
      els.inSheetMargin,
      els.inSpacing,
      els.inOrientation,
      els.inWorkZoneMode,
      els.inFlipAxis,
      els.inMarkerStyle,
      els.inLaserOrigin,
      els.inShowSheetLabel,
      els.inEllipseWidth,
      els.inEllipseHeight,
      els.inTopMale,
      els.inTopFemale,
      els.inBottomMale,
      els.inBottomFemale,
      els.inCurvedFontSize,
      els.inCenterFontSize,
      els.inAmtradsHeight,
      els.inMarkerPadding
    ];
    settingInputs.forEach((input) => {
      const evt = input.tagName === "SELECT" || input.type === "checkbox" ? "change" : "input";
      input.addEventListener(evt, readSettingsFromInputs);
    });

    els.btnResetSettings.addEventListener("click", () => {
      state.settings = window.SvgEngine.mergeSettings({});
      syncSettingsToInputs();
      saveState();
      renderAll({ skipTable: true });
    });

    // Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        state.viewMode = btn.dataset.view;
        renderPreview();
      });
    });

    // Pagers
    els.btnPrevSheet.addEventListener("click", () => {
      if (state.activeSheetIndex > 0) {
        state.activeSheetIndex--;
        renderPreview();
        updateStatsAndGuide(state.layout);
      }
    });
    els.btnNextSheet.addEventListener("click", () => {
      if (state.layout && state.activeSheetIndex < state.layout.sheets.length - 1) {
        state.activeSheetIndex++;
        renderPreview();
        updateStatsAndGuide(state.layout);
      }
    });
    els.btnPrevItem.addEventListener("click", () => {
      if (state.selectedItemIndex > 0) {
        state.selectedItemIndex--;
        updateTableSelectionHighlight();
        renderPreview();
      }
    });
    els.btnNextItem.addEventListener("click", () => {
      if (state.selectedItemIndex < state.items.length - 1) {
        state.selectedItemIndex++;
        updateTableSelectionHighlight();
        renderPreview();
      }
    });

    // Theme & zoom
    els.btnThemeMdf.addEventListener("click", () => {
      state.renderTheme = "mdf";
      els.btnThemeMdf.classList.add("is-active");
      els.btnThemeLaser.classList.remove("is-active");
      renderPreview();
    });
    els.btnThemeLaser.addEventListener("click", () => {
      state.renderTheme = "laser";
      els.btnThemeLaser.classList.add("is-active");
      els.btnThemeMdf.classList.remove("is-active");
      renderPreview();
    });
    els.btnZoomOut.addEventListener("click", () => {
      state.zoomMultiplier = Math.max(0.4, state.zoomMultiplier - 0.2);
      applySheetZoom();
    });
    els.btnZoomIn.addEventListener("click", () => {
      state.zoomMultiplier = Math.min(4, state.zoomMultiplier + 0.2);
      applySheetZoom();
    });
    els.btnZoomFit.addEventListener("click", () => {
      state.zoomMultiplier = 1;
      applySheetZoom();
    });

    window.addEventListener("resize", () => {
      if (state.viewMode !== "detail") applySheetZoom();
    });

    // Exports SVG & ZIP
    els.btnExportStep1.addEventListener("click", () => {
      if (!state.layout || state.layout.error) return;
      const svg = window.SvgEngine.generateSheetSvg(state.layout, state.activeSheetIndex, 1);
      const pad = String(state.activeSheetIndex + 1).padStart(2, "0");
      triggerDownload(
        new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
        `planche_${pad}_etape1_nom_gravure.svg`
      );
    });
    els.btnExportStep2.addEventListener("click", () => {
      if (!state.layout || state.layout.error) return;
      const svg = window.SvgEngine.generateSheetSvg(state.layout, state.activeSheetIndex, 2);
      const pad = String(state.activeSheetIndex + 1).padStart(2, "0");
      triggerDownload(
        new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
        `planche_${pad}_etape2_buque_gravure_decoupe.svg`
      );
    });
    els.btnExportZip.addEventListener("click", async () => {
      if (!state.layout || state.layout.error) return;
      try {
        els.btnExportZip.disabled = true;
        const zip = await window.DataIO.generateAllSheetsZip(state.layout);
        const blob = await zip.generateAsync({ type: "blob" });
        triggerDownload(blob, "ellipses_baptss_laser.zip");
      } finally {
        els.btnExportZip.disabled = state.items.length === 0 || Boolean(state.layout.error);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    loadState();
    syncSettingsToInputs();
    bindEvents();
    renderAll();
  });
})();
