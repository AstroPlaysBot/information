// src/app/apply/advertised/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvertisedPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('apply_error_toast');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.message) setToastMessage(data.message);
      sessionStorage.removeItem('apply_error_toast');
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 10000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-indigo-500/20 blur-[200px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/20 blur-[200px] rounded-full bottom-[-200px] right-[-200px]" />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl flex items-center gap-6 max-w-md w-full"
          >
            <span className="text-sm font-medium">{toastMessage}</span>

            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto text-white/70 hover:text-white font-bold"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center shadow-2xl"
      >

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500/20 border border-green-500/40">
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Bewerbung erfolgreich gesendet
        </h1>

        {/* Text */}
        <div className="text-gray-300 space-y-2 text-lg mb-8">
          <p>Vielen Dank für deine Bewerbung.</p>
          <p>Unser Team wird deine Angaben sorgfältig prüfen.</p>
          <p>Du erhältst eine Rückmeldung sobald eine Entscheidung getroffen wurde.</p>
          <p>Bitte überprüfe regelmäßig deine E-Mails.</p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition font-semibold text-white shadow-lg"
        >
          Zur Startseite zurückkehren
        </button>

      </motion.div>
    </div>
  );
}
