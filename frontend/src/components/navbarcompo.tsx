import { useState } from "react";
import { Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "../lib/utils";

export function NavbarCompo() {
  return (
    <div className="relative w-full flex items-center justify-center sm: mx-2">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 ",
        className
      )}
    >
      <Menu setActive={setActive}>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Home"
          path=""
        ></MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Profile"
          path="profile"
        ></MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Projects"
          path="recent-projects"
        ></MenuItem>
        <MenuItem
          setActive={setActive}
          active={active}
          item="Logout"
        ></MenuItem>
      </Menu>
    </div>
  );
}
