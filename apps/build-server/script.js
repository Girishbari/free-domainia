const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const Redis = require("ioredis");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const publisher = new Redis(
  `${process.env.REDIS_URL || "redis://localhost:6379"}`
);

const s3Client = new S3Client({
  region: "auto",
  endpoint: `${process.env.R2_ENDPOINT}`,
  credentials: {
    accessKeyId: `${process.env.R2_ID}`,
    secretAccessKey: `${process.env.R2_SECRET_KEY}`,
  },
});

const PROJECT_ID = process.env.PROJECT_ID;
const INSTALL_COMMAND = process.env.INSTALL_COMMAND || "npm install";
const BUILD_COMMAND = process.env.BUILD_COMMAND || "npm run build";
const BUILD_DIR = process.env.BUILD_DIR || "dist";

function publishLog(log) {
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
  console.log("Executing script.js");
  publishLog("Build Started...");
  const outDirPath = path.join(__dirname, "projects");

  if (fs.existsSync(path.join(__dirname, "projects", BUILD_DIR))) {
    fs.rmSync(path.join(__dirname, "projects", BUILD_DIR), {
      recursive: true,
    });
  }

  const p = exec(`cd ${outDirPath} && ${INSTALL_COMMAND} && ${BUILD_COMMAND}`);

  p.stdout.on("data", function (data) {
    console.log(data.toString());
    publishLog(data.toString());
  });

  p.stdout.on("error", function (data) {
    console.log("Error", data.toString());
    publishLog(`error: ${data.toString()}`);
  });

  p.on("close", async function (code) {
    if (code !== 0) {
      console.error(`Build process exited with code ${code}`);
      publishLog(`Build failed with exit code ${code}`);
      process.exit(1); // Exit with failure
    }
    console.log("Build Complete");
    publishLog(`Build Complete`);
    exec(`ls ${outDirPath}`);
    const distFolderPath = path.join(__dirname, "projects", BUILD_DIR);
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });

    publishLog(`Starting to upload`);
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      console.log("uploading", filePath);
      publishLog(`uploading ${file}`);

      const command = new PutObjectCommand({
        Bucket: "free-domainia-v1",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });

      await s3Client.send(command);
      publishLog(`uploaded ${file}`);
      console.log("uploaded", filePath);
    }
    publishLog(`Done`);
    console.log("Done...");
    console.log("Exiting gracefully...");
    process.exit(0); // Exit successfully
  });
}

init();
