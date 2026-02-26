// src/secure/session.ts
import { cookies } from 'next/headers';

export function getTokenCookie(cookieName: 'personal_token' | 'user_token' = 'personal_token') {
  const token = cookies().get(cookieName)?.value;
  return token || null;
}
