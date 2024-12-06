export async function createCardCanvas(): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1012;  // 3.375 inches * 300 DPI
  canvas.height = 638;  // 2.125 inches * 300 DPI
  return canvas;
}

export async function loadCardBackground(url: string, canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';  // Enable CORS for the image
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load background image'));
    };
    
    img.src = url;
  });
}

export async function drawPhoto(
  photoUrl: string,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number = 20 // Default border radius for rounded corners
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create a rounded rectangle path
      ctx.save(); // Save the context state
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + width - borderRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
      ctx.lineTo(x + width, y + height - borderRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
      ctx.lineTo(x + borderRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();

      ctx.clip(); // Clip to the rounded rectangle path

      // Draw the image
      ctx.drawImage(img, x, y, width, height);
      ctx.restore(); // Restore the context state

      resolve();
    };

    img.onerror = () => {
      reject(new Error('Failed to load photo'));
    };

    img.src = photoUrl;
  });
}
