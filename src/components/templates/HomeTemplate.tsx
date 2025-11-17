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
