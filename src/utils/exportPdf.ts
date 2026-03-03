import { jsPDF } from 'jspdf';
import type { Project } from '../types';
import { generateCutList } from './cutList';
import { CELL_PX } from '../constants';
import { tileToSvgPoints } from '../geometry';

const SHAPE_LABELS: Record<string, string> = {
  'square': 'Square',
  'right-triangle': 'Triangle',
  'rectangle': 'Rectangle',
  'parallelogram': 'Parallelogram',
};

/** Render the quilt block SVG onto a canvas, then embed it in the PDF. */
function drawBlockImage(doc: jsPDF, project: Project, x: number, y: number, renderSize: number) {
  const blockSize = project.block.blockSize;
  const totalPx = blockSize * CELL_PX;

  const canvas = document.createElement('canvas');
  const scale = 2; // retina sharpness
  canvas.width = totalPx * scale;
  canvas.height = totalPx * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#f9f6f2';
  ctx.fillRect(0, 0, totalPx, totalPx);

  // Tiles
  for (const tile of project.block.tiles) {
    const pointsStr = tileToSvgPoints(tile);
    const pairs = pointsStr.split(' ').map(p => p.split(',').map(Number));
    ctx.beginPath();
    ctx.moveTo(pairs[0][0], pairs[0][1]);
    for (let i = 1; i < pairs.length; i++) {
      ctx.lineTo(pairs[i][0], pairs[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = tile.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Grid
  ctx.strokeStyle = '#bbb';
  for (let i = 0; i <= blockSize; i++) {
    const pos = i * CELL_PX;
    const isBorder = i === 0 || i === blockSize;
    ctx.lineWidth = isBorder ? 2 : 0.5;
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(totalPx, pos);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, totalPx);
    ctx.stroke();
  }

  const imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', x, y, renderSize, renderSize);
}

/** Draw a color swatch (simple filled square). */
function drawColorSwatch(doc: jsPDF, color: string, x: number, y: number, size: number) {
  doc.setFillColor(color);
  doc.setDrawColor('#666666');
  doc.setLineWidth(0.2);
  doc.rect(x, y, size, size, 'FD');
}

export function exportProjectToPdf(project: Project) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // ── Title ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(project.name || 'Untitled Project', margin, cursorY + 7);
  cursorY += 14;

  // ── Block info ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const block = project.block;
  doc.text(`Block: ${block.name}`, margin, cursorY);
  cursorY += 5;
  doc.text(`Block size: ${block.blockSize}" × ${block.blockSize}"`, margin, cursorY);
  cursorY += 5;
  doc.text(`Total pieces: ${block.tiles.length}`, margin, cursorY);
  cursorY += 10;

  // ── Block image ──
  const imgSize = Math.min(contentWidth, 120);
  const imgX = margin + (contentWidth - imgSize) / 2;
  drawBlockImage(doc, project, imgX, cursorY, imgSize);
  cursorY += imgSize + 10;

  // ── Cut List heading ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Cut List', margin, cursorY);
  cursorY += 8;

  const entries = generateCutList(block.tiles);

  if (entries.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.text('No tiles placed.', margin, cursorY);
  } else {
    // Table header
    const colColor = margin;
    const colShape = margin + 10;
    const colSize = margin + 55;
    const colCount = margin + 80;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setDrawColor('#999999');
    doc.setLineWidth(0.3);
    doc.text('Color', colColor, cursorY);
    doc.text('Shape', colShape, cursorY);
    doc.text('Size', colSize, cursorY);
    doc.text('Qty', colCount, cursorY);
    cursorY += 2;
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const rowHeight = 7;
    const swatchSize = 4;

    for (const entry of entries) {
      // Check for page break
      if (cursorY + rowHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }

      // Color swatch
      drawColorSwatch(doc, entry.color, colColor, cursorY - 3.5, swatchSize);

      // Shape
      doc.text(SHAPE_LABELS[entry.shape] || entry.shape, colShape, cursorY);

      // Size
      doc.text(`${entry.size}"`, colSize, cursorY);

      // Count
      doc.text(`× ${entry.count}`, colCount, cursorY);

      cursorY += rowHeight;
    }

    // Total
    cursorY += 2;
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY, margin + contentWidth, cursorY);
    cursorY += 5;
    const total = entries.reduce((sum, e) => sum + e.count, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Total: ${total} pieces`, margin, cursorY);
  }

  // ── Save ──
  doc.save(`${project.name || 'quilt'}-cut-list.pdf`);
}
