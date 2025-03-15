"use client";

import { Dashboard } from "./components/dashboard";
import { Toaster } from "@/components/ui/toaster";
import { XIcon } from "./components/icons/x-icon";
import { DiscordIcon } from "./components/icons/discord-icon";
import { LinkedInIcon } from "./components/icons/linkedin-icon";
import { GithubIcon } from "./components/icons/github-icon";
import { SocialIcon } from "./components/social-icon";
import { Navbar } from "./components/navbar";

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-graent(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;di
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
    transition: all 0.5s ease-in-out;
  }
`;

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-x-hidden "
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <Navbar />
      <main>
        <div className="content w-full mt-16 mb-5">
          <Dashboard />
        </div>
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(23 23 23)",
              color: "white",
              border: "1px solid rgb(63 63 70)",
            },
            className: "rounded-xl",
            duration: 5000,
          }}
        />
      </main>
      <footer className="pt-6 md:pt-8 flex justify-center space-x-6">
        <SocialIcon
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (formerly Twitter)"
          icon={<XIcon className="w-5 h-5 md:w-6 md:h-6" />}
        />
        <SocialIcon
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          icon={<DiscordIcon className="w-5 h-5 md:w-6 md:h-6" />}
        />
        <SocialIcon
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          icon={<GithubIcon className="w-5 h-5 md:w-6 md:h-6" />}
        />
        <SocialIcon
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          icon={<LinkedInIcon className="w-5 h-5 md:w-6 md:h-6" />}
        />
      </footer>
    </div>
  );
}
