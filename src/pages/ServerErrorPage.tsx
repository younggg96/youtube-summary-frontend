import { useNavigate } from 'react-router-dom';
import { ServerCrash, RefreshCcw, Home } from 'lucide-react';

interface ServerErrorPageProps {
  error?: string;
  resetErrorBoundary?: () => void;
}

const ServerErrorPage = ({ error, resetErrorBoundary }: ServerErrorPageProps) => {
  const navigate = useNavigate();
  
  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-900/50 flex items-center justify-center mb-4 sm:mb-6">
            <ServerCrash className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-2">
            500 Error
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Server Error</h2>
          <p className="text-gray-300 text-center">
            Something went wrong on our server. Please try again later.
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg w-full">
              <p className="text-red-200 text-sm overflow-x-auto">{error}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRefresh}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-gray-700/50 hover:bg-gray-600 transition-colors text-white font-medium flex items-center justify-center"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
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

export default ServerErrorPage; 