import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from '../../components/AuthModal';

// Mock the AppContext
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockAddToast = jest.fn();

jest.mock('../../context/AppContext', () => ({
  useApp: () => ({
    login: mockLogin,
    register: mockRegister,
    addToast: mockAddToast,
  }),
}));

describe('AuthModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<AuthModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('renders sign in form by default', () => {
    render(<AuthModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('switches to sign up form when sign up button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthModal {...defaultProps} />);

    const signUpTab = screen.getByText('Sign Up');
    await user.click(signUpTab);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
  });

  it('calls login function with correct credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<AuthModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls register function with correct data', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(<AuthModal {...defaultProps} />);

    // Switch to sign up
    const signUpTab = screen.getByText('Sign Up');
    await user.click(signUpTab);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const firstNameInput = screen.getByPlaceholderText('John');
    const lastNameInput = screen.getByPlaceholderText('Doe');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123', 'John', 'Doe');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows validation error for missing required fields in sign up', async () => {
    const user = userEvent.setup();
    render(<AuthModal {...defaultProps} />);

    // Switch to sign up
    const signUpTab = screen.getByText('Sign Up');
    await user.click(signUpTab);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    expect(screen.getByText('First and last name are required')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows validation error for missing first/last name in sign up', async () => {
    const user = userEvent.setup();
    render(<AuthModal {...defaultProps} />);

    // Switch to sign up
    const signUpTab = screen.getByText('Sign Up');
    await user.click(signUpTab);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText('First and last name are required')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('handles login errors gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    render(<AuthModal {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('handles register errors gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Email already exists';
    mockRegister.mockRejectedValue(new Error(errorMessage));

    render(<AuthModal {...defaultProps} />);

    // Switch to sign up
    const signUpTab = screen.getByText('Sign Up');
    await user.click(signUpTab);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AuthModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: '' }); // Close button has no text
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('clears form data after successful submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<AuthModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });
});