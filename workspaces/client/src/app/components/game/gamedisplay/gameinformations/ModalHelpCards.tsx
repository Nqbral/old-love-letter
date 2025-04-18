import SecondaryButton from '@components/buttons/SecondaryButton';
import ModalTemplate from '@components/modal/ModalTemplate';
import { MouseEventHandler } from 'react';

type Props = {
  handleClose: MouseEventHandler;
};

export default function ModalHelpCards({ handleClose }: Props) {
  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Aides de jeu</h2>
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                9. Princesse
              </div>
              <div className="py-2">x1</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Quittez la manche si vous la jouez/défaussez
            </div>
          </div>
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                8. Comtesse
              </div>
              <div className="py-2">x1</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Vous devez la jouer si vous détenez le Roi ou un Prince
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                7. Roi
              </div>
              <div className="py-2">x1</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Échangez votre main contre celle d'un autre joueur
            </div>
          </div>
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                6. Chancelier
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Piochez et remettez 2 cartes sous le paquet
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                5. Prince
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Défaussez la main d'un joueur (vous-compris) qui repioche
            </div>
          </div>
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                4. Comtesse
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Vous êtes immunisé contre les autres cartes jusqu'à votre prochain
              tour
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                3. Baron
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Comparez votre main avec celle d'un autre joueur
            </div>
          </div>
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                2. Prêtre
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Regarder la main d'un autre joueur
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                1. Garde
              </div>
              <div className="py-2">x6</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Devinez la main d'un autre joueur (sauf garde)
            </div>
          </div>
          <div className="flex w-full flex-row items-center border-1 border-slate-700">
            <div className="flex w-32 flex-col items-center">
              <div className="w-32 border-b-1 border-slate-700 py-4 font-bold">
                0. Espionne
              </div>
              <div className="py-2">x2</div>
            </div>
            <div className="flex h-full w-full items-center justify-center border-l-1 border-slate-700 px-2">
              Gagnez 1 pion Faveur si personne d'autre ne joue/défausse une
              Espionne
            </div>
          </div>
        </div>

        <SecondaryButton
          buttonText="Retour"
          onClick={handleClose}
          disabled={false}
        />
      </div>
    </ModalTemplate>
  );
}
