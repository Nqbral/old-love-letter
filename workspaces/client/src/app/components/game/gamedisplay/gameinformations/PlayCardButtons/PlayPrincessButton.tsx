import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};
export default function PlayPrincessButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playPrincess = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer la Princesse"
      onClick={playPrincess}
      primary={primary}
    />
  );
}
