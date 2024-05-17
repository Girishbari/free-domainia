"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { parseCookies } from "nookies";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

export default function Deploy() {
  const cookies = parseCookies();

  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handlerSubmit = async () => {
    {
      if (!repoUrl) {
        toast.warning("Please enter valid url");
        return;
      }
      setUploading(true);
      try {
        const res = await axios.post(`${process.env.BACKEND_URL}/deploy`, {
          repoUrl: repoUrl,
          id: cookies["userId"],
        });
        if (res.status != 200) {
          toast.error(`Error in deployment due to ${res.data.message}`);
          return;
        }
        setUploadId(res.data.projectId);
        setUploading(false);
        const interval = setInterval(async () => {
          const response = await axios.get(
            `${process.env.BACKEND_URL}/status?id=${res.data.projectId}&userId=${cookies["userId"]}`
          );

          if (response.data.status === "deployed") {
            clearInterval(interval);
            setDeployed(true);
          }
          if (response.status !== 200) {
            clearInterval(interval);
            setDeployed(false);
            toast.error(
              `Problem with deployment due to ${response.data.message} `
            );
          }
        }, 3000);
      } catch (error: any) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
        setUploading(false);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-[100vh] p-4 bg-slate-950">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 1,
            ease: "easeInOut",
          }}
          className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-normal text-transparent md:text-5xl"
        >
          Github Link <br />
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">
                Deploy your React Project
              </CardTitle>
              <CardDescription>
                Enter the URL of your GitHub repository to deploy it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-url">GitHub Repository URL</Label>
                  <Input
                    onChange={(e) => {
                      setRepoUrl(e.target.value);
                    }}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <Button
                  onClick={handlerSubmit}
                  disabled={uploadId !== "" || uploading}
                  className="w-full"
                  type="submit"
                >
                  {uploadId
                    ? `Deploying (${uploadId})`
                    : uploading
                    ? "Uploading..."
                    : "Upload"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.h1>
      </LampContainer>
      {deployed && (
        <Card className="w-full max-w-sm ">
          <CardHeader>
            <CardTitle className="text-xl">Deployment Status</CardTitle>
            <CardDescription>
              Your website is successfully deployed!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="deployed-url">Deployed URL</Label>
              <Input
                id="deployed-url"
                readOnly
                type="url"
                value={`http://${uploadId}.freedomainia.com:3001/index.html`}
              />
            </div>
            <br />
            <Button className="w-full" variant="outline">
              <a
                href={`http://${uploadId}.freedomainia.com:3001/index.html`}
                target="_blank"
              >
                Visit Website
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

/* "use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { Fira_Code } from "next/font/google";
import axios from "axios";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import nookies, { parseCookies } from "nookies";

const socket = io(process.env.BACKEND_URL!);

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function Home() {
  const cookies = parseCookies();
  const [repoURL, setURL] = useState<string>("");

  const [logs, setLogs] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [projectId, setProjectId] = useState<string | undefined>();
  const [deployPreviewURL, setDeployPreviewURL] = useState<
    string | undefined
  >();

  const logContainerRef = useRef<HTMLElement>(null);

  const isValidURL: [boolean, string | null] = useMemo(() => {
    if (!repoURL || repoURL.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter valid Github Repository URL"];
  }, [repoURL]);

  const handleClickDeploy = useCallback(async () => {
    setLoading(true);

    const { data } = await axios.post(`${process.env.BACKEND_URL}/project`, {
      gitURL: repoURL,
      slug: projectId,
      userId: cookies["userId"],
    });

    if (data && data.data) {
      const { projectSlug, url } = data.data;
      setProjectId(projectSlug);
      setDeployPreviewURL(url);

      console.log(`Subscribing to logs:${projectSlug}`);
      socket.emit("subscribe", `logs:${projectSlug}`);
    }
  }, [projectId, repoURL]);

  const handleSocketIncommingMessage = useCallback((message: string) => {
    console.log(`[Incomming Socket Message]:`, typeof message, message);
    const log = message;
    setLogs((prev) => [...prev, log]);
    logContainerRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    socket.on("message", handleSocketIncommingMessage);

    return () => {
      socket.off("message", handleSocketIncommingMessage);
    };
  }, [handleSocketIncommingMessage]);

  return (
    <main className="flex flex-col justify-center items-center h-[100vh] bg-slate-950">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 1,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-normal text-transparent md:text-7xl"
        >
          Github Link <br />
          <div className="w-[400px] px-6 md:min-w-[600px] ">
            <span className="flex justify-start items-center gap-2">
              <Github className="text-5xl text-white" />
              <Input
                className="text-white"
                disabled={loading}
                value={repoURL}
                onChange={(e) => setURL(e.target.value)}
                type="url"
                placeholder="Github URL"
              />
            </span>
            <Button
              onClick={handleClickDeploy}
              disabled={!isValidURL[0] || loading}
              className="w-full mt-3"
            >
              {loading ? "In Progress" : "Deploy"}
            </Button>
          </div>
        </motion.h1>
        {deployPreviewURL && (
          <div className="mt-2 bg-slate-900 py-4 px-2 rounded-lg">
            <p>
              Preview URL{" "}
              <a
                target="_blank"
                className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg text-lg"
                href={deployPreviewURL}
              >
                {deployPreviewURL}
              </a>
            </p>
          </div>
        )}
        {logs.length > 1 && (
          <div
            className={`${firaCode.className} text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
          >
            <pre className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <code
                  ref={logs.length - 1 === i ? logContainerRef : undefined}
                  key={i}
                >{`> ${log}`}</code>
              ))}
            </pre>
          </div>
        )}
      </LampContainer>
    </main>
  );
}
 */
