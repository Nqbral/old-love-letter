import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayBaronButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playBaron = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Baron"
      onClick={playBaron}
      primary={primary}
    />
  );
}
