export const getBackendImageUrl = (imagePath, type = "product") => {
  if (!imagePath) return null;

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";

  // If it's a category image, assume path already has 'uploads/'
  if (type === "category") {
    return `${baseUrl}/${imagePath}`;
  }
  

  // For product images, add 'uploads/' prefix if missing
  if (type === "product") {
    const normalizedPath = imagePath.startsWith("uploads/")
      ? imagePath
      : `uploads/${imagePath}`;

    return `${baseUrl}/${normalizedPath}`;
  }

  // Default fallback (treat as product)
  const normalizedPath = imagePath.startsWith("uploads/")
    ? imagePath
    : `uploads/${imagePath}`;

  return `${baseUrl}/${normalizedPath}`;
};