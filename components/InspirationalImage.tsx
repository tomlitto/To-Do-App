import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const motivationalCaptions = [
    'Complete your Must Do to play with me.',
    'Let\'s crush these goals together! I believe in you.',
    'Finish up! Adventure is waiting for us.',
    'You are unstoppable! Just a few more tasks to go.',
    'I\'m so proud of your focus. Let\'s celebrate after!',
];

const InspirationalImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageSubject, setImageSubject] = useState<'woman' | 'hunk'>('woman');
  const [caption, setCaption] = useState<string>('');

  useEffect(() => {
    const generateImage = async () => {
      setIsLoading(true);
      setError(null);
      setImageUrl(null); // Clear previous image while loading
      setCaption(motivationalCaptions[Math.floor(Math.random() * motivationalCaptions.length)]);

      const womanPrompt = "A close-up, portrait-style photo of a beautiful and friendly young woman on a sunny beach. She's wearing a stylish sunhat and smiling playfully at the camera, with a look that says 'Finish your work so we can have fun!' The image should be vibrant, realistic, and highly motivational, reminding the viewer of the vacation that awaits.";
      const hunkPrompt = "A portrait-style, close-up photo of a handsome, muscular man's face. He is smiling encouragingly at the camera, motivating the viewer to work hard and be productive. The style is realistic and inspirational.";
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: imageSubject === 'woman' ? womanPrompt : hunkPrompt,
              },
            ],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
        });
        
        let foundImageUrl: string | null = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              foundImageUrl = `data:image/png;base64,${base64ImageBytes}`;
              break; // Exit after finding the first image
            }
          }
        }

        if (foundImageUrl) {
          setImageUrl(foundImageUrl);
        } else {
            throw new Error("No image data found in API response.");
        }
      } catch (err) {
        console.error("Failed to generate image:", err);
        setError("Could not generate motivational image.");
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [imageSubject]);

  const handleToggleImage = () => {
    setImageSubject(prev => (prev === 'woman' ? 'hunk' : 'woman'));
  };

  const altText = imageSubject === 'woman'
    ? "An AI-generated inspirational image of a woman encouraging hard work."
    : "An AI-generated inspirational image of a man encouraging hard work.";
  const buttonText = imageSubject === 'woman' ? "Change to picture of Hunk" : "Change to picture of Lady";


  return (
    <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center text-center">
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="text-gray-500 animate-pulse">Generating inspiration...</div>
        )}
        {error && !isLoading && (
          <div className="text-red-500 p-4 text-sm">{error}</div>
        )}
        {imageUrl && !isLoading && (
          <img
            src={imageUrl}
            alt={altText}
            className="rounded-lg w-full h-full object-cover"
          />
        )}
      </div>
      <p className="mt-4 text-sm text-gray-600 italic">
        {caption}
      </p>
      <button
        onClick={handleToggleImage}
        disabled={isLoading}
        className="mt-4 inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-brand-primary hover:bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : buttonText}
      </button>
    </div>
  );
};

export default InspirationalImage;