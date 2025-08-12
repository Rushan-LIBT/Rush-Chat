// Helper function to get correct image URL for development and production
export const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  
  // Use API base URL for images (they're served from backend)
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 
    (import.meta.env.PROD 
      ? 'https://rush-chat-api.onrender.com' 
      : 'http://localhost:5000');
    
  return `${baseUrl}${imagePath}`;
};