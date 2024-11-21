import { useCallback, useState } from "react";

export default function useCheckWinner() {
  const [player1HandType, setPlayer1HandType] = useState<string>("");
  const [player2HandType, setPlayer2HandType] = useState<string>("");
  const [player1IsWinner, setPlayer1IsWinner] = useState<boolean>(false);

  const checkWinner = useCallback((hand1: string[], hand2: string[]) => {
    const player1Values: number[] = getHandValues(hand1)!;
    setPlayer1HandType(getHandType(player1Values[0]));

    const player2Values: number[] = getHandValues(hand2)!;
    setPlayer2HandType(getHandType(player2Values[0]));

    if (checkHandScores(player1Values, player2Values)) {
      setPlayer1IsWinner(true);
    } else {
      setPlayer1IsWinner(false);
    }
  }, []);

  return [
    player1HandType,
    player2HandType,
    player1IsWinner,
    checkWinner,
  ] as const;
}

const rankValue = new Map<string, number>([
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

enum HandType {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

function getHandType(value: number) {
  switch (value as HandType) {
    case HandType.HighCard:
      return "High Card";
    case HandType.Pair:
      return "Pair";
    case HandType.TwoPair:
      return "Two Pair";
    case HandType.ThreeOfAKind:
      return "Three of a Kind";
    case HandType.Straight:
      return "Straight";
    case HandType.Flush:
      return "Flush";
    case HandType.FullHouse:
      return "Full House";
    case HandType.FourOfAKind:
      return "Four of a Kind";
    case HandType.StraightFlush:
      return "Straight Flush";
    case HandType.RoyalFlush:
      return "Royal Flush";
  }
}

class CountMap extends Map<number, number> {}

function getHandValues(hand: string[]) {
  const counts = cardCounts(hand);
  return (
    getRoyalFlush(hand) ||
    getStraightFlush(hand) ||
    getFourOfAKind(counts) ||
    getFullHouse(counts) ||
    getFlush(hand) ||
    getStraight(hand) ||
    getThreeOfAKind(counts) ||
    getTwoPair(counts) ||
    getPair(counts) ||
    getHighCard(hand)
  );
}

function checkHandScores(scores1: number[], scores2: number[]) {
  for (let i = 0; i < scores1.length; i++) {
    if (scores1[i] > scores2[i]) {
      return true;
    } else if (scores1[i] < scores2[i]) {
      return false;
    }
  }
}

function cardCounts(hand: string[]): CountMap {
  const counts = new CountMap();
  hand.forEach((card) => {
    const rank = rankValue.get(card[0])!;
    counts.set(rank, (counts.get(rank) || 0) + 1);
  });
  return counts;
}

function isFlush(hand: string[]) {
  const suits = hand.map((card) => card[1]);
  return suits.every((suit) => suit === suits[0]);
}

function isStraight(hand: string[]) {
  const ranks = hand.map((card) => card[0]);
  const sortedRanks = ranks.sort(
    (a, b) => rankValue.get(a)! - rankValue.get(b)!,
  );
  return sortedRanks.every((rank, index) => {
    if (index === 0) {
      return true;
    }
    return rankValue.get(rank) === rankValue.get(sortedRanks[index - 1])! + 1;
  });
}

function isStraightFlush(hand: string[]) {
  return isFlush(hand) && isStraight(hand);
}

function getRoyalFlush(hand: string[]) {
  if (isStraightFlush(hand) && hand.some((card) => card[0] === "A")) {
    return [HandType.RoyalFlush as number];
  }
  return null;
}

function getStraightFlush(hand: string[]) {
  if (isStraightFlush(hand)) {
    const values = hand
      .map((card) => rankValue.get(card[0])!)
      .sort((a, b) => b - a);
    return [HandType.StraightFlush, ...values];
  }
  return null;
}

function getFourOfAKind(counts: CountMap): number[] | null {
  let fourOfAKind;
  let otherCard;
  counts.forEach((count, rank) => {
    if (count === 4) {
      fourOfAKind = rank;
    } else if (count === 1) {
      otherCard = rank;
    }
  });
  if (fourOfAKind && otherCard) {
    return [HandType.FourOfAKind, fourOfAKind, otherCard];
  }
  return null;
}

function getFullHouse(counts: CountMap): number[] | null {
  let threeOfAKind;
  let pair;
  counts.forEach((count, rank) => {
    if (count === 3) {
      threeOfAKind = rank;
    }
    if (count === 2) {
      pair = rank;
    }
  });
  if (threeOfAKind && pair) {
    return [HandType.FullHouse, threeOfAKind, pair];
  }
  return null;
}

function getFlush(hand: string[]) {
  if (isFlush(hand)) {
    const values = hand
      .map((card) => rankValue.get(card[0])!)
      .sort((a, b) => b - a);
    return [HandType.Flush, ...values];
  }
  return null;
}

function getStraight(hand: string[]) {
  if (isStraight(hand)) {
    const values = hand
      .map((card) => rankValue.get(card[0])!)
      .sort((a, b) => b - a);
    return [HandType.Straight, ...values];
  }
  return null;
}

function getThreeOfAKind(counts: CountMap) {
  let threeOfAKind;
  let otherCards: number[] = [];
  counts.forEach((count, rank) => {
    if (count === 3) {
      threeOfAKind = rank;
    }
    if (count === 1) {
      otherCards.push(rank);
    }
  });
  otherCards.sort((a, b) => b - a);
  if (threeOfAKind) {
    return [HandType.ThreeOfAKind, threeOfAKind, ...otherCards];
  }
  return null;
}

function getTwoPair(counts: CountMap) {
  let pair1: number | null = null;
  let pair2: number | null = null;
  let otherCard: number | null = null;
  counts.forEach((count, rank) => {
    if (count === 2) {
      if (!pair1) {
        pair1 = rank;
      } else {
        pair2 = rank;
      }
    }
    if (count === 1) {
      otherCard = rank;
    }
  });

  if (pair1 && pair2) {
    const pairs = [pair1, pair2].sort((a, b) => b - a);
    return [
      HandType.TwoPair,
      ...([pairs] as unknown as number[]),
      otherCard as unknown as number,
    ];
  }
  return null;
}

function getPair(counts: CountMap) {
  let pair = null;
  let otherCards: number[] = [];
  counts.forEach((count, rank) => {
    if (count === 2) {
      pair = rank;
    }
    if (count === 1) {
      otherCards.push(rank);
    }
  });
  otherCards.sort((a, b) => b - a);
  if (pair) {
    return [HandType.Pair, pair, ...otherCards];
  }
  return null;
}

function getHighCard(hand: string[]) {
  const ranks = hand
    .map((card) => rankValue.get(card[0])!)
    .sort((a, b) => b - a);
  return [HandType.HighCard, ...ranks];
}
