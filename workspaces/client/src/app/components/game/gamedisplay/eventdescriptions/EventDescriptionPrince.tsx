import { EventDescription } from '@shared/common/EventDescription';
import { articleCard } from 'app/helper/ArticleCard';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionPrince({ eventDescription }: Props) {
  const discardedCard = articleCard(eventDescription?.discardedCard)?.get('card');
  const articleDiscardedCard = articleCard(eventDescription?.discardedCard)?.get(
    'articleCard',
  );

  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Prince</span> sur{' '}
      {eventDescription?.player.id == eventDescription?.playerTargeted?.id ? (
        'lui-même'
      ) : (
        <span className={eventDescription?.playerTargeted?.color}>
          {eventDescription?.playerTargeted?.playerName}
        </span>
      )}
      .
      {eventDescription?.discardedCard != undefined && (
        <div className="text-center">
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          a défaussé {articleDiscardedCard}
          <span className="font-bold">{discardedCard}</span>.
        </div>
      )}
      {eventDescription?.killedCard != undefined && (
        <div className="text-center">
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          a défaussé la <span className="font-bold">Princesse</span> et est donc
          éliminé.
        </div>
      )}
    </div>
  );
}
