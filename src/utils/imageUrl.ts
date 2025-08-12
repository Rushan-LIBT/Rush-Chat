// Helper function to get correct image URL for development and production
export const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;
  
  // In production, images are served from the same domain
  if (import.meta.env.PROD) {
    return imagePath; // e.g., "/uploads/filename.jpg"
  }
  
  // In development, images are served from localhost:5000
  return `http://localhost:5000${imagePath}`;
};