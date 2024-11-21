# Poker Hands Checker

## Running the project

`npm install`
or
`bun install`

then
`npm run dev`
or `bun run dev`

## How it works

Creates a series of scores for a hand in this order:
1. Rank of hand (example: High card: 1, Straight Flush: 9)
2. Rank of card(s) in scoring hand (in descending order if more than one)
3. Rank of card(s) not in scoring hand in descending order

### Example Scoring for a hand of `2H 2D 5S 5C KD`: 
- Hand Rank: [ 3 ]
- Scoring Ranks: [ 5, 2 ], 
- Non-Scoring Ranks: [ 13 ]
- Final Scores: [ 3, 5, 2, 13 ]

### Comparing hands
Do this for both player's hands and then compare both arrays, finding the first value that is higher