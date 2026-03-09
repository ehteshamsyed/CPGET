"use client"

import { Instagram, Facebook, Youtube, Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 font-black text-slate-900 tracking-tighter text-lg">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            CPGET NUTRITION
          </div>

          {/* Social Icons Section */}
          <div className="flex items-center gap-2">
            {[
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Youtube, href: "#", label: "YouTube" },
              { icon: Globe, href: "#", label: "Website" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright Section */}
          <div className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
            © {new Date().getFullYear()} • Academic Excellence
          </div>

        </div>
      </div>
    </footer>
  )
}