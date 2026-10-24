import "./assets/styles/App.css";
import { useState } from "react";
import { Setup, ComputerSelect, GamePanel, GameOver } from "./components/";

// Game phases: "name" → "placement" → "computer-select" → "game" → "gameover"
function App() {
  const [phase, setPhase] = useState("name");
  const [playerName, setPlayerName] = useState("");
  const [playerBoard, setPlayerBoard] = useState(null);
  const [playerShips, setPlayerShips] = useState(null);
  const [computerBoard, setComputerBoard] = useState(null);
  const [computerShips, setComputerShips] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setPhase("placement");
  };

  const handlePlacementDone = (board, ships) => {
    setPlayerBoard(board);
    setPlayerShips(ships);
    setPhase("computer-select");
  };

  const handleComputerReady = (board, ships) => {
    setComputerBoard(board);
    setComputerShips(ships);
    setPhase("game");
  };

  const handleGameOver = (result) => {
    setGameResult(result);
    setPhase("gameover");
  };

  const handlePlayAgain = () => {
    setPhase("name");
    setPlayerName("");
    setPlayerBoard(null);
    setPlayerShips(null);
    setComputerBoard(null);
    setComputerShips(null);
    setGameResult(null);
  };

  return (
    <div id="app">
      {phase === "name" && (
        <Setup phase="name" onNameSubmit={handleNameSubmit} />
      )}

      {phase === "placement" && (
        <Setup
          phase="placement"
          playerName={playerName}
          onPlacementDone={handlePlacementDone}
        />
      )}

      {phase === "computer-select" && (
        <ComputerSelect onReady={handleComputerReady} />
      )}

      {phase === "game" && (
        <GamePanel
          playerName={playerName}
          initialPlayerBoard={playerBoard}
          initialPlayerShips={playerShips}
          initialComputerBoard={computerBoard}
          initialComputerShips={computerShips}
          onGameOver={handleGameOver}
        />
      )}

      {phase === "gameover" && (
        <GameOver
          winner={gameResult.winner}
          playerName={playerName}
          totalMoves={gameResult.totalMoves}
          reason={gameResult.reason}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
