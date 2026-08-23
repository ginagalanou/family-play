import type { Game } from "./game";

export type FilterMap = Record<string, true>;

export type GameListItem = Game & {
  createdAt?: number;
  isCustom?: true;
};

export type DerivedFilters = {
  supplies: string[];
  ages: string[];
  noise: string[];
  activity: string[];
};

export type ListRenderable =
  | { type: "rails"; id: "rails" }
  | { type: "summary"; id: "summary"; title: string; count: number }
  | { type: "empty"; id: "empty" }
  | { type: "game"; id: string; game: GameListItem };
