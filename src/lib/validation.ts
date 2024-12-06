import { z } from 'zod';
import { BLOOD_GROUPS } from '../types/form';
import { supabase } from './supabase';

export const applicationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .regex(/^[a-zA-Z.\s]+$/, 'Name can only contain letters, spaces, and periods (.)'),
  dateOfBirth: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Invalid date format (DD/MM/YYYY)'),
  bloodGroup: z.enum(BLOOD_GROUPS, {
    errorMap: () => ({ message: 'Please select a valid blood group' }),
  }),
  mobileNumber: z.string()
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .refine(
      async (number) => {
        const { data } = await supabase
          .from('applications')
          .select('mobile_number')
          .eq('mobile_number', number)
          .single();
        return !data;
      },
      'This mobile number is already registered'
    ),
  address: z.string().min(1, 'Address is required').transform(str => str.trim()),
  city: z.string().min(1, 'City is required').transform(str => str.trim()),
  state: z.string().min(1, 'State is required').transform(str => str.trim()),
  pinCode: z.string().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
  photoUrl: z.string().min(1, 'Photo is required'),
});
