import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  HomePage,
  CreatorTrackerPage,
  AuthPage,
  ProfilePage,
  ErrorPage,
} from "./pages";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import {
  Youtube as YouTubeIcon,
  UserRound,
  UserCircle,
  LogIn,
} from "lucide-react";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileNav from "./components/MobileNav";
import ScrollToTop from "./components/ScrollToTop";

// Navigation component, shows different links based on login status
const Navigation = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
          <div className="flex items-center">
            <YouTubeIcon className="h-8 w-8 text-red-500 mr-2" />
            <span className="hidden sm:inline text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              YouTube Summarizer
            </span>
          </div>
        </div>
        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link
            to="/"
            className="px-4 py-2 flex items-center gap-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <YouTubeIcon className="h-5 w-5 inline mr-1" />
            Summarize
          </Link>
          <Link
            to="/creator-tracker"
            className="px-4 py-2 flex items-center gap-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <UserRound className="h-5 w-5 inline mr-1" />
            Creator Tracker
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="px-4 py-2 flex items-center gap-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <UserCircle className="h-5 w-5 mr-1" />
              {user?.username || "Profile"}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 flex items-center gap-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center"
            >
              <LogIn className="h-5 w-5 mr-1" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  );
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative flex-1 flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex-1 w-full max-w-7xl">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/creator-tracker" element={<CreatorTrackerPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <Footer />

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/*"
            element={<AppContent />}
            errorElement={<ErrorPage />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
