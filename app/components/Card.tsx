import { useState } from "react";

export function Card({ card, index }: { card: string; index: number }) {
  let [rank, suit] = card.split("");

  const isRed = suit === "D" || suit === "H";

  if (rank == "T") rank = "10";

  switch (suit) {
    case "D":
      suit = "♦";
      break;
    case "H":
      suit = "♥";
      break;
    case "C":
      suit = "♣";
      break;
    case "S":
      suit = "♠";
      break;
  }

  return (
    <div
      className={`border bg-white ${isRed ? "text-red-800" : "text-black"} text-2xl p-2 aspect-square w-auto h-auto`}
    >
      <span>{rank}</span>
      <span className={"text-3xl mx-1"}>{suit}</span>
    </div>
  );
}
