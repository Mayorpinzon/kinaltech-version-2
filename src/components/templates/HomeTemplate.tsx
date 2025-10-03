//src/components/templates/HomeTemplate.tsx
import Header from '../organisms/Header';
import Hero from '../organisms/Hero';
import Services from '../organisms/Services';
import { Techs } from '../organisms/Techs';
import { About } from '../organisms/About';
import { Contact } from '../organisms/Contact';
import { Footer } from '../organisms/Footer';

export default function HomeTemplate() {
  return (
    <>
      {/* Skip link para accesibilidad / teclado */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3
                   rounded-app bg-card px-4 py-2 shadow-soft trans-app"
      >
        Ir al contenido
      </a>

      <Header />

      {/* Nota: damos un id para el skip link y fijamos fondo/tipo por tokens */}
      <main id="content" className="bg-bg text-base">
        {/* Importante: cada sección ya usa tokens y reveal */}
        <Hero />
        <Services />
        <Techs />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
