import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, Loader } from 'lucide-react';
import { generateIdCard } from '../lib/idCard/generator';
import { sendIdCards } from '../lib/idCard/api';
import type { FormData } from '../types/form';
import { toast } from 'react-hot-toast';

const translations = {
  en: {
    successTitle: 'Application Submitted Successfully!',
    idMessage: 'Your Membership ID is:',
    saveMessage: 'Please save this ID for future reference',
    generatingCard: 'Generating your ID card...',
    downloadCard: 'Download ID Card',
    downloadSuccess: 'ID card downloaded successfully!',
    error: 'Failed to generate ID card. Please try again.',
    sendingCards: 'Sending ID cards to your mobile number...',
    cardsSent: 'ID cards have been sent to your mobile number!',
  },
  ta: {
    successTitle: 'விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    idMessage: 'உங்கள் உறுப்பினர் அடையாள எண்:',
    saveMessage: 'இந்த அடையாள எண்ணை எதிர்காலத்தில் குறிப்பிட சேமிக்கவும்',
    generatingCard: 'உங்கள் அடையாள அட்டையை உருவாக்குகிறது...',
    downloadCard: 'அடையாள அட்டையை பதிவிறக்கம் செய்யவும்',
    downloadSuccess: 'அடையாள அட்டை வெற்றிகரமாக பதிவிறக்கம் செய்யப்பட்டது!',
    error: 'அடையாள அட்டையை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    sendingCards: 'அடையாள அட்டைகளை உங்கள் மொபைல் எண்ணுக்கு அனுப்புகிறது...',
    cardsSent: 'அடையாள அட்டைகள் உங்கள் மொபைல் எண்ணுக்கு அனுப்பப்பட்டன!',
  },
};

interface SuccessMessageProps {
  id: string;
  language: 'en' | 'ta';
  formData: FormData;
}

export function SuccessMessage({ id, language, formData }: SuccessMessageProps) {
  const [status, setStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [cardUrls, setCardUrls] = useState<{ frontCard: string; backCard: string } | null>(null);
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const t = translations[language];

  useEffect(() => {
    async function generateCard() {
      try {
        const cards = await generateIdCard({
          ...formData,
          id,
        });
        setCardUrls(cards);
        setStatus('ready');
      } catch (error) {
        console.error('Error generating ID card:', error);
        setStatus('error');
      }
    }

    generateCard();
  }, [id, formData]);

 useEffect(() => {
  if (status === 'ready' && cardUrls && sendingStatus === 'idle') {
    async function sendCards() {
      try {
        setSendingStatus('sending');
        await sendIdCards(formData.mobileNumber, cardUrls.frontCard, cardUrls.backCard);
        setSendingStatus('sent');
        toast.success(t.cardsSent);
      } catch (error) {
        console.error('Error sending ID cards:', error);
        setSendingStatus('error');
        toast.error('Failed to send ID cards to your mobile number');
      }
    }

    sendCards();
  }
}, [status, cardUrls, sendingStatus, formData.mobileNumber, t.cardsSent]);

  const handleDownload = async () => {
    if (!cardUrls) return;

    // Download front card
    const frontLink = document.createElement('a');
    frontLink.href = cardUrls.frontCard;
    frontLink.download = `AMVSP${id}_front.png`;
    document.body.appendChild(frontLink);
    frontLink.click();
    document.body.removeChild(frontLink);

    // Download back card
    const backLink = document.createElement('a');
    backLink.href = cardUrls.backCard;
    backLink.download = `AMVSP${id}_back.png`;
    document.body.appendChild(backLink);
    backLink.click();
    document.body.removeChild(backLink);
  };

  return (
    <div className="rounded-lg bg-green-50 p-6 text-center">
      <div className="flex justify-center mb-4">
        {status === 'generating' ? (
          <Loader className="h-12 w-12 text-green-500 animate-spin" />
        ) : (
          <CheckCircle className="h-12 w-12 text-green-500" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        {t.successTitle}
      </h3>
      
      <p className="text-green-700">
        {t.idMessage} <span className="font-bold">AMVSP{id}</span>
      </p>
      
      <p className="text-sm text-green-600 mt-2">{t.saveMessage}</p>
      
      <div className="mt-6">
        {status === 'generating' && (
          <p className="text-sm text-green-600">{t.generatingCard}</p>
        )}
        {status === 'ready' && cardUrls && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.downloadCard}
          </button>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600">{t.error}</p>
        )}
      </div>

      {sendingStatus === 'sending' && (
        <p className="text-sm text-green-600 mt-4">{t.sendingCards}</p>
      )}
      {sendingStatus === 'error' && (
        <p className="text-sm text-red-600 mt-4">Failed to send ID cards to your mobile number</p>
      )}
    </div>
  );
}