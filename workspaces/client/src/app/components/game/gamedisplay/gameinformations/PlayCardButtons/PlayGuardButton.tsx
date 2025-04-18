import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayGuardButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playGuard = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Garde"
      onClick={playGuard}
      primary={primary}
    />
  );
}
