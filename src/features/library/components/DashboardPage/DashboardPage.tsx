import { useState } from 'react';
import { useAuth } from '@/features/auth';
import type { Game } from '../../model/game.types';
import { GameCard } from '../GameCard/GameCard';

const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'VALORANT',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    category: 'FPS / Tactical',
    size: '28.5 GB',
    installed: true,
    description: 'A 5v5 character-based tactical shooter where precise gunplay meets adaptive agent abilities.'
  },
  {
    id: '2',
    title: 'League of Legends',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    category: 'MOBA',
    size: '16.2 GB',
    installed: false,
    description: 'A team-based strategy game where two teams of five powerful champions face off.'
  },
  {
    id: '3',
    title: 'PUBG: BATTLEGROUNDS',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80',
    category: 'Battle Royale',
    size: '40.0 GB',
    installed: false,
    description: 'Loot, weaponize, and outwit your opponents to become the last player standing.'
  }
];

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [games] = useState<Game[]>(MOCK_GAMES);
  const [selectedGame, setSelectedGame] = useState<Game>(MOCK_GAMES[0]);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 bg-neutral-950 text-white">
      {/* Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold">VNGGames Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Xin chào, <span className="font-semibold text-blue-400">{user?.username ?? 'Gamer'}</span>!
          </p>
        </div>
        <button
          onClick={() => void logout()}
          className="rounded-lg bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all"
        >
          Đăng xuất
        </button>
      </div>

      {/* Hero Banner Game */}
      {selectedGame && (
        <div className="relative h-72 w-full shrink-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
          <img
            src={selectedGame.bannerUrl}
            alt={selectedGame.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 flex flex-col items-start gap-3 p-8">
            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/30">
              {selectedGame.category}
            </span>
            <h2 className="text-4xl font-extrabold text-white">{selectedGame.title}</h2>
            <p className="max-w-xl text-sm text-neutral-300 line-clamp-2">{selectedGame.description}</p>
            <button className="mt-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95">
              {selectedGame.installed ? 'CHƠI NGAY' : 'TẢI XUỐNG'}
            </button>
          </div>
        </div>
      )}

      {/* Lưới danh sách Game */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-white">Thư viện Game</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isSelected={selectedGame?.id === game.id}
              onSelect={(g) => setSelectedGame(g)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}