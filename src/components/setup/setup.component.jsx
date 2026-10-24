import { useState } from "react";
import "./setup.css";
import { Board } from "../";
import {
  FLEET_SIZES,
  SHIP_NAMES,
} from "../../constants";
import {
  createEmptyBoard,
  isValidPlacement,
  placeShip,
  getPreviewCells,
} from "../../helpers";

function Setup(props) {
  const { phase, playerName, onNameSubmit, onPlacementDone } = props;

  // ── Name phase ──
  const [nameInput, setNameInput] = useState("");

  // ── Placement phase ──
  const [board, setBoard] = useState(createEmptyBoard());
  const [ships, setShips] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [hoverCell, setHoverCell] = useState(null);

  const currentSize = FLEET_SIZES[currentIdx];
  const allPlaced = currentIdx >= FLEET_SIZES.length;

  const previewCells =
    hoverCell && !allPlaced
      ? getPreviewCells(currentSize, hoverCell.row, hoverCell.col, horizontal)
      : [];

  const previewValid =
    previewCells.length > 0 &&
    isValidPlacement(board, currentSize, hoverCell?.row, hoverCell?.col, horizontal);

  const handleCellClick = (row, col) => {
    if (allPlaced) return;
    if (!isValidPlacement(board, currentSize, row, col, horizontal)) return;

    const result = placeShip(board, ships, currentSize, row, col, horizontal);
    setBoard(result.board);
    setShips(result.ships);
    setCurrentIdx((prev) => prev + 1);
    setHoverCell(null);
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) onNameSubmit(nameInput.trim());
  };

  // ── Render: Name phase ──
  if (phase === "name") {
    return (
      <div id="setup-screen">
        <div id="setup-card">
          <div id="setup-logo">⚓</div>
          <h1 id="setup-title">BATALHA NAVAL</h1>
          <h2 id="setup-subtitle">AVANÇADA</h2>
          <p id="setup-intro">Comande a sua frota. Destrua o inimigo.</p>

          <div id="name-form">
            <label htmlFor="inputName" className="form-label">NOME DO COMANDANTE</label>
            <input
              id="inputName"
              type="text"
              className="form-input"
              placeholder="Introduza o seu nome..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              autoFocus
              maxLength={20}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleNameSubmit}
              disabled={!nameInput.trim()}
            >
              INICIAR MISSÃO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Placement phase ──
  return (
    <div id="placement-screen">
      <h2 id="placement-title">
        COMANDANTE <span className="name-highlight">{playerName}</span> — POSICIONE A SUA FROTA
      </h2>

      <div id="placement-layout">

        {/* Ship list panel */}
        <div id="ship-list-panel">
          <h3 className="panel-heading">NAVIOS</h3>

          {FLEET_SIZES.map((size, idx) => {
            const placed = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <div
                key={idx}
                className={`ship-item ${placed ? "ship-placed" : ""} ${active ? "ship-active" : ""}`}
              >
                <span className="ship-item-name">{SHIP_NAMES[size]}</span>
                <span className="ship-item-blocks">{"█".repeat(size)}</span>
                <span className="ship-item-status">
                  {placed ? "✓" : active ? "▶" : "○"}
                </span>
              </div>
            );
          })}

          <h3 className="panel-heading" id="orientation-heading">ORIENTAÇÃO</h3>
          <div id="orientation-btns">
            <button
              type="button"
              className={`orientation-btn ${horizontal ? "active" : ""}`}
              onClick={() => setHorizontal(true)}
            >
              ↔ Horizontal
            </button>
            <button
              type="button"
              className={`orientation-btn ${!horizontal ? "active" : ""}`}
              onClick={() => setHorizontal(false)}
            >
              ↕ Vertical
            </button>
          </div>

          {allPlaced && (
            <button
              type="button"
              className="btn-primary btn-ready"
              onClick={() => onPlacementDone(board, ships)}
            >
              PRONTO PARA COMBATE ▶
            </button>
          )}
        </div>

        {/* Board */}
        <Board
          board={board}
          isPlayer={true}
          onCellClick={handleCellClick}
          onCellHover={(row, col) => !allPlaced && setHoverCell({ row, col })}
          onMouseLeave={() => setHoverCell(null)}
          previewCells={previewCells}
          previewValid={previewValid}
          title="O SEU TABULEIRO"
        />

      </div>

      {!allPlaced && (
        <p id="placement-hint">
          A colocar: <strong>{SHIP_NAMES[currentSize]}</strong> (tamanho {currentSize})
          — Clique no tabuleiro para posicionar
        </p>
      )}
    </div>
  );
}

export default Setup;
