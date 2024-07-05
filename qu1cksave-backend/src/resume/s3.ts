import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  // If using getSignedUrl
  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  // const seconds = 3600;
  // const url = await getSignedUrl(client, command, { expiresIn: seconds });
  // return url;

  const response = await client.send(command);
  console.log(`Called GetObjectCommand for S3`);
  return response;
}

export async function putObject(key: string, byteArray: Uint8Array) {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/
  // - I can just set Bucket, Key, and Body for the input.
  // - For the Body, I can just have a Uint8Array.
  //   -- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-smithy-types/TypeAlias/StreamingBlobPayloadInputTypes/
  //      + NodeJsRuntimeStreamingBlobPayloadInputTypes includes a Uint8Array
  const input = { // PutObjectRequest
    'Bucket': bucketName, // required
    'Key': key, // required
    'Body': byteArray
  };

  const command = new PutObjectCommand(input);

  // const response = await client.send(command);
  await client.send(command);
  console.log(`Called PutObjectCommand for S3`);
  // return response;
}

export async function deleteObject(key: string) {
  const input = { // GetObjectRequest
    'Bucket': bucketName, // required
    'Key': key, // required
  };

  const command = new DeleteObjectCommand(input);
  const response = await client.send(command);
  console.log(`Called DeleteObjectCommand for S3`);
  return response;
}

export function getResumeS3Key(id: string, mimeType: string): string {
    // TODO: Need a better way of doing this instead of appending .docx, .pdf, etc.
    let extension = '';
    switch (mimeType) {
      case 'application/pdf':
        extension = '.pdf';
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        extension = '.docx';
        break;
      default:
        extension = '.pdf';
    }

    return id + extension;
}

