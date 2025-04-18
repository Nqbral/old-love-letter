type Props = {
  value: number;
  nameCard: string;
  nbCard: number;
  description: string;
};

export default function HelpCard({
  value,
  nameCard,
  nbCard,
  description,
}: Props) {
  return (
    <div className="flex flex-row gap-2 pb-4">
      <div className="flex flex-1/2 flex-col items-center">
        <div className="font-bold">
          {value}- {nameCard}
        </div>
        <div>x{nbCard}</div>
      </div>
      <div className="italic">{description}</div>
    </div>
  );
}
