"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Speakers", href: "/speakers" },
    // { name: "Registration", href: "/registration" },
    { name: "Submissions", href: "/submissions" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-bright/90 backdrop-blur-md border-b border-surface-dim/30">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4 md:px-12 lg:px-24">
        
        {/* Brand */}
        <motion.div {...springInteraction}>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair font-bold text-xl tracking-tight text-primary">
              MCDHD/MCDTU 2026
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.name} {...springInteraction}>
                <Link 
                  href={link.href}
                  className={`font-inter text-sm font-medium transition-colors ${
                    isActive ? "text-secondary font-semibold" : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <motion.div {...springInteraction}>
            <Link 
              href="/registration" 
              className="hidden md:inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-white font-inter text-sm font-medium transition-colors hover:bg-primary-container"
            >
              Register Now
            </Link>
          </motion.div>
          
          {/* Mobile Menu Toggle (Visual Only for now) */}
          <motion.button 
            className="md:hidden p-2 text-primary"
            {...springInteraction}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
}