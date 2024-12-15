import { OpenAI } from 'openai';  // Correct way to import

// Initialize the OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure you have your API key in the .env file
});

export const askAI = async (question: string) => {
  try {
    console.log("💬 Sending query to AI: ", question); // Logging the question sent to AI
    
    // Using the OpenAI instance to interact with the API
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-3.5-turbo',  // Or whichever model you're using
    });

    const aiResponse = response.choices[0]?.message?.content || 'No response 😔';

    // Log and return the AI response
    console.log("🤖 AI's Response: ", aiResponse); // Logging the AI response
    return aiResponse;
  } catch (error) {
    console.error('⚠️ Error interacting with OpenAI API:', error);
    throw new Error('🚨 Failed to get a response from AI, please try again later!');
  }
};

// Additional helper function for law queries to provide more context
export const lawAdviceAI = async (query: string) => {
  try {
    console.log("🔎 Law query received: ", query); // Logging law query

    // Asking AI to provide law-related advice or information
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: query }],
      model: 'gpt-3.5-turbo',
    });

    const lawResponse = response.choices[0]?.message?.content || 'Sorry, no legal information available at the moment ⚖️';

    // Log and return the law-related response
    console.log("⚖️ AI's Legal Advice: ", lawResponse); // Logging legal response
    return lawResponse;
  } catch (error) {
    console.error('⚠️ Error fetching legal advice from AI:', error);
    throw new Error('🚨 Could not retrieve legal information. Please try again later.');
  }
};

// Helper function to predict verdict outcomes
export const predictVerdictAI = async (crimeDetails: string) => {
  try {
    console.log("🕵️‍♂️ Crime details for verdict prediction: ", crimeDetails);

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `Predict verdict for this crime: ${crimeDetails}` }],
      model: 'gpt-3.5-turbo',
    });

    const verdictPrediction = response.choices[0]?.message?.content || 'Verdict prediction unavailable 🤷‍♂️';

    console.log("🔮 AI Verdict Prediction: ", verdictPrediction); // Logging verdict prediction
    return verdictPrediction;
  } catch (error) {
    console.error('⚠️ Error predicting verdict from AI:', error);
    throw new Error('🚨 Could not predict the verdict. Please try again later.');
  }
};

// Helper function to generate legal document templates
export const generateDocumentTemplateAI = async (documentType: string) => {
  try {
    console.log("📄 Requesting document template for: ", documentType);

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `Generate a template for: ${documentType} document` }],
      model: 'gpt-3.5-turbo',
    });

    const documentTemplate = response.choices[0]?.message?.content || 'Sorry, I couldn’t generate the document template 😞';

    console.log("📝 AI Generated Document Template: ", documentTemplate); // Logging the document template
    return documentTemplate;
  } catch (error) {
    console.error('⚠️ Error generating document template from AI:', error);
    throw new Error('🚨 Failed to generate the document template. Please try again later.');
  }
};

