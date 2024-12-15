import { Hono } from 'hono';
import { askAI, lawAdviceAI, predictVerdictAI, generateDocumentTemplateAI } from './aiservice';

// Controller to handle AI-related queries
export const aiController = (app: Hono) => {
  // Route for general AI queries
  app.post('/ask', async (c) => {
    try {
      const { question } = await c.req.json();
      if (!question) {
        return c.text('❌ Question is required!', 400);
      }

      console.log("💬 User asked: ", question); // Logging user question
      const aiResponse = await askAI(question);  // Call the AI service
      return c.json({ answer: aiResponse });  // Respond with AI's answer
    } catch (error) {
      console.error("⚠️ Error in AI query:", error);
      return c.text('🚨 Failed to get a response from AI, please try again later.', 500);
    }
  });

  // Route for law advice related queries
  app.post('/law-advice', async (c) => {
    try {
      const { query } = await c.req.json();
      if (!query) {
        return c.text('❌ Query is required for legal advice!', 400);
      }

      console.log("⚖️ User asked for legal advice: ", query);
      const lawResponse = await lawAdviceAI(query);  // Call the law advice service
      return c.json({ advice: lawResponse });  // Respond with AI's legal advice
    } catch (error) {
      console.error("⚠️ Error in legal advice query:", error);
      return c.text('🚨 Failed to fetch legal advice, please try again later.', 500);
    }
  });

  // Route for predicting verdicts based on crime details
  app.post('/predict-verdict', async (c) => {
    try {
      const { crimeDetails } = await c.req.json();
      if (!crimeDetails) {
        return c.text('❌ Crime details are required for verdict prediction!', 400);
      }

      console.log("🕵️‍♂️ User asked for verdict prediction based on: ", crimeDetails);
      const verdictPrediction = await predictVerdictAI(crimeDetails);  // Call the verdict prediction service
      return c.json({ prediction: verdictPrediction });  // Respond with predicted verdict
    } catch (error) {
      console.error("⚠️ Error in verdict prediction:", error);
      return c.text('🚨 Failed to predict the verdict, please try again later.', 500);
    }
  });

  // Route for generating document templates
  app.post('/generate-document', async (c) => {
    try {
      const { documentType } = await c.req.json();
      if (!documentType) {
        return c.text('❌ Document type is required to generate the template!', 400);
      }

      console.log("📄 User requested a document template for: ", documentType);
      const documentTemplate = await generateDocumentTemplateAI(documentType);  // Call the document generation service
      return c.json({ template: documentTemplate });  // Respond with the generated template
    } catch (error) {
      console.error("⚠️ Error in document generation:", error);
      return c.text('🚨 Failed to generate the document template, please try again later.', 500);
    }
  });
};
