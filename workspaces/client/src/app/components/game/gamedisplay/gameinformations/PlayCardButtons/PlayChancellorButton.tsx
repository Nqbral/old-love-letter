import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayChancellorButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playChancellor = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Chancelier"
      onClick={playChancellor}
      primary={primary}
    />
  );
}
