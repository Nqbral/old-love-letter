import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

type Props = {
  nameCard: string;
  img: StaticImageData;
  altimg: string;
  description: ReactNode;
  value: number;
  nbCard: number;
};

export default function CardDescription({
  nameCard,
  img,
  altimg,
  description,
  value,
  nbCard,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-xl flex-col items-center gap-3 rounded-t-full border-2 border-slate-700 pt-12 pb-4">
        <Image src={img} height={200} width={200} alt={altimg} />
        <h3 className="text-lg font-bold">{nameCard}</h3>
      </div>
      <div className="flex w-xl flex-col items-center border-r-2 border-b-2 border-l-2 border-slate-700 px-2 py-4">
        <h4 className="mb-2 font-bold underline">Description</h4>
        {description}
      </div>
      <div className="flex w-xl flex-col items-center border-r-2 border-b-2 border-l-2 border-slate-700 py-4">
        <h4 className="mb-2 font-bold underline">Valeur</h4>
        <p>{value}</p>
      </div>
      <div className="flex w-xl flex-col items-center border-r-2 border-b-2 border-l-2 border-slate-700 py-4">
        <h4 className="mb-2 font-bold underline">Nombre d'exemplaire(s)</h4>
        <p>{nbCard}</p>
      </div>
    </div>
  );
}
