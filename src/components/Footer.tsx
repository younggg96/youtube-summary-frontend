import { Youtube, Github, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <Youtube className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-lg font-semibold text-white">YouTube Summarizer</span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center flex-wrap">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span>© {currentYear} YouTube Summarizer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 