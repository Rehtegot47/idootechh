import HeroSection from "./HeroSection";
import CompanyHistory from "./CompanyHistory";
import StatsGrid from "./StatsGrid";
import TeamGrid from "./TeamGrid";
import Footer from "../Footer";
import SEO from "../SEO";
import "./about.css";

export default function AboutPage({ logoSrc }) {
  return (
    <main className="idt-about">
      <SEO title="About" description="We are a team of engineers, educators, and business experts building intelligent systems, software platforms, and future-ready learning programs." path="/about" />
      <HeroSection logoSrc={logoSrc} />
      <CompanyHistory />
      <StatsGrid />
      <TeamGrid />
      <Footer />
    </main>
  );
}
