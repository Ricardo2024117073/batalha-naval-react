import { useState } from "react";
import "./computer-select.css";
import { buildPredefinedFleet, generateRandomFleet } from "../../helpers";

function ComputerSelect(props) {
  const { onReady } = props;

  const [selected, setSelected] = useState(null); // 0,1,2 or "random"

  const handleConfirm = () => {
    if (selected === null) return;

    const fleet =
      selected === "random"
        ? generateRandomFleet()
        : buildPredefinedFleet(selected);

    onReady(fleet.board, fleet.ships);
  };

  const fleetNames = ["ALPHA", "BRAVO", "CHARLIE"];

  return (
    <div id="computer-select-screen">
      <h2 id="computer-select-title">SELECIONAR FROTA DO COMPUTADOR</h2>

      <div id="computer-select-layout">
        <div id="fleet-options">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              className={`fleet-option-btn ${selected === i ? "selected" : ""}`}
              onClick={() => setSelected(i)}
            >
              <span className="fleet-option-name">FROTA {fleetNames[i]}</span>
              <span className="fleet-option-desc">Posicionamento pré-definido</span>
            </button>
          ))}
          <button
            type="button"
            className={`fleet-option-btn fleet-random ${selected === "random" ? "selected" : ""}`}
            onClick={() => setSelected("random")}
          >
            <span className="fleet-option-name">ALEATÓRIA</span>
            <span className="fleet-option-desc">Posicionamento gerado pelo sistema</span>
          </button>
        </div>

        <div id="fleet-preview">
          {selected === null ? (
            <p id="preview-placeholder">Selecione uma frota para continuar.</p>
          ) : (
            <div className="fleet-summary">
              <p>
                {selected === "random"
                  ? "A frota do computador será gerada automaticamente ao iniciar o jogo."
                  : `Foi selecionada a frota ${fleetNames[selected]}.`}
              </p>
              <p>Use a opção de debug durante o jogo para verificar a frota do computador.</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="btn-primary btn-confirm"
        onClick={handleConfirm}
        disabled={selected === null}
      >
        CONFIRMAR E INICIAR BATALHA
      </button>
    </div>
  );
}

export default ComputerSelect;
