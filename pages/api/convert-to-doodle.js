import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, customApiKey } = req.body;

    // Validate inputs
    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Set up the API key
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is required' });
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: ["image", "text"]
      }
    });

    // Create the prompt for doodle conversion
    const prompt = `Convert this image into a clean, high-contrast black and white doodle.
Requirements:
- Use ONLY pure black lines on a pure white background
- No gray tones or shading allowed
- Simple, clean linework only
- Maintain the key shapes and outlines
- High contrast for clarity
- Follow the original content but simplify if needed`;

    // Prepare the generation content
    const generationContent = [
      {
        inlineData: {
          data: imageData,
          mimeType: "image/png"
        }
      },
      { text: prompt }
    ];

    // Generate content
    const result = await model.generateContent(generationContent);
    const response = await result.response;
    
    // Process the response to extract image data
    let convertedImageData = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        convertedImageData = part.inlineData.data;
        break;
      }
    }

    if (!convertedImageData) {
      throw new Error('No image data received from the API');
    }

    // Return the converted image data
    return res.status(200).json({
      success: true,
      imageData: convertedImageData
    });
  } catch (error) {
    console.error('Error in convert-to-doodle API:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred during doodle conversion.'
    });
  }
} 