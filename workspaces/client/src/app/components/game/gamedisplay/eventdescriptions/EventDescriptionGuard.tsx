import { EventDescription, ResultEvent } from '@shared/common/EventDescription';
import { articleCard } from 'app/helper/ArticleCard';

type Props = {
  eventDescription: EventDescription | undefined;
};

export default function EventDescriptionGuard({ eventDescription }: Props) {
  const cardTarget = articleCard(eventDescription?.cardTarget)?.get('card');
  const articleCardTarget = articleCard(eventDescription?.cardTarget)?.get(
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
        <div>Ce n&apos;est pas le cas, rien ne se passe.</div>
      )}
      {eventDescription?.resultEvent == ResultEvent.KillPlayer && (
        <div>
          C&apos;est le cas, le joueur{' '}
          <span className={eventDescription?.playerTargeted?.color}>
            {eventDescription?.playerTargeted?.playerName}
          </span>{' '}
          n&apos;est plus en lice.
        </div>
      )}
    </div>
  );
}
