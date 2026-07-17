// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
// })


// 2nd Version with API middleware for development
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { handleGenerateRecipe } from "./api/_lib/recipeEngine.js";
// import tailwindcss from '@tailwindcss/vite'

// function readJsonBody(req) {
//     return new Promise((resolve, reject) => {
//         let data = "";
//         req.on("data", (chunk) => { data += chunk; });
//         req.on("end", () => {
//             try {
//                 resolve(data ? JSON.parse(data) : {});
//             } catch (err) {
//                 reject(err);
//             }
//         });
//         req.on("error", reject);
//     });
// }

// function apiDevMiddleware() {
//     return {
//         name: "api-dev-middleware",
//         configureServer(server) {
//             server.middlewares.use("/api/generate-recipe", async (req, res) => {
//                 if (req.method !== "POST") {
//                     res.statusCode = 405;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify({ error: "Method Not Allowed" }));
//                     return;
//                 }

//                 try {
//                     const body = await readJsonBody(req);
//                     const result = await handleGenerateRecipe(body);

//                     res.statusCode = result.status;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify(result.body));
//                 } catch (err) {
//                     console.error("Dev API middleware error:", err);
//                     res.statusCode = 400;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify({ error: "Invalid request." }));
//                 }
//             });
//         },
//     };
// }

// export default defineConfig({
//     plugins: [tailwindcss(), react(), apiDevMiddleware()],
// });


// 3rd VERSION to run locally too: 

// vite.config.js
// import { defineConfig, loadEnv } from "vite"; // <-- Add loadEnv here
// import react from "@vitejs/plugin-react";
// import { handleGenerateRecipe } from "./api/_lib/recipeEngine.js";
// import tailwindcss from '@tailwindcss/vite'

// function readJsonBody(req) {
//     return new Promise((resolve, reject) => {
//         let data = "";
//         req.on("data", (chunk) => { data += chunk; });
//         req.on("end", () => {
//             try { resolve(data ? JSON.parse(data) : {}); } 
//             catch (err) { reject(err); }
//         });
//         req.on("error", reject);
//     });
// }

// function apiDevMiddleware() {
//     return {
//         name: "api-dev-middleware",
//         configureServer(server) {
//             server.middlewares.use("/api/generate-recipe", async (req, res) => {
//                 if (req.method !== "POST") {
//                     res.statusCode = 405;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify({ error: "Method Not Allowed" }));
//                     return;
//                 }
//                 try {
//                     const body = await readJsonBody(req);
//                     const result = await handleGenerateRecipe(body);
//                     res.statusCode = result.status;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify(result.body));
//                 } catch (err) {
//                     console.error("Dev API middleware error:", err);
//                     res.statusCode = 400;
//                     res.setHeader("Content-Type", "application/json");
//                     res.end(JSON.stringify({ error: "Invalid request." }));
//                 }
//             });
//         },
//     };
// }

// // Update this part to load .env variables into process.env
// export default defineConfig(({ mode }) => {
//     // This loads variables from .env into process.env
//     Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
    
//     return {
//         plugins: [tailwindcss(), react(), apiDevMiddleware()],
//     };
// });



// 4th version so to make sure it reads their .env file properly and loads the GEMINI_API_KEY into process.env for local development, we can use the following configuration:

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleGenerateRecipe } from "./api/_lib/recipeEngine.js";
import tailwindcss from '@tailwindcss/vite'

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => { data += chunk; });
        req.on("end", () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}

function apiDevMiddleware() {
    return {
        name: "api-dev-middleware",
        configureServer(server) {
            server.middlewares.use("/api/generate-recipe", async (req, res) => {
                if (req.method !== "POST") {
                    res.statusCode = 405;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Method Not Allowed" }));
                    return;
                }

                try {
                    const body = await readJsonBody(req);
                    const result = await handleGenerateRecipe(body);

                    res.statusCode = result.status;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(result.body));
                } catch (err) {
                    console.error("Dev API middleware error:", err);
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Invalid request." }));
                }
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    // Load .env variables into process.env for the local dev server
    Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
    
    return {
        plugins: [tailwindcss(), react(), apiDevMiddleware()],
    };
});