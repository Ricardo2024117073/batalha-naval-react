import "./dashboard.css";
import { Timer } from "../";
import { TURN_TIMEOUT } from "../../constants";

function Dashboard(props) {
  const { fuel, radarAvailable, isPlayerTurn, onTimeout, onRadarActivate, turnKey } = props;

  const fuelColor =
    fuel > 50 ? "var(--color-green)" : fuel > 25 ? "var(--color-gold)" : "var(--color-red)";
  const fuelPercent = Math.max(0, fuel);

  const handleTimer = (seconds) => {
    if (seconds === 0 && isPlayerTurn) {
      onTimeout && onTimeout();
    }
  };

  return (
    <section className="dashboard">

      {/* Turn Timer */}
      <div className="dashboard-card timer-card">
        <p className="dashboard-label">TURNO</p>
        <p className={`timer-display ${isPlayerTurn ? "timer-active" : "timer-inactive"}`}>
          {isPlayerTurn ? (
            <Timer key={`turn-${turnKey}-${TURN_TIMEOUT}`} timeout={TURN_TIMEOUT} onTimer={handleTimer} />
          ) : (
            "--"
          )}
          <span className="timer-unit">s</span>
        </p>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill timer-bar-fill"
            style={{ width: isPlayerTurn ? undefined : "0%" }}
          />
        </div>
      </div>

      {/* Fuel */}
      <div className="dashboard-card fuel-card">
        <p className="dashboard-label">COMBUSTÍVEL</p>
        <p className="fuel-value" style={{ color: fuelColor }}>{fuel}</p>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${fuelPercent}%`, background: fuelColor }}
          />
        </div>
        <div className="fuel-legend">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Radar */}
      <div className="dashboard-card radar-card">
        <p className="dashboard-label">RADAR</p>
        <button
          type="button"
          className={`radar-btn ${radarAvailable ? "radar-available" : "radar-unavailable"}`}
          onClick={radarAvailable ? onRadarActivate : undefined}
          disabled={!radarAvailable}
        >
          {radarAvailable ? "ATIVAR" : "INDISPONÍVEL"}
        </button>
        <p className="radar-hint">
          {radarAvailable ? "Radar pronto a usar" : "Acerte em menos de 3s para desbloquear"}
        </p>
      </div>

    </section>
  );
}

export default Dashboard;
