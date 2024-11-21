import { Hand } from "@/app/components/Hand";

export function Player({
  name,
  hand,
  type,
  win,
}: {
  name: string;
  hand: string[];
  type: string;
  win: boolean;
}) {
  return (
    <div
      className={`${win ? "border-2 border-amber-500" : ""} w-fit mx-auto box-content p-2 my-6`}
    >
      <h2 className={"text-2xl text-center my-6"}>
        {name} - {type}
      </h2>
      <Hand hand={hand} />
    </div>
  );
}
