import { createCanvas, loadImage } from 'canvas';

const canvasToBlob = (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  });
};

export const mergeImages = async (images) => {
  const maxWidth = 800; // Maximum width of the final image
  const padding = 10; // Padding between images

  try {
    // Load all images
    const loadedImages = await Promise.all(images.map(img => loadImage(img)));

    // Calculate dimensions
    let totalHeight = 0;
    loadedImages.forEach((img, index) => {
      const aspectRatio = img.width / img.height;
      const scaledHeight = maxWidth / aspectRatio;
      totalHeight += scaledHeight;
      if (index < loadedImages.length - 1) {
        totalHeight += padding;
      }
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
    return await canvasToBlob(canvas);
  } catch (error) {
    console.error('Error merging images:', error);
    throw new Error('Failed to merge images');
  }
};

export const handleImageUpload = async (files) => {
  if (!files || files.length === 0) return null;
  
  if (files.length === 1) {
    return files[0];
  }

  const imageUrls = [];
  try {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        imageUrls.push(URL.createObjectURL(file));
      } else {
        console.warn(`Skipping non-image file: ${file.name}`);
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('No valid image files found');
    }

    const mergedImageBlob = await mergeImages(imageUrls);
    return new File([mergedImageBlob], 'merged_image.jpg', { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error handling image upload:', error);
    throw error;
  } finally {
    // Release the object URLs
    imageUrls.forEach(url => URL.revokeObjectURL(url));
  }
};