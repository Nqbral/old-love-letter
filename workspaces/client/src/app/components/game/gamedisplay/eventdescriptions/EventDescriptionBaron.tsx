import { Cards } from '@shared/common/Cards';
import { EventDescription, ResultEvent } from '@shared/common/EventDescription';
import { articleCard } from 'app/helper/ArticleCard';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionBaron({ eventDescription }: Props) {
  let cardKilled = articleCard(eventDescription?.killedCard)?.get('card');
  let articleCardKilled = articleCard(eventDescription?.killedCard)?.get(
    'articleCard',
  );

  if (eventDescription?.resultEvent == ResultEvent.NoEffect) {
    return (
      <div className="text-center">
        Le joueur{' '}
        <span className={eventDescription?.player.color}>
          {eventDescription?.player.playerName}
        </span>{' '}
        a joué le <span className="font-bold">Baron</span> sans effet.
      </div>
    );
  }
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Baron</span> et compare sa main avec{' '}
      <span className={eventDescription?.playerTargeted?.color}>
        {eventDescription?.playerTargeted?.playerName}
      </span>
      .
      {eventDescription?.resultEvent == ResultEvent.DrawBaron && (
        <div>Égalité, rien ne se passe.</div>
      )}
      {eventDescription?.resultEvent == ResultEvent.VictoryBaron && (
        <div>
          <span className={eventDescription?.player.color}>
            {eventDescription?.player.playerName}
          </span>{' '}
          gagne contre{' '}
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          qui perds avec {articleCardKilled}
          <span className="font-bold">{cardKilled}</span>.
        </div>
      )}
      {eventDescription?.resultEvent == ResultEvent.LooseBaron && (
        <div>
          <span className={eventDescription?.player.color}>
            {eventDescription?.player.playerName}
          </span>{' '}
          perds contre{' '}
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          avec {articleCardKilled}
          <span className="font-bold">{cardKilled}</span>.
        </div>
      )}
    </div>
  );
}
