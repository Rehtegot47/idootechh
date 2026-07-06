import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import CompanyHistory from "./CompanyHistory";
import StatsGrid from "./StatsGrid";
import TeamGrid from "./TeamGrid";
import Footer from "./Footer";
import "./about.css";

function LoadingOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Remove from DOM after the CSS fade-out animation (1.2s delay + 0.5s fade = 1.7s)
    const timer = setTimeout(() => setVisible(false), 1750);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="idt-loader" aria-hidden="true">
      <div className="idt-loader__ring" />
      <p className="idt-loader__wordmark">
        Idoo<span>Tech</span>
      </p>
    </div>
  );
}

export default function AboutPage({ logoSrc }) {
  return (
    <>
      <LoadingOverlay />
      <main className="idt-about">
        <HeroSection logoSrc={logoSrc} />
        <CompanyHistory />
        <StatsGrid />
        <TeamGrid />
        <Footer />
      </main>
    </>
  );
}
