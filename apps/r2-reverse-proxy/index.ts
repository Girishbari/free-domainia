import express, { Request, Response } from "express";
import httpProxy from "http-proxy";

const app = express();
const PORT = 8000;

const BASE_PATH = `${process.env.R2_DIRECTORY}__outputs`;

const proxy = httpProxy.createProxy();

app.use((req: Request, res: Response) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  // Custom Domain - DB Query (if required)
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req) => {
  const url = req.url;
  if (url === "/") {
    proxyReq.path += "index.html";
  }
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
