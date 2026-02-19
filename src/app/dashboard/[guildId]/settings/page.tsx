export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">
        Bot Einstellungen
      </h1>

      <div className="space-y-6 max-w-2xl">
        <SettingToggle title="Willkommensnachricht" />
        <SettingToggle title="Moderations-Logs aktivieren" />
        <SettingToggle title="Auto-Roles" />
      </div>
    </div>
  );
}

function SettingToggle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between bg-white/5 p-5 rounded-xl border border-white/10">
      <span>{title}</span>
      <input type="checkbox" className="scale-125 accent-purple-500" />
    </div>
  );
}
