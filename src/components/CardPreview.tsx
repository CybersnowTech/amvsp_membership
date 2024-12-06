import React from 'react';
import { FormData } from '../types/form';
import cardBackground from '../assets/Card_front.jpg';

interface CardPreviewProps {
  formData: FormData;
}

export function CardPreview({ formData }: CardPreviewProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">ID Card Preview</h3>
      <div className="flex justify-center">
        <div
          className="relative w-[800px] h-[400px] rounded-lg overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${cardBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#fff',
          }}
        >
          {/* Photo placeholder resized for physical ID photo dimensions */}
          <div
            className="absolute left-[50px] top-[200px] w-[120px] h-[150px] bg-white border-2 border-gray-300 rounded-md shadow-md"
            style={{
              zIndex: 10, // Ensure the image is above other elements
            }}
          >
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="User photo"
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>

          {/* User details aligned to the right */}
          <div className="absolute left-[380px] top-[218px] text-black">
            <h4 className="text-2xl font-bold">
              {formData.name || 'Your Name'}
            </h4>
            <p className="text-lg mt-2">
              {formData.id ? `AMVSP${formData.id}` : 'AMVSPXXXX'}
            </p>
            {formData.bloodGroup && (
              <p className="text-lg mt-1">Blood Group: {formData.bloodGroup}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
