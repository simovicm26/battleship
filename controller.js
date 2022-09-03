import {
  generateGameboards,
  renderShip,
  addStartGameButtonHandler,
  addHandlerClick,
  hitFieldRender,
  renderSwitch,
  renderEndGameScreen,
  addRestartHandler,
} from "./interface.js";

import {
  addBoatPlacerHandler,
  addClearBoardHandler,
  addStartGameHandler,
} from "./dragAndDrop.js";
import * as model from "./model.js";

const clickController = function (coords, player, playerAI) {
  const hitShip = playerAI.gameboard.recieveAttack(coords);
  hitFieldRender(playerAI.gameboard, coords);
  if (playerAI.gameboard.allSunk()) return renderEndGameScreen(player);
  if (!hitShip) return switchPlayers(player, playerAI);
  hitShip.hit(coords);
};

const AIController = function (player, playerAI) {
  const coords = playerAI.attack();
  const hitShip = player.gameboard.recieveAttack(coords);
  if (player.gameboard.allSunk()) return renderEndGameScreen(playerAI);
  hitFieldRender(player.gameboard, coords);
  if (!hitShip) return renderSwitch(playerAI.id);
  hitShip.hit(coords);
  setTimeout(
    (player, playerAI) => AIController(player, playerAI),
    500,
    player,
    playerAI
  );
};

const placeAIShips = function (gameboard) {
  gameboard.placeRandomShips(4);
  gameboard.placeRandomShips(3);
  gameboard.placeRandomShips(3);
  gameboard.placeRandomShips(3);
  gameboard.placeRandomShips(2);
  gameboard.placeRandomShips(2);
  gameboard.placeRandomShips(2);
};

const switchPlayers = function (player, playerAI) {
  renderSwitch(player.id);
  setTimeout(
    (player, playerAI) => AIController(player, playerAI),
    500,
    player,
    playerAI
  );
};

const runGame = function () {
  generateGameboards();
  const playerHuman = new model.Player(1);
  const playerAI = new model.Player(2);
  playerHuman.createGameboard();
  playerAI.createGameboard();
  const gameboardP1 = playerHuman.gameboard;
  const gameboardP2 = playerAI.gameboard;
  gameboardP2.opponent = true;
  playerAI.isAI = true;
  addBoatPlacerHandler(gameboardP1, boatPlacerController);
  addClearBoardHandler(gameboardP1, clearBoardController);
  addStartGameHandler();
  placeAIShips(gameboardP2);
  addHandlerClick(playerHuman, playerAI, clickController);
};

const boatPlacerController = function (gameboard, boatFields) {
  const boatCoords = boatFields.map((field) => [
    +field.dataset.x,
    +field.dataset.y,
  ]);
  gameboard.placeShip(boatCoords, boatCoords.length);
};

const clearBoardController = function (gameboard) {
  gameboard.ships = [];
};

const startGameButtonController = function () {
  runGame();
};

addStartGameButtonHandler(startGameButtonController);
addRestartHandler();
