/**
 * Client-side image processor for admin uploads.
 * Reads image files directly from device (phone, laptop, tablet),
 * scales them to optimal web dimensions, compresses them, and
 * outputs a clean base64 Data URI that persists reliably in MongoDB
 * without depending on ephemeral server file systems or external storage.
 */
export const processDeviceImage = (file, maxWidth = 1600, maxHeight = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected.'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPEG, PNG, WebP, etc.).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from your device.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unable to process the selected image format.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale down if image exceeds max bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Optional smooth downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-efficiency web JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default processDeviceImage;
