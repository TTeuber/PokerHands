import { Card } from "@/app/components/Card";

export function Hand({ hand }: { hand: string[] }) {
  return (
    <div className={"flex gap-3 justify-center flex-wrap"}>
      {hand.map((card, index) => (
        <Card key={index} card={card} index={index} />
      ))}
    </div>
  );
}
