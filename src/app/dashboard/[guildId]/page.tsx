import StatCard from '@/app/dashboard/[guildId]/StatCard';

export default function OverviewPage() {
  return (
    <>
      <h1 className="text-4xl font-extrabold mb-10">Übersicht</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Mitglieder" value="1.284" />
        <StatCard title="Aktive Module" value="9" />
        <StatCard title="Serverwachstum" value="+12%" />
      </div>

      <div className="mt-12 h-64 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
        📈 Serverwachstums-Grafik (kommt)
      </div>
    </>
  );
}
