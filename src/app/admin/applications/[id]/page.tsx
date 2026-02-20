'use client';
import { motion } from 'framer-motion';

export default function ApplicationDetail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <h1 className="text-4xl font-extrabold mb-6">
        Bewerbung – Max Mustermann
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">Persönliche Daten</h3>
          <p className="text-gray-400">Alter: 19</p>
          <p className="text-gray-400">Discord: Max#1234</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">Bewerbung</h3>
          <p className="text-gray-400 leading-relaxed">
            Ich möchte Teil des Teams werden, weil...
          </p>
        </div>
      </div>
    </motion.div>
  );
}
