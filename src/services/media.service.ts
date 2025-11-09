import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET } from "@/utils/aws";

interface FileRequest {
  fileName: string;
  fileType: string;
  scope: string; // e.g., "listing", "user", etc.
}

export class MediaService {
  static async generatePresignedUrls(files: FileRequest[]) {
    if (!files?.length) {
      throw new Error("No files provided");
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const uniqueName = `${file.scope}/${Date.now()}-${file.fileName}`;
        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: uniqueName,
          ContentType: file.fileType,
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // 1 hour
        });

        const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;

        return {
          fileName: file.fileName,
          uploadUrl,
          fileUrl,
        };
      }),
    );

    return urls;
  }
}
