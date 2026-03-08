'use client';
import React from "react";
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-10">

        {/* LEFT INFO CARD */}
        <div className="w-72 h-fit bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold text-white mb-6">
            AstroPlaysBot
          </h2>

          <nav className="flex flex-col gap-2 text-sm">

            <Link
              href="/AGB"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition"
            >
              AGB / Terms
            </Link>

            <Link
              href="/Impressum"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Impressum
            </Link>

            <Link
              href="/Datenschutz"
              className="px-3 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Datenschutz
            </Link>

          </nav>

          <div className="border-t border-gray-800 mt-6 pt-4 text-sm space-y-1">

            <p className="text-gray-400">Kontakt</p>

            <p>
              Discord:{" "}
              <a
                href="https://discord.com/users/3cvhBBm87G"
                className="text-purple-400 hover:underline"
              >
                3cvhBBm87G
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
        <main className="flex-1 max-w-3xl">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 shadow-lg">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
