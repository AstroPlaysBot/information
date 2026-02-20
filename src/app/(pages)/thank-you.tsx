'use client';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
    router.refresh(); // Seite neu laden
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-6xl font-bold mb-6 text-center">Danke für deine Bewerbung!</h1>
      <p className="text-xl mb-12 text-center text-gray-300">
        Wir haben deine Bewerbung erhalten und melden uns so schnell wie möglich.
      </p>
      <button
        onClick={goHome}
        className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition shadow-lg"
      >
        Zurück zur Homepage
      </button>
    </div>
  );
}
