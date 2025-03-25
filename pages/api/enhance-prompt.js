import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { materialName, basePrompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancementPrompt = `As an expert in 3D rendering and materials, enhance this base prompt with specific details for a ${materialName} material. Add 1-2 sentences about unique physical properties, visual characteristics, and rendering considerations specific to ${materialName}. Keep the technical focus on Cinema 4D and Octane rendering.

Base prompt: "${basePrompt}"

Also suggest a creative, memorable name for this material style (2-3 words maximum).

Format the response as JSON with 'enhancedPrompt' and 'suggestedName' fields.`;

    const result = await model.generateContent(enhancementPrompt);
    const response = await result.response;
    
    try {
      const jsonResponse = JSON.parse(response.text());
      return res.status(200).json(jsonResponse);
    } catch (e) {
      // Fallback if response isn't valid JSON
      return res.status(200).json({
        enhancedPrompt: basePrompt,
        suggestedName: materialName
      });
    }
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return res.status(500).json({ error: 'Failed to enhance prompt' });
  }
} 