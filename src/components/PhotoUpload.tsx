import React, { useCallback } from 'react';
import { Camera } from 'lucide-react';

interface PhotoUploadProps {
  photoUrl: string;
  onPhotoChange: (file: File) => void;
  error?: string;
}

export function PhotoUpload({ photoUrl, onPhotoChange, error }: PhotoUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    onPhotoChange(file);
  }, [onPhotoChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="relative w-[3.5cm] h-[4.5cm] border-2 border-gray-300 rounded-lg overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="block">
            <span className="sr-only">Choose photo</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            JPG, JPEG or PNG. Max 2MB.
          </p>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}