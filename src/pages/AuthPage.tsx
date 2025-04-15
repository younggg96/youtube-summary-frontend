import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Youtube as YouTubeIcon } from 'lucide-react';

enum AuthMode {
  LOGIN,
  REGISTER
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75"></div>
              <div className="relative bg-gray-900 rounded-full p-3">
                <YouTubeIcon className="h-12 w-12 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {mode === AuthMode.LOGIN ? (
          <LoginForm onSuccess={handleSuccess} onRegisterClick={toggleMode} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onLoginClick={toggleMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage; 