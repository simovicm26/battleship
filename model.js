export class Ship {
  constructor(shipCoords, length) {
    this.shipCoords = shipCoords;
    this.length = length;
  }

  hitCoords = [];

  hit(coord) {
    this.hitCoords.push(coord);
  }

  isSunk() {
    return this.hitCoords.length === this.shipCoords.length ? true : false;
  }
}

export class Gameboard {
  constructor(id) {
    this.id = id;
  }

  opponent;

  ships = [];

  isHit = false;

  missedAttacksCoords = [];

  placedShipCoords = [];

  placeShip(coords, length) {
    const ship = new Ship(coords, length);
    this.ships.push(ship);
    console.log(this.ships);
  }

  placeRandomShips(length) {
    let coords = [];
    let x;
    let y;
    const axis = Math.random() >= 0.5 ? "x" : "y";
    for (let i = 1; i <= length; i++) {
      if (i === 1) {
        (x = Math.floor(Math.random() * 10) + 1),
          (y = Math.floor(Math.random() * 10) + 1),
          coords.push([x, y]);
      } else {
        if (axis === "x") {
          y = y + 1;
        }
        if (axis === "y") {
          x = x + 1;
        }
        if (x > 10 || y > 10) return this.placeRandomShips(length);
        coords.push([x, y]);
      }
    }
    if (
      coords.some((coord) =>
        this.placedShipCoords.some(
          (ship) => ship.toString() === coord.toString()
        )
      )
    )
      return this.placeRandomShips(length);
    coords.forEach((coord) => this.placedShipCoords.push(coord));
    this.placeShip(coords, length);
  }

  recieveAttack(coords) {
    const attackedShip = this.ships.filter((ship) =>
      ship.shipCoords.some((coord) => coord.toString() === coords.toString())
    );
    if (attackedShip.length !== 0) {
      this.isHit = true;
      return attackedShip[0];
    }
    this.isHit = false;
    this.missedAttacksCoords.push[coords];
  }

  allSunk() {
    return this.ships.some((ship) => !ship.isSunk()) ? false : true;
  }
}

export class Player {
  constructor(id) {
    this.id = id;
  }
  isAI = false;

  allAttacks = [];
  gameboard;

  createGameboard() {
    const gameboard = new Gameboard(this.id);
    this.gameboard = gameboard;
  }

  attack(coord = [this.random(), this.random()]) {
    if (
      this.allAttacks.some((attack) => attack.toString() === coord.toString())
    ) {
      return this.attack();
    } else {
      this.allAttacks.push(coord);

      return coord;
    }
  }

  random() {
    return Math.floor(Math.random() * 10) + 1;
  }
}
