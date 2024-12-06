export function drawText(
  canvas: HTMLCanvasElement,
  text: string,
  x: number,
  y: number,
  font = '20px Arial',
  color = '#000000'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

export function drawWrappedText(
  canvas: HTMLCanvasElement,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font = '20px Arial',
  color = '#000000'
): number {
  const ctx = canvas.getContext('2d');
  if (!ctx) return y;

  ctx.font = font;
  ctx.fillStyle = color;

  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  ctx.fillText(line, x, currentY);
  return currentY;
}

export function drawMultilineText(
  canvas: HTMLCanvasElement,
  lines: { text: string; font?: string; color?: string }[],
  startX: number,
  startY: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  let currentY = startY;
  
  lines.forEach(({ text, font = '20px Arial', color = '#000000' }) => {
    drawText(canvas, text, startX, currentY, font, color);
    currentY += 30;
  });
}