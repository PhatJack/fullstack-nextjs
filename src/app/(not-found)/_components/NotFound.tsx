"use client";
import React from "react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import Link from "next/link"; // Assuming Next.js for client-side navigation
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { usePathname } from "next/navigation";
import { MorphingText } from "@/components/magicui/morphing-text";

const NotFound = () => {
  const texts = ["404", "Not Found", "👀"];

  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <MorphingText texts={texts} />;
      <Terminal className="w-full max-w-2xl shadow-xl">
        <TypingAnimation>&gt; Attempting to locate resource...</TypingAnimation>

        <AnimatedSpan delay={2000} className="text-red-400">
          <span>Error: Resource not found.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={3000} className="text-red-400">
          <span>
            Path: <span className="text-yellow-300">{pathname}</span>
          </span>
        </AnimatedSpan>

        <AnimatedSpan delay={4000} className="text-yellow-500">
          <span>Searching for alternative routes...</span>
        </AnimatedSpan>

        <AnimatedSpan delay={5000} className="text-blue-400">
          <span>Suggestion: Return to base directory.</span>
        </AnimatedSpan>

        <TypingAnimation delay={6000} className="text-green-500">
          Operation complete with errors.
        </TypingAnimation>

        <TypingAnimation delay={7000} className="text-muted-foreground">
          Press the button below.
        </TypingAnimation>
      </Terminal>
      <div className="mt-8">
        <Link href="/" passHref>
          <RainbowButton>Go to Homepage</RainbowButton>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
