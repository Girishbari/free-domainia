"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { joinWaitlist } from "../actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WaitlistFormProps {}

export function DeployProjectForm() {
  const [state, formAction, isPending] = useActionState(joinWaitlist, null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Check if input contains a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = value.match(urlRegex);

    /*     if (match && match.length > 0) {
      onLinkDetected(match[0]);
    } */
  };

  return (
    <form action={handleSubmit} className="w-full space-y-4 mb-8">
      <div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500">
        <Input
          id="link"
          name="link"
          type="text"
          placeholder="Paste you github or gitlab link here"
          required
          value={email}
          onChange={handleInputChange}
          aria-describedby="email-error"
          className="w-full border-0 bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-black hover:bg-gray-800 text-white font-semibold px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none w-[120px]"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Deploy 🚀"
          )}
        </Button>
      </div>
    </form>
  );
}
