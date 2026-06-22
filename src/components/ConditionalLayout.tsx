"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current route is /admin or any sub-route of /admin
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      {/* The main page content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}