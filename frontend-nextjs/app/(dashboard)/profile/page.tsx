"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function Component() {
  const [currentInfo, setCurentInfo] = useState({
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    bio: `
Software Engineer at Free-domainia Inc.`,
  });
  const [info, setInfo] = useState({
    userId: localStorage.getItem("userId"),
    username: "Jared Palmer",
    email: "jared@gmail.com",
  });
  const [passwordData, setPasswordData] = useState({
    userId: localStorage.getItem("userId"),
    currentpass: "",
    newpassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInfo = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axios.post(`http://localhost:9000/updateinfo`, info);
      if (!resp) throw new Error();
      console.log(resp.data);
      setCurentInfo({
        ...currentInfo,
        email: resp.data.info.email,
        username: resp.data.info.username,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [info, currentInfo]);

  const handlePassword = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axios.post(
        `http://localhost:9000/updatepassword`,
        passwordData
      );
      if (resp) console.log(resp);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [passwordData]);

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{currentInfo.username}</h1>
          <p className="text-gray-500 dark:text-gray-400">{currentInfo.bio}</p>
        </div>
      </div>
      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-lg font-medium">Personal Information</h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 align-baseline">
              <div>
                <Label htmlFor="name">Username</Label>
                <Input
                  defaultValue={currentInfo.username!}
                  id="name"
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  defaultValue={currentInfo.email!}
                  id="email"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea defaultValue={currentInfo.bio} id="bio" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleInfo}>Save</Button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium">Password</h2>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentpass: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newpassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePassword}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
