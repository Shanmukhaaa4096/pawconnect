import {
  User,
  Pet,
  PetFilterOptions,
  Application,
  AppNotification,
  ShelterReview,
  Conversation,
  Message,
  ApplicationQuestionnaire,
  PetStatus,
  ApplicationStatus,
  ApplicationHandover,
  Product,
  Order,
  DeliveryTracking,
  Feedback,
  DeliveryAddress,
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

  async lazyLogin(role: string = 'adopter', guestName?: string) {
    return customFetch<{ message: string; token: string; user: User; isLazyLogin?: boolean }>('/auth/lazy-login', {
      method: 'POST',
      body: JSON.stringify({ role, guestName }),
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

  async verifyShelter(id: string, verified: boolean) {
    return customFetch<{ message: string; shelter: User }>(`/shelters/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verified }),
    });
  },

  // Admin
  async getAdminUsers() {
    return customFetch<{ count: number; users: User[] }>('/admin/users');
  },

  async setUserSuspended(id: string, suspended: boolean) {
    return customFetch<{ message: string; user: User }>(`/admin/users/${id}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ suspended }),
    });
  },

  async updateHandover(id: string, data: Partial<ApplicationHandover>) {
    return customFetch<{ message: string; application: Application }>(`/applications/${id}/handover`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Notifications
  async getNotifications() {
    return customFetch<{ notifications: AppNotification[]; unreadCount: number }>('/notifications');
  },

  async markNotificationRead(id: string) {
    return customFetch<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  async markAllNotificationsRead() {
    return customFetch<{ message: string }>('/notifications/read-all', { method: 'PATCH' });
  },

  // Applications: withdraw
  async withdrawApplication(id: string) {
    return customFetch<{ message: string; application: Application }>(`/applications/${id}/withdraw`, {
      method: 'PATCH',
    });
  },

  // Shelter reviews
  async getShelterReviews(shelterId: string) {
    return customFetch<{ reviews: ShelterReview[]; count: number; average: number }>(
      `/shelters/${shelterId}/reviews`
    );
  },

  async addShelterReview(shelterId: string, data: { applicationId: string; rating: number; comment?: string }) {
    return customFetch<{ message: string; review: ShelterReview }>(`/shelters/${shelterId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Shop & Merchandise
  async getProducts(filters: { category?: string; petType?: string; search?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.petType && filters.petType !== 'All') params.append('petType', filters.petType);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return customFetch<{ success: boolean; count: number; products: Product[] }>(`/shop/products${qs}`);
  },

  async getProductById(id: string) {
    return customFetch<{ success: boolean; product: Product }>(`/shop/products/${id}`);
  },

  async createOrder(data: {
    items: { productId: string; quantity: number }[];
    deliveryAddress: DeliveryAddress;
    paymentMethod?: string;
  }) {
    return customFetch<{ success: boolean; message: string; order: Order }>('/shop/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyOrders() {
    return customFetch<{ success: boolean; count: number; orders: Order[] }>('/shop/orders/mine');
  },

  async getOrderById(id: string) {
    return customFetch<{ success: boolean; order: Order }>(`/shop/orders/${id}`);
  },

  async getDeliveryTracking(orderId: string) {
    return customFetch<{ success: boolean; order: Order; delivery: DeliveryTracking }>(
      `/shop/orders/${orderId}/delivery`
    );
  },

  async submitOrderFeedback(orderId: string, feedback: { rating: number; emoji?: string; comment?: string }) {
    return customFetch<{ success: boolean; message: string; feedback: Feedback }>(
      `/shop/orders/${orderId}/feedback`,
      {
        method: 'POST',
        body: JSON.stringify(feedback),
      }
    );
  },
};
