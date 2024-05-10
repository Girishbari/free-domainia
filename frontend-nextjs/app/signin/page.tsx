"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import nookies from "nookies";

export default function Signin() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    try {
      if (!data.email || !data.password) {
        toast.error("Some fields are empty");
        return;
      }
      setLoading(true);
      const resp = await axios.post(`${process.env.BACKEND_URL}/signin`, data);
      console.log(resp);
      if (!resp) {
        throw new Error("");
        return;
      }
      nookies.set({}, "userId", resp.data.user.id);
      nookies.set({}, "email", resp.data.user.email);
      nookies.set({}, "username", resp.data.user.username);
      nookies.set({}, "bio", resp.data.user.bio);

      setLoading(false);
      router.push("/home");
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  }, [data, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="mx-auto  max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign-in</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2" /> sigin
                </>
              ) : (
                "sigin"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant={"outline"}
            className=""
            onClick={() => router.push("/signup")}
          >
            {" "}
            Register here
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
