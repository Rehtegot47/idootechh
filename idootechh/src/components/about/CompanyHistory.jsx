import { useEffect, useRef } from "react";
import "./about.css";

const SERVED = ["Businesses", "Schools", "Educators", "Individual Learners"];

export default function CompanyHistory() {
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
    <section className="idt-section" id="story" ref={sectionRef}>
      <div className="idt-container idt-history__grid">
        {/* Left: Story Text */}
        <div>
          <p className="idt-eyebrow idt-reveal">
            <StoryIcon /> Our Story
          </p>
          <h2 className="idt-h2 idt-reveal idt-reveal--delay-1">
            Built on the belief that technology should empower, not
            complicate.
          </h2>
          <p className="idt-p idt-reveal idt-reveal--delay-2">
            IdooTech bridges the gap between innovation and practical
            application. Our work spans robotics, AI, SaaS platforms, and
            future-ready learning programs - all aimed at empowering
            individuals and organisations to overcome challenges and embrace
            new opportunities.
          </p>
          <p className="idt-p idt-reveal idt-reveal--delay-2">
            The name IdooTech represents more than a brand - it is a
            declaration of intent: to move beyond being end-users of
            technology and become active contributors to its development
            and implementation.
          </p>

          <p className="idt-eyebrow idt-reveal idt-reveal--delay-3" style={{ marginTop: "2rem" }}>
            <PeopleIcon /> Who We Serve
          </p>
          <p className="idt-p idt-reveal idt-reveal--delay-3">
            We help organisations scale, improve efficiency, and connect
            with customers globally, while giving students and learners the
            in-demand skills to become the next generation of innovators.
          </p>
          <div className="idt-served idt-reveal idt-reveal--delay-4">
            {SERVED.map((item) => (
              <span className="idt-chip" key={item}>{item}</span>
            ))}
          </div>
        </div>

        {/* Right: Callout Card */}
        <div className="idt-reveal idt-reveal--delay-2">
          {/* Collaboration image in callout */}
          <div className="idt-story__img-wrap">
            <img src="/story-collab.png" alt="IdooTech team at work" />
            <div className="idt-story__img-caption">
              Building solutions that matter - every day.
            </div>
          </div>

          <div className="idt-callout">
            <p className="idt-callout__title">
              <svg className="idt-callout__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              What our mark means
            </p>

            <div className="idt-meaning">
              <span className="idt-meaning__dot idt-meaning__dot--green" />
              <p className="idt-meaning__text">
                <strong>Green</strong> symbolises optimism and influence - the
                energy behind every new idea we build.
              </p>
            </div>

            <div className="idt-meaning">
              <span className="idt-meaning__dot idt-meaning__dot--purple" />
              <p className="idt-meaning__text">
                <strong>Purple-blue</strong> reflects professionalism,
                uniqueness, and trust in everything we deliver.
              </p>
            </div>

            <div className="idt-meaning">
              <span className="idt-meaning__dot idt-meaning__dot--green" />
              <p className="idt-meaning__text">
                <strong>The two interlinked rings</strong> signify our
                presence around the world, day and night.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
