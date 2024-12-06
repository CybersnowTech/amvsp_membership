import { supabase } from '../supabase';

interface SendMessagePayload {
  to_number: string;
  type: string;
  message: string; // Media URL
  text?: string; // Optional caption or text message
}

const API_CONFIG = {
  baseUrl: 'https://api.maytapi.com/api',
  productId: 'f7d38c5f-595e-4e94-9c6b-e6b3bdd94906',
  phoneId: '59311',
  token: '51f9464b-1a0e-4233-9dfa-3d81a70bcaf1',
};

async function sendMessage(payload: SendMessagePayload): Promise<Response> {
  const url = `${API_CONFIG.baseUrl}/${API_CONFIG.productId}/${API_CONFIG.phoneId}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-maytapi-key': API_CONFIG.token,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(`API request failed: ${errorData.message || response.statusText}`);
  }

  return response;
}

export async function sendIdCards(phoneNumber: string, frontCard: string, backCard: string): Promise<boolean> {
  try {
    // Store the cards in Supabase storage
    const cards = await Promise.all([
      storeCardImage(frontCard, 'front'),
      storeCardImage(backCard, 'back'),
    ]);

    // Format phone number with country code and Maytapi suffix
    const formattedNumber = `91${phoneNumber}@c.us`;

    // Send messages with the public URLs
    await Promise.all([
      sendMessage({
        to_number: formattedNumber,
        type: 'media',
        message: cards[0], // Media URL for the front card
        text: 'AMVSP Member Card (Front)', // Caption for the image
      }),
      sendMessage({
        to_number: formattedNumber,
        type: 'media',
        message: cards[1], // Media URL for the back card
        text: 'AMVSP Member Card (Back)', // Caption for the image
      }),
    ]);

    return true;
  } catch (error) {
    console.error('Failed to send ID cards:', error);
    throw new Error('Failed to send ID cards. Please try again.');
  }
}

async function storeCardImage(dataUrl: string, side: 'front' | 'back'): Promise<string> {
  try {
    // Convert base64 to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const fileName = `${Date.now()}-${side}.png`;
    const filePath = `cards/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('applications')
      .upload(filePath, blob);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('applications')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to retrieve public URL from Supabase');
    }

    return data.publicUrl;
  } catch (error) {
    throw new Error(`Failed to store card image: ${error.message}`);
  }
}
