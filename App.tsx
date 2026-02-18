import React, { useState } from 'react';
import { Search, Crown, Info, Menu, X, Github, MapPin, ArrowRightLeft } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MPCard from './components/MPCard';
import ComparisonView from './components/ComparisonView';
import { analyzeMP } from './services/gemini';
import { MPProfile, LoadingState } from './types';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'compare'>('dashboard');
  const [mpData, setMpData] = useState<MPProfile | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setActiveTab('search');
    setStatus(LoadingState.LOADING);
    setMpData(null);

    try {
      // Pass 'false' for direct text search (unless it detects coordinates, but for now strict text)
      // Actually, let's treat it as a potential location if the user typed a place.
      // The analyzeMP function prompt now handles both via smart prompting.
      const data = await analyzeMP(searchTerm, true); 
      setMpData(data);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setStatus(LoadingState.LOADING);
    setActiveTab('search');
    setMpData(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coordsString = `${latitude}, ${longitude}`;
        setSearchTerm("My Location");
        
        try {
          // Pass 'true' to indicate this is a location-based search
          const data = await analyzeMP(coordsString, true);
          setMpData(data);
          setStatus(LoadingState.SUCCESS);
        } catch (error) {
          console.error(error);
          setStatus(LoadingState.ERROR);
        }
      },
      () => {
        setStatus(LoadingState.ERROR);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="bg-purple-900 p-2 rounded-lg text-white">
                <Crown size={24} />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">Members of Posh</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('search'); document.getElementById('search-input')?.focus(); }}
                className={`text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Find MP
              </button>
              <button 
                onClick={() => setActiveTab('compare')}
                className={`text-sm font-medium transition-colors ${activeTab === 'compare' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Compare
              </button>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Github size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-900">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
             <button 
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-medium text-slate-700 py-2"
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('search'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-medium text-slate-700 py-2"
              >
                Find MP
              </button>
              <button 
                onClick={() => { setActiveTab('compare'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-medium text-slate-700 py-2"
              >
                Compare
              </button>
          </div>
        )}
      </nav>

      {/* Hero / Search Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6 tracking-tight">
            How Posh is Your MP?
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Discover the educational backgrounds, wealth indicators, and social standing of the people running the country.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Name, Town, or Postcode..."
              className="w-full pl-6 pr-24 py-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl text-lg placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <button
                type="button"
                onClick={handleLocationSearch}
                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Use my location"
              >
                <MapPin size={24} />
              </button>
              <button 
                type="submit"
                className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'compare' && <ComparisonView />}

        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            {status === LoadingState.IDLE && !mpData && (
              <div className="text-center py-20 text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-serif">Enter an MP's name or your town/postcode above.</p>
              </div>
            )}

            {status === LoadingState.LOADING && (
               <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-serif text-slate-600 animate-pulse">Consulting the archives...</p>
                <p className="text-sm text-slate-400 mt-2">Checking school records, financial disclosures, and Wikipedia.</p>
              </div>
            )}

            {status === LoadingState.ERROR && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <Info className="text-red-500 mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Analysis Failed</h3>
                    <p className="text-red-700 mt-1">
                      We couldn't find sufficient data for that query. If searching by location, ensure you have allowed geolocation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === LoadingState.SUCCESS && mpData && (
              <MPCard mp={mpData} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-purple-900">
            <Crown size={20} />
            <span className="font-serif font-bold">Members of Posh</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            A satirical project generated by AI. Data is retrieved via Google Search and Gemini models. 
            "Posh Scores" are arbitrary fun metrics and should not be taken as serious sociological studies.
          </p>
          <div className="mt-8 text-slate-400 text-xs">
            © {new Date().getFullYear()} Members of Posh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;