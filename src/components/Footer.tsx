"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const springInteraction = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 320, damping: 22 }
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-surface-dim pt-20 pb-10 px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand & Mission (Takes up more space) */}
          <div className="md:col-span-5 space-y-6 pr-0 md:pr-12">
            <h3 className="font-playfair font-bold text-3xl text-white tracking-tight">MCDHD/MCDTU 2026</h3>
            <p className="font-inter text-sm leading-relaxed text-[#A0A0A0] max-w-sm">
              Empowering scientific discovery through international collaboration and mitochondrial excellence.
            </p>
            <div className="flex gap-4 pt-4">
               <motion.a href="#" {...springInteraction} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Share">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               </motion.a>
               <motion.a href="#" {...springInteraction} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Email">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="font-inter text-xs font-bold tracking-widest uppercase text-white">Quick Links</h4>
            <ul className="space-y-3 font-inter text-sm">
              <li><Link href="/privacy" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Terms of Service</Link></li>
              <li><Link href="/partners" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">University Partners</Link></li>
              <li><Link href="/contact" className="text-[#A0A0A0] hover:text-secondary-container transition-colors">Contact Secretariat</Link></li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-inter text-xs font-bold tracking-widest uppercase text-white">Location</h4>
            <div className="font-inter text-sm leading-relaxed text-[#A0A0A0] space-y-2">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 text-secondary-container shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Council Hall, Tezpur University<br />Tezpur, Assam, India</span>
              </p>
              <p className="flex items-center gap-2 pt-2">
                <svg className="w-5 h-5 text-secondary-container shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                November 2 - 3, 2026
              </p>
            </div>
          </div>

          {/* Institutional Partners */}
          <div className="md:col-span-2 space-y-6">
             <h4 className="font-inter text-xs font-bold tracking-widest uppercase text-white">In Association With</h4>
             <ul className="space-y-3 font-inter text-sm text-[#A0A0A0]">
                <li>Tezpur University</li>
                <li>Rutgers Health</li>
                <li>Roswell Park Cancer Center</li>
             </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom Bar: Copyright & Developer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-inter text-xs text-[#606060]">
          <p>© 2026 International Symposium on Mitochondria, Cell Death, and Human Disease. All rights reserved.</p>
          
          {/* Synthera Systems Badge */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 transition-colors">
            <span>Platform developed by</span>
            <div className="flex items-center gap-2 text-white font-medium">
                  <Image src="/synthera_system.svg" alt="Synthera Systems Logo" width={20} height={20} />
               {/* <div className="w-4 h-4 bg-secondary-container rounded-sm" />  */}
               <span>Synthera Systems</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}