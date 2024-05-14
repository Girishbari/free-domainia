/* 

    Mote of this service : 
    1. clone the repo from github
    2. upload the files to s3 instance with specific id

*/

import express from "express";
import cors from "cors";
import generateID from "./utils/generateID";
import getAllFiles from "./utils/getFilesPath";
import simpleGit from "simple-git";
import path from "path";
import uploadFile from "./utils/aws";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const publisher = createClient({
  url: "rediss://default:AVNS_7MG9qDXqpEBS-F7gHxr@free-domainia-verce.d.aivencloud.com:15257",
});
publisher.connect();

// const subscriber = createClient();
// subscriber.connect();

publisher.on("error", (err) => {
  console.log(err);
});

const prisma = new PrismaClient();

const port = 3000;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "fields are empty" });
      return;
    }
    const isEmailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const isUsernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (isEmailExists || isUsernameExists) {
      res
        .status(400)
        .json({ message: "user with email or username already exists" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        bio: "This is some random gibberish, enter some bio",
      },
    });

    if (user) {
      res.status(200).json({ message: "user created", id: user.id });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "fields are empty" });
      return;
    }
    const isEmailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!isEmailExists) {
      res
        .status(400)
        .json({ message: "user with email or username not registered" });
      return;
    }

    if (isEmailExists.password !== password) {
      res.status(402).json({
        message: "password is incorrect",
      });
      return;
    }
    res.status(200).json({ message: "valid user", user: isEmailExists });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/getprojects", async (req, res) => {
  const userId = req.body.id;
  try {
    const getProject = await prisma.project.findMany({
      where: {
        authorId: Number(userId),
      },
    });
    if (getProject.length === 0) throw new Error("No Project has been found");
    res.json({
      project: getProject,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
});

app.post("/updatepassword", async (req, res) => {
  const { userId, currentpass, newpassword } = req.body;
  try {
    const getUser = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (getUser?.password !== String(currentpass))
      throw new Error("Current password does not matches");

    const updatedPass = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        password: newpassword,
      },
    });
    if (!updatedPass) throw new Error("Problem with updating");
    res.json({
      message: "success",
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(401).send({
      message: error.message,
    });
  }
});

app.post("/updateinfo", async (req, res) => {
  // send in body userId, username, email, bio
  const { userId, username, bio, email } = req.body;
  try {
    const getUser = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    if (!getUser) throw new Error("Current user not matches");

    const updatedinfo = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        username: username,
        email: email,
        bio: bio,
      },
    });
    if (!updatedinfo) throw new Error("Problem with updating");
    res.json({
      message: "success",
      info: updatedinfo,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(401).send({
      message: error.message,
    });
  }
});

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const userid = req.body.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userid),
      },
    });

    if (!user) {
      res.status(401).json({ message: "not a valid user to make requests" });
      return;
    }

    const id = generateID();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    /* files.forEach(async (file) => {
      await uploadFile(file.slice(__dirname.length + 1), file);
      console.log("inloop");
    }); */

    /*     await new Promise((resolve) => setTimeout(resolve, 5000));
     */
    const uploadPromises = files.map(async (file) => {
      return uploadFile(file.slice(__dirname.length + 1), file);
    });

    await Promise.all(uploadPromises);
    console.log("final");

    publisher.lPush("build-queue", id);

    // INSERT => SQL
    // .create =>
    /* publisher.hSet("status", id, "uploaded"); */
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userid),
      },
      data: {
        projects: {
          create: {
            projectId: id,
            status: "uploaded",
          },
        },
      },
    });

    res.json({
      message: "project uploaded sucessfully",
      user: updatedUser,
      projectId: id,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/status", async (req, res) => {
  // send status;
  try {
    const id = String(req.query.id);
    const userId = req.query.userId;

    const checkProjectStatus = await prisma.project.findFirst({
      where: {
        projectId: id,
        authorId: Number(userId),
      },
    });
    if (checkProjectStatus) {
      res.json({
        projectId: id,
        status: checkProjectStatus.status,
      });
    } else {
      throw new Error("no project found");
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("server started at ", port);
});
