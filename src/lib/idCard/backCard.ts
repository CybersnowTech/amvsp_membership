import { Canvas } from 'canvas';
import { LAYOUT, FONTS, COLORS } from './constants';
import { CardData } from './types';
import { loadCardBackground } from './canvas';
import { drawText, drawWrappedText } from './text';

const CARD_BACKGROUND_URL = 'https://jfrsjpmtlrruztvfvwut.supabase.co/storage/v1/object/public/assets/Card_back.png';

export async function generateBackCard(data: CardData, canvas: Canvas): Promise<string> {
  try {
    await loadCardBackground(CARD_BACKGROUND_URL, canvas);
    
    const startX = LAYOUT.backContent.x;
    let startY = LAYOUT.backContent.y;
    
    // Draw details without labels
    drawText(
      canvas,
      data.dateOfBirth,
      startX,
      startY,
      FONTS.regular,
      COLORS.primary
    );
    
    drawText(
      canvas,
      data.bloodGroup,
      startX,
      startY + LAYOUT.backContent.lineSpacing,
      FONTS.regular,
      COLORS.primary
    );
    
    drawText(
      canvas,
      data.mobileNumber,
      startX,
      startY + (LAYOUT.backContent.lineSpacing * 2),
      FONTS.regular,
      COLORS.primary
    );
    
    // Format and draw wrapped address
    const address = `${data.address}, ${data.city}, ${data.state} - ${data.pinCode}`;
    drawWrappedText(
      canvas,
      address,
      startX,
      startY + (LAYOUT.backContent.lineSpacing * 3),
      LAYOUT.backContent.maxWidth,
      LAYOUT.backContent.lineHeight,
      FONTS.regular,
      COLORS.primary
    );
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    throw new Error(`Failed to generate back card: ${error.message}`);
  }
}