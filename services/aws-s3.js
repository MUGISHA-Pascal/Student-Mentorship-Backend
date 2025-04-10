import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    requestTimeout: 300000, // 300 seconds = 5 minutes
    connectionTimeout: 10000, // 10 seconds
  }),
});

// Helper function to get folder based on imageType
const getImageFolder = (imageType) => {
  switch (imageType) {
    case 'blog':
      return 'blogs/';
    default:
      return 'uploads/';
  }
};

export const uploadToS3 = async (file, imageType = 'uploads') => {
  const folder = getImageFolder(imageType);
  const fileName = `${folder}${Date.now()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  await s3.send(new PutObjectCommand(uploadParams));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};
