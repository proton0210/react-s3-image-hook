
import {
    S3Client,
    GetObjectCommand,
    GetObjectCommandOutput,
  } from "@aws-sdk/client-s3";
  import { useQuery } from "@tanstack/react-query";
  
  interface S3ClientConfig {
    region: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  }
  
  export const createS3Client = (config: S3ClientConfig) => {
    return new S3Client(config);
  };
  
  export const useS3Image = (
    s3Client: S3Client,
    bucketName: string,
    key: string
  ) => {
    return useQuery({
      queryKey: ["s3Image", bucketName, key],
      queryFn: async () => {
        try {
          if (!key) {
            throw new Error("Key is undefined or empty");
          }
          const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
          });
  
          const response: GetObjectCommandOutput = await s3Client.send(command);
          if (response.Body) {
            const chunks: Uint8Array[] = [];
            for await (const chunk of response.Body as any) {
              chunks.push(chunk);
            }
            const blob = new Blob(chunks);
            return URL.createObjectURL(blob);
          }
          throw new Error("Response body is empty");
        } catch (error: any) {
          console.error("Error fetching image from S3:", error);
          throw new Error(`Failed to fetch image: ${error.message}`);
        }
      },
    });
  };