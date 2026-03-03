// src/app/utils/roles.ts
export type RoleType = 'OWNER' | 'CO_OWNER' | 'PARTNER';

export const roleColors: Record<RoleType, string> = {
  OWNER: 'bg-green-600',
  CO_OWNER: 'bg-yellow-500',
  PARTNER: 'bg-orange-500',
};

export const roleLabels: Record<RoleType, string> = {
  OWNER: 'Eigentümer',
  CO_OWNER: 'Miteigentümer',
  PARTNER: 'Teilhaber',
};
