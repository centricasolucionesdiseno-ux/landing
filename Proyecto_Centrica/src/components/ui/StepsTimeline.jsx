/** Metodología en línea de tiempo: número en círculo y línea que une cada paso. */
const StepsTimeline = ({ pasos }) => (
  <ol className="steps">
    {pasos.map((paso, index) => (
      <li key={paso.title} className="card card-highlight step" data-reveal="left">
        <span className="step-number" aria-hidden="true">{index + 1}</span>
        <div>
          <h3 className="step-title">
            <span className="visually-hidden">Paso {index + 1}: </span>
            {paso.title}
          </h3>
          <p className="step-text">{paso.text}</p>
        </div>
      </li>
    ))}
  </ol>
);

export default StepsTimeline;
