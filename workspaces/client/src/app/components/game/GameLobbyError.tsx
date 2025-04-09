import PreviousNavBar from '@components/PreviousNavBar';
import LinkButton from '@components/buttons/LinkButton';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';

type Props = {
  error: ServerPayloads[ServerEvents.LobbyError] | null;
};

export default function GameLobbyError({ error }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-12">
      <PreviousNavBar linkTo="/lobby" />
      <h1 className="text-primary text-4xl">Erreur !</h1>
      <p>{error?.message}.</p>
      <LinkButton
        buttonText="Retour à la page des lobby"
        linkTo="/lobby"
        primary={false}
      />
    </div>
  );
}
