import "./cell.css";

function Cell(props) {
  const { state, isPlayer, showShip, onClick, onMouseEnter, isPreview, previewValid, isRadar } = props;

  let className = "cell";

  if (state === "miss") className += " cell-miss";
  else if (state === "hit") className += " cell-hit";
  else if (state === "sunk") className += " cell-sunk";
  else if (state === "ship" && (isPlayer || showShip)) className += " cell-ship";
  else className += " cell-water";

  if (isPreview) className += previewValid ? " cell-preview-valid" : " cell-preview-invalid";
  if (isRadar) className += " cell-radar";

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {state === "miss" && <span className="cell-icon">·</span>}
      {(state === "hit" || state === "sunk") && <span className="cell-icon">✕</span>}
    </div>
  );
}

export default Cell;
