import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure AWS
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

/**
 * Upload a file to S3
 * @param {Object} file - The file object from the request
 * @param {String} folder - The folder name in S3 bucket
 * @returns {Promise<Object>} - S3 upload result containing Location URL
 */
const uploadToS3 = async (file, folder) => {
  try {
    const fileExtension = path.extname(file.name);
    const fileName = `${folder}/${file.name}/${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    return await s3Client.send(new PutObjectCommand(params));
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Delete a file from S3
 * @param {String} fileUrl - The complete S3 URL of the file
 * @returns {Promise<Object>} - S3 delete result
 */
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL
    const key = fileUrl.split('.com/')[1];

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    };

    return await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

export { deleteFromS3, uploadToS3 };

