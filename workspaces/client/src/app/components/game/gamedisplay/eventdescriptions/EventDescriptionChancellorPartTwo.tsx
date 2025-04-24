import { EventDescription } from '@shared/common/EventDescription';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionChancellorPartTwo({
  eventDescription,
}: Props) {
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Chancelier</span>. Il a pioché{' '}
      {eventDescription?.nbCardsToDiscard} carte(s) et en a placé autant sous la
      pioche.
    </div>
  );
}
