import {
  BOARD_SIZE,
  FLEET_SIZES,
  CELL_SHIP,
  CELL_MISS,
  CELL_HIT,
  CELL_SUNK,
  PREDEFINED_FLEETS,
} from "../constants";

// Creates a 10x10 board of empty cells
// Each cell: { state: "empty", shipId: null }
export function createEmptyBoard() {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({ state: "empty", shipId: null }))
    );
}

// Returns true if the ship fits and doesn't overlap anything
export function isValidPlacement(board, size, row, col, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
    if (board[r][c].shipId !== null) return false;
  }
  return true;
}

// Returns { board, ships } after placing one ship
export function placeShip(board, ships, size, row, col, horizontal) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const shipId = ships.length;
  const cells = [];

  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    newBoard[r][c] = { state: CELL_SHIP, shipId };
    cells.push({ row: r, col: c });
  }

  const newShips = [
    ...ships,
    { id: shipId, size, cells, hits: [], sunk: false },
  ];

  return { board: newBoard, ships: newShips };
}

// Generates a random valid fleet placement
export function generateRandomFleet() {
  let board = createEmptyBoard();
  let ships = [];

  for (const size of FLEET_SIZES) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 2000) {
      attempts++;
      const horizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (isValidPlacement(board, size, row, col, horizontal)) {
        const result = placeShip(board, ships, size, row, col, horizontal);
        board = result.board;
        ships = result.ships;
        placed = true;
      }
    }
  }

  return { board, ships };
}

// Builds a fleet from one of the predefined fleet definitions
export function buildPredefinedFleet(fleetIndex) {
  let board = createEmptyBoard();
  let ships = [];

  for (const def of PREDEFINED_FLEETS[fleetIndex]) {
    const result = placeShip(board, ships, def.size, def.row, def.col, def.horizontal);
    board = result.board;
    ships = result.ships;
  }

  return { board, ships };
}

// Returns the preview cells for hover effect during placement
export function getPreviewCells(size, row, col, horizontal) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    cells.push({
      row: horizontal ? row : row + i,
      col: horizontal ? col + i : col,
    });
  }
  return cells;
}

// Processes a shot on a board. Returns { board, ships, hit, shipSunk }
export function processShot(board, ships, row, col) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const newShips = ships.map((s) => ({ ...s, hits: [...s.hits] }));
  const cell = newBoard[row][col];

  let hit = false;
  let shipSunk = false;

  if (cell.shipId !== null) {
    hit = true;
    const ship = newShips[cell.shipId];
    ship.hits = [...ship.hits, { row, col }];

    if (ship.hits.length === ship.size) {
      ship.sunk = true;
      shipSunk = true;
      // Mark all ship cells as sunk
      for (const c of ship.cells) {
        newBoard[c.row][c.col] = { ...newBoard[c.row][c.col], state: CELL_SUNK };
      }
    } else {
      newBoard[row][col] = { ...cell, state: CELL_HIT };
    }
  } else {
    newBoard[row][col] = { ...cell, state: CELL_MISS };
  }

  return { board: newBoard, ships: newShips, hit, shipSunk };
}

// Returns true if every ship has been sunk
export function allShipsSunk(ships) {
  return ships.length > 0 && ships.every((s) => s.sunk);
}
