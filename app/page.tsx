"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import fullDeck from "@/app/utilities/fullDeck";
import { Player } from "@/app/components/Player";
import useCheckWinner from "@/app/utilities/useCheckWinner";

export default function Home() {
  const deck = useRef<string[]>(fullDeck);
  const [player1Hand, setPlayer1Hand] = useState<string[]>([]);
  const [player2Hand, setPlayer2Hand] = useState<string[]>([]);

  const [player1HandType, player2HandType, player1IsWinner, checkWinner] =
    useCheckWinner();

  const makeHands = useCallback(() => {
    const hand1 = [];
    const hand2 = [];

    for (let i = 0; i < 10; i++) {
      // get random card from deck
      const card =
        deck.current[Math.floor(Math.random() * deck.current.length)];

      if (i % 2 === 0) {
        hand1.push(card);
      } else {
        hand2.push(card);
      }

      deck.current = deck.current.filter((c) => c !== card);
    }

    setPlayer1Hand(hand1);
    setPlayer2Hand(hand2);
  }, []);

  useEffect(() => {
    makeHands();
  }, []);

  useEffect(() => {
    // check winner whenever hands change
    checkWinner(player1Hand, player2Hand);
  }, [player1Hand, player2Hand]);

  const reshuffle = useCallback(() => {
    deck.current = fullDeck;
    makeHands();
  }, [makeHands]);

  return (
    <div>
      <h1 className={"text-4xl text-center my-24"}>Poker Hands</h1>
      <Player
        name={"Player 1"}
        hand={player1Hand}
        type={player1HandType}
        isWinner={player1IsWinner}
      />
      <Player
        name={"Player 2"}
        hand={player2Hand}
        type={player2HandType}
        isWinner={!player1IsWinner}
      />
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
