import {
  User,
  Pet,
  PetFilterOptions,
  Application,
  Conversation,
  Message,
  ApplicationQuestionnaire,
  PetStatus,
  ApplicationStatus,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('pawconnect_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('pawconnect_token', token);
  } else {
    localStorage.removeItem('pawconnect_token');
  }
};

const customFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
};

// API Services
export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    return customFetch<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: Partial<User> & { password: string }) {
    return customFetch<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getMe() {
    return customFetch<{ user: User }>('/auth/me');
  },

  async updateProfile(profileData: Partial<User>) {
    return customFetch<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Pets
  async getPets(filters: PetFilterOptions = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== 'All') {
        params.append(key, val);
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return customFetch<{ count: number; pets: Pet[] }>(`/pets${queryString}`);
  },

  async getPetById(id: string) {
    return customFetch<{ pet: Pet; isFavorite: boolean }>(`/pets/${id}`);
  },

  async createPet(formData: FormData) {
    return customFetch<{ message: string; pet: Pet }>('/pets', {
      method: 'POST',
      body: formData,
    });
  },

  async updatePet(id: string, petData: Partial<Pet>) {
    return customFetch<{ message: string; pet: Pet }>(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  },

  async deletePet(id: string) {
    return customFetch<{ message: string }>(`/pets/${id}`, {
      method: 'DELETE',
    });
  },

  async updatePetStatus(id: string, status: PetStatus) {
    return customFetch<{ message: string; pet: Pet }>(`/pets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Favorites
  async getFavorites() {
    return customFetch<{ count: number; favorites: Pet[] }>('/favorites');
  },

  async toggleFavorite(petId: string) {
    return customFetch<{ message: string; isFavorite: boolean }>(`/favorites/${petId}`, {
      method: 'POST',
    });
  },

  // Applications
  async createApplication(data: { petId: string; questionnaire: ApplicationQuestionnaire }) {
    return customFetch<{ message: string; application: Application }>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyApplications() {
    return customFetch<{ count: number; applications: Application[] }>('/applications/my-applications');
  },

  async getShelterApplications() {
    return customFetch<{ count: number; applications: Application[] }>('/applications/shelter-applications');
  },

  async getApplicationById(id: string) {
    return customFetch<{ application: Application }>(`/applications/${id}`);
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, shelterNotes?: string) {
    return customFetch<{ message: string; application: Application }>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, shelterNotes }),
    });
  },

  // Messages & Chat
  async getConversations() {
    return customFetch<{ conversations: Conversation[] }>('/messages/conversations');
  },

  async startConversation(recipientId: string, petId?: string) {
    return customFetch<{ conversation: Conversation }>('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId, petId }),
    });
  },

  async getMessages(conversationId: string) {
    return customFetch<{ messages: Message[] }>(`/messages/${conversationId}`);
  },

  async sendMessage(data: { conversationId: string; receiverId: string; petId?: string; text: string }) {
    return customFetch<{ message: string; data: Message }>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Shelters & Stats
  async getShelters() {
    return customFetch<{ count: number; shelters: User[] }>('/shelters');
  },

  async getShelterById(id: string) {
    return customFetch<{ shelter: User; pets: Pet[] }>(`/shelters/${id}`);
  },

  async getPlatformStats() {
    return customFetch<{
      stats: {
        totalPets: number;
        availablePets: number;
        adoptedPets: number;
        totalApplications: number;
        totalShelters: number;
        totalAdopters: number;
      };
    }>('/shelters/stats');
  },
};
