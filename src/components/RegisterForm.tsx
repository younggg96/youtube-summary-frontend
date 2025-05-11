import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RegisterCredentials } from '../types';
import { Loader2, UserPlus, User } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick: () => void;
}

interface ValidationError {
  type: string;
  loc: string[];
  msg: string;
  input: string;
}

const RegisterForm = ({ onSuccess, onLoginClick }: RegisterFormProps) => {
  const { register, loading } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): string | null => {
    if (credentials.password !== credentials.confirmPassword) {
      return 'Passwords do not match';
    }
    if (credentials.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationError = validateForm();
    if (validationError) {
      setErrors([{
        type: 'validation_error',
        loc: ['password'],
        msg: validationError,
        input: credentials.password
      }]);
      return;
    }

    try {
      await register(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message && err.message.includes('detail')) {
        try {
          const errorData = JSON.parse(err.message);
          if (Array.isArray(errorData.detail)) {
            setErrors(errorData.detail);
          } else {
            setErrors([{
              type: 'error',
              loc: ['general'],
              msg: errorData.detail || 'Registration failed',
              input: ''
            }]);
          }
        } catch {
          setErrors([{
            type: 'error',
            loc: ['general'],
            msg: err.message || 'Registration failed',
            input: ''
          }]);
        }
      } else {
        setErrors([{
          type: 'error',
          loc: ['general'],
          msg: err instanceof Error ? err.message : 'Registration failed',
          input: ''
        }]);
      }
    }
  };

  const getFieldError = (fieldName: string): string | null => {
    const fieldError = errors.find(error => 
      error.loc.includes(fieldName) || 
      (error.loc.length > 1 && error.loc[1] === fieldName)
    );
    return fieldError ? fieldError.msg : null;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-gray-400 mt-1">Sign up to get started</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-200 text-sm mb-1">
              <span className="font-semibold capitalize">{error.loc.length > 1 ? error.loc[1] : 'Error'}</span>: {error.msg}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={credentials.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700/50 border ${
              getFieldError('username') ? 'border-red-500' : 'border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white`}
            placeholder="Choose a username"
          />
          {getFieldError('username') && (
            <p className="mt-1 text-sm text-red-400">
              <span className="font-semibold">Username</span>: {getFieldError('username')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={credentials.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700/50 border ${
              getFieldError('email') ? 'border-red-500' : 'border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white`}
            placeholder="Enter your email"
          />
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-400">
              <span className="font-semibold">Email</span>: {getFieldError('email')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={credentials.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700/50 border ${
              getFieldError('password') ? 'border-red-500' : 'border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white`}
            placeholder="Create a password"
            minLength={8}
          />
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-400">
              <span className="font-semibold">Password</span>: {getFieldError('password')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={credentials.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-gray-700/50 border ${
              getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white`}
            placeholder="Confirm your password"
          />
          {getFieldError('confirmPassword') && (
            <p className="mt-1 text-sm text-red-400">
              <span className="font-semibold">Confirm Password</span>: {getFieldError('confirmPassword')}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-red-400 hover:text-red-300 font-medium focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 