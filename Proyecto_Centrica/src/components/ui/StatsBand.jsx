import CountUp from './CountUp';
import SectionHeader from './SectionHeader';

/**
 * Franja azul de métricas con contadores animados y números flotantes.
 * `animar: false` en una métrica la muestra tal cual (p. ej. un año).
 * `fuente`: de dónde salen las cifras (se muestra al pie).
 */
const StatsBand = ({ title, stats, fuente }) => (
  <section className="stats-section bg-primary">
    <div className="container">
      <SectionHeader title={title} light />
      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-item"
            data-reveal="zoom"
          >
            {stat.animar === false
              ? <span className="stat-number stat-number--texto">{stat.value}</span>
              : <CountUp value={stat.value} className="stat-number" />}
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      {fuente && <p className="stats-fuente" data-reveal>{fuente}</p>}
    </div>
  </section>
);

export default StatsBand;
