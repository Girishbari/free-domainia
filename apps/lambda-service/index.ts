import { SQSEvent, Context, SQSHandler, SQSRecord } from "aws-lambda";
// @ts-ignore
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  for (const message of event.Records) {
    await processMessageAsync(message);
  }
  console.info("done");
};

async function processMessageAsync(message: SQSRecord): Promise<any> {
  try {
    console.log(`Processing message ${message.body}`);
    console.log(`Processing message ${{ ...message.messageAttributes }}`);
    const {
      PROJECT_ID,
      GIT_REPOSITORY__URL,
      INSTALL_COMMAND,
      BUILD_COMMAN,
      BUILD_DIR,
    } = message.messageAttributes;
    const command = new RunTaskCommand({
      cluster: process.env.AWS_CLUSTER_ARN,
      launchType: "FARGATE",
      taskDefinition: process.env.AWS_TASK_DEFINITION,
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [process.env.AWS_SUBNET_ID],
          securityGroups: [process.env.AWS_SECURITY_GROUP],
          assignPublicIp: "ENABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: process.env.AWS_IMAGE,
            environment: [
              { name: "PROJECT_ID", value: PROJECT_ID },
              { name: "GIT_REPOSITORY__URL", value: GIT_REPOSITORY__URL },
              { name: "INSTALL_COMMAND", value: INSTALL_COMMAND },
              { name: "BUILD_COMMAN", value: BUILD_COMMAN },
              { name: "BUILD_DIR", value: BUILD_DIR },
            ],
          },
        ],
      },
    });

    await ecsClient.send(command);

    return Promise.resolve("Sent the task to ECS cluster");
  } catch (err) {
    console.error("An error occurred");
    throw err;
  }
}
