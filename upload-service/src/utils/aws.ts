import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import "dotenv/config";

let s3: any;

if (process.env.accessKeyId && process.env.secretAccessKey) {
  s3 = new S3Client({
    credentials: {
      accessKeyId: "AKIA5FTY7AUERQBQCNGI",
      secretAccessKey: "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",
    },
  });
}

export default async function uploadFile(
  fileName: string,
  localFilePath: string
) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(localFilePath);
      const response = await s3.send(
        new PutObjectCommand({
          Bucket: "free-domainia-2",
          Key: fileName,
          Body: fileContent,
        })
      );
      if (response) {
        console.log(response);
        resolve("");
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.log(error);
      reject(error.message);
    }
  });
}
