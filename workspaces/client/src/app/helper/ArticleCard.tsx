import { Cards } from '@shared/common/Cards';

export function articleCard(
  card: Cards | undefined,
): Map<string, string> | undefined {
  const map: Map<string, string> = new Map();

  switch (card) {
    case Cards.Spy:
      map.set('articleCard', "l'");
      map.set('card', 'Espionne');
      break;
    case Cards.Guard:
      map.set('articleCard', 'le ');
      map.set('card', 'Garde');
      break;
    case Cards.Priest:
      map.set('articleCard', 'le ');
      map.set('card', 'Prêtre');
      break;
    case Cards.Baron:
      map.set('articleCard', 'le ');
      map.set('card', 'Baron');
      break;
      break;
    case Cards.Handmaid:
      map.set('articleCard', 'la ');
      map.set('card', 'Servante');
      break;
    case Cards.Prince:
      map.set('articleCard', 'le ');
      map.set('card', 'Prince');
      break;
    case Cards.Chancellor:
      map.set('articleCard', 'le ');
      map.set('card', 'Chancelier');
      break;
    case Cards.King:
      map.set('articleCard', 'le ');
      map.set('card', 'Roi');
      break;
    case Cards.Countess:
      map.set('articleCard', 'la ');
      map.set('card', 'Comtesse');
      break;
    case Cards.Princess:
      map.set('articleCard', 'la ');
      map.set('card', 'Princesse');
      break;
    default:
      console.log('Article card not handled');
      return undefined;
      break;
  }

  return map;
}
