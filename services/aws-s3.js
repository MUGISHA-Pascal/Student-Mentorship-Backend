import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getImageFolder = (imageType) => {
  switch (imageType) {
    case 'blog':
      return 'blogs/';
    default:
      return 'uploads/';
  }
};

// Multer-S3 storage configuration
export const uploadImage = (imageType) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: 'public-read', // Allow public read access
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // Determine the folder based on image type (blog, profile, etc.)
        const folder = getImageFolder(imageType);
        
        // Generate a unique file name using the current timestamp and original file name
        const fileName = `${folder}${Date.now()}-${file.originalname}`;
        cb(null, fileName); // Set the file path (folder + file name)
      },
    }),
  });
};
