'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from './StatCard';

const data = [
  { day: 'Mo', joins: 5, leaves: 1 },
  { day: 'Di', joins: 8, leaves: 2 },
  { day: 'Mi', joins: 6, leaves: 3 },
  { day: 'Do', joins: 12, leaves: 4 },
  { day: 'Fr', joins: 10, leaves: 2 },
  { day: 'Sa', joins: 7, leaves: 1 },
  { day: 'So', joins: 9, leaves: 0 },
];

export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-5xl font-extrabold mb-12 animate-fadeIn">Übersicht</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Mitglieder" value="1.284" />
        <StatCard title="Aktive Module" value="9" />
        <StatCard title="Serverwachstum" value="+12%" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="p-6 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Serverwachstum</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#fff' }} />
            <Line type="monotone" dataKey="joins" stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="leaves" stroke="#ec4899" strokeWidth={3} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
