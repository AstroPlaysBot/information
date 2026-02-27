'use client';
import React from 'react';

interface LoginButtonsProps {
  isUser: boolean;
  isAdmin: boolean;
  username: string;
}

export default function LoginButtons({ isUser, isAdmin, username }: LoginButtonsProps) {
  const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!;
  const OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify%20guilds`;

  if (!CLIENT_ID || !REDIRECT_URI) {
    return <p>Discord OAuth nicht konfiguriert</p>;
  }

  return (
    <div>
      {isUser ? (
        <div>
          <p>Willkommen, {username}!</p>
          {isAdmin && <p>Du bist Admin.</p>}
          <button
            onClick={() => {
              document.cookie = 'discord_token=; max-age=0; path=/';
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <a href={OAUTH_URL}>
          <button>Login mit Discord</button>
        </a>
      )}
    </div>
  );
}
