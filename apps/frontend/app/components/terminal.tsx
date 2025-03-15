"use client";

import { useEffect, useState, useRef } from "react";
import { XCircle } from "lucide-react";

interface Command {
  text: string;
  delay: number;
  duration: number;
}

interface TerminalProps {
  url: string;
  onClose?: () => void;
}

export function Terminal({ url, onClose }: TerminalProps) {
  const [commands, setCommands] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Generate commands based on the URL
  useEffect(() => {
    const domain = new URL(url).hostname;
    const commandSequence: Command[] = [
      {
        text: `> Initializing connection to ${domain}...`,
        delay: 0,
        duration: 50,
      },
      { text: `> Validating URL structure...`, delay: 800, duration: 40 },
      { text: `> URL validated successfully`, delay: 1200, duration: 30 },
      {
        text: `> Fetching metadata from ${domain}...`,
        delay: 1800,
        duration: 45,
      },
      { text: `> Processing link content...`, delay: 2500, duration: 35 },
      { text: `> Analyzing website structure...`, delay: 3200, duration: 40 },
      {
        text: `> Extracting page title and description...`,
        delay: 4000,
        duration: 30,
      },
      {
        text: `> Checking for security certificates...`,
        delay: 4800,
        duration: 35,
      },
      { text: `> Link processing complete`, delay: 5500, duration: 25 },
      {
        text: `> Adding ${url} to waitlist database...`,
        delay: 6200,
        duration: 40,
      },
      { text: `> Successfully added to waitlist!`, delay: 7000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 9000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 10000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 12000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 15000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 16000, duration: 30 },
      { text: `> Successfully added to waitlist!`, delay: 20000, duration: 30 },
    ];

    // Initialize empty commands
    setCommands(commandSequence.map(() => ""));

    // Type out each command with a delay
    commandSequence.forEach((command, index) => {
      setTimeout(() => {
        setCurrentCommandIndex(index);
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i <= command.text.length) {
            setCommands((prev) => {
              const newCommands = [...prev];
              newCommands[index] = command.text.substring(0, i);
              return newCommands;
            });
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, command.duration);
      }, command.delay);
    });

    // Blink cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(cursorInterval);
    };
  }, [url]);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-black/95 border-l border-white/10 z-50 flex flex-col ring-1 ring-white/20 rounded-lg">
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-gray-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-white/70 text-sm font-mono">Terminal</div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Close terminal"
        >
          <XCircle size={20} />
        </button>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm text-white overflow-y-auto"
      >
        {commands.map((command, index) => (
          <div key={index} className="mb-2">
            {command}
            {index === currentCommandIndex && showCursor && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
