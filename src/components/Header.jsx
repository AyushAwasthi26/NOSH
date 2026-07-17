import { motion } from 'framer-motion';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${darkMode ? 'bg-black/40 border-white/5' : 'bg-[#F5F2EC]/60 border-black/5'}`}>
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-5">
        
        {/* NOSH Branding */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* <span className="text-3xl text-orange-500">✦</span> */}
          
          <img 
            src="/nosh.png" 
            alt="NOSH Logo" 
            // Smart filter: adds glow in dark mode. 
            // If your logo is black and disappears in dark mode, change 'invert-0' to 'invert'
            className={`w-8 h-8 object-contain transition-all duration-500 
              ${darkMode 
                ? 'invert-0 drop-shadow-[0_0_10px_rgba(242,148,26,0.6)]' 
                : 'brightness-0'
              }`} 
          />
          
          <h1 className={`font-serif text-xl tracking-[0.3em] uppercase transition-colors duration-500 ${darkMode ? 'text-white' : 'text-black'}`}>
            Nosh
          </h1>
        </motion.div>
        
        {/* Dark/Light Toggle Switch */}
        <div className="flex items-center gap-4">
          <span className={`text-xs uppercase tracking-widest hidden sm:block transition-colors duration-500 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {darkMode ? '' : ''}
          </span>
          
          {/* Added whileTap for a smooth click animation */}
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-7 rounded-full p-1 flex items-center transition-colors duration-300 ease-in-out ${darkMode ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-black/10 border border-black/10'}`}
            aria-label="Toggle dark mode"
          >
            <motion.div 
              className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] ${darkMode ? 'bg-orange-500 ml-auto' : 'bg-white mr-auto'}`}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Animated Icon Swap */}
              <motion.span
                key={darkMode ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {darkMode ? '🌙' : '☀️'}
              </motion.span>
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  );
}