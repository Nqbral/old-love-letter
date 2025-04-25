import { Cards, CardsValue } from "./Cards";
import { EventDescription } from "./EventDescription";
import { PlayerGame } from "./Player";

export class RoundRecap {
  public playersWhoWinByValue: PlayerGame[] = [];

  public playerWhoWinBySpy: PlayerGame | undefined;

  public playersAlive: PlayerGame[];

  public playersWhoWinMatch: PlayerGame[] = [];

  constructor(
    public players: PlayerGame[],
    public scoreToReach: number,
    public eventDescription: EventDescription
  ) {
    this.playersAlive = this.players.filter((player) => {
      return player.alive;
    });
  }

  public calculateScoreByValue(): void {
    let maxCard = Cards.Spy;

    this.playersAlive.forEach((playerAlive) => {
      if (CardsValue[playerAlive.cards[0]] > CardsValue[maxCard]) {
        maxCard = playerAlive.cards[0];
      }
    });

    this.playersWhoWinByValue = this.playersAlive.filter((player) => {
      return player.cards.includes(maxCard);
    });

    this.playersWhoWinByValue.forEach((player) => {
      player.score = player.score + 1;
    });

    this.playersWhoWinByValue = this.playersWhoWinByValue.sort(
      (playerA, playerB) => {
        if (CardsValue[playerA.cards[0]] > CardsValue[playerB.cards[0]]) {
          return -1;
        }

        if (CardsValue[playerA.cards[0]] < CardsValue[playerB.cards[0]]) {
          return 1;
        }

        return 0;
      }
    );
  }

  public calculateScoreBySpy(): void {
    let playersWhoHaveSpy = this.playersAlive.filter((player) => {
      return player.activeCards.includes(Cards.Spy);
    });

    if (playersWhoHaveSpy.length == 1) {
      this.playerWhoWinBySpy = playersWhoHaveSpy[0];
      this.playerWhoWinBySpy.score = this.playerWhoWinBySpy.score + 1;
      return;
    }

    this.playerWhoWinBySpy = undefined;
  }

  public checkEndGame(): boolean {
    let endGame = false;

    this.players.forEach((player) => {
      if (player.score >= this.scoreToReach) {
        endGame = true;
        this.playersWhoWinMatch.push(player);
      }
    });

    return endGame;
  }

  public getPlayerFromWinner(): PlayerGame {
    let index = Math.floor(Math.random() * this.playersWhoWinByValue.length);
    return this.playersWhoWinByValue[index];
  }
}
