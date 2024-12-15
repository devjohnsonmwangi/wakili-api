import { Hono } from 'hono';
import { aiController } from './aicontroller';

// Create and export the router to handle AI-related routes
export const aiRouter = new Hono();

aiController(aiRouter);  // Attach all the AI routes to the Hono app

// You can now use aiRouter to handle requests in the main app file (index.ts)

// The routes included are:
// - POST /ask: For general AI queries
// - POST /law-advice: For legal advice queries
// - POST /predict-verdict: For verdict predictions based on crime details
// - POST /generate-document: For generating document templates

