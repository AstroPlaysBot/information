// src/app/dashboard/DashboardClient.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  roleLabel?: 'Eigentümer' | 'Anteilhaber';
  roleColor?: 'green' | 'orange';
}

interface DashboardClientProps {
  guilds: Guild[];
  user: { username: string; discriminator: string; id: string; avatar?: string };
}

interface ManagedUser {
  id: string;
  discordId: string;
  username: string;
}

export default function DashboardClient({ guilds, user }: DashboardClientProps) {

  // kleiner Fix gegen crash
  if (!guilds || !Array.isArray(guilds)) guilds = [];
  if (!user) user = { username: 'unbekannt', discriminator: '0000', id: '', avatar: undefined };
  
  const [managementOpen, setManagementOpen] = useState(false);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [newId, setNewId] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  // 🔹 Fehler-Fänger für Render
  const renderWithErrorBoundary = (fn: () => JSX.Element) => {
    try {
      return fn();
    } catch (err: any) {
      console.error('DashboardClient render error:', err);
      setClientError(err.message || String(err));
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/dashboard-users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setToast({ type: 'error', message: 'Fehler beim Laden der User: ' + (err.message || String(err)) });
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const addUser = async () => {
    if (!newId.trim()) return;
    try {
      const res = await fetch('/api/dashboard-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: newId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers([...users, data]);
      setNewId('');
      setToast({ type: 'success', message: 'User hinzugefügt!' });
    } catch (err: any) {
      setToast({ type: 'error', message: 'Fehler beim Hinzufügen: ' + (err.message || String(err)) });
    }
  };

  const removeUser = async (id: string) => {
    try {
      await fetch('/api/dashboard-users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setUsers(users.filter(u => u.id !== id));
      setToast({ type: 'success', message: 'User entfernt!' });
    } catch (err: any) {
      setToast({ type: 'error', message: 'Fehler beim Entfernen: ' + (err.message || String(err)) });
    }
  };

  const handleSave = () => setToast({ type: 'success', message: 'Änderungen gespeichert!' });
  const handleCancel = () => setToast({ type: 'error', message: 'Änderungen verworfen!' });

  // 🔹 Render-Fallback bei Props-Fehlern
  if (!user || !guilds) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black p-6">
        <p>Fehler: Ungültige Props. user oder guilds fehlen.</p>
      </div>
    );
  }

  return renderWithErrorBoundary(() => (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-6 py-16 text-white">
      {clientError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-red-700 p-6 rounded shadow-lg max-w-md w-full text-white">
            <h2 className="text-2xl font-bold mb-2">Client-seitiger Fehler</h2>
            <pre className="whitespace-pre-wrap break-words">{clientError}</pre>
            <p className="mt-2 text-sm">Überprüfe die Browser-Konsole für Details.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-12">
        <img
          src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-bold text-lg">{user.username ?? '–'}#{user.discriminator ?? '–'}</p>
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-center mb-8">Wähle einen Server</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {(guilds ?? []).map((g, i) => (
          <motion.button
            key={g.id ?? i}
            onClick={() => setManagementOpen(g.id === 'management' ? !managementOpen : false)}
            className="group relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-700 hover:to-pink-600 transition transform hover:scale-105"
          >
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">{g.name ?? '–'}</h3>
              {g.roleLabel && (
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full shadow-lg ${
                    g.roleColor === 'green' ? 'bg-green-600' : 'bg-orange-500'
                  }`}
                >
                  {g.roleLabel}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <p className="mt-6 text-center text-gray-400">
        Wird dein Server hier nicht angezeigt? Das liegt daran, dass der Bot noch nicht auf deinem Server installiert ist. Du kannst ihn über{' '}
        <a href="[Link]" className="text-purple-500 underline">
          diesen Link
        </a>{' '}
        hinzufügen.
      </p>

      <AnimatePresence>
        {managementOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-96 bg-gray-900/95 backdrop-blur-lg p-6 shadow-2xl z-50 flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-4">Dashboard Management</h2>

            <div className="flex flex-col gap-2 mb-4 overflow-y-auto max-h-96">
              {(users ?? []).map(u => (
                <div key={u.id ?? u.discordId} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span>{u.username ?? '–'} ({u.discordId ?? '–'})</span>
                  <button className="text-red-500 font-bold" onClick={() => removeUser(u.id)}>×</button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="Discord ID hinzufügen"
                className="flex-1 p-2 rounded bg-gray-800 text-white"
              />
              <button onClick={addUser} className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700">
                Hinzufügen
              </button>
            </div>

            <div className="mt-auto flex justify-end gap-4">
              <button onClick={handleCancel} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">
                Abbrechen
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
                Speichern
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  ));
}
