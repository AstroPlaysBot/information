import { getApplicationById } from "../../../lib/applications";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function ApplicationDetail({ params }: Props) {
  const app = await getApplicationById(params.id);
  if (!app) return notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-6">Bewerbung – {app.name}</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">Persönliche Daten</h3>
          <p className="text-gray-400">Alter: {app.age || "-"}</p>
          <p className="text-gray-400">Discord: {app.discord || "-"}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">Bewerbung</h3>
          <p className="text-gray-400 leading-relaxed">{app.answers}</p>
        </div>
      </div>
    </div>
  );
}
