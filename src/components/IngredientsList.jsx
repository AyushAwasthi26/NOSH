import React from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function IngredientsList({ ingredients, darkMode, resetIngredients, toggleRecipeShown, deleteIngredient }) {
  return (
    <section className="mt-12">
      <AnimatePresence>
        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h2 className={`text-xs font-medium uppercase tracking-[0.2em] mb-6 text-center ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Selected Pantry
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <AnimatePresence>
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={ingredient}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    // Dynamic Pill Styling
                    className={`flex items-center gap-3 pl-5 pr-2 py-2 rounded-full text-sm font-light border shadow-sm ${darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-white text-black border-black/10'}`}
                  >
                    {ingredient}
                    <button
                      onClick={() => deleteIngredient(ingredient)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors text-[10px] ${darkMode ? 'bg-white/10 text-zinc-400 hover:bg-orange-500 hover:text-white' : 'bg-black/5 text-zinc-500 hover:bg-orange-500 hover:text-white'}`}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mb-12">
              <button onClick={resetIngredients} className="text-xs uppercase tracking-widest text-zinc-500 hover:text-orange-500 transition-colors">
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {ingredients.length > 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <p className={`font-serif italic mb-6 text-lg ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Shall we begin the culinary journey?
          </p>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(242, 148, 26, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleRecipeShown} 
            className="px-12 py-4 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium tracking-wider uppercase text-sm shadow-xl shadow-orange-500/20 border border-orange-400/20"
          >
            Generate Recipe
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}