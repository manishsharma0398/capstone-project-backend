import { S3Client } from "@aws-sdk/client-s3";
import { Env } from "../config";

export const s3Client = new S3Client({
  region: Env.AWS_REGION,
  credentials: {
    accessKeyId: Env.AWS_ACCESS_KEY_ID,
    secretAccessKey: Env.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET = Env.S3_BUCKET;
