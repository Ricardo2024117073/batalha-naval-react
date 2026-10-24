export const BOARD_SIZE = 10;

// Fleet to place: one ship of each size
export const FLEET_SIZES = [5, 4, 3, 3, 2, 2];

export const SHIP_NAMES = {
  5: "Porta-Aviões",
  4: "Couraçado",
  3: "Cruzador",
  2: "Destruidor",
};

// Turn timer in seconds
export const TURN_TIMEOUT = 15;

// Fuel constants
export const FUEL_START = 100;
export const FUEL_SHOT_COST = 5;
export const FUEL_HIT_BONUS = 10;
export const FUEL_TIMEOUT_PENALTY = 5;

// Radar: seconds threshold to unlock
export const RADAR_TIME_THRESHOLD = 3;

// Cell states
export const CELL_EMPTY = "empty";
export const CELL_SHIP = "ship";
export const CELL_MISS = "miss";
export const CELL_HIT = "hit";
export const CELL_SUNK = "sunk";

// 3 predefined computer fleets
export const PREDEFINED_FLEETS = [
  // Frota Alpha
  [
    { size: 5, row: 0, col: 0, horizontal: true },
    { size: 4, row: 2, col: 1, horizontal: true },
    { size: 3, row: 4, col: 0, horizontal: true },
    { size: 3, row: 4, col: 6, horizontal: false },
    { size: 2, row: 7, col: 2, horizontal: true },
    { size: 2, row: 7, col: 7, horizontal: true },
  ],
  // Frota Bravo
  [
    { size: 5, row: 0, col: 0, horizontal: false },
    { size: 4, row: 0, col: 3, horizontal: false },
    { size: 3, row: 1, col: 6, horizontal: false },
    { size: 3, row: 5, col: 1, horizontal: false },
    { size: 2, row: 0, col: 8, horizontal: false },
    { size: 2, row: 7, col: 5, horizontal: true },
  ],
  // Frota Charlie
  [
    { size: 5, row: 5, col: 4, horizontal: true },
    { size: 4, row: 1, col: 5, horizontal: false },
    { size: 3, row: 0, col: 0, horizontal: true },
    { size: 3, row: 8, col: 0, horizontal: true },
    { size: 2, row: 3, col: 0, horizontal: false },
    { size: 2, row: 8, col: 8, horizontal: false },
  ],
];
