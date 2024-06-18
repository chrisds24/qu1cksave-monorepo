import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import

const bucketName = process.env.BUCKET_NAME as string;
const region = process.env.BUCKET_REGION as string;
const accessKeyId = process.env.BUCKET_ACCESS_KEY as string;
const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY as string;

const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getObject(key: string) {
  const input = { // GetObjectRequest
    'Bucket': bucketName, // required
    'Key': key, // required
  };
  const command = new GetObjectCommand(input);
  const response = await client.send(command);
  return response;
}

