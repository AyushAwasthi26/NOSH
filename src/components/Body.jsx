import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import IngredientsList from "./IngredientsList";
import RecipeDisplay from "./RecipeDisplay";
import { getRecipeFromGemini } from "../ai";

export default function Body({ darkMode }) {
  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem("ingredients");
    return saved ? JSON.parse(saved) : [];
  });
  const [recipe, setRecipe] = useState(() => {
    const saved = localStorage.getItem("recipe");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [recipeShown, setRecipeShown] = useState(!!localStorage.getItem("recipe"));
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false); 
  const [error, setError] = useState(null);
  const recipeSection = useRef(null);

  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    if (recipe) localStorage.setItem("recipe", JSON.stringify(recipe));
    else localStorage.removeItem("recipe");
  }, [recipe]);

  useEffect(() => {
    if (recipe && recipeSection.current) {
      recipeSection.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recipe]);

  function deleteIngredient(ingredientToDelete) {
    setIngredients(prev => prev.filter(i => i !== ingredientToDelete));
  }

  function resetIngredients() {
    setIngredients([]);
    setRecipe(null);
    setRecipeShown(false);
    setError(null);
    localStorage.removeItem("ingredients");
    localStorage.removeItem("recipe");
  }

  const fetchRecipe = useCallback(async (refinement = "", currentRecipe = null) => {
    if (ingredients.length < 4 && !currentRecipe) return;
    
    if (currentRecipe) setIsRefining(true); else setIsLoading(true);
    setError(null);
    setRecipeShown(true);

    try {
      const rawText = await getRecipeFromGemini(ingredients, refinement, currentRecipe);
      
      let parsedRecipe;
      try {
        parsedRecipe = JSON.parse(rawText);
        if (!parsedRecipe.title || !parsedRecipe.ingredients) throw new Error("Invalid shape");
      } catch (parseError) {
        throw new Error("The AI returned malformed data. Please try again.");
      }

      setRecipe(parsedRecipe);
    } catch (err) {
      setError(err.message || "Failed to fetch recipe.");
    } finally {
      setIsLoading(false);
      setIsRefining(false);
    }
  }, [ingredients]);

  function handleSubmit(event) {
    event.preventDefault();
    const newIngredient = new FormData(event.currentTarget).get("ingredient");
    if (!newIngredient || newIngredient.trim() === "") return;
    setIngredients(prev => [...prev, newIngredient.trim()]);
    event.currentTarget.reset();
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      {/* Hero / Input Section */}
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`font-serif text-4xl md:text-5xl mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}
        >
          What's in your <span className="italic text-orange-500">kitchen</span>?
        </motion.h2>
        <p className={`font-light mb-10 max-w-xl mx-auto ${darkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
          List your ingredients below. Let NOSH craft a cinematic culinary experience for you.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="e.g. paneer, tomatoes, garlic"
            aria-label="Add ingredient"
            name="ingredient"
            // Dynamic Input Styling
            className={`flex-1 px-6 py-4 rounded-full border backdrop-blur-md outline-none focus:border-orange-500/50 transition-all shadow-[0_0_30px_rgba(242,148,26,0.15)] font-light ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-zinc-600' : 'bg-white/60 border-black/10 text-black placeholder-zinc-400'}`}
          />
          <motion.button 
            type="submit" 
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
          >
            Add
          </motion.button>
        </form>
      </div>
      
      <IngredientsList
        ingredients={ingredients}
        darkMode={darkMode} // Passed down
        resetIngredients={resetIngredients}
        toggleRecipeShown={() => fetchRecipe()}
        deleteIngredient={deleteIngredient}
      />
      
      <section ref={recipeSection} className="mt-20 max-w-4xl mx-auto">
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className={`font-light tracking-widest text-sm uppercase ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Crafting your recipe...</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl flex justify-between items-center backdrop-blur-md">
            <span>{error}</span>
            <button onClick={() => fetchRecipe()} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Retry</button>
          </div>
        )}
        
        {!isLoading && !error && recipe && (
          <RecipeDisplay 
            recipe={recipe} 
            darkMode={darkMode} // Passed down
            onRefine={(text, currentRecipe) => fetchRecipe(text, currentRecipe)} 
            isRefining={isRefining}
            onReset={resetIngredients}
            onRegenerate={() => fetchRecipe()} 
          />
        )}
      </section>
    </main>
  );
}