"use client";

import { useState, useEffect } from "react";
import { getWaitlistCount } from "../actions/waitlist";
import { DeployProjectForm } from "./deploy-project-form";
import { Terminal } from "./terminal";
import { Avatar } from "./avatar";

export function Dashboard() {
  /* const handleCloseTerminal = () => {
    setShowTerminal(false);
  }; */

  return (
    <div className="w-full min-h-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between ">
      <div className="flex flex-col gap-4 lg:flex-row flex-grow">
        {/* Content section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center lg:items-start lg:text-left ">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600">
              Deploy your React Code in minutes
            </h2>
          </div>
          <div>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl">
              Join 100s of others. Reach 1000s of users quickly and efficiently
              with our expert CDN strategies, enabling your next generation
              product to achieve its full potential.
            </p>
          </div>
          <div className="w-full max-w-md">
            <DeployProjectForm />
          </div>
          <div className="flex items-center justify-center lg:justify-start">
            <div className="flex -space-x-2 mr-4">
              <Avatar initials="JD" index={0} />
              <Avatar initials="AS" index={1} />
              <Avatar initials="MK" index={2} />
            </div>
            <p className="text-white font-semibold">
              {`100`}+ people have already deployed their projects
            </p>
          </div>
        </div>

        {/* Terminal section */}
        <div className="flex-1 flex items-center justify-center mb-6 lg:mb-0 max-w-full lg:max-w-[50%]">
          <Terminal url={"https://google.com"} />
        </div>
      </div>
    </div>
  );
}
