// lib/discordApi.ts
export async function fetchDiscordMember(userId: string, accessToken: string, guildId: string) {
  const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return null;
  return await res.json(); // { roles: [...] }
}
