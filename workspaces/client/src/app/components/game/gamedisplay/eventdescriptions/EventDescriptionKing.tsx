import { EventDescription, ResultEvent } from '@shared/common/EventDescription';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionKing({ eventDescription }: Props) {
  if (eventDescription?.resultEvent == ResultEvent.NoEffect) {
    return (
      <div className="text-center">
        Le joueur{' '}
        <span className={eventDescription?.player.color}>
          {eventDescription?.player.playerName}
        </span>{' '}
        a joué le <span className="font-bold">Roi</span> sans effet.
      </div>
    );
  }
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Roi</span> et échange sa main avec
      le joueur{' '}
      <span className={eventDescription?.playerTargeted?.color}>
        {eventDescription?.playerTargeted?.playerName}
      </span>
      .
    </div>
  );
}
