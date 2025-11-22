import { Farmer, SupplyEntry, Payment, Settings, User } from '../types';

const API_URL = 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, fullName: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const data = await this.request<{ user: User }>('/auth/me');
    return data.user;
  }

  // Farmers
  async getFarmers(): Promise<Farmer[]> {
    return this.request<Farmer[]>('/farmers');
  }

  async getFarmerById(id: string): Promise<Farmer> {
    return this.request<Farmer>(`/farmers/${id}`);
  }

  async createFarmer(farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'balance' | 'isActive'>): Promise<Farmer> {
    return this.request<Farmer>('/farmers', {
      method: 'POST',
      body: JSON.stringify(farmer),
    });
  }

  async updateFarmer(id: string, updates: Partial<Farmer>): Promise<Farmer> {
    return this.request<Farmer>(`/farmers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteFarmer(id: string): Promise<void> {
    return this.request<void>(`/farmers/${id}`, { method: 'DELETE' });
  }

  // Supply Entries
  async getSupplyEntries(): Promise<SupplyEntry[]> {
    return this.request<SupplyEntry[]>('/supplies');
  }

  async createSupplyEntry(entry: Omit<SupplyEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<SupplyEntry> {
    return this.request<SupplyEntry>('/supplies', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  // Payments
  async getPayments(): Promise<Payment[]> {
    return this.request<Payment[]>('/payments');
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Payment> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    return this.request<Settings>('/settings');
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    return this.request<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const apiService = new ApiService();
