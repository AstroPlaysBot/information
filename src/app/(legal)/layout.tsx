'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/AGB", label: "AGB / Terms" },
    { href: "/Impressum", label: "Impressum / Imprint" },
    { href: "/Datenschutz", label: "Datenschutz / Privacy" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-4 sm:px-6 lg:px-20 py-16">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT INFO CARD */}
        <div className="w-full lg:w-72 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg flex-shrink-0">
          <h2 className="text-xl font-semibold text-white mb-6">AstroPlaysBot</h2>

          <nav className="flex flex-col gap-2 text-sm">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-purple-600 text-white font-medium"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-800 mt-6 pt-4 text-sm space-y-1">
            <p className="text-gray-400">Kontakt</p>
            <p>
              Discord:{" "}
              <a
                href="https://discord.com/users/3cvhBBm87G"
                className="text-purple-400 hover:underline"
              >
                Beitreten
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:astroplays.help@gmail.com"
                className="text-purple-400 hover:underline"
              >
                astroplays.help@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 max-w-4xl w-full">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 shadow-lg">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
