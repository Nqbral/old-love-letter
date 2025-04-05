import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

type Props = {
  linkTo: string;
};

export default function PreviousNavBar({ linkTo }: Props) {
  return (
    <nav
      className={`active left border-primary bg-bg-previous-navbar fixed top-0 left-0 border-r-1 border-b-1 px-4 py-3`}
    >
      <Link href={linkTo}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          height={20}
          color="oklch(87.9% 0.169 91.605)"
        />
      </Link>
    </nav>
  );
}
