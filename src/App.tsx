import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Latest } from "./components/Latest";
import { Schedule } from "./components/Schedule";
import { Socials } from "./components/Socials";
import { Support } from "./components/Support";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Support />
        <Latest />
        <Gallery />
        <Schedule />
        <About />
        <Socials />
      </main>
      <Footer />
    </div>
  );
}
