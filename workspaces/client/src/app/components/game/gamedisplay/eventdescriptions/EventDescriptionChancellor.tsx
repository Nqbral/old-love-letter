import { EventDescription } from '@shared/common/EventDescription';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionChancellor({
  eventDescription,
}: Props) {
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Chancelier</span>. Il a pioché{' '}
      {eventDescription?.nbCardsToDiscard} carte(s) et doit actuellement en
      placer autant sous la pioche.
    </div>
  );
}
