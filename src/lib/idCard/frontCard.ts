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

export async function generateFrontCard(data: CardData, canvas: Canvas): Promise<string> {
  try {
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
    
    // Draw fully capitalized name (to the right of the photo)
    const capitalizedName = capitalizeName(data.name);
    drawText(
      canvas,
      capitalizedName,
      LAYOUT.textLeft,
      LAYOUT.nameTop,
      FONTS.title,
      COLORS.primary
    );
    
    // Draw ID below the name
    drawText(
      canvas,
      `AMVSP${data.id}`,
      LAYOUT.textLeft,
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
