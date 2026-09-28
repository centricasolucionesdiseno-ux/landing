import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import ContactInfo from './components/ContactInfo';
import AgendaForm from './components/AgendaForm';
import MapaSection from './components/MapaSection';
import NebulinaAyuda from '../../components/common/NebulinaAyuda';
import { useHidratado } from '../../hooks/useMediaQuery';

const SEO = {
  title: 'Contacto: Agenda una Reunión por Google Meet | Céntrica',
  description: 'Agenda una reunión virtual con nuestro gerente comercial o visítanos en Belén, Medellín. Cuéntanos tu proyecto de software, ERP o inteligencia artificial.',
  ogTitle: 'Contacto | Céntrica',
  ogDescription: 'Hablemos de tu proyecto: agenda una reunión por Google Meet con Céntrica.',
  path: '/contacto'
};

const AgendaTuCita = () => {
  // Tras hidratar se vuelve a montar el formulario, ya con el borrador guardado
  const hidratado = useHidratado();

  return (
    <Page className="contacto-page" seo={SEO}>
      <PageHero
        video="https://cdn.coverr.co/videos/coverr-people-handshaking-in-an-office-1586815565729/1080p.mp4"
        image={heroImage('Contacto')}
        title={<>Hablemos de tu <span>proyecto</span></>}
        description="Cuéntanos tu idea o necesidad. Nuestros expertos te asesorarán sin compromiso."
        actions={[
          { label: 'Enviar mensaje', targetId: 'contacto-form' },
          { label: 'Cómo llegar', targetId: 'mapa', variant: 'secondary' }
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="grid-2 contacto-grid">
            <ContactInfo />
            {/* En escritorio bajo los datos de contacto; en celular después del formulario */}
            <NebulinaAyuda className="contacto-ayuda" />

            <div id="contacto-form" className="card contacto-form-card" data-reveal="right">
              <h2 className="contacto-form-titulo">Agenda tu <span>cita</span></h2>
              <p className="contacto-form-intro">
                Elige el rango de fechas que te sirve y te enviaremos la invitación a una reunión por Google Meet con nuestro gerente comercial.
              </p>
              <AgendaForm key={hidratado ? 'navegador' : 'html'} restaurar={hidratado} />
            </div>
          </div>
        </div>
      </section>

      <MapaSection />
    </Page>
  );
};

export default AgendaTuCita;
