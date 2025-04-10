import LinkButton from '@components/buttons/LinkButton';
import PreviousNavBar from '@components/navbar/PreviousNavBar';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';

type Props = {
  data: ServerPayloads[ServerEvents.LobbyDelete] | null;
};

export default function GameLobbyDelete({ data }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-12">
      <PreviousNavBar linkTo="/lobby" />
      <h1 className="text-primary text-4xl">Lobby supprimé</h1>
      <p>{data?.message}</p>
      <LinkButton
        buttonText="Retour à la page des lobby"
        linkTo="/lobby"
        primary={false}
      />
    </div>
  );
}
