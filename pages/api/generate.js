import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure API route options
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Increase the body size limit to 10MB
    }
  }
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, drawingData, customApiKey, generateTextOnly } = req.body;

    // Log the API request details (excluding the full drawing data for brevity)
    console.log('API Request:', {
      prompt: prompt.substring(0, 100) + '...',
      hasDrawingData: !!drawingData,
      hasCustomApiKey: !!customApiKey,
      generateTextOnly: !!generateTextOnly
    });

    // Use custom API key if provided
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure the model with settings based on the request type
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: generateTextOnly ? ["text"] : ["image", "text"]
      }
    });

    // Handle text-only generation
    if (generateTextOnly) {
      console.log('Generating text-only response');
      
      // Make text-only API call
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Extract text from response
      const textResponse = response.text();
      
      console.log('Generated text response:', textResponse.substring(0, 100) + '...');
      
      return res.status(200).json({
        success: true,
        textResponse: textResponse
      });
    }

    // For image generation, proceed as normal
    // Prepare the generation content
    let generationContent;
    if (drawingData) {
      // If we have drawing data, include it in the request
      generationContent = [
        {
          inlineData: {
            data: drawingData,
            mimeType: "image/png"
          }
        },
        { text: prompt }
      ];
    } else {
      // Text-only prompt if no drawing
      generationContent = prompt;
    }

    console.log('Calling Gemini API for image generation...');
    const result = await model.generateContent(generationContent);
    console.log('Gemini API response received');

    const response = await result.response;
    
    // Process the response to extract image data
    let imageData = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (!imageData) {
      throw new Error('No image data received from the API');
    }

    return res.status(200).json({
      success: true,
      imageData: imageData
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    
    // Check for quota exceeded errors
    if (error.message?.includes('quota') || error.message?.includes('Resource has been exhausted')) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later or use your own API key.'
      });
    }
    
    return res.status(500).json({
      error: error.message || 'An error occurred during generation.'
    });
  }
}
