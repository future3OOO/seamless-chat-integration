import { createCanvas, loadImage } from 'canvas';

export const mergeImages = async (images) => {
  const maxWidth = 800; // Maximum width of the final image
  const padding = 10; // Padding between images

  // Load all images
  const loadedImages = await Promise.all(images.map(img => loadImage(img)));

  // Calculate dimensions
  let totalHeight = 0;
  loadedImages.forEach(img => {
    const aspectRatio = img.width / img.height;
    const scaledHeight = maxWidth / aspectRatio;
    totalHeight += scaledHeight + padding;
  });

  // Create canvas
  const canvas = createCanvas(maxWidth, totalHeight);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw images
  let y = 0;
  for (const img of loadedImages) {
    const aspectRatio = img.width / img.height;
    const scaledHeight = maxWidth / aspectRatio;
    ctx.drawImage(img, 0, y, maxWidth, scaledHeight);
    y += scaledHeight + padding;
  }

  // Convert canvas to blob
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.9);
  });
};

export const handleImageUpload = async (files) => {
  if (files.length === 0) return null;
  
  if (files.length === 1) {
    return files[0];
  }

  const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
  const mergedImageBlob = await mergeImages(imageUrls);
  return new File([mergedImageBlob], 'merged_image.jpg', { type: 'image/jpeg' });
};