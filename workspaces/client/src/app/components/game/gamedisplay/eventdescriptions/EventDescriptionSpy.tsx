import { EventDescription } from '@shared/common/EventDescription';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionSpy({ eventDescription }: Props) {
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué l'<span className="font-bold">Espionne</span>.
    </div>
  );
}
