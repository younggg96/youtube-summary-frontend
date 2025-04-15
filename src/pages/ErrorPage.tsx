import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  let status = 500;
  let title = 'Server Error';
  let message = 'Something went wrong on our server. Please try again later.';
  
  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title = 'Page Not Found';
      message = 'The page you are looking for does not exist or has been moved.';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-900/50 flex items-center justify-center mb-4 sm:mb-6">
            <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-2">
            {status} Error
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-300 text-center">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 hover:bg-gray-600 transition-colors text-white font-medium flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition-colors text-white font-medium flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 