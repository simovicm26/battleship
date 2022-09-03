import { music, controlDrag } from "./dragAndDrop.js";

const mainContainers = [...document.querySelectorAll(".main-container")];

const startButton = document.querySelector(".start-button");

const startGameButton = document.querySelector(".start-game-button");

const gameInfo = document.querySelector(".game-info");

const clang = new Audio("./sounds/stingers-001-6294.mp3");

export const addStartGameButtonHandler = function (handler) {
  startGameButton.addEventListener("click", () => {
    clang.play();
    pause(1000);
    gameInfo.classList.remove("invisable");
    document.querySelector(".game-end").classList.remove("invisable");
    document.querySelector(".start-menu").classList.add("invisable");
    document.querySelector(".main-wrapper").classList.remove("invisable");
    handler();
  });
};

export const generateGameboards = function () {
  mainContainers.forEach((container) => {
    generateFields(container);
  });
};

const generateFields = function (container) {
  let x;
  let y;
  for (let i = 1; i <= 100; i++) {
    x = i % 10;
    x === 0 ? (x = 10) : x;
    y = Math.ceil(i / 10);
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="field" data-x="${x}" data-y="${y}"></div>`
    );
  }
};

export const renderShip = function (id, coords) {
  const fields = [...document.querySelector(`#gameboard-${id}`).children];
  const filteredFields = fields.filter((field) =>
    checkArrayInArray(coords, +field.dataset.x, +field.dataset.y)
  );
  filteredFields.forEach((field) => field.classList.add("ship"));
};

const checkArrayInArray = function (arrays, valueX, valueY) {
  return arrays.some((arr) => arr[0] === valueX && arr[1] === valueY);
};
export const addHandlerClick = function (player, AI, handler) {
  mainContainers[player.id].addEventListener("click", (e) => {
    let coords;
    if (e.target.classList.contains("field")) {
      let x = +e.target.dataset.x;
      let y = +e.target.dataset.y;
      coords = [x, y];
      handler(coords, player, AI);
    }
  });
};
function pause(milliseconds) {
  let now = Date.now(),
    end = now + milliseconds;
  while (now < end) {
    now = Date.now();
  }
}

export const hitFieldRender = function (gameboard, coords) {
  const field = [
    ...mainContainers[gameboard.id - 1].querySelectorAll(".field"),
  ].filter(
    (field) => +field.dataset.x === coords[0] && +field.dataset.y === coords[1]
  )[0];
  pause(1000);
  if (gameboard.isHit) {
    field.classList.add("animation");
    field.classList.add("hit");
    gameboard.opponent
      ? (gameInfo.textContent = "Great shot!")
      : (gameInfo.textContent = "Ouch, you have been hit!");
  }
  if (!gameboard.isHit) {
    field.classList.add("miss");
    gameboard.opponent
      ? (gameInfo.textContent = "You missed.")
      : (gameInfo.textContent = "Wow, that one was close!");
  }
};

export const renderSwitch = function (playerId) {
  if (!document.querySelector(".game-over").classList.contains("invisable"))
    return;
  mainContainers.forEach((container) => container.classList.add("inactive"));
  document.querySelector(`#gameboard-${playerId}`).classList.remove("inactive");
};

export const renderEndGameScreen = function (player) {
  document.querySelector(".game-over").classList.remove("invisable");
  document.querySelector(".restart-button").classList.remove("invisable");
  if (player.isAI) gameInfo.textContent = "You lost. Better luck next time!";
  if (!player.isAI) gameInfo.textContent = "Good job captain. You won!";
  music.pause();
  mainContainers.forEach((container) => container.classList.add("inactive"));
};

export const addRestartHandler = function (handler) {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("restart-button")) {
      window.location.reload();
    }
  });
};
