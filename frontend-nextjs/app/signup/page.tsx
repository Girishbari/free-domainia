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
import { Loader } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    try {
      if (!data.email || !data.password || !data.username) {
        toast.error("Some fields are empty");
        return;
      }
      setLoading(true);
      const resp = await axios.post(`${process.env.BACKEND_URL}/signup`, data);
      if (resp.status !== 200) throw new Error(resp.data.message);
      console.log(resp);
      toast.success(resp.data.message);
      setLoading(false);
      router.push("/signin");
    } catch (error: any) {
      console.log(error);
      toast.error(error);

      setLoading(false);
    }
  }, [data, router]);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="mx-auto  max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign-up</CardTitle>
          <CardDescription>
            Enter your username ,email, password to get started 🚀
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                placeholder="username"
                required
                onChange={(e) => setData({ ...data, username: e.target.value })}
                type="username"
              />
            </div>
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
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader className="mr-2" /> signup
                </>
              ) : (
                "signup"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant={"outline"} onClick={() => router.push("/signin")}>
            {" "}
            Login here
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
