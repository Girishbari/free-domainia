"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DrawerTrigger, DrawerContent, Drawer } from "@/components/ui/drawer";
import nookie from "nookies";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  const handleLogout = () => {
    nookie.destroy({}, "userId");
    router.push("/signin");
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm dark:bg-gray-900 ">
        <Link className="flex items-center gap-2" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Free Domainia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4  ">
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/home"
          >
            Home
          </Link>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/profile"
          >
            Profile
          </Link>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer"
            href="#"
          >
            <Button variant="destructive" onClick={() => handleLogout}>
              Logout
            </Button>
          </Link>
        </nav>
        <Drawer closeThreshold={1024}>
          <DrawerTrigger asChild>
            <Button className="md:hidden" size="icon" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  fill="#ffffff"
                  d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                />
              </svg>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col items-start gap-6 p-6">
              <Link className="text-xl font-semibold" href="#">
                <MountainIcon className="h-6 w-6 mr-2" />
                Free Domainia
              </Link>
              <nav className="grid gap-4">
                <Link
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="/home"
                >
                  Home
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="/projects"
                >
                  Projects
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  href="/profile"
                >
                  Profile
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer"
                  href="#"
                >
                  {/*  <Button variant="outline">Logout</Button> */}
                  <Button
                    name="Logout"
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Link>
              </nav>
            </div>
          </DrawerContent>
        </Drawer>
      </header>
    </>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
