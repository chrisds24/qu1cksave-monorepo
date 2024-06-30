import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
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

// TODO: putObject 
// - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/
// - I can just set Bucket, Key, and Body for the input.
// - For the Body, I can just have a Uint8Array
//   -- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-smithy-types/TypeAlias/StreamingBlobPayloadInputTypes/
//      + NodeJsRuntimeStreamingBlobPayloadInputTypes includes a Uint8Array

