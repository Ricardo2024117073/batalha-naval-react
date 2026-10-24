import "./board.css";
import { Cell } from "../";

const COL_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function Board(props) {
  const {
    board,
    isPlayer,
    showShips,
    onCellClick,
    onCellHover,
    onMouseLeave,
    previewCells,
    previewValid,
    radarCells,
    disabled,
    title,
  } = props;

  const previewSet = new Set((previewCells || []).map(({ row, col }) => `${row}-${col}`));
  const radarSet = new Set(radarCells || []);

  return (
    <div className="board-wrapper" onMouseLeave={onMouseLeave}>
      <h3 className="board-title">{title}</h3>
      <div className="board-container">

        {/* Column labels row */}
        <div className="board-labels-row">
          <div className="board-corner" />
          {COL_LABELS.map((label) => (
            <div key={label} className="board-label">{label}</div>
          ))}
        </div>

        {/* Game rows */}
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="board-row">
            <div className="board-label row-label">{rowIdx + 1}</div>
            {row.map((cell, colIdx) => {
              const key = `${rowIdx}-${colIdx}`;
              return (
                <Cell
                  key={key}
                  state={cell.state}
                  isPlayer={isPlayer}
                  showShip={showShips}
                  isPreview={previewSet.has(key)}
                  previewValid={previewValid}
                  isRadar={radarSet.has(key)}
                  onClick={() => { if (!disabled && onCellClick) onCellClick(rowIdx, colIdx); }}
                  onMouseEnter={() => { if (onCellHover) onCellHover(rowIdx, colIdx); }}
                />
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
}

export default Board;
