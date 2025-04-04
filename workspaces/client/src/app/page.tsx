import LinkButton from './components/buttons/LinkButton';

export default function Home() {
  return (
    <div className="container flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="">Love Letter</h1>
      <div className="flex flex-row gap-12">
        <LinkButton
          buttonText={'Créer un lobby'}
          linkTo={'lobby'}
          primary={true}
        />
        <LinkButton buttonText={'Règles'} linkTo={'rules'} primary={false} />
      </div>
    </div>
  );
}
