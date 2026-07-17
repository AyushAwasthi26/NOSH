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
          <span className="text-3xl text-orange-500">✦</span>
          {/* NOSH in Serif with wide tracking for premium look */}
          <h1 className={`font-serif text-xl tracking-[0.3em] uppercase ${darkMode ? 'text-white' : 'text-black'}`}>
            Nosh
          </h1>
        </motion.div>
        
        {/* Dark/Light Toggle Switch */}
        <div className="flex items-center gap-4">
          <span className={`text-xs uppercase tracking-widest hidden sm:block ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {darkMode ? 'Cinematic' : 'Light'}
          </span>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-7 rounded-full p-1 flex items-center transition-colors duration-300 ${darkMode ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-black/10 border border-black/10'}`}
          >
            <motion.div 
              className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] ${darkMode ? 'bg-orange-500 ml-auto' : 'bg-white mr-auto'}`}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {/* Sun/Moon Icons */}
              {darkMode ? '🌙' : '☀️'}
            </motion.div>
          </button>
        </div>
      </div>
    </header>
  );
}