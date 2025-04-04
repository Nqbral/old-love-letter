import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import desktopcomputer from '../../public/desktop-computer.svg';
import LinkButton from './components/buttons/LinkButton';

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="">Love Letter</h1>
      <div className="flex flex-row gap-12">
        <LinkButton buttonText={'Jouer'} linkTo={'lobby'} primary={true} />
        <LinkButton buttonText={'Règles'} linkTo={'rules'} primary={false} />
      </div>
      <div className="flex flex-row items-center gap-2">
        <FontAwesomeIcon icon={faComputer} height={30} color="#8d9eaa" />
        <p>Pour une expérience optimale, jouer sur un ordinateur</p>
      </div>
    </div>
  );
}
