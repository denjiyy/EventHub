import axios from 'axios';
import { apiClient } from '../../services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Setup axios.create to return a mocked instance
    mockedAxios.create = jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    } as any));
  });

  describe('token management', () => {
    it('should set and get token', () => {
      const token = 'test-token';
      apiClient.setToken(token);

      expect(apiClient.getToken()).toBe(token);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
    });

    it('should clear token', () => {
      const token = 'test-token';
      apiClient.setToken(token);
      apiClient.clearToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('HTTP methods', () => {
    it('should make GET requests', async () => {
      const mockData = { data: 'test' };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });
      
      // Create a new instance with mocked methods
      const mockInstance = {
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn(() => mockInstance as any);
      
      // Re-import to get new instance
      const { APIClient } = await import('../../services/api');
      const client = new (APIClient as any)('http://test.com/api');
      
      const result = await client.get('/test');

      expect(mockGet).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });

    it('should make POST requests', async () => {
      const mockData = { id: 1, name: 'test' };
      const requestData = { name: 'test' };
      const mockPost = jest.fn().mockResolvedValue({ data: mockData });
      
      const mockInstance = {
        get: jest.fn(),
        post: mockPost,
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn(() => mockInstance as any);
      
      const { APIClient } = await import('../../services/api');
      const client = new (APIClient as any)('http://test.com/api');
      
      const result = await client.post('/test', requestData);

      expect(mockPost).toHaveBeenCalledWith('/test', requestData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make PUT requests', async () => {
      const mockData = { id: 1, name: 'updated' };
      const requestData = { name: 'updated' };
      const mockPut = jest.fn().mockResolvedValue({ data: mockData });
      
      const mockInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: mockPut,
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn(() => mockInstance as any);
      
      const { APIClient } = await import('../../services/api');
      const client = new (APIClient as any)('http://test.com/api');
      
      const result = await client.put('/test', requestData);

      expect(mockPut).toHaveBeenCalledWith('/test', requestData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make DELETE requests', async () => {
      const mockData = { success: true };
      const mockDelete = jest.fn().mockResolvedValue({ data: mockData });
      
      const mockInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: mockDelete,
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      };

      mockedAxios.create = jest.fn(() => mockInstance as any);
      
      const { APIClient } = await import('../../services/api');
      const client = new (APIClient as any)('http://test.com/api');
      
      const result = await client.delete('/test');

      expect(mockDelete).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });
  });
});