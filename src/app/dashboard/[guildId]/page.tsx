// src/app/dashboard/[guildId]/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Member {
  username: string;
  userId: string;
  role: 'TEILHABER' | 'CO_OWNER';
}

export default function GuildDashboardPage() {

  const { guildId } = useParams<{ guildId: string }>();
  const search = useSearchParams();
  const tab = search.get('tab');

  const [guildName, setGuildName] = useState<string>('Lade...');
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {

    fetch(`/api/guild/${guildId}`)
      .then(r => r.json())
      .then(data => {
        setGuildName(data.name);
        setMembers(data.members || []);
      });

  }, [guildId]);

  if (tab === "verwaltung") {

    return (
      <div className="space-y-10">

        <h1 className="text-3xl font-bold">
          Server: {guildName} ({guildId})
        </h1>

        {/* Liste */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">

          {members.map((m, i) => (

            <div
              key={i}
              className="grid grid-cols-3 items-center px-6 py-4 border-b border-gray-800"
            >

              <div>{m.username}</div>

              <div className="text-gray-400">
                {m.userId}
              </div>

              <div className="flex items-center gap-3">

                <select
                  value={m.role}
                  className="bg-gray-800 px-3 py-1 rounded"
                >
                  <option value="TEILHABER">Teilhaber</option>
                  <option value="CO_OWNER">Co-Owner</option>
                </select>

                <button className="text-red-400 hover:text-red-600">
                  Entfernen
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* Hinzufügen */}

        <div className="bg-gray-900 p-6 rounded-2xl max-w-xl space-y-4">

          <h2 className="text-xl font-semibold">
            Person hinzufügen
          </h2>

          <input
            placeholder="Username"
            className="w-full px-4 py-2 rounded bg-gray-800"
          />

          <input
            placeholder="User ID"
            className="w-full px-4 py-2 rounded bg-gray-800"
          />

          <select className="w-full px-4 py-2 rounded bg-gray-800">
            <option value="TEILHABER">Teilhaber</option>
            <option value="CO_OWNER">Co-Owner</option>
          </select>

          <button className="w-full py-2 rounded bg-purple-600 hover:bg-purple-700">
            Hinzufügen
          </button>

        </div>

      </div>
    );
  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Server: {guildName} ({guildId})
      </h1>

      <div className="text-gray-400">
        Übersicht
      </div>

    </div>

  );
}
