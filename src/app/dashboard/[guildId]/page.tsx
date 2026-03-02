// src/app/dashboard/[guildId]/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Member {

  username: string
  userId: string
  role: string

}

export default function GuildDashboardPage() {

  const { guildId } = useParams<{ guildId: string }>();
  const search = useSearchParams();
  const tab = search.get("tab");

  const [guildName, setGuildName] = useState("Loading...");
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

      <div className="space-y-8">

        <h1 className="text-3xl font-bold">
          Server: {guildName} ({guildId})
        </h1>

        <div className="grid grid-cols-2 gap-10">

          {/* Liste */}

          <div className="bg-gray-900 rounded-xl overflow-hidden">

            {members.map((m,i) => (

              <div
                key={i}
                className="grid grid-cols-3 items-center px-6 py-4 border-b border-gray-800"
              >

                <div>{m.username}</div>

                <div className="text-gray-400">
                  {m.userId}
                </div>

                <div className="flex gap-3">

                  <select
                    defaultValue={m.role}
                    className="bg-gray-800 px-3 py-1 rounded"
                  >
                    <option value="PARTNER">Teilhaber</option>
                    <option value="CO_OWNER">Co Owner</option>
                  </select>

                  <button className="text-red-400 hover:text-red-600">
                    Entfernen
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Hinzufügen */}

          <div className="bg-gray-900 p-6 rounded-xl space-y-4 h-fit">

            <h2 className="text-xl font-semibold">
              Person hinzufügen
            </h2>

            <input
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <input
              placeholder="Discord User ID"
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <select className="w-full px-4 py-2 bg-gray-800 rounded">

              <option value="PARTNER">
                Teilhaber
              </option>

              <option value="CO_OWNER">
                Co Owner
              </option>

            </select>

            <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded">

              Hinzufügen

            </button>

          </div>

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

        Dashboard Übersicht

      </div>

    </div>

  );

}
