import { Canvas } from 'canvas';
import { LAYOUT, FONTS, COLORS, CARD_DIMENSIONS } from './constants';
import { CardData } from './types';
import { loadCardBackground, drawPhoto } from './canvas';
import { drawText } from './text';

const CARD_BACKGROUND_URL = 'https://jfrsjpmtlrruztvfvwut.supabase.co/storage/v1/object/public/assets/Card_front.png';

/**
 * Converts all words in the input string to uppercase.
 */
function capitalizeName(name: string): string {
  return name
    .split(' ')
    .map(word => word.toUpperCase())
    .join(' ');
}

function measureTextWidth(ctx: CanvasRenderingContext2D, text: string, font: string): number {
  ctx.font = font;
  return ctx.measureText(text).width;
}

export async function generateFrontCard(data: CardData, canvas: Canvas): Promise<string> {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to get canvas context");

    // Load the card background
    await loadCardBackground(CARD_BACKGROUND_URL, canvas);

    // Draw the photo if the URL is provided
    if (data.photoUrl) {
      await drawPhoto(
        data.photoUrl,
        canvas,
        LAYOUT.photoLeft,
        LAYOUT.photoTop,
        LAYOUT.photoWidth,
        LAYOUT.photoHeight,
        30
      );
    }

    // Define a text area to the right of the photo to ensure we can center text properly
    const photoRight = LAYOUT.photoLeft + LAYOUT.photoWidth;
    const textAreaLeft = photoRight + 50; // some spacing from the photo
    const textAreaRight = CARD_DIMENSIONS.width - LAYOUT.padding;
    const textAreaWidth = textAreaRight - textAreaLeft;

    // Prepare the name
    const capitalizedName = capitalizeName(data.name);

    // Set font for the name and measure
    ctx.font = FONTS.title;
    ctx.fillStyle = COLORS.primary;

    // If name overflows, we truncate (optional)
    let nameToRender = capitalizedName;
    let nameWidth = measureTextWidth(ctx, nameToRender, FONTS.title);
    const ellipsis = '...';
    while (nameWidth > textAreaWidth && nameToRender.length > 0) {
      nameToRender = nameToRender.slice(0, -1);
      nameWidth = measureTextWidth(ctx, nameToRender + ellipsis, FONTS.title);
    }
    if (nameWidth > textAreaWidth) {
      // Even after trimming one char at a time, if it doesn't fit, just use ellipsis
      nameToRender = nameToRender + ellipsis;
      nameWidth = measureTextWidth(ctx, nameToRender, FONTS.title);
    }

    // Center the name in the text area
    const nameX = textAreaLeft + (textAreaWidth / 2) - (nameWidth / 2);

    // Draw the name
    drawText(
      canvas,
      nameToRender,
      nameX,
      LAYOUT.nameTop,
      FONTS.title,
      COLORS.primary
    );

    // Now the ID
    const idText = `AMVSP${data.id}`;
    ctx.font = FONTS.regular;
    const idWidth = measureTextWidth(ctx, idText, FONTS.regular);
    const idX = textAreaLeft + (textAreaWidth / 2) - (idWidth / 2);

    drawText(
      canvas,
      idText,
      idX,
      LAYOUT.idTop,
      FONTS.regular,
      COLORS.primary
    );

    // Convert the canvas to a PNG data URL and return it
    return canvas.toDataURL('image/png');
  } catch (error) {
    // Handle errors and provide meaningful feedback
    throw new Error(`Failed to generate front card: ${error.message}`);
  }
}
