export type UserRole = 'adopter' | 'shelter' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  organization?: {
    name?: string;
    licenseNumber?: string;
    description?: string;
    website?: string;
    verified?: boolean;
  };
  createdAt?: string;
}

export type PetSpecies = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';
export type PetAgeGroup = 'Baby' | 'Young' | 'Adult' | 'Senior';
export type PetGender = 'Male' | 'Female';
export type PetSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';
export type PetStatus = 'Available' | 'Reserved' | 'Adopted';

export interface PetHealth {
  vaccinated: boolean;
  spayedNeutered: boolean;
  specialNeeds: boolean;
  microchipped?: boolean;
  medicalHistory?: string;
}

export interface PetGoodWith {
  children: boolean;
  dogs: boolean;
  cats: boolean;
}

export interface Pet {
  _id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  ageGroup: PetAgeGroup;
  gender: PetGender;
  size: PetSize;
  weightKg?: number;
  health: PetHealth;
  temperament: string[];
  goodWith: PetGoodWith;
  description: string;
  photos: string[];
  location: {
    city: string;
    state: string;
    zipCode?: string;
  };
  status: PetStatus;
  adoptionFee: number;
  shelter: User | string;
  viewsCount?: number;
  createdAt: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface ApplicationQuestionnaire {
  fullName: string;
  phone: string;
  address?: string;
  housingType: 'Apartment' | 'House with Yard' | 'House without Yard' | 'Townhouse/Condo' | 'Other';
  ownership: 'Own' | 'Rent';
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  hasChildren: boolean;
  childrenAges?: string;
  hoursAlonePerDay: number;
  petExperience: 'First-time Owner' | 'Previous Owner' | 'Experienced Caretaker';
  reasonForAdopting: string;
}

export interface ApplicationTimeline {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

export interface Application {
  _id: string;
  pet: Pet;
  adopter: User;
  shelter: User;
  status: ApplicationStatus;
  questionnaire: ApplicationQuestionnaire;
  shelterNotes?: string;
  timeline: ApplicationTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User | { _id: string; name: string; avatar?: string; role: UserRole };
  receiver: string;
  pet?: Pet | string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  pet?: Pet;
  lastMessage?: string;
  lastMessageAt?: string;
  updatedAt?: string;
}

export interface PetFilterOptions {
  species?: string;
  breed?: string;
  ageGroup?: string;
  status?: string;
  gender?: string;
  size?: string;
  location?: string;
  search?: string;
  shelterId?: string;
}
