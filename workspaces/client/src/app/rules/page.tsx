import { faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BaronImg from '../../../public/baron.png';
import ChancellorImg from '../../../public/chancellor.png';
import CountessImg from '../../../public/countess.png';
import GuardImg from '../../../public/guard.png';
import HandmaidImg from '../../../public/handmaid.png';
import KingImg from '../../../public/king.png';
import PriestImg from '../../../public/priest.png';
import PrinceImg from '../../../public/prince.png';
import PrincessImg from '../../../public/princess.png';
import SpyImg from '../../../public/spy.png';
import PreviousNavBar from '../components/PreviousNavBar';
import LinkButton from '../components/buttons/LinkButton';
import CardDescription from '../components/rules/CardDescription';

export default function Rules() {
  return (
    <div className="flex w-full flex-col items-center gap-16 py-12">
      <PreviousNavBar linkTo="/" />
      <h1 className="text-primary text-4xl">Règles</h1>
      <div className="container flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">Présentation</h2>
          <p className="text-center">
            Dans <span className="font-bold">Love Letter</span> 2 à 6 soupirants
            s'affrontent pour que leurs lettres soient remises à la Princesse du
            royaume, qui cherche le partenaire et le confident idéal, en
            prévision du jour où elle montera sur le trône.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Mise en place du jeu
          </h2>
          <p className="text-center">
            Lors d'une partie de <span className="font-bold">Love Letter</span>,
            les 21 cartes personnages sont mélangées au début de chaque manche
            et la première carte du paquet est mise de côté face cachée.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Déroulement de la Partie
          </h2>
          <p className="text-center">
            <span className="font-bold">Love Letter</span> se déroule selon
            plusieurs manches durant lesquelles vous faites appel aux alliés,
            amis et à la famille de la princesse afin qu'ils lui remettent une
            lettre d'amour.
            <br />
            La carte que vous avez en main représente la personne qui transporte
            actuellement votre missive, mais elle est susceptible de changer à
            mesure que vous jouez et piochez des cartes pendant la manche.
            <br />
            Pour remporter une manche, vous devez détenir la carte dont la
            valeur est la plus élevée à la fin de cette manche ou être le
            dernier joueur en lice.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Tour des Joueurs
          </h2>
          <p className="text-center">
            Effectuez vos tours de jeu en sens horaire. À votre tour, piochez 1
            carte du paquet. Choisissez et jouez ensuite l'une de vos deux
            cartes en résolvant son effet.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Quitter la Manche
          </h2>
          <p className="text-center">
            Certains effets de cartes vous forcent à quitter la manche en cours
            ; un soupirant adverse s'est assuré que votre lettre n'arrive jamais
            à destination.
            <br />
            Lorsque cela se produit,{' '}
            <span className="font-bold">
              défaussez votre main face visible devant vous
            </span>{' '}
            (sans résoudre l'effet de la carte qu'elle contenait).
            <br />
            Jusqu'au début de la prochaine manche,{' '}
            <span className="font-bold">
              {' '}
              vous ne pouvez plus être ciblé par des effets de cartes et vous
              passez votre tour
            </span>
            .
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Cartes Jouées et Défaussées
          </h2>
          <p className="text-center">
            Comparé à la version classique du jeu, les seules cartes{' '}
            <span className="font-bold">face visible</span> sont :
          </p>
          <ul className="list-inside list-disc text-center">
            <li>la dernière carte défaussée ou jouée par l'un des joueurs</li>
            <li>
              les cartes dont les effets sont en cours (Espionne ou Servante)
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Fin de la manche
          </h2>
          <p className="text-center">
            La manche peut s'achever de deux manières : soit quand{' '}
            <span className="font-bold">le paquet est épuisé</span>, soit quand
            lorsqu'il ne reste plus qu'
            <span className="font-bold">un seul joueur en lice</span>.
            <br />
            <br />
            Si le paquet se retrouve vide, tous les joueurs encore en lice
            révèlent et comparent les carte de leur main{' '}
            <span className="font-bold">après le tour du joueur actif</span>.
            <br />
            Si vous détenez la carte dont la valeur est la plus élevée, vous
            remportez la manche et gagnez 1 pion Faveur ; votre lettre est bien
            parvenue à la Princesse.
            <br />
            En cas d'égalité, tous les joueurs concernés remportent la manche et
            chacun d'eux gagne 1 pion faveur.
            <br />
            <br />
            Si vous êtes le seul joueur à participer encore à la manche en cours
            (car tous les autres ont dû la quitter suite à des effets de
            cartes), celle-ci s'achève immédiatement ; vous la remporter et
            gagnez 1 pion faveur.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Commencer la manche suivante
          </h2>
          <p className="text-center">
            Pour débuter la manche suivante, toutes les cartes personnages sont
            à nouveaux réunies, mélangées puis la première carte est alors
            défaussée comme dans la première manche.
            <br />
            <span className="font-bold">
              Le joueur qui a remporté la manche précédente
            </span>{' '}
            effectue alors son tour en premier. Si la manche précédente s'est
            soldée par une égalité, un joueur au hasard sera le premier joueur
            parmi les concernés.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Remporter la partie
          </h2>
          <p className="text-center">
            La partie s'achève lorsqu'un joueur détient suffisamment de pions
            Faveur pour gagner (ce qui dépend du nombre de joueurs, voir tableau
            ci-dessous). Il est possible que plusieurs joueurs remportent
            simultanément la partie.
          </p>
          <table>
            <tbody>
              <tr>
                <td className="min-w-12 border-2 border-slate-700 px-3 py-2 text-center">
                  <FontAwesomeIcon icon={faUser} color="#8d9eaa" />
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  2
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  3
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  4
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  5
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  6
                </td>
              </tr>
              <tr>
                <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                  <FontAwesomeIcon
                    icon={faCoins}
                    color="oklch(92.4% 0.12 95.746)"
                  />
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  6
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  5
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  4
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  3
                </td>
                <td className="min-w-8 border-2 border-slate-700 py-2 text-center">
                  3
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl underline underline-offset-4">
            Effet des cartes
          </h2>
          <p className="mb-6 text-center">
            Chaque carte Personnage repréente une personne importante dans la
            vie de la Princesse. Chaque carte a son propre effet et la section
            suivante fournit les règles complètes pour chaque personnage.
          </p>

          <div className="flex flex-col items-center gap-8">
            {/* Princesse */}
            <CardDescription
              nameCard="Princesse"
              img={PrincessImg}
              altimg="princess_img"
              description={
                <p className="text-center">
                  La princesse est la carte avec{' '}
                  <span className="font-bold">
                    la valeur la plus élevée du jeu
                  </span>
                  .
                  <br />
                  <br />
                  Cependant, si vous jouez ou défaussez la Princesse{' '}
                  <span className="font-bold">
                    pour quelque raison que ce soit
                  </span>
                  , vous quittez immédiatement la manche.
                </p>
              }
              value={9}
              nbCard={1}
            />
            {/* Comtesse */}
            <CardDescription
              nameCard="Comtesse"
              img={CountessImg}
              altimg="countess_img"
              description={
                <p className="text-center">
                  La Comtesse n'a pas d'effect actif lorsqu'elle est jouée ou
                  défaussée.
                  <br />
                  <br />
                  Vous <span className="font-bold">devez</span> la jouer pendant
                  votre tour si l'autre carte de votre main est le{' '}
                  <span className="font-bold">Roi</span> ou un{' '}
                  <span className="font-bold">Prince</span>.
                  <br />
                  <br />
                  Néanmoins, vous pouvez choisir de la jouer durant votre tour
                  même si vous ne détenez ni le Roi, ni un Prince.
                  <br />
                  <br />
                  Son effet ne s'applique pas lorsque vous piochez des cartes
                  suite à d'autres effets (Chancelier).
                </p>
              }
              value={8}
              nbCard={1}
            />
            {/* Roi */}
            <CardDescription
              nameCard="Roi"
              img={KingImg}
              altimg="king_img"
              description={
                <p className="text-center">
                  Choisissez un autre joueur et échangez votre main contre la
                  sienne.
                </p>
              }
              value={7}
              nbCard={1}
            />
            {/* Chancelier */}
            <CardDescription
              nameCard="Chancelier"
              img={ChancellorImg}
              altimg="chancellor_img"
              description={
                <p className="text-center">
                  Piochez 2 cartes du paquet et ajoutez-les à votre main.
                  Choisissez et conservez <span className="font-bold">une</span>{' '}
                  des trois cartes de votre main, puis placez les{' '}
                  <span className="font-bold">deux</span> autres face cachée
                  au-dessous du paquet (dans l'ordre de votre choix).
                  <br />
                  <br />
                  S'il ne reste qu'une seule carte dans le paquet, piochez-la et
                  remettez-en une à sa place. Si le paquet est épuisé, le
                  Chancelier n'a pas d'effet lorsqu'il est joué.
                </p>
              }
              value={6}
              nbCard={2}
            />
            {/* Prince */}
            <CardDescription
              nameCard="Prince"
              img={PrinceImg}
              altimg="prince_img"
              description={
                <p className="text-center">
                  Choisissez{' '}
                  <span className="font-bold">n'importe quel joueur</span>, y
                  compris vous-même. Le joueur choisi défausse sa main face
                  visible (sans résoudre l'effet de la carte qu'elle contenait)
                  et en pioche une nouvelle.
                  <br />
                  <br />
                  Si le paquet est épuisé, le joueur choisi pioche la carte face
                  cachée mise de côté en début de la partie
                  <br />
                  <br />
                  Si un joueur vous cible en résolvant l'effet du Prince et que
                  vous êtes contrait de défausser la Princesse, vous quittez la
                  manche immédiatement sans piocher de nouvelle main.
                </p>
              }
              value={5}
              nbCard={2}
            />
            {/* Prince */}
            <CardDescription
              nameCard="Servante"
              img={HandmaidImg}
              altimg="handmaid_img"
              description={
                <div>
                  <p className="text-center">
                    Jusqu'au début de{' '}
                    <span className="font-bold">votre prochain tour</span>, les
                    autres joueurs ne peuvent pas vous cibler lorsqu'ils
                    résolvent leurs effets de cartes.
                    <br />
                    <br />
                    Dans le cas extrêmement rare où{' '}
                    <span className="font-bold">
                      tous les autres joueurs
                    </span>{' '}
                    encore en lice seraient "protégés" par une Servante au
                    moment où vous jouez une carte, suivez ces consignes :
                  </p>
                  <br />
                  <ul className="list-inside list-disc text-center">
                    <li>
                      Si cette carte nécessite que vous choisissez{' '}
                      <span className="font-bold">un autre joueur</span> (Garde,
                      Prêtre, Baron ou Roi), elle n'a pas d'effet.
                    </li>
                    <li>
                      Si cette carte nécessite que vous choisissez{' '}
                      <span className="font-bold">n'importe quel joueur</span>{' '}
                      (Prince), vous êtes contraint de vous cibler vous-même
                      pour résoudre son effet.
                    </li>
                  </ul>
                </div>
              }
              value={4}
              nbCard={2}
            />
            {/* Baron */}
            <CardDescription
              nameCard="Baron"
              img={BaronImg}
              altimg="baron_img"
              description={
                <p className="text-center">
                  Choisissez un autre joueur et comparer discrètement vos deux
                  mains. Celui d'entre vous qui détient la carte dont la valeur
                  est la plus faible quitte immédiatement la manche.
                  <br />
                  <br />
                  En cas d'égalité, aucun de vous deux ne quitte la manche.
                </p>
              }
              value={3}
              nbCard={2}
            />
            {/* Prêtre */}
            <CardDescription
              nameCard="Prêtre"
              img={PriestImg}
              altimg="priest_img"
              description={
                <p className="text-center">
                  Choisissez un autre joueur et regardez discrètement sa main
                  (personne d'autre que vous ne le voit).
                </p>
              }
              value={2}
              nbCard={2}
            />
            {/* Garde */}
            <CardDescription
              nameCard="Garde"
              img={GuardImg}
              altimg="guard_img"
              description={
                <p className="text-center">
                  Choisissez un autre joueur et nommez un personnage autre que
                  le Garde. Si le joueur choisi a cette carte en main, il quitte
                  la manche.
                </p>
              }
              value={1}
              nbCard={6}
            />
            {/* Espionne */}
            <CardDescription
              nameCard="Espionne"
              img={SpyImg}
              altimg="spy_img"
              description={
                <p className="text-center">
                  Une Espionne n'a pas d'effet actif lorsqu'elle est jouée ou
                  défaussée.
                  <br />
                  <br />À la fin de manche, si vous êtes{' '}
                  <span className="font-bold">
                    le seul joueur encore en lice
                  </span>{' '}
                  qui a joué ou défaussé une Espionne, vous gagnez 1 pion
                  Faveur.
                  <br />
                  <br />
                  Cela ne revient pas à remporter la manche ; le vainqueur (même
                  si c'est vous) gagne quand même son pion faveur.
                  <br />
                  <br />
                  Vous ne gagnez toujours qu'un seul pion, même si vous jouez
                  et/ou défaussez les deux Espionnes.
                </p>
              }
              value={0}
              nbCard={2}
            />
          </div>
        </div>
      </div>
      <LinkButton buttonText={'Retour au menu'} linkTo={'/'} primary={false} />
    </div>
  );
}
