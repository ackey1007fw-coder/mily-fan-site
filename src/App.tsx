import { About } from "./components/About";
import { ActivityBanner } from "./components/ActivityBanner";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Latest } from "./components/Latest";
import { MobileActionDock } from "./components/MobileActionDock";
import { Schedule } from "./components/Schedule";
import { Socials } from "./components/Socials";
import { StreamSchedule } from "./components/StreamSchedule";
import { Stories } from "./components/Stories";
import { Support } from "./components/Support";
import { TodayDashboard } from "./components/TodayDashboard";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper pb-20 text-ink sm:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sage focus:px-4 focus:py-2 focus:text-white"
      >
        本文へスキップ
      </a>
      <ActivityBanner />
      <Header />
      <main id="main">
        <Hero />
        <TodayDashboard />
        <Support />
        <StreamSchedule />
        <Socials />
        <Latest />
        <Stories />
        <About />
        <Gallery />
        <Schedule />
      </main>
      <Footer />
      <MobileActionDock />
    </div>
  );
}
