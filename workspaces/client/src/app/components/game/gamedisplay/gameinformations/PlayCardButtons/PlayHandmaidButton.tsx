import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayHandmaidButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playHandmaid = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer la Servante"
      onClick={playHandmaid}
      primary={primary}
    />
  );
}
