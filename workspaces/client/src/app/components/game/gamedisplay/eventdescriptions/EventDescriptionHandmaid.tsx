import { EventDescription } from '@shared/common/EventDescription';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionHandmaid({ eventDescription }: Props) {
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué la <span className="font-bold">Servante</span> et est protégé des
      attaques pendant 1 tour.
    </div>
  );
}
