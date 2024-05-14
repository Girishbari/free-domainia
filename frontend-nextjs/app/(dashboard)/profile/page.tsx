"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import nookies, { parseCookies } from "nookies";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Component() {
  const cookies = parseCookies();
  const [currentInfo, setCurentInfo] = useState<{
    userId: string | undefined;
    username: string | undefined;
    email: string | undefined;
    bio: string | "software engineer at Free-domainia";
  }>({
    userId: cookies["userId"],
    email: localStorage.getItem("email")!,
    bio: localStorage.getItem("bio")!,
    username: localStorage.getItem("username")!,
  });
  const [info, setInfo] = useState({
    userId: cookies["userId"],
    email: localStorage.getItem("email")!,
    bio: localStorage.getItem("bio")!,
    username: localStorage.getItem("username")!,
  });
  const [passwordData, setPasswordData] = useState({
    userId: cookies["userId"],
    currentpass: "",
    newpassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);

  const handleInfo = useCallback(async () => {
    try {
      const resp = await axios.post(
        `${process.env.BACKEND_URL}/updateinfo`,
        info
      );
      if (resp.status !== 200) throw new Error(resp.data);
      setCurentInfo(resp.data.info);
      setInfo(resp.data.info);
      localStorage.setItem("email", resp.data.info.email);
      localStorage.setItem("bio", resp.data.info.bio);
      localStorage.setItem("username", resp.data.info.username);
      toast.success("data updated successfully");
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading2(false);
    }
  }, [info]);

  const handlePassword = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axios.post(
        `${process.env.BACKEND_URL}/updatepassword`,
        passwordData
      );
      if (resp.status !== 200) throw new Error(resp.data);
      console.log(resp.data);
      toast.success("passwword updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, [passwordData]);

  return (
    <div className="w-full h-full bg-slate-950">
      <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{currentInfo.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {currentInfo.bio}
            </p>
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
                    name="username"
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
                    name="email"
                    onChange={(e) =>
                      setInfo({
                        ...info,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  defaultValue={currentInfo.bio}
                  id="bio"
                  name="bio"
                  onChange={(e) =>
                    setInfo({
                      ...info,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleInfo} disabled={loading2}>
                  {" "}
                  {loading2 ? (
                    <>
                      <Loader2 className="mr-2" /> sigin
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
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
                <Button onClick={handlePassword} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2" /> sigin
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
