import "./game-over.css";

function GameOver(props) {
  const { winner, playerName, totalMoves, reason, onPlayAgain } = props;

  const playerWon = winner === "player";
  const lostByFuel = !playerWon && reason === "fuel";

  return (
    <div id="gameover-screen">
      <div className={`gameover-card ${playerWon ? "gameover-win" : "gameover-lose"}`}>

        <div className="gameover-icon">{playerWon ? "🏆" : "💀"}</div>

        <h1 className="gameover-title">{playerWon ? "VITÓRIA!" : "DERROTA!"}</h1>

        <p className="gameover-message">
          {playerWon
            ? `${playerName}, destruiu toda a frota inimiga!`
            : lostByFuel
              ? `${playerName}, ficou sem combustível e perdeu a batalha!`
              : `${playerName}, a sua frota foi destruída!`}
        </p>

        <dl className="gameover-stats">
          <div className="stat-item">
            <dt className="stat-label">VENCEDOR</dt>
            <dd className="stat-value">{playerWon ? playerName : "Computador"}</dd>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <dt className="stat-label">JOGADAS TOTAIS</dt>
            <dd className="stat-value">{totalMoves}</dd>
          </div>
        </dl>

        <button type="button" className="btn-primary gameover-btn" onClick={onPlayAgain}>
          🔄 JOGAR NOVAMENTE
        </button>

      </div>
    </div>
  );
}

export default GameOver;
