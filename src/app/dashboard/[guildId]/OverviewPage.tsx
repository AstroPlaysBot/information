'use client';
import { useEffect, useState } from 'react';
import StatCard from './StatCard';

const initialData = [
  { day: 'Mo', joins: 5, leaves: 1 },
  { day: 'Di', joins: 8, leaves: 2 },
  { day: 'Mi', joins: 6, leaves: 3 },
  { day: 'Do', joins: 12, leaves: 4 },
  { day: 'Fr', joins: 10, leaves: 2 },
  { day: 'Sa', joins: 7, leaves: 1 },
  { day: 'So', joins: 9, leaves: 0 },
];

export default function OverviewPage() {
  const [data, setData] = useState(initialData);

  return (
    <div>
      <h1 className="text-5xl font-extrabold mb-12 animate-fadeIn">Übersicht</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Mitglieder" value="1.284" />
        <StatCard title="Aktive Module" value="9" />
        <StatCard title="Serverwachstum" value="+12%" />
      </div>

      <div className="p-6 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-6">Serverwachstum (Joins / Leaves)</h2>

        <div className="grid grid-cols-7 gap-2 items-end h-48">
          {data.map((d) => (
            <div key={d.day} className="flex flex-col items-center justify-end space-y-1">
              {/* Joins Balken */}
              <div
                className="w-6 bg-purple-600 rounded-t-lg transition-all duration-700"
                style={{ height: `${d.joins * 20}px` }}
              />
              {/* Leaves Balken */}
              <div
                className="w-6 bg-pink-500 rounded-t-lg transition-all duration-700"
                style={{ height: `${d.leaves * 20}px` }}
              />
              <span className="text-xs mt-2">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
