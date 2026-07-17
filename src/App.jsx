import { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function App() {
  // Restored toggle state (Defaults to dark for the cinematic vibe)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true; 
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      {/* Dynamic Background based on Dark/Light Mode */}
      <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-[#F5F2EC] text-black'}`}>
        
        {/* Dynamic Glows */}
        <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none transition-colors duration-500 ${darkMode ? 'bg-orange-500/10' : 'bg-orange-400/20'}`}></div>
        <div className={`absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${darkMode ? 'bg-yellow-700/10' : 'bg-yellow-500/10'}`}></div>
        
        <div className="relative z-10">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <Body darkMode={darkMode} />
        </div>
      </div>
    </ReactLenis>
  );
}