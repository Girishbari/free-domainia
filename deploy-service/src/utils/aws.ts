import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path, { resolve } from "path";
import "dotenv/config";
import mime from "mime-types";

let s3: any;

if (process.env.accessKeyId && process.env.secretAccessKey) {
  s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.accessKeyId.secretAccessKey,
      secretAccessKey: process.env.accessKeyId.secretAccessKey,
    },
  });
}

const allType = {
  js: "application/javascript",
  svg: "image/svg+xml",
  html: "text/html",
  css: "text/css",
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gig",
};

export async function downloadS3Folder(prefix: string) {
  try {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: "free-domainia-2",
      Prefix: prefix,
    });
    const listObjectsResult = await s3.send(listObjectsCommand);
    const contents = listObjectsResult.Contents || []; // Handle empty list

    console.log("Your bucket contains the following objects:\n");
    for (const item of contents) {
      const key = item.Key;
      /*       console.log(`  • ${key}`);
       */
      const finalOutputPath = path.join(__dirname, key); // Construct output path
      const outputFile = fs.createWriteStream(finalOutputPath);

      const dirName = path.dirname(finalOutputPath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true }); // Create directories if needed
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: "free-domainia-2",
        Key: key,
      });
      const getObjectResult = await s3.send(getObjectCommand);

      // Download file content and pipe it to outputFile
      getObjectResult.Body.pipe(outputFile)
        .on("error", (err: any) => {
          console.error(`Error downloading file ${key}:`, err);
        })
        .on("finish", () => {
          console.log(`Downloaded file: ${key}`);
        });
    }

    console.log("Download complete.");
  } catch (err) {
    console.error("Error downloading files:", err);
  }
}

export function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`);
  const allFiles = getAllFiles(folderPath);
  allFiles.forEach(async (file) => {
    const filetype = String(mime.lookup(file));
    await copyFilesToS3(
      `__outputs/${id}/` + file.slice(folderPath.length + 1),
      file,
      filetype
    );
  });
}

function getAllFiles(folderPath: string) {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}

async function copyFilesToS3(
  fileName: string,
  localFilePath: string,
  filetype: string
) {
  return new Promise(async (resolve) => {
    try {
      const fileContent = fs.readFileSync(localFilePath);
      const response = await s3.send(
        new PutObjectCommand({
          Bucket: "free-domainia-2",
          Key: fileName,
          Body: fileContent,
          ContentType: filetype,
        })
      );
      if (!response) resolve("problem");
      console.log(response);
      resolve("");
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
}
