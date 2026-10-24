import { useState, useRef, useEffect } from "react";
import "./game-panel.css";
import { Board, Dashboard } from "../";
import {
  FUEL_START,
  FUEL_SHOT_COST,
  FUEL_HIT_BONUS,
  FUEL_TIMEOUT_PENALTY,
  RADAR_TIME_THRESHOLD,
  BOARD_SIZE,
} from "../../constants";
import {
  processShot,
  allShipsSunk,
  createAIState,
  getComputerMove,
  updateAIAfterShot,
} from "../../helpers";

function GamePanel(props) {
  const {
    playerName,
    initialPlayerBoard,
    initialPlayerShips,
    initialComputerBoard,
    initialComputerShips,
    onGameOver,
  } = props;

  const [playerBoard, setPlayerBoard] = useState(initialPlayerBoard);
  const [playerShips, setPlayerShips] = useState(initialPlayerShips);
  const [computerBoard, setComputerBoard] = useState(initialComputerBoard);
  const [computerShips, setComputerShips] = useState(initialComputerShips);

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [fuel, setFuel] = useState(FUEL_START);
  const [totalMoves, setTotalMoves] = useState(0);
  const [radarAvailable, setRadarAvailable] = useState(false);
  const [radarCells, setRadarCells] = useState([]);
  const [aiState, setAIState] = useState(createAIState());
  const [showDebug, setShowDebug] = useState(false);
  const [message, setMessage] = useState(`Turno de ${playerName}. Escolha uma célula do tabuleiro inimigo.`);
  const [turnKey, setTurnKey] = useState(0);
  const [computerThinking, setComputerThinking] = useState(false);

    const fuelRef = useRef(FUEL_START);
  const totalMovesRef = useRef(0);
  const playerBoardRef = useRef(initialPlayerBoard);
  const playerShipsRef = useRef(initialPlayerShips);
  const aiStateRef = useRef(createAIState());
  const turnStartRef = useRef(0);

    useEffect(() => { fuelRef.current = fuel; }, [fuel]);
  useEffect(() => { totalMovesRef.current = totalMoves; }, [totalMoves]);
  useEffect(() => { playerBoardRef.current = playerBoard; }, [playerBoard]);
  useEffect(() => { playerShipsRef.current = playerShips; }, [playerShips]);
  useEffect(() => { aiStateRef.current = aiState; }, [aiState]);

  useEffect(() => {
    turnStartRef.current = Date.now();
  }, []);

  const clampFuel = (val) => Math.max(0, Math.min(100, val));

  const colLabel = (col) => String.fromCharCode(65 + col);

    const runComputerTurn = () => {
    setComputerThinking(true);
    setMessage("Turno do computador...");

    setTimeout(() => {
      const board = playerBoardRef.current;
      const ships = playerShipsRef.current;
      const ai = aiStateRef.current;

      const { row, col, aiState: newAIState } = getComputerMove(board, ai);
      const { board: newBoard, ships: newShips, hit, shipSunk } = processShot(board, ships, row, col);

      setPlayerBoard(newBoard);
      setPlayerShips(newShips);
      playerBoardRef.current = newBoard;
      playerShipsRef.current = newShips;

      const updatedAI = updateAIAfterShot(newAIState, row, col, hit, shipSunk, newBoard);
      setAIState(updatedAI);
      aiStateRef.current = updatedAI;

      const moves = totalMovesRef.current + 1;
      setTotalMoves(moves);
      totalMovesRef.current = moves;

      let msg;
      if (shipSunk) msg = `Computador afundou um navio em ${colLabel(col)}${row + 1}.`;
      else if (hit) msg = `Computador acertou em ${colLabel(col)}${row + 1}.`;
      else msg = `Computador falhou em ${colLabel(col)}${row + 1}.`;

      if (allShipsSunk(newShips)) {
        onGameOver({ winner: "computer", totalMoves: moves });
        return;
      }

      setMessage(msg + ` Turno de ${playerName}.`);
      setComputerThinking(false);
      setIsPlayerTurn(true);
      setTurnKey((prev) => prev + 1);
      turnStartRef.current = Date.now();
    }, 1000);
  };

    const handlePlayerShot = (row, col) => {
    if (!isPlayerTurn || computerThinking) return;

    const cell = computerBoard[row][col];
    if (cell.state === "miss" || cell.state === "hit" || cell.state === "sunk") return;

    const shotTime = (Date.now() - turnStartRef.current) / 1000;

    const { board: newComputerBoard, ships: newComputerShips, hit, shipSunk } =
      processShot(computerBoard, computerShips, row, col);

    setComputerBoard(newComputerBoard);
    setComputerShips(newComputerShips);
    setRadarCells([]);

    const moves = totalMoves + 1;
    setTotalMoves(moves);
    totalMovesRef.current = moves;

    let newFuel = clampFuel(fuel - FUEL_SHOT_COST);
    if (hit) newFuel = clampFuel(newFuel + FUEL_HIT_BONUS);
    setFuel(newFuel);
    fuelRef.current = newFuel;

    if (hit && shotTime < RADAR_TIME_THRESHOLD) {
      setRadarAvailable(true);
    }

    if (newFuel <= 0) {
      onGameOver({ winner: "computer", reason: "fuel", totalMoves: moves });
      return;
    }

    if (allShipsSunk(newComputerShips)) {
      onGameOver({ winner: "player", totalMoves: moves });
      return;
    }

    let msg;
    if (shipSunk) msg = `Navio destruído em ${colLabel(col)}${row + 1}.`;
    else if (hit) msg = `Acertou em ${colLabel(col)}${row + 1}.`;
    else msg = `Falhou em ${colLabel(col)}${row + 1}.`;
    setMessage(msg);

    setIsPlayerTurn(false);
    runComputerTurn();
  };

    const handleTimeout = () => {
    if (!isPlayerTurn || computerThinking) return;

    const newFuel = clampFuel(fuelRef.current - FUEL_TIMEOUT_PENALTY);
    setFuel(newFuel);
    fuelRef.current = newFuel;
    setMessage("Tempo esgotado. Perdeu 5 unidades de combustível.");

    if (newFuel <= 0) {
      onGameOver({ winner: "computer", reason: "fuel", totalMoves: totalMovesRef.current });
      return;
    }

    setIsPlayerTurn(false);
    runComputerTurn();
  };

    const handleRadarActivate = () => {
    if (!radarAvailable) return;
    setRadarAvailable(false);

    for (let r = 0; r <= BOARD_SIZE - 2; r++) {
      for (let c = 0; c <= BOARD_SIZE - 2; c++) {
        const area = [
          { row: r, col: c },     { row: r, col: c + 1 },
          { row: r + 1, col: c }, { row: r + 1, col: c + 1 },
        ];
        const hasUnhitShip = area.some(({ row, col }) => {
          const cell = computerBoard[row][col];
          return cell.shipId !== null && cell.state !== "hit" && cell.state !== "sunk";
        });
        if (hasUnhitShip) {
          setRadarCells(area.map(({ row, col }) => `${row}-${col}`));
          setMessage("Radar ativado. Foi destacada uma área 2x2 com navio.");
          return;
        }
      }
    }
  };

  const activePlayer = isPlayerTurn && !computerThinking;

  return (
    <section id="game-panel">

      {/* Status bar */}
      <div id="game-topbar">
        <span className={`turn-badge ${activePlayer ? "turn-player" : "turn-computer"}`}>
          {activePlayer ? `TURNO: ${playerName}` : "TURNO: Computador"}
        </span>
        <p id="game-message">{message}</p>
        <label className="debug-checkbox">
          <input
            type="checkbox"
            checked={showDebug}
            onChange={(e) => setShowDebug(e.target.checked)}
          />
          Debug: mostrar frota PC
        </label>
      </div>

      {/* Boards + Dashboard */}
      <div id="game-layout">
        <Board
          board={playerBoard}
          isPlayer={true}
          title={playerName}
          disabled={true}
        />

        <Dashboard
          fuel={fuel}
          radarAvailable={radarAvailable}
          isPlayerTurn={activePlayer}
          onTimeout={handleTimeout}
          onRadarActivate={handleRadarActivate}
          turnKey={turnKey}
        />

        <Board
          board={computerBoard}
          isPlayer={false}
          showShips={showDebug}
          title="Computador"
          onCellClick={handlePlayerShot}
          radarCells={radarCells}
          disabled={!activePlayer}
        />
      </div>

    </section>
  );
}

export default GamePanel;
