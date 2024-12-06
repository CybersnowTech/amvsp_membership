import React, { useState } from 'react';
import { ApplicationForm } from '../components/ApplicationForm';
import { CardPreview } from '../components/CardPreview';
import { Toaster } from 'react-hot-toast';
import type { FormData } from '../types/form';

const initialFormData: FormData = {
  name: '',
  dateOfBirth: '',
  bloodGroup: '',
  mobileNumber: '',
  address: '',
  city: '',
  state: '',
  pinCode: '',
  photoUrl: '',
};

export function MembershipApplication() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleFormChange = (updatedData: FormData) => {
    setFormData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AMVSP Card Application</h1>
          <p className="mt-2 text-lg text-gray-600">Fill out the form below to apply for your membership ID card</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div>
            <ApplicationForm onFormChange={handleFormChange} />
          </div>
          {/* <div className="lg:sticky lg:top-8">
            <CardPreview formData={formData} />
          </div> */}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}