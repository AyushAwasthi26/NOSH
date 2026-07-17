// // src/ai.js
// import { GoogleGenAI } from "@google/genai";

// const SYSTEM_PROMPT = `
// You are **Chef Claude**, a professional culinary director. 
// Analyze the user's ingredients and design one sophisticated recipe.
// You MUST respond with ONLY valid JSON, using the following exact structure. Do not include markdown formatting or extra text outside the JSON.

// {
//   "title": "Classic Dish Name",
//   "description": "A short 1-2 sentence description of the dish.",
//   "servings": 4,
//   "ingredients": ["1 cup item", "2 tbsp item"],
//   "steps": ["Step 1 instruction", "Step 2 instruction"],
//   "tips": ["Optional tip 1", "Optional tip 2"]
// }
// `;

// export async function getRecipeFromGemini(ingredientsArr, refinement = "", currentRecipe = null) {
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   if (!apiKey) throw new Error("GEMINI_API_KEY missing.");

//   const ai = new GoogleGenAI({ apiKey });
  
//   let prompt;
//   if (refinement && currentRecipe) {
//     // Refinement mode: pass current recipe for context
//     prompt = `Here is the current recipe JSON: ${JSON.stringify(currentRecipe)}. Please modify it based on this request: "${refinement}". Return the FULL modified JSON.`;
//   } else {
//     // Initial generation mode
//     const ingredientsString = ingredientsArr.join(", ");
//     prompt = `I have ${ingredientsString}. Give me one recipe you'd recommend I make!`;
//   }

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ parts: [{ text: prompt }] }],
//       config: {
//         systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
//         responseMimeType: "application/json",
//       },
//     });
//     return response.text.trim();
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     throw new Error("Recipe fetch failed.");
//   }
// }

// ================================================================================================================

// AFTER adding backend:

// =================================================================================================================

// src/ai.js
// src/ai.js
export async function getRecipeFromGemini(ingredientsArr, refinement = "", currentRecipe = null, signal) {
  try {
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ingredients: ingredientsArr, 
        refinement, 
        currentRecipe 
      }),
      signal: signal // <--- THIS IS CRUCIAL! It connects the abort to the fetch
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch recipe.");
    }

    return data;
  } catch (err) {
    // Re-throw the error so the component can check if it was aborted
    throw err;
  }
}