import { AuthService } from '../../services/authService';
import { apiClient } from '../../services/api';

// Mock the API client
jest.mock('../../services/api');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 'user-id',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName
      );

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(mockApiClient.setToken).toHaveBeenCalledWith(mockResponse.token);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration with phone number', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
      };

      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 'user-id',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.phoneNumber
      );

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'mock-token',
        user: {
          id: 'user-id',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login(credentials.email, credentials.password);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(mockApiClient.setToken).toHaveBeenCalledWith(mockResponse.token);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockProfile = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockApiClient.get.mockResolvedValue(mockProfile);

      const result = await AuthService.getProfile();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockResponse = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockApiClient.put.mockResolvedValue(mockResponse);

      const result = await AuthService.updateProfile(updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/auth/profile', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and logout', () => {
      AuthService.logout();

      expect(mockApiClient.clearToken).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      mockApiClient.getToken.mockReturnValue('mock-token');

      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
      expect(mockApiClient.getToken).toHaveBeenCalled();
    });

    it('should return false when no token exists', () => {
      mockApiClient.getToken.mockReturnValue(null);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
      expect(mockApiClient.getToken).toHaveBeenCalled();
    });
  });
});