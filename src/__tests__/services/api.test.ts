import { apiClient } from '../../services/api';

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('request method', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { data: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should make a successful POST request', async () => {
      const mockResponse = { id: 1, name: 'test' };
      const requestData = { name: 'test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.post('/test', requestData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      } as any);

      await apiClient.get('/test');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        method: 'GET',
      });
    });

    it('should throw error for failed requests', async () => {
      const errorMessage = 'Not found';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ message: errorMessage }),
      } as any);

      await expect(apiClient.get('/test')).rejects.toThrow(errorMessage);
    });

    it('should return null for 204 responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as any);

      const result = await apiClient.delete('/test');

      expect(result).toBeNull();
    });
  });

  describe('token management', () => {
    it('should set and get token', () => {
      const token = 'test-token';
      apiClient.setToken(token);

      expect(apiClient.getToken()).toBe(token);
    });

    it('should clear token', () => {
      const token = 'test-token';
      apiClient.setToken(token);
      apiClient.clearToken();

      expect(apiClient.getToken()).toBe(null);
    });
  });
});