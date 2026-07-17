import React, { useState } from "react";
import { motion } from 'framer-motion';

export default function RecipeDisplay({ recipe, darkMode, onRefine, isRefining, onRegenerate, onReset }) {
  const [checkedSteps, setCheckedSteps] = useState({});
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [refinementText, setRefinementText] = useState("");

  if (!recipe) return null;

  const toggleStep = (idx) => setCheckedSteps(p => ({...p, [idx]: !p[idx]}));
  const toggleIng = (idx) => setCheckedIngredients(p => ({...p, [idx]: !p[idx]}));

  const handleRefineSubmit = (e, text) => {
    e.preventDefault();
    if (!text.trim()) return; // Don't submit if empty
    onRefine(text, recipe);
    setRefinementText("");
  };

  const totalSteps = recipe.steps?.length || 1;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;
  const progress = (completedSteps / totalSteps) * 100;

  const glassCard = darkMode 
    ? 'border-white/10 bg-white/[0.03] backdrop-blur-xl' 
    : 'border-black/10 bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]';
  const subText = darkMode ? 'text-zinc-400' : 'text-zinc-500';
  const mainText = darkMode ? 'text-white' : 'text-black';
  const hoverBg = darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5';
  const inputBg = darkMode 
    ? 'bg-black/40 border-white/10 text-white placeholder-zinc-600' 
    : 'bg-white/80 border-black/10 text-black placeholder-zinc-400';
  const divider = darkMode ? 'border-white/10' : 'border-black/10';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`p-10 rounded-3xl shadow-2xl border ${glassCard}`}
    >
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-50 bg-black/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-400" 
          animate={{ width: `${progress}%` }}
          transition={{ stiffness: 300 }}
        />
      </div>

      {/* Header Section */}
      <div className={`mb-10 border-b ${divider} pb-8`}>
        <h2 className={`font-serif text-4xl md:text-5xl mb-3 tracking-tight ${mainText}`}>{recipe.title}</h2>
        <p className={`italic text-lg font-light max-w-2xl ${subText}`}>{recipe.description}</p>
      </div>

      {/* Servings Scaler with Loading Spinners */}
      <div className="flex items-center gap-6 mb-10">
        <span className={`text-xs uppercase tracking-widest ${subText}`}>Servings</span>
        <div className="flex items-center gap-3">
          <button 
            disabled={isRefining}
            onClick={() => onRefine(`Scale this recipe to ${Math.max(1, recipe.servings - 1)} servings`, recipe)}
            className={`w-9 h-9 rounded-full border font-light text-xl transition-colors flex items-center justify-center disabled:opacity-50 ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-orange-500 hover:border-orange-500' : 'bg-white border-black/10 text-black hover:bg-orange-500 hover:text-white hover:border-orange-500'}`}
          >
            {isRefining ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : "-"}
          </button>
          <span className={`font-serif text-xl w-6 text-center ${mainText}`}>{recipe.servings || 4}</span>
          <button 
            disabled={isRefining}
            onClick={() => onRefine(`Scale this recipe to ${recipe.servings + 1} servings`, recipe)}
            className={`w-9 h-9 rounded-full border font-light text-xl transition-colors flex items-center justify-center disabled:opacity-50 ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-orange-500 hover:border-orange-500' : 'bg-white border-black/10 text-black hover:bg-orange-500 hover:text-white hover:border-orange-500'}`}
          >
            {isRefining ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : "+"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Ingredients Column */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-6">Ingredients</h3>
          <ul className="space-y-3">
            {recipe.ingredients?.map((ing, idx) => (
              <motion.li 
                key={idx} 
                layout
                onClick={() => toggleIng(idx)}
                className={`flex items-center justify-between gap-3 cursor-pointer p-2 rounded-lg transition-all ${checkedIngredients[idx] ? 'opacity-40' : hoverBg}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checkedIngredients[idx] ? 'bg-orange-500 border-orange-500' : darkMode ? 'border-zinc-600' : 'border-zinc-300'}`}>
                    {checkedIngredients[idx] && <span className="text-white text-[10px]">✓</span>}
                  </span>
                  <span className={`font-light ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                    {ing.quantity && <span className="text-orange-500 mr-1">{ing.quantity}</span>}
                    {ing.name}
                  </span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRefine(`Swap out ${ing.name} for a common alternative`, recipe); }}
                  disabled={isRefining}
                  className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 transition-colors uppercase tracking-wider flex items-center justify-center w-[50px] h-[24px]"
                >
                  {isRefining ? <div className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : "Swap"}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Instructions Column - Fixed Number Alignment */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-6">Method</h3>
          <ol className="space-y-6">
            {recipe.steps?.map((step, idx) => (
              <motion.li 
                key={idx} 
                layout
                onClick={() => toggleStep(idx)}
                className={`flex gap-5 cursor-pointer group transition-all ${checkedSteps[idx] ? 'opacity-50' : ''}`}
              >
                {/* Added leading-none and pb-0.5 for perfect centering */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-serif text-sm leading-none pb-0.5 transition-all ${checkedSteps[idx] ? 'bg-green-500 border-green-500 text-white' : darkMode ? 'border-zinc-600 text-zinc-400 group-hover:border-orange-500 group-hover:text-orange-500' : 'border-zinc-300 text-zinc-400 group-hover:border-orange-500 group-hover:text-orange-500'}`}>
                  {checkedSteps[idx] ? '✓' : idx + 1}
                </div>
                <div className="pt-1 flex-1">
                  {step.title && <span className={`block font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>{step.title}</span>}
                  <span className={`font-light leading-relaxed ${checkedSteps[idx] ? 'line-through' : ''} ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{step.description || step}</span>
                  {step.tip && <span className="block text-xs italic text-orange-500/80 mt-2">💡 {step.tip}</span>}
                  {!checkedSteps[idx] && <div className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to complete</div>}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Chef's Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-12 p-6 rounded-2xl border-l-2 border-orange-500 bg-orange-500/5">
          <h4 className="font-serif text-lg text-orange-500 mb-3">Chef's Secrets</h4>
          <ul className="space-y-2 text-sm">
            {recipe.tips.map((tip, idx) => <li key={idx} className={`italic font-light ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>— {tip}</li>)}
          </ul>
        </div>
      )}

      {/* Custom Refinement Input - WITH BUTTON */}
      <form onSubmit={(e) => handleRefineSubmit(e, refinementText)} className="mt-10">
        <label className={`text-xs uppercase tracking-widest block mb-3 ${subText}`}>Refine Recipe</label>
        <div className="flex gap-3">
          <input 
            type="text"
            value={refinementText}
            onChange={(e) => setRefinementText(e.target.value)}
            placeholder="e.g., 'Make it spicier' or 'Add garlic'"
            className={`flex-1 px-5 py-4 rounded-xl border outline-none focus:border-orange-500 transition-colors font-light ${inputBg}`}
            disabled={isRefining}
          />
          <button 
            type="submit"
            disabled={isRefining || refinementText.trim() === ''}
            className={`px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isRefining || refinementText.trim() === '' ? 'bg-zinc-500/20 text-zinc-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
          >
            {isRefining ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Refine"}
          </button>
        </div>
      </form>

      {/* Bottom Actions: Restored Start Over & Next Recipe */}
      <div className={`mt-12 pt-8 border-t ${divider} flex flex-col sm:flex-row justify-between items-center gap-4`}>
        <button 
          onClick={onReset}
          className={`text-xs uppercase tracking-widest transition-colors ${darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}
        >
          ↺ Start Over
        </button>
        <button 
          onClick={onRegenerate}
          disabled={isRefining}
          className="px-8 py-3 rounded-full border border-orange-500 text-orange-500 text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
        >
          ✦ Next Recipe
        </button>
      </div>
    </motion.div>
  );
}