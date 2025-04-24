import { EventDescription, TypeEvent } from '@shared/common/EventDescription';

import EventDescriptionBaron from './eventdescriptions/EventDescriptionBaron';
import EventDescriptionChancellor from './eventdescriptions/EventDescriptionChancellor';
import EventDescriptionChancellorPartTwo from './eventdescriptions/EventDescriptionChancellorPartTwo';
import EventDescriptionCountess from './eventdescriptions/EventDescriptionCountess';
import EventDescriptionGuard from './eventdescriptions/EventDescriptionGuard';
import EventDescriptionHandmaid from './eventdescriptions/EventDescriptionHandmaid';
import EventDescriptionKing from './eventdescriptions/EventDescriptionKing';
import EventDescriptionPrincess from './eventdescriptions/EventDescriptionPlayPrincess';
import EventDescriptionPriest from './eventdescriptions/EventDescriptionPriest';
import EventDescriptionPrince from './eventdescriptions/EventDescriptionPrince';
import EventDescriptionSpy from './eventdescriptions/EventDescriptionSpy';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionDisplay({ eventDescription }: Props) {
  switch (eventDescription?.typeEvent) {
    case TypeEvent.PlaySpy:
      return <EventDescriptionSpy eventDescription={eventDescription} />;
    case TypeEvent.PlayGuard:
      return <EventDescriptionGuard eventDescription={eventDescription} />;
    case TypeEvent.PlayPriest:
      return <EventDescriptionPriest eventDescription={eventDescription} />;
    case TypeEvent.PlayBaron:
      return <EventDescriptionBaron eventDescription={eventDescription} />;
    case TypeEvent.PlayHandmaid:
      return <EventDescriptionHandmaid eventDescription={eventDescription} />;
    case TypeEvent.PlayPrince:
      return <EventDescriptionPrince eventDescription={eventDescription} />;
    case TypeEvent.PlayChancellor:
      return <EventDescriptionChancellor eventDescription={eventDescription} />;
    case TypeEvent.PlayChancellorPartTwo:
      return (
        <EventDescriptionChancellorPartTwo
          eventDescription={eventDescription}
        />
      );
    case TypeEvent.PlayKing:
      return <EventDescriptionKing eventDescription={eventDescription} />;
    case TypeEvent.PlayCountess:
      return <EventDescriptionCountess eventDescription={eventDescription} />;
    case TypeEvent.PlayPrincess:
      return <EventDescriptionPrincess eventDescription={eventDescription} />;
    default:
      return (
        <div className="text-center">Aucun joueur n'a joué pour le moment.</div>
      );
  }
}
