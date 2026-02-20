'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function StatusPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-black
                    text-white flex items-center justify-center p-10">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl rounded-3xl
                   bg-neutral-900/90 border border-white/10
                   backdrop-blur-xl p-10 space-y-6"
      >
        <h1 className="text-4xl font-extrabold">Bot Status</h1>

        <StatusRow label="Status">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            Online
          </span>
        </StatusRow>

        <StatusRow label="Ping">
          <span className="font-mono text-purple-400">42 ms</span>
        </StatusRow>

        <StatusRow label="Uptime">
          <span>3 Tage 4 Stunden</span>
        </StatusRow>

        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-3 rounded-xl
                     bg-purple-600 hover:bg-pink-600
                     transition font-semibold"
        >
          Zurück
        </button>
      </motion.div>
    </div>
  );
}

function StatusRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-xl">
      <span className="text-gray-400">{label}</span>
      {children}
    </div>
  );
}
