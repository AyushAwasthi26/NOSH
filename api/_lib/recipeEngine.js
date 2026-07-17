import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are Chef Claude, a professional culinary director.
Generate one complete recipe based on the user's ingredients and desired servings.
Respond with ONLY valid JSON matching this exact shape. No markdown, no code fences, no extra text.

{
  "title": string,
  "description": string,
  "cuisine": string,
  "mealType": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "cookingTime": string,
  "servings": number,
  "calories": number,
  "nutrition": {
    "calories": number,
    "protein": string,
    "carbs": string,
    "fat": string,
    "fiber": string,
    "sugar": string,
    "sodium": string
  },
  "ingredients": [ { "name": string, "quantity": string } ],
  "steps": [ { "title": string, "description": string, "duration": string, "tip": string } ],
  "swaps": [ { "original": string, "substitute": string, "reason": string } ],
  "tips": [string]
}

Rules:
- "ingredients" must be a non-empty array of objects (never a string).
- "steps" must be a non-empty array of objects (never a string).
- Scale ingredient quantities to match the requested servings.
- Keep it realistic and cookable (you may add basic pantry staples like oil, salt, water).
`;

function buildUserPrompt(ingredients, servings) {
    return `Ingredients available: ${ingredients.join(", ")}.
Requested servings: ${servings || 2}.
Return one recipe as JSON only.`;
}

function validateShape(recipe) {
    if (!recipe || typeof recipe !== "object") return "Empty or invalid response.";
    if (!recipe.title || typeof recipe.title !== "string") return "Missing title.";
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) return "Ingredients must be a non-empty array.";
    if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) return "Steps must be a non-empty array.";
    return null;
}

function normalizeRecipe(recipe, fallbackServings) {
    return {
        id: crypto.randomUUID(),
        title: recipe.title,
        description: recipe.description || "",
        cuisine: recipe.cuisine || "Indian",
        mealType: recipe.mealType || "Lunch",
        difficulty: recipe.difficulty || "Medium",
        cookingTime: recipe.cookingTime || "30 mins",
        servings: recipe.servings || fallbackServings || 2,
        calories: recipe.calories ?? recipe.nutrition?.calories ?? null,
        nutrition: {
            calories: recipe.nutrition?.calories ?? recipe.calories ?? null,
            protein: recipe.nutrition?.protein ?? "N/A",
            carbs: recipe.nutrition?.carbs ?? "N/A",
            fat: recipe.nutrition?.fat ?? "N/A",
            fiber: recipe.nutrition?.fiber ?? "N/A",
            sugar: recipe.nutrition?.sugar ?? "N/A",
            sodium: recipe.nutrition?.sodium ?? "N/A",
        },
        ingredients: recipe.ingredients.map((item, index) => ({
            id: index + 1,
            name: item.name ?? String(item),
            quantity: item.quantity ?? "",
        })),
        steps: recipe.steps.map((step, index) => ({
            id: index + 1,
            title: step.title || `Step ${index + 1}`,
            description: step.description || step.instruction || "",
            duration: step.duration || null,
            tip: step.tip || null,
        })),
        swaps: Array.isArray(recipe.swaps) ? recipe.swaps : [],
        tips: Array.isArray(recipe.tips) ? recipe.tips : [],
        generatedAt: new Date().toISOString(),
    };
}

async function callGemini(ingredients, servings) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Server misconfigured: missing GEMINI_API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                parts: [{ text: buildUserPrompt(ingredients, servings) }],
            },
        ],
        config: {
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            responseMimeType: "application/json",
        },
    });

    return response.text.trim();
}

// Core handler logic, transport-agnostic (used by both Vite dev middleware and Vercel function)
export async function handleGenerateRecipe(body) {
    const { ingredients, servings } = body || {};

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return { status: 400, body: { error: "Please add at least one ingredient." } };
    }

    let rawResponse;

    try {
        rawResponse = await callGemini(ingredients, servings);
    } catch (err) {
        console.error("Gemini request failed:", err);
        return { status: 502, body: { error: "AI service is temporarily unavailable. Please try again." } };
    }

    let parsed;

    try {
        parsed = JSON.parse(rawResponse);
    } catch {
        // one retry, asking explicitly for valid JSON only
        try {
            const retryRaw = await callGemini(
                ingredients,
                servings
            );
            parsed = JSON.parse(retryRaw);
        } catch (err) {
            console.error("JSON parse failed twice:", err);
            return { status: 502, body: { error: "The AI returned invalid data. Please try again." } };
        }
    }

    const validationError = validateShape(parsed);

    if (validationError) {
        return { status: 422, body: { error: `Invalid recipe data: ${validationError}` } };
    }

    const normalized = normalizeRecipe(parsed, servings);

    return { status: 200, body: normalized };
}