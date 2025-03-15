"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div
        className={`mx-auto px-4 py-2 sm:px-6 lg:px-8 transition-all duration-300 backdrop-blur-xl border-b min-w-64 w-4/5 rounded-full ring-1 ring-white/5  ${
          scrolled
            ? "bg-black/40 border-white/10"
            : "bg-transparent border-transparent"
        }`}
      >
        <nav className="flex justify-center items-center space-x-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            FAQ
          </a>
          <Button
            className="bg-white text-blue-900 hover:bg-gray-200"
            onClick={() => {
              const formElement = document.getElementById("waitlist-form");
              if (formElement) {
                formElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
}
