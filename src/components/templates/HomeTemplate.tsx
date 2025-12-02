//src/components/templates/HomeTemplate.tsx
import { Header, Hero, Services, Techs, About, Contact, Footer } from '../organisms';

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
