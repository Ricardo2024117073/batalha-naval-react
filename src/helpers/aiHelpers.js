import { BOARD_SIZE } from "../constants";

// Initial AI state
export function createAIState() {
  return {
    mode: "hunt",        // "hunt" = random, "target" = focus on found ship
    targetQueue: [],     // adjacent cells to try when in target mode
    firstHit: null,      // first hit on the current ship being targeted
  };
}

// Checks if a cell has not been attacked yet
function canAttack(row, col, board) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
  const state = board[row][col].state;
  return state === "empty" || state === "ship";
}

// Gets valid adjacent cells (up/down/left/right)
function getAdjacentCells(row, col, board) {
  return [[-1, 0],[1, 0],[0, -1],[0, 1]]
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(({ row: r, col: c }) => canAttack(r, c, board));
}

// Picks the next cell for the computer to attack
export function getComputerMove(board, aiState) {
  const newAIState = { ...aiState, targetQueue: [...aiState.targetQueue] };

  // Target mode: try queued adjacent cells
  if (newAIState.mode === "target") {
    newAIState.targetQueue = newAIState.targetQueue.filter(
      ({ row, col }) => canAttack(row, col, board)
    );

    if (newAIState.targetQueue.length > 0) {
      const [target, ...rest] = newAIState.targetQueue;
      newAIState.targetQueue = rest;
      return { row: target.row, col: target.col, aiState: newAIState };
    }

    // Queue empty — back to hunt
    newAIState.mode = "hunt";
    newAIState.firstHit = null;
  }

  // Hunt mode: pick random unattacked cell
  const available = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (canAttack(r, c, board)) available.push({ row: r, col: c });
    }
  }

  const idx = Math.floor(Math.random() * available.length);
  return { row: available[idx].row, col: available[idx].col, aiState: newAIState };
}

// Updates AI state after a shot result
export function updateAIAfterShot(aiState, row, col, hit, sunk, board) {
  const newAIState = { ...aiState, targetQueue: [...aiState.targetQueue] };

  if (sunk) {
    // Ship destroyed — reset to hunt
    newAIState.mode = "hunt";
    newAIState.targetQueue = [];
    newAIState.firstHit = null;
    return newAIState;
  }

  if (hit) {
    if (newAIState.mode === "hunt") {
      // Found a ship — switch to target mode
      newAIState.mode = "target";
      newAIState.firstHit = { row, col };
      newAIState.targetQueue = getAdjacentCells(row, col, board);
    } else {
      // Already in target — prioritise the same direction
      const first = newAIState.firstHit;
      const dr = row - first.row;
      const dc = col - first.col;

      if (dr !== 0 || dc !== 0) {
        const nextRow = row + (dr === 0 ? 0 : dr > 0 ? 1 : -1);
        const nextCol = col + (dc === 0 ? 0 : dc > 0 ? 1 : -1);
        if (canAttack(nextRow, nextCol, board)) {
          newAIState.targetQueue = [{ row: nextRow, col: nextCol }, ...newAIState.targetQueue];
        }
      }
    }
  }

  return newAIState;
}
