import { createCardCanvas } from './canvas';
import { generateFrontCard } from './frontCard';
import { generateBackCard } from './backCard';
import type { CardData } from './types';

export async function generateIdCard(data: CardData): Promise<{ frontCard: string; backCard: string }> {
  try {
    const frontCanvas = await createCardCanvas();
    const backCanvas = await createCardCanvas();
    
    const frontCard = await generateFrontCard(data, frontCanvas);
    const backCard = await generateBackCard(data, backCanvas);
    
    return { frontCard, backCard };
  } catch (error) {
    console.error('ID card generation failed:', error);
    throw new Error('Failed to generate ID card. Please try again.');
  }
}