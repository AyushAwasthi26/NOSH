import { motion } from 'framer-motion';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-5">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl text-orange-500">✦</span>
          <h1 className="font-serif text-xl tracking-wide text-white">
            Bawarch<span className="text-orange-500 text-sm align-top">AI</span>
          </h1>
        </motion.div>
        
        <div className="text-xs text-zinc-500 tracking-widest uppercase hidden sm:block">
          Premium Recipe Companion
        </div>
      </div>
    </header>
  );
}