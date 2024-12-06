import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { PhotoUpload } from './PhotoUpload';
import { SuccessMessage } from './SuccessMessage';
import { BLOOD_GROUPS, type FormData } from '../types/form';
import { applicationSchema } from '../lib/validation';
import { uploadPhoto, getNextId, formatDate } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useDateMask } from '../lib/hooks/useDateMask';

interface ApplicationFormProps {
  onFormChange?: (formData: FormData) => void;
}

const translations = {
  en: {
    formTitle: 'Personal Information',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    bloodGroup: 'Blood Group',
    mobileNumber: 'Mobile Number',
    address: 'Residential Address',
    city: 'City',
    state: 'State',
    pinCode: 'PIN Code',
    submitButton: 'Submit Application',
    submitting: 'Submitting...',
    successMessage: 'Membership ID card application submitted successfully!',
    previewTitle: 'Preview Your ID Card',
  },
  ta: {
    formTitle: 'தனிப்பட்ட தகவல்',
    fullName: 'முழு பெயர்',
    dateOfBirth: 'பிறந்த தேதி',
    bloodGroup: 'இரத்த வகை',
    mobileNumber: 'மொபைல் எண்',
    address: 'வசிப்பிட முகவரி',
    city: 'நகரம்',
    state: 'மாநிலம்',
    pinCode: 'பின் குறியீடு',
    submitButton: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    successMessage: 'உறுப்பினர் அடையாள அட்டை விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    previewTitle: 'உங்கள் அடையாள அட்டையை முன்னோட்டம் காணுங்கள்',
  },
};

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

export function ApplicationForm({ onFormChange }: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const dateMask = useDateMask();

  useEffect(() => {
    onFormChange?.(formData);
  }, [formData, onFormChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'dateOfBirth') {
      const maskedValue = dateMask.onChange(e);
      setFormData((prev) => ({ ...prev, [name]: maskedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = async (file: File) => {
    try {
      const url = await uploadPhoto(file);
      setFormData((prev) => ({ ...prev, photoUrl: url }));
      setErrors((prev) => ({ ...prev, photoUrl: '' }));
    } catch (error) {
      toast.error('Failed to upload photo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = await applicationSchema.parseAsync(formData);
      const id = await getNextId();

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            id,
            name: validatedData.name,
            date_of_birth: formatDate(validatedData.dateOfBirth),
            blood_group: validatedData.bloodGroup,
            mobile_number: validatedData.mobileNumber,
            address: validatedData.address,
            city: validatedData.city,
            state: validatedData.state,
            pin_code: validatedData.pinCode,
            photo_url: validatedData.photoUrl,
          },
        ]);

      if (error) throw error;

      setSubmittedId(id);
      setIsSubmitted(true);
      toast.success(translations[language].successMessage);
    } catch (error: any) {
      if (error.errors) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Please fix the errors in the form');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage id={submittedId} language={language} formData={formData} />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{translations[language].formTitle}</h2>
        <select
          className="text-black rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <PhotoUpload
          photoUrl={formData.photoUrl}
          onPhotoChange={handlePhotoChange}
          error={errors.photoUrl}
        />

        <div className="space-y-6">
          <FormInput
            label={translations[language].fullName}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder={translations[language].fullName}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={translations[language].dateOfBirth}
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              error={errors.dateOfBirth}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              disabled={isSubmitting}
            />

            <FormSelect
              label={translations[language].bloodGroup}
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              options={BLOOD_GROUPS}
              error={errors.bloodGroup}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={translations[language].mobileNumber}
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              error={errors.mobileNumber}
              placeholder="10-digit mobile number"
              maxLength={10}
              disabled={isSubmitting}
            />
          </div>

          <FormInput
            label={translations[language].address}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            placeholder={translations[language].address}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label={translations[language].city}
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              placeholder={translations[language].city}
              disabled={isSubmitting}
            />

            <FormInput
              label={translations[language].state}
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              error={errors.state}
              placeholder={translations[language].state}
              disabled={isSubmitting}
            />

            <FormInput
              label={translations[language].pinCode}
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              error={errors.pinCode}
              placeholder="6-digit PIN code"
              maxLength={6}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? translations[language].submitting : translations[language].submitButton}
        </button>
      </form>
    </div>
  );
}