import { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(true); // Locked to Dark for Cinematic Vibe

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, syncTouch: true }}>
      {/* Deep Obsidian Background with Saffron Glow */}
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-yellow-700/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <Body darkMode={darkMode} />
        </div>
      </div>
    </ReactLenis>
  );
}