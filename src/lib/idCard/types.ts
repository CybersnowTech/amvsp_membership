export interface CardData {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  photoUrl: string;
}

export interface CardGenerationResult {
  frontCard: string;
}