"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import fullDeck from "@/app/utilities/fullDeck";
import { Player } from "@/app/components/Player";
import useCheckWinner from "@/app/utilities/useCheckWinner";

export default function Home() {
  const deck = useRef<string[]>(fullDeck);
  const [hand1, setHand1] = useState<string[]>([]);
  const [hand2, setHand2] = useState<string[]>([]);

  const [player1Type, player2Type, winner, checkWinner] = useCheckWinner();

  const makeHands = useCallback(() => {
    const hand1 = [];
    const hand2 = [];

    for (let i = 0; i < 10; i++) {
      const card =
        deck.current[Math.floor(Math.random() * deck.current.length)];

      if (i % 2 === 0) {
        hand1.push(card);
      } else {
        hand2.push(card);
      }

      deck.current = deck.current.filter((c) => c !== card);
    }

    setHand1(hand1);
    setHand2(hand2);
  }, []);

  useEffect(() => {
    makeHands();
  }, []);

  useEffect(() => {
    checkWinner(hand1, hand2);
  }, [hand1, hand2]);

  const reshuffle = useCallback(() => {
    deck.current = fullDeck;
    makeHands();
  }, [makeHands]);

  return (
    <div>
      <h1 className={"text-4xl text-center my-24"}>Poker Hands</h1>
      <Player name={"Player 1"} hand={hand1} type={player1Type} win={winner} />
      <Player name={"Player 2"} hand={hand2} type={player2Type} win={!winner} />
      <button
        onClick={reshuffle}
        className={
          "block mx-auto mt-8 px-4 py-2 bg-red-900 text-white rounded active:bg-red-950"
        }
      >
        Reshuffle
      </button>
    </div>
  );
}
