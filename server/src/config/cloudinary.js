import { v2 as cloudinary } from 'cloudinary';

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️ [Cloudinary] Configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('ℹ️ [Cloudinary] Credentials not set in .env. Falling back to high-res image data buffer URLs for instant local testing.');
}

export const uploadToCloudinary = async (fileBuffer, mimetype, folder = 'pawconnect') => {
  if (!isConfigured) {
    // Return base64 data URI fallback for local dev
    const base64Data = fileBuffer.toString('base64');
    return `data:${mimetype};base64,${base64Data}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
