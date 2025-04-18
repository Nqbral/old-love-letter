import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlaySpyButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playSpy = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer l'Espionne"
      onClick={playSpy}
      primary={primary}
    />
  );
}
