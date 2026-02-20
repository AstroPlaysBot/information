// lib/discordAuth.ts
import { fetchDiscordMember } from './discordApi';

export const ADMIN_ROLE_IDS = ['1474507057154756919']; // Admin / Moderator Rollen-IDs
export const MAIN_GUILD_ID = '1462894776671277241';

export async function checkAdminAccess(discordUserId: string, accessToken: string) {
  // Prüfe, ob der User Mitglied im Server ist und die Rolle hat
  const member = await fetchDiscordMember(discordUserId, accessToken, MAIN_GUILD_ID);
  if (!member) return false;

  const hasRole = member.roles.some((roleId: string) => ADMIN_ROLE_IDS.includes(roleId));
  return hasRole;
}
