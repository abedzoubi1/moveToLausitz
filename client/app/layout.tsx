import "./globals.css";
import { Inter } from "next/font/google";
import { FilterProvider } from "@/context/FilterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard",
  description: "A responsive dashboard built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
