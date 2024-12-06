export const CARD_DIMENSIONS = {
  width: 1012, // 3.375 inches * 300 DPI
  height: 638, // 2.125 inches * 300 DPI
};

export const FONTS = {
  title: 'bold 34px Arial',
  regular: 'bold 24px Arial',
  small: '20px Arial',
};

export const COLORS = {
  primary: '#000000',
  text: '#000000',
  light: '#718096',
};

export const LAYOUT = {
  // Front card layout
  photoWidth: 200,
  photoHeight: 240,
  photoLeft: 130,
  photoTop: 300,
  textLeft: 600,
  nameTop: 380,
  idTop: 440,
  padding: 60,
  lineHeight: 50,
  
  // Back card layout
  backContent: {
    x: 370, // Starting x position for back content
    y: 80, // Starting y position for back content
    lineSpacing: 59, // Vertical space between lines
    maxWidth: 550, // Maximum width for text wrapping
    lineHeight: 35, // Line height for wrapped text
  }
};