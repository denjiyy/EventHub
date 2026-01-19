const API_BASE_URL = 'http://localhost:5001/api';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
