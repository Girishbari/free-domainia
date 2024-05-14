/* 
    mote of this service :
    1. fetch project id from redis sns queue
    2. get that project from s3 using id
    3. do npm install and npm run build
    4. upload dist for with project id to s3

 */

import { createClient, commandOptions } from "redis";
import { downloadS3Folder, copyFinalDist } from "./utils/aws";
import { buildProject } from "./utils/utils";
import { PrismaClient } from "@prisma/client";

const subscriber = createClient({
  url: "rediss://default:AVNS_7MG9qDXqpEBS-F7gHxr@free-domainia-verce.d.aivencloud.com:15257",
});
subscriber.connect();

const prisma = new PrismaClient();

const publisher = createClient({
  url: "rediss://default:AVNS_7MG9qDXqpEBS-F7gHxr@free-domainia-verce.d.aivencloud.com:15257",
});
publisher.connect();

publisher.on("error", (err) => {
  console.log(err);
});

subscriber.on("error", (err) => {
  console.log(err);
});

async function main() {
  while (1) {
    try {
      const response = await subscriber.brPop(
        commandOptions({ isolated: true }),
        "build-queue",
        0
      );
      // @ts-ignore
      const projectId = response.element;
      console.log(projectId);

      await downloadS3Folder(`output/${projectId}`);
      await buildProject(`${projectId}`);
      await copyFinalDist(`${projectId}`);
      /*       publisher.hSet("status", projectId, "deployed");
       */

      const findProjectToUpdate = await prisma.project.findMany({
        where: {
          projectId: projectId,
        },
      });

      if (!findProjectToUpdate)
        throw new Error(`no project with ${projectId} found `);

      const updateProject = await prisma.project.update({
        where: {
          id: findProjectToUpdate[0].id,
        },
        data: {
          status: "deployed",
        },
      });

      console.log("downloaded");
    } catch (error: any) {
      console.log("error", error.message);
    }
  }
}

main();
