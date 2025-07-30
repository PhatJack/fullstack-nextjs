import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome to Todo App</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            A simple and efficient todo list application with authentication.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/login">
            <Button className="rounded-full h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-medium">
              Get Started - Login
            </Button>
          </Link>
          <Link href="/register">
            <Button 
              variant="outline" 
              className="rounded-full h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-medium"
            >
              Create Account
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="font-semibold mb-2">Secure Login</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              JWT-based authentication to keep your tasks private
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold mb-2">Todo Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create, edit, and manage your daily tasks efficiently
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Works perfectly on desktop, tablet, and mobile devices
            </p>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
