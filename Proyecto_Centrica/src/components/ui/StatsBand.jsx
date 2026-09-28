import CountUp from './CountUp';
import SectionHeader from './SectionHeader';

/** Franja azul de métricas con contadores animados y números flotantes. */
const StatsBand = ({ title, stats }) => (
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
            <CountUp value={stat.value} className="stat-number" />
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBand;
