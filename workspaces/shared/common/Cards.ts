export enum Cards {
  Princess = "princess",
  Countess = "countess",
  King = "king",
  Chancellor = "chancellor",
  Prince = "prince",
  Handmaid = "handmaid",
  Baron = "baron",
  Priest = "priest",
  Guard = "guard",
  Spy = "spy",
}

export const CardsNumber = {
  princess: 1,
  countess: 1,
  king: 1,
  chancellor: 2,
  prince: 2,
  handmaid: 2,
  baron: 2,
  priest: 2,
  guard: 6,
  spy: 2,
};

export const CardsValue = {
  princess: 9,
  countess: 8,
  king: 7,
  chancellor: 6,
  prince: 5,
  handmaid: 4,
  baron: 3,
  priest: 2,
  guard: 1,
  spy: 0,
};
