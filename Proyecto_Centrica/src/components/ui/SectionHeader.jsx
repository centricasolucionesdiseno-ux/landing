/**
 * Título (y subtítulo opcional) de sección.
 * `light` adapta los colores a fondos azules; `subtitleClassName` permite
 * las variantes destacadas (p. ej. "section-subtitle--accent").
 */
const SectionHeader = ({ title, subtitle, light = false, as: Tag = 'h2', subtitleClassName = '' }) => (
  <>
    <Tag className={`section-title${light ? ' section-title--light' : ''}`} data-reveal>
      {title}
    </Tag>
    {subtitle && (
      <p
        className={`section-subtitle${light ? ' section-subtitle--light' : ''} ${subtitleClassName}`.trim()}
        data-reveal
      >
        {subtitle}
      </p>
    )}
  </>
);

export default SectionHeader;
