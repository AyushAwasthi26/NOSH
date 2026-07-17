// import Groq from "groq-sdk";

// const SYSTEM_PROMPT = `
// You are Chef Claude, a professional culinary director.
// Generate one complete recipe based on the user's ingredients and desired servings.
// You MUST respond with ONLY valid JSON. No markdown, no code fences, no extra text.

// Match this exact shape:

// {
//   "title": string,
//   "description": string,
//   "cuisine": string,
//   "mealType": string,
//   "difficulty": "Easy" | "Medium" | "Hard",
//   "cookingTime": string (e.g. "25 mins"),
//   "servings": number,
//   "calories": number,
//   "nutrition": {
//     "calories": number,
//     "protein": string (e.g. "18 g"),
//     "carbs": string,
//     "fat": string,
//     "fiber": string,
//     "sugar": string,
//     "sodium": string
//   },
//   "ingredients": [
//     { "name": string, "quantity": string }
//   ],
//   "steps": [
//     { "title": string, "description": string, "duration": string, "tip": string }
//   ],
//   "swaps": [
//     { "original": string, "substitute": string, "reason": string }
//   ],
//   "tips": [string]
// }

// Rules:
// - "ingredients" must be a non-empty array of objects (never a string).
// - "steps" must be a non-empty array of objects (never a string).
// - Scale ingredient quantities to match the requested servings.
// - Keep it realistic and cookable with the given ingredients (you may add basic pantry staples like oil, salt, water).
// `;

// function buildUserPrompt(ingredients, servings) {
//     return `Ingredients available: ${ingredients.join(", ")}.
// Requested servings: ${servings || 2}.
// Return one recipe as JSON only.`;
// }

// function validateShape(recipe) {
//     if (!recipe || typeof recipe !== "object") return "Empty or invalid response.";
//     if (!recipe.title || typeof recipe.title !== "string") return "Missing title.";
//     if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return "Ingredients must be a non-empty array.";
//     if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) return "Steps must be a non-empty array.";
//     return null;
// }

// function normalizeRecipe(recipe, fallbackServings) {
//     return {
//         id: crypto.randomUUID(),
//         title: recipe.title,
//         description: recipe.description || "",
//         cuisine: recipe.cuisine || "Indian",
//         mealType: recipe.mealType || "Lunch",
//         difficulty: recipe.difficulty || "Medium",
//         cookingTime: recipe.cookingTime || "30 mins",
//         servings: recipe.servings || fallbackServings || 2,
//         calories: recipe.calories ?? recipe.nutrition?.calories ?? null,
//         nutrition: {
//             calories: recipe.nutrition?.calories ?? recipe.calories ?? null,
//             protein: recipe.nutrition?.protein ?? "N/A",
//             carbs: recipe.nutrition?.carbs ?? "N/A",
//             fat: recipe.nutrition?.fat ?? "N/A",
//             fiber: recipe.nutrition?.fiber ?? "N/A",
//             sugar: recipe.nutrition?.sugar ?? "N/A",
//             sodium: recipe.nutrition?.sodium ?? "N/A",
//         },
//         ingredients: recipe.ingredients.map((item, index) => ({
//             id: index + 1,
//             name: item.name ?? String(item),
//             quantity: item.quantity ?? "",
//         })),
//         steps: recipe.steps.map((step, index) => ({
//             id: index + 1,
//             title: step.title || `Step ${index + 1}`,
//             description: step.description || step.instruction || "",
//             duration: step.duration || null,
//             tip: step.tip || null,
//         })),
//         swaps: Array.isArray(recipe.swaps) ? recipe.swaps : [],
//         tips: Array.isArray(recipe.tips) ? recipe.tips : [],
//         generatedAt: new Date().toISOString(),
//     };
// }

// async function callGroq(groq, ingredients, servings) {
//     const completion = await groq.chat.completions.create({
//         model: "llama-3.1-8b-instant",
//         response_format: { type: "json_object" },
//         temperature: 0.7,
//         messages: [
//             { role: "system", content: SYSTEM_PROMPT },
//             { role: "user", content: buildUserPrompt(ingredients, servings) },
//         ],
//     });

//     return completion.choices[0].message.content;
// }

// export default async function handler(req, res) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     const { ingredients, servings } = req.body || {};

//     if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
//         return res.status(400).json({ error: "Please add at least one ingredient." });
//     }

//     if (!process.env.GROQ_API_KEY) {
//         return res.status(500).json({ error: "Server misconfigured: missing GROQ_API_KEY." });
//     }

//     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//     let rawResponse;

//     try {
//         rawResponse = await callGroq(groq, ingredients, servings);
//     } catch (err) {
//         console.error("Groq request failed:", err);
//         return res.status(502).json({ error: "AI service is temporarily unavailable. Please try again." });
//     }

//     // Attempt to parse; retry once by asking the model to return valid JSON only.
//     let parsed;

//     try {
//         parsed = JSON.parse(rawResponse);
//     } catch {
//         try {
//             const retryCompletion = await groq.chat.completions.create({
//                 model: "llama-3.1-8b-instant",
//                 response_format: { type: "json_object" },
//                 temperature: 0.3,
//                 messages: [
//                     { role: "system", content: SYSTEM_PROMPT },
//                     { role: "user", content: buildUserPrompt(ingredients, servings) },
//                     { role: "assistant", content: rawResponse },
//                     { role: "user", content: "That was not valid JSON. Return ONLY valid JSON matching the schema, nothing else." },
//                 ],
//             });

//             parsed = JSON.parse(retryCompletion.choices[0].message.content);
//         } catch (err) {
//             console.error("JSON parse failed twice:", err);
//             return res.status(502).json({ error: "The AI returned invalid data. Please try again." });
//         }
//     }

//     const validationError = validateShape(parsed);

//     if (validationError) {
//         return res.status(422).json({ error: `Invalid recipe data: ${validationError}` });
//     }

//     const normalized = normalizeRecipe(parsed, servings);

//     return res.status(200).json(normalized);
// }

import { handleGenerateRecipe } from "./_lib/recipeEngine.js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const result = await handleGenerateRecipe(req.body);

    return res.status(result.status).json(result.body);
}