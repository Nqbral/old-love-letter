import { Cards } from '@shared/common/Cards';
import { EventDescription, ResultEvent } from '@shared/common/EventDescription';
import { articleCard } from 'app/helper/ArticleCard';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionGuard({ eventDescription }: Props) {
  let cardTarget = articleCard(eventDescription?.cardTarget)?.get('card');
  let articleCardTarget = articleCard(eventDescription?.cardTarget)?.get(
    'articleCard',
  );

  if (eventDescription?.resultEvent == ResultEvent.NoEffect) {
    return (
      <div className="text-center">
        Le joueur{' '}
        <span className={eventDescription?.player.color}>
          {eventDescription?.player.playerName}
        </span>{' '}
        a joué le <span className="font-bold">Garde</span> sans effet.
      </div>
    );
  }
  return (
    <div className="text-center">
      Le joueur{' '}
      <span className={eventDescription?.player.color}>
        {eventDescription?.player.playerName}
      </span>{' '}
      a joué le <span className="font-bold">Garde</span> et pense que le joueur{' '}
      <span className={eventDescription?.playerTargeted?.color}>
        {eventDescription?.playerTargeted?.playerName}
      </span>{' '}
      a {articleCardTarget}
      <span className="font-bold">{cardTarget}</span> dans sa main.
      <br />
      {eventDescription?.resultEvent == ResultEvent.GuardNotGuessed && (
        <div>Ce n'est pas le cas, rien ne se passe.</div>
      )}
      {eventDescription?.resultEvent == ResultEvent.KillPlayer && (
        <div>
          C'est le cas, le joueur{' '}
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          n'est plus en lice.
        </div>
      )}
    </div>
  );
}
