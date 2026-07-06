import { useEffect, useRef } from "react";
import "./about.css";

const STATS = [
  {
    value: "4,000+",
    label: "Students reached through TIM, our EduTech program",
    icon: "users",
    iconVariant: "green",
  },
  {
    value: "10+",
    label: "Industries served - logistics, real estate, education and NGOs",
    icon: "globe",
    iconVariant: "purple",
  },
  {
    value: "2x",
    label: "Team growth over the past year",
    icon: "chart",
    iconVariant: "green",
  },
  {
    value: "3",
    label: "Major platforms shipped - from school management to client web portals",
    icon: "layers",
    iconVariant: "purple",
  },
];

export default function StatsGrid() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".idt-reveal").forEach((el) =>
              el.classList.add("is-visible")
            );
          }
        });
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="idt-stats-section" id="milestones" ref={sectionRef}>
      {/* Decorative background image */}
      <div className="idt-stats-section__bg" aria-hidden="true" />
      <div className="idt-stats-section__overlay" aria-hidden="true" />

      <div className="idt-container">
        <p className="idt-eyebrow idt-reveal">
          <MilestoneIcon /> Milestones
        </p>
        <h2 className="idt-h2 idt-reveal idt-reveal--delay-1">
          Progress we can point to.
        </h2>
        <p className="idt-p idt-reveal idt-reveal--delay-2" style={{ maxWidth: 600, marginBottom: 0 }}>
          Numbers don't tell the whole story, but they are a fair snapshot of
          where IdooTech stands today.
        </p>

        <div className="idt-stats__grid">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, icon, iconVariant, delay }) {
  return (
    <div className={`idt-stat idt-reveal idt-reveal--delay-${delay}`}>
      <div className={`idt-stat__icon idt-stat__icon--${iconVariant}`}>
        <StatIcon name={icon} />
      </div>
      <p className="idt-stat__value">{value}</p>
      <p className="idt-stat__label">{label}</p>
    </div>
  );
}

function StatIcon({ name }) {
  switch (name) {
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12h20M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 16l4-5 4 3 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function MilestoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V12M12 12 6 6M12 12l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
