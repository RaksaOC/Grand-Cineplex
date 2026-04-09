import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";

type PresignPosterUploadInput = {
  movieId: number;
  fileName: string;
  contentType: string | undefined;
};

type PresignPosterUploadResult = {
  uploadUrl: string;
  posterUrl: string;
  key: string;
};

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function inferExtension(fileName: string, contentType: string | undefined) {
  const extFromName = path.extname(fileName || "").replace(".", "").trim();
  if (extFromName) return extFromName.toLowerCase();

  if (!contentType) return "jpg";

  // Basic fallback for common image MIME types
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/jpeg") return "jpg";

  return "jpg";
}

function publicUrlFromKey(key: string): string {
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  }

  const bucket = getEnvOrThrow("S3_BUCKET");
  const region = getEnvOrThrow("AWS_REGION");
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function getMoviePosterPresignedUploadUrl(
  input: PresignPosterUploadInput
): Promise<PresignPosterUploadResult> {
  const region = getEnvOrThrow("AWS_REGION");
  const bucket = getEnvOrThrow("S3_BUCKET");
  const keyPrefix = process.env.S3_KEY_PREFIX || "movie-posters";

  const movieId = input.movieId;
  const contentType = input.contentType || "application/octet-stream";
  const ext = inferExtension(input.fileName, input.contentType);
  const uuid = randomUUID();

  // Key scheme chosen for this project: movie-posters/{movieId}/{uuid}.{ext}
  const key = `${keyPrefix}/${movieId}/${uuid}.${ext}`;

  const s3 = new S3Client({ region });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(
    s3,
    command,
    { expiresIn: 60 * 10 }
  );

  return {
    uploadUrl,
    posterUrl: publicUrlFromKey(key),
    key,
  };
}

