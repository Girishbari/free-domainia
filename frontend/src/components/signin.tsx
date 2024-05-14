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
import axios from "axios";

const BACKEND_UPLOAD_URL = "https://7vg9j5-3000.csb.app";

export function Signin() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [uploading, setUploading] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign in to deploy 🚀</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>Enter your mail</CardDescription>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="test@gmail.com"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>
        </CardContent>

        <CardContent>
          <CardDescription>Enter your password</CardDescription>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>
          <Button
            onClick={async () => {
              setUploading(true);
              const res = await axios.post(`${BACKEND_UPLOAD_URL}/signin`, {
                email: data.email,
                password: data.password,
              });
              if (res.status == 200) {
                localStorage.setItem("userid", res.data.id)
                setUploading(false);
              }
            }}
            disabled={uploading}
            className="w-full mt-4"
            type="submit"
          >
            {uploading ? "letting you in..." : "Signin"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
