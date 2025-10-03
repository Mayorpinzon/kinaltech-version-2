//src/components/organisms/Header.tsx
import Container from '../atoms/Container';
import LangSelect from '../atoms/LangSelect';
import ThemeToggle from '../atoms/ThemeToggle';
import Nav from '../molecules/Nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-surface/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#home" className="font-extrabold text-xl text-[var(--primary)]">
          KinalTech
        </a>
        <div className="flex items-center gap-4">
          <Nav />
          <LangSelect />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
