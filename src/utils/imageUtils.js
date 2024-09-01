import { createCanvas, loadImage } from 'canvas';

export const mergeImages = async (images) => {
  const maxWidth = 800; // Maximum width of the final image
  const padding = 10; // Padding between images

  // Load all images
  const loadedImages = await Promise.all(images.map(img => loadImage(img)));

  // Calculate dimensions
  let totalHeight = 0;
  let maxImageWidth = 0;
  loadedImages.forEach(img => {
    const aspectRatio = img.width / img.height;
    const scaledHeight = maxWidth / aspectRatio;
    totalHeight += scaledHeight + padding;
    maxImageWidth = Math.max(maxImageWidth, maxWidth);
  });

  // Create canvas
  const canvas = createCanvas(maxImageWidth, totalHeight);
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
    canvas.toBlob(resolve, 'image/jpeg', 0.8);
  });
};