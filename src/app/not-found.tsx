import { Metadata } from "next";
import NotFound from "./(not-found)/_components/NotFound";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFoundPage() {
  return <NotFound />;
}
