'use client';

import { useParams } from 'next/navigation';

export default function GuildDashboardPage() {
  const { guildId } = useParams<{ guildId: string }>();

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">
        Server Übersicht
      </h1>

      <p className="text-gray-400 mb-10">
        Guild ID: <span className="text-purple-400">{guildId}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Mitglieder" value="128" />
        <StatCard title="Aktive Module" value="6" />
        <StatCard title="Logs heute" value="42" />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
