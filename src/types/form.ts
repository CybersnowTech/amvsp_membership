export type FormData = {
  id?: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  photoUrl: string;
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;