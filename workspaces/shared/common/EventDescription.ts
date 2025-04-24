import { Cards } from "./Cards";
import { PlayerGame } from "./Player";

export enum TypeEvent {
  PlaySpy,
  PlayGuard,
  PlayPriest,
  PlayBaron,
  PlayHandmaid,
  PlayPrince,
  PlayChancellor,
  PlayChancellorPartTwo,
  PlayKing,
  PlayCountess,
  PlayPrincess,
}

export enum ResultEvent {
  KillPlayer,
  GuardNotGuessed,
  VictoryBaron,
  DrawBaron,
  LooseBaron,
  NoEffect,
}

export class EventDescription {
  public playerTargeted: PlayerGame | undefined;

  public resultEvent: ResultEvent | undefined;

  public nbCardsToDiscard: number | undefined;

  public cardTarget: Cards | undefined;

  public discardedCard: Cards | undefined;

  public killedCard: Cards | undefined;

  constructor(
    public typeEvent: TypeEvent,
    public player: PlayerGame
  ) {}

  public static fromSpy(player: PlayerGame): EventDescription {
    return new this(TypeEvent.PlaySpy, player);
  }

  public static fromGuard(
    player: PlayerGame,
    playerTargeted: PlayerGame | undefined,
    resultEvent: ResultEvent,
    cardTarget: Cards | undefined
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayGuard,
      player
    );

    eventDescription.playerTargeted = playerTargeted;
    eventDescription.resultEvent = resultEvent;
    eventDescription.cardTarget = cardTarget;

    return eventDescription;
  }

  public static fromPriest(
    player: PlayerGame,
    playerTargeted: PlayerGame | undefined,
    resultEvent: ResultEvent | undefined
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayPriest,
      player
    );

    eventDescription.playerTargeted = playerTargeted;
    eventDescription.resultEvent = resultEvent;

    return eventDescription;
  }

  public static fromBaron(
    player: PlayerGame,
    playerTargeted: PlayerGame | undefined,
    resultEvent: ResultEvent,
    killedCard: Cards | undefined
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayBaron,
      player
    );

    eventDescription.playerTargeted = playerTargeted;
    eventDescription.resultEvent = resultEvent;
    eventDescription.killedCard = killedCard;

    return eventDescription;
  }

  public static fromHandmaid(player: PlayerGame): EventDescription {
    return new this(TypeEvent.PlayHandmaid, player);
  }

  public static fromPrince(
    player: PlayerGame,
    playerTargeted: PlayerGame | undefined,
    discardedCard: Cards | undefined,
    killedCard: Cards | undefined
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayPrince,
      player
    );

    eventDescription.playerTargeted = playerTargeted;
    eventDescription.discardedCard = discardedCard;
    eventDescription.killedCard = killedCard;

    return eventDescription;
  }

  public static fromChancellor(
    player: PlayerGame,
    nbCardsToDiscard: number
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayChancellor,
      player
    );
    eventDescription.nbCardsToDiscard = nbCardsToDiscard;

    return eventDescription;
  }

  public static fromChancellorPartTwo(
    player: PlayerGame,
    nbCardsToDiscard: number
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayChancellorPartTwo,
      player
    );

    eventDescription.nbCardsToDiscard = nbCardsToDiscard;

    return eventDescription;
  }

  static fromKing(
    player: PlayerGame,
    playerTargeted: PlayerGame | undefined,
    resultEvent: ResultEvent | undefined
  ): EventDescription {
    let eventDescription: EventDescription = new this(
      TypeEvent.PlayKing,
      player
    );

    eventDescription.playerTargeted = playerTargeted;

    eventDescription.resultEvent = resultEvent;

    return eventDescription;
  }

  public static fromCountess(player: PlayerGame): EventDescription {
    return new this(TypeEvent.PlayCountess, player);
  }

  public static fromPrincess(player: PlayerGame): EventDescription {
    return new this(TypeEvent.PlayPrincess, player);
  }
}
