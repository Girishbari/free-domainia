/* 
    Mote of this service :
    1. fetch files from dist folder with id and filePath
    2. kind of deploy it then
    *Not really sure how it is working*
*/

import express from "express";
import cors from "cors";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
import httpProxy from "http-proxy";

const port = 3002;
const app = express();
app.use(cors());

let s3: any;

const BASE_PATH = "https://free-domainia-2.s3.amazonaws.com/__outputs";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  // Custom Domain - DB Query

  const resolvesTo = `${BASE_PATH}/${subdomain}`;
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") proxyReq.path += "index.html";
});

app.listen(port, () => console.log(`Reverse Proxy Running..${port}`));

/* app.get("/*", (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path;
  console.log(id); */

/* const contents = s3.send(
    new GetObjectCommand({
      Bucket: "free-domainia",
      Key: `dist/${id}${filePath}`,
    })
  );

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  res.send(contents.Body); 
}); */
