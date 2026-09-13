import type { Game } from '../../model/game.types';

interface GameCardProps {
  game: Game;                         // tương đương @Input()
  isSelected: boolean;               // tương đương @Input()
  onSelect: (game: Game) => void;     // tương đương @Output() EventEmitter
}

// React 19: dùng function thường, không cần React.FC
export function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  return (
    <div
      onClick={() => onSelect(game)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-800/50 transition-all duration-300 hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'border border-neutral-700/50'
      }`}
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate text-base font-bold text-white group-hover:text-blue-400">
          {game.title}
        </h3>
        <p className="mt-1 text-xs text-neutral-400">{game.category}</p>
      </div>
    </div>
  );
}
