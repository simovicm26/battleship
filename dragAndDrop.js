const startButton = document.querySelector(".start-button");

const draggables = [...document.querySelectorAll(".draggable")];

const gameboard = document.querySelector("#gameboard-1");

const boatPlacer = document.querySelector(".boat-placer");

const rotateButton = document.querySelector(".rotate-button");

const clearButton = document.querySelector(".clear-button");

export const music = new Audio(
  "./sounds/ytmp3free.cc_epic-pirate-music-buccaneer-island-brand-x-music-youtubemp3free.org.mp3"
);

music.loop = true;
music.volume = 0.1;

export const addBoatPlacerHandler = function (shipGameboard, handler) {
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", controlDrag);
    draggable.addEventListener("dragstart", (e) => {
      e.dataTransfer.setDragImage(e.target, 0, 0);
    });
    draggable.addEventListener("dragend", (e) => {
      draggable.classList.remove("dragging");
      draggable.removeAttribute("id");
      removeHover();
    });
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    removeHover();
    const ship = document.querySelector("#dragged");
    const occupiedFields = hoverOverFields(e.target);
    ship.removeAttribute("id");
    if (!checkIfCanBePlaced(ship, occupiedFields)) return;
    handler(shipGameboard, occupiedFields);
    updateShipsNumber(ship);
    occupiedFields.forEach((field) => field.classList.add("ship"));
    const gameboard = e.target.closest(".main-container");
  });
};
export const addClearBoardHandler = function (gameboard, handler) {
  clearButton.addEventListener("click", function () {
    const fields = [...document.querySelectorAll(".field")];
    fields.forEach((field) => field.classList.remove("ship"));
    draggables.forEach((draggable) => {
      if (draggable.classList.contains("undraggable")) {
        draggable.classList.add("draggable");
        draggable.classList.remove("undraggable");
        draggable.setAttribute("draggable", "true");
        draggable.addEventListener("dragstart", controlDrag);
      }
    });
    const quantity = [...document.querySelectorAll(".ships-num")].forEach(
      (number) => {
        if (number.id === "small") number.textContent = "3x";
        if (number.id === "medium") number.textContent = "3x";
        if (number.id === "large") number.textContent = "1x";
      }
    );
    startButton.classList.add("disabled");
    handler(gameboard);
  });
};

export const addStartGameHandler = function (handler) {
  startButton.addEventListener("click", function (e) {
    if (!e.target.classList.contains("disabled")) {
      music.play();
      document.querySelector(".instructions").classList.add("invisable");
      document.querySelector(".boat-placer").classList.add("invisable");
      document.querySelector(".buttons-container").classList.add("invisable");
      startButton.classList.add("invisable");
      document.querySelector(".game-info").classList.remove("invisable");
      document.querySelector("#computer").classList.remove("invisable");
    }
  });
};

gameboard.addEventListener("dragover", (e) => {
  e.preventDefault();
  removeHover();
  const hoverFields = hoverOverFields(e.target);

  hoverFields.forEach((field) => {
    field.classList.add("hovered");
  });
});

rotateButton.addEventListener("click", rotateShips);

export const controlDrag = function () {
  this.id = "dragged";
  this.classList.add("dragging");
};
const disableDrag = function (ship) {
  enableStartButton();
  ship.removeEventListener("dragstart", controlDrag);
  ship.classList.add("undraggable");
  ship.classList.remove("draggable");
  ship.removeAttribute("draggable");
  return;
};

const enableStartButton = function () {
  const quantity = [...document.querySelectorAll(".ships-num")].map(
    (number) => +number.textContent.split("")[0]
  );
  if (quantity.every((number) => number <= 0)) {
    startButton.classList.remove("disabled");
    document.querySelector(".instructions").textContent =
      "Time to go to battle. Click START when ready!";
  }
};

const updateShipsNumber = function (ship) {
  const quantity = [...document.querySelectorAll(".ships-num")].filter(
    (number) => ship.classList.contains(number.id)
  )[0];
  const num = +quantity.textContent.split("")[0] - 1;
  quantity.textContent = [num, quantity.textContent.split("")[1]].join("");

  if (num <= 0) return disableDrag(ship);
};

const checkIfCanBePlaced = function (ship, newShipFields) {
  const unavailableFields = [...document.querySelectorAll(".field")].filter(
    (field) => field.classList.contains("ship")
  );
  const shipLenght = +ship.dataset.length;
  if (shipLenght !== newShipFields.length) return false;
  const check = unavailableFields.filter((field) =>
    newShipFields.some((ship) => ship === field)
  );
  if (check.length === 0) {
    newShipFields.forEach((ship) => unavailableFields.push(ship));
    return true;
  } else return false;
};
const removeHover = function () {
  const fields = [...gameboard.querySelectorAll(".field")];
  fields.forEach((field) => field.classList.remove("hovered"));
};

function rotateShips() {
  draggables.forEach((draggable) => {
    if (draggable.classList.contains("small" || "small-vertical"))
      draggable.classList.toggle("small-vertical");
    if (draggable.classList.contains("medium" || "medium-vertical"))
      draggable.classList.toggle("medium-vertical");
    if (draggable.classList.contains("large" || "large-vertical"))
      draggable.classList.toggle("large-vertical");
  });
}

const occupyFields = function (ship, comparative, allFields) {
  console.log(ship);
  let hoverFields = allFields.filter((field) => {
    let fieldX = +field.dataset.x;
    let fieldY = +field.dataset.y;
    let targetX = +comparative.dataset.x;
    let targetY = +comparative.dataset.y;
    if (
      ship.classList.contains("small-vertical") ||
      ship.classList.contains("medium-vertical") ||
      ship.classList.contains("large-vertical")
    ) {
      let fieldPlaceholder = fieldX;
      fieldX = fieldY;
      fieldY = fieldPlaceholder;
      let targetPlaceholder = targetX;
      targetX = targetY;
      targetY = targetPlaceholder;
    }
    if (ship.classList.contains("small")) {
      return (
        fieldY === targetY && (fieldX === targetX || fieldX === targetX + 1)
      );
    }
    if (ship.classList.contains("large")) {
      return (
        fieldY === targetY &&
        (fieldX === targetX ||
          fieldX === targetX + 1 ||
          fieldX === targetX + 2 ||
          fieldX === targetX + 3)
      );
    }
    if (ship.classList.contains("medium")) {
      return (
        fieldY === targetY &&
        (fieldX === targetX || fieldX === targetX + 1 || fieldX === targetX + 2)
      );
    }
  });

  return hoverFields;
};

const hoverOverFields = function (comparative) {
  const allFields = [...gameboard.querySelectorAll(".field")];
  const ship = draggables.filter((draggable) => draggable.id === "dragged")[0];

  return occupyFields(ship, comparative, allFields);
};
