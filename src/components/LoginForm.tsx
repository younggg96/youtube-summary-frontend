import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';
import { Loader2, LogIn, User } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick: () => void;
}

const LoginForm = ({ onSuccess, onRegisterClick }: LoginFormProps) => {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to login');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-gray-400 mt-1">Sign in to continue</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-200 text-sm">{error}</p>
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
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
            placeholder="Enter your username"
          />
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
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-red-400 hover:text-red-300 font-medium focus:outline-none"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 