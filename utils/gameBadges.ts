import { Ionicons } from "@expo/vector-icons";
import { BadgeTints, Colors } from "../theme/colors";
import type { Game } from "../types/game";

export type VibeBadge = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
};

export function pickGameBadge(game: Pick<Game, "supplies">): VibeBadge {
  const supplies = (game.supplies || []).map((s) => s.toLowerCase());
  const hasSupply = (...keywords: string[]) =>
    supplies.some((supply) => keywords.some((keyword) => supply.includes(keyword)));

  if (hasSupply("pillow", "pillows", "cushion")) {
    return {
      label: "Pillow",
      icon: "bed-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.pillow,
    };
  }

  if (hasSupply("balloon", "ball")) {
    return {
      label: "Balloon",
      icon: "balloon-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.balloon,
    };
  }

  if (hasSupply("dice", "die")) {
    return {
      label: "Dice",
      icon: "dice-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.dice,
    };
  }

  if (hasSupply("card", "deck")) {
    return {
      label: "Cards",
      icon: "layers-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.cards,
    };
  }

  if (hasSupply("tissue")) {
    return {
      label: "Tissue",
      icon: "document-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.tissue,
    };
  }

  if (hasSupply("spoon", "spoons")) {
    return {
      label: "Kitchen",
      icon: "restaurant-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.kitchen,
    };
  }

  if (hasSupply("paper", "notebook")) {
    return {
      label: "Paper",
      icon: "document-text-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.paper,
    };
  }

  if (hasSupply("tape")) {
    return {
      label: "Tape",
      icon: "resize-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.tape,
    };
  }

  if (hasSupply("rope", "string")) {
    return {
      label: "Rope",
      icon: "infinite-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.rope,
    };
  }

  if (hasSupply("chalk", "pen", "crayon")) {
    return {
      label: "Draw",
      icon: "create-outline",
      color: Colors.deepTeal,
      tint: BadgeTints.draw,
    };
  }

  return {
    label: "Play",
    icon: "sparkles-outline",
    color: Colors.deepTeal,
    tint: BadgeTints.play,
  };
}
