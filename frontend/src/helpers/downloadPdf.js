import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PAGE_W = 210;
const PAGE_H = 297;
const M = { top: 14, bottom: 16, side: 12 }; // mm
const W = PAGE_W - 2 * M.side;
const GAP = 8;
const COL_W = (W - GAP) / 2;
const FS = 8.5; // body font size (pt)
const PAD = 1.3; // vertical padding inside a row (mm)
const NAVY = [20, 53, 94];
const TEXT = [34, 34, 34];
const MUTED = [102, 112, 133];
const RULE = [225, 229, 235];

const clean = (el) => (el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "");

export async function downloadPdf(root, filename, formId) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  doc.setLineHeightFactor(1.25);
  const k = doc.internal.scaleFactor;
  const LH = (FS * 1.25) / k;
  let y = M.top;

  const ensure = (h) => {
    if (y + h > PAGE_H - M.bottom) {
      doc.addPage();
      y = M.top;
    }
  };

  // ---------- title block ----------
  function drawTitle() {
    const head = root.querySelector(".pdf-header");
    if (!head) return;
    [
      [clean(head.querySelector("h1")), 16, "bold", NAVY],
      [clean(head.querySelector("h2")), 10, "bold", TEXT],
      [clean(head.querySelector("h3")), 9, "bold", [52, 64, 84]],
      [clean(head.querySelector("p")), 8, "normal", MUTED],
    ].forEach(([text, size, style, color]) => {
      if (!text) return;
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(text, PAGE_W / 2, y, { align: "center", baseline: "top" });
      y += (size * 1.45) / k;
    });
    y += 1;
    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.6);
    doc.line(M.side, y, M.side + W, y);
    y += 7;
  }

  // ---------- section header (numbered badge + title + rule) ----------
  function drawSectionHeader(num, title, need) {
    ensure(need);
    doc.setFillColor(...NAVY);
    doc.circle(M.side + 3.2, y + 3.2, 3.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(num.length > 1 ? 6 : 7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(num, M.side + 3.2, y + 3.2, { align: "center", baseline: "middle" });

    doc.setFontSize(11.5);
    doc.setTextColor(...NAVY);
    doc.text(title, M.side + 9, y + 3.2, { baseline: "middle" });

    doc.setDrawColor(...NAVY);
    doc.setLineWidth(0.5);
    doc.line(M.side, y + 8, M.side + W, y + 8);
    y += 12;
  }

  function drawSubheading(text) {
    ensure(30);
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(text, M.side, y, { baseline: "top" });
    y += 6.5;
  }

  function drawNote(text) {
    ensure(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(text, M.side, y, { baseline: "top" });
    y += 7;
  }

  // ---------- one label/value cell ----------
  function measure(row, w) {
    const labelEl = row.querySelector("label");
    const value = clean(row.querySelector("p"));
    const isChecklist = row.classList.contains("doc-checklist-row");
    const strong = labelEl.querySelector("strong");
    const num = strong ? clean(strong) : "";
    const rest = clean(labelEl).slice(num.length).trim();
    const labelFont = isChecklist ? "normal" : "bold";

    doc.setFontSize(FS);
    doc.setFont("helvetica", "bold");
    const numW = num ? doc.getTextWidth(num + " ") : 0;
    doc.setFont("helvetica", labelFont);
    const natural = numW + doc.getTextWidth(rest);
    const labelW = isChecklist ? w - 22 : Math.min(natural + 1, w * 0.6);
    const labelLines = doc.splitTextToSize(rest, labelW - numW);
    doc.setFont("helvetica", "normal");
    const valueLines = doc.splitTextToSize(value, w - labelW - 3);

    const h = Math.max(labelLines.length, valueLines.length) * LH + 2 * PAD;

    return {
      h,
      draw(x, top, rowH) {
        const ty = top + PAD;
        doc.setFontSize(FS);
        doc.setTextColor(...TEXT);
        if (num) {
          doc.setFont("helvetica", "bold");
          doc.text(num, x, ty, { baseline: "top" });
        }
        doc.setFont("helvetica", labelFont);
        doc.text(labelLines, x + numW, ty, { baseline: "top" });
        doc.setFont("helvetica", "normal");
        doc.text(valueLines, x + w, ty, { align: "right", baseline: "top" });
        doc.setDrawColor(...RULE);
        doc.setLineWidth(0.2);
        doc.line(x, top + rowH, x + w, top + rowH);
      },
    };
  }

  // ---------- two-column grid (same flow as the CSS grid) ----------
  function drawGrid(grid) {
    const pair = (a, b) => {
      const ca = measure(a, COL_W);
      const cb = b ? measure(b, COL_W) : null;
      const h = Math.max(ca.h, cb ? cb.h : 0);
      ensure(h);
      ca.draw(M.side, y, h);
      if (cb) cb.draw(M.side + COL_W + GAP, y, h);
      y += h;
    };

    let left = null;
    Array.from(grid.children).forEach((row) => {
      if (row.classList.contains("doc-full-width")) {
        if (left) {
          pair(left, null);
          left = null;
        }
        const c = measure(row, W);
        ensure(c.h);
        c.draw(M.side, y, c.h);
        y += c.h;
      } else if (!left) {
        left = row;
      } else {
        pair(left, row);
        left = null;
      }
    });
    if (left) pair(left, null);
    y += 3;
  }

  // ---------- server tables ----------
  function drawTable(table) {
    const head = [Array.from(table.querySelectorAll("thead th")).map((c) => clean(c))];
    const body = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.children).map((c) => clean(c))
    );
    ensure(25);
    autoTable(doc, {
      head,
      body,
      startY: y,
      margin: { top: M.top, bottom: M.bottom, left: M.side, right: M.side },
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 1.6,
        lineColor: [204, 204, 204],
        lineWidth: 0.2,
        textColor: TEXT,
      },
      headStyles: { fillColor: [242, 242, 242], textColor: TEXT, fontStyle: "bold" },
      rowPageBreak: "avoid",
    });
    y = doc.lastAutoTable.finalY + 5;
  }

  // ---------- build the document ----------
  drawTitle();

  Array.from(root.children).forEach((section) => {
    if (!section.classList.contains("doc-section")) return;

    const kids = Array.from(section.children).filter(
      (c) => !c.classList.contains("doc-section-header")
    );
    const first = kids[0];
    const need = first && (first.tagName === "H4" || first.tagName === "TABLE") ? 50 : 30;

    drawSectionHeader(
      clean(section.querySelector(".doc-badge")),
      clean(section.querySelector(".doc-section-header h3")),
      need
    );

    kids.forEach((c) => {
      if (c.classList.contains("doc-grid")) drawGrid(c);
      else if (c.tagName === "H4") drawSubheading(clean(c));
      else if (c.tagName === "TABLE") drawTable(c);
      else if (clean(c)) drawNote(clean(c));
    });

    y += 4;
  });

  // ---------- footer on every page ----------
  const pages = doc.internal.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.text(formId || "", M.side, PAGE_H - 8);
    doc.text(`Page ${i} of ${pages}`, PAGE_W - M.side, PAGE_H - 8, { align: "right" });
  }

  doc.save(filename);
}