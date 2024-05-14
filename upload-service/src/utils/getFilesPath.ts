import fs from "fs";
import path from "path";

export default function getAllFiles(folderpath: string) {
  let response: string[] = [];

  const allFilesAndFolder = fs.readdirSync(folderpath);

  allFilesAndFolder.forEach((file) => {
    const fullfilePath = path.join(folderpath, file);
    if (fs.statSync(fullfilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullfilePath));
    } else {
      response.push(fullfilePath);
    }
  });

  return response;
}
