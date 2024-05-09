"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function CustomComponent({
  name,
  path,
  variant,
}: {
  name: string;
  path: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}) {
  const router = useRouter();
  return (
    <Button variant={variant} onClick={() => router.push(path)}>
      {name}
    </Button>
  );
}
