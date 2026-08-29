import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";
import Footer from "../Footer";
import PageHero from "../PageHero";
import "./tim.css";

export default function TimProgramPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="tim-page">
      <SEO
        title="TIM Program"
        description="The Innovative Mind (TIM) is IdooTech's flagship EduTech program teaching robotics, coding, AI, and digital graphics to 4,000+ students across Nigerian schools."
        path="/tim-program"
      />
      <Hero />
      <Intro />
      <Pillars />
      <Experience />
      <Videos />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <PageHero
      eyebrow="TIM Program"
      title={<>Raising <span className="pg-hero__title-accent">The Innovative Mind</span>.</>}
      description="Robotics, coding, AI, and digital graphics, taught through learner-centred, child-friendly methodologies, to mould children who are not just tech-savvy, but ready to transform the world around them."
      image={{ src: "/idoo1.jpg", alt: "A child wearing a VR headset as part of the IdooTech TIM Program" }}
      badge="4,000+ students impacted"
      actions={[
        { to: "/contact", label: "Partner with us", variant: "primary" },
        { to: "/portfolio", label: "See our work", variant: "ghost" },
      ]}
    />
  );
}

/* ============ INTRO / WHY NOW ============ */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal-up").forEach((el) =>
            el.classList.add("is-visible")
          );
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

function Intro() {
  const ref = useReveal(0.1);

  return (
    <section className="tim-intro" ref={ref}>
      <div className="tim-container">
        <blockquote className="tim-quote reveal-up">
          <p>
            &ldquo;The future will not be led by countries with the most money
            today, but by those with the youngest, best-educated, and most
            digitally empowered children.&rdquo;
          </p>
          <cite>UNICEF, Global Outlook on Digital Learning 2022</cite>
        </blockquote>

        <div className="tim-intro__body reveal-up reveal--delay-1">
          <p>
            Realising this need, the IdooTech TIM (The Innovative Mind)
            Program is designed to mould children who are not only tech-savvy
            but possess what it takes to transform the world around them.
          </p>
          <p>
            Our TIM Program encompasses robotics, coding, AI, and digital
            graphics, all taught through learner-centred and child-friendly
            methodologies. The sole aim of this program is to nurture children
            who are not only technologically proficient but also possess
            valuable skills such as problem-solving, creativity, teamwork, and
            leadership.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============ PROGRAM PILLARS ============ */
const PILLARS = [
  {
    id: "robotics",
    icon: <GearIcon />,
    title: "Robotics",
    desc: "Robotics, automation, and AI are the driving forces of our current digital age, and all these elements are integrated into our robotics program. Our curriculum teaches learners how to design, build, and program robots, and how to integrate AI to make them smarter.",
    tags: ["Wireless-controlled cars", "Obstacle-avoiding robots", "Talking robots", "Smart home systems", "Drones"],
  },
  {
    id: "coding",
    icon: <CodeIcon />,
    title: "Coding",
    desc: "Coding is giving computers a set of instructions to execute. Students are introduced to a full ladder of languages, from block-based tools to high-level languages, and discover how to build software, games, websites, and programs for robots to follow.",
    tags: ["Scratch", "mBlock", "MIT App Inventor", "Python", "JavaScript", "Java", "C++"],
  },
  {
    id: "ai",
    icon: <AiIcon />,
    title: "AI",
    desc: "AI is reshaping how the world works, and we introduce learners to it early - from understanding how machines learn, see, and respond, to training simple models and prompting AI tools responsibly. Students learn to weave AI into their own coding and robotics projects.",
    tags: ["Machine Learning Basics", "AI Image Generators", "Chatbots & Prompting", "Computer Vision", "AI-Powered Robots"],
  },
  {
    id: "graphics",
    icon: <BrushIcon />,
    title: "Digital Graphics",
    desc: "Our digital graphics program includes logo design, drawing objects from scratch, 2D and 3D character design and modelling, landscape drawing, and image editing, creative outlets that build real technical proficiency in visual design.",
    tags: ["Logo design", "2D & 3D modelling", "Character design", "Landscape drawing", "Image editing"],
  },
];

function Pillars() {
  const ref = useReveal(0.08);

  return (
    <section className="tim-pillars" id="program" ref={ref}>
      <div className="tim-container">
        <p className="tim-eyebrow reveal-up">Program Structure</p>
        <h2 className="tim-section-title reveal-up reveal--delay-1">
          Hands-on learning across four disciplines.
        </h2>
        <p className="tim-section-desc reveal-up reveal--delay-2">
          Our TIM Program focuses on equipping students with practical,
          hands-on learning experiences while fostering creativity,
          innovation, teamwork, and problem-solving abilities.
        </p>

        <div className="tim-pillars__grid">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.id} className={`tim-pillar reveal-up reveal--delay-${(i % 4) + 1}`}>
              <div className="tim-pillar__icon">{pillar.icon}</div>
              <h3 className="tim-pillar__title">{pillar.title}</h3>
              <p className="tim-pillar__desc">{pillar.desc}</p>
              <div className="tim-pillar__tags">
                {pillar.tags.map((tag) => (
                  <span key={tag} className="tim-pillar__tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ OUR EXPERIENCE ============ */
const SCHOOLS = ["Rochester Schools", "Pathfinder Heights Schools", "Corona Schools Agbara"];

const STANDOUT_PROJECTS = [
  "Talking robots",
  "Self-driving cars",
  "Image generators",
  "Spelling games",
  "Smart home control & monitoring",
  "Real-time translator apps",
  "Automatic water dispensers",
];

function Experience() {
  const ref = useReveal(0.1);

  return (
    <section className="tim-experience" ref={ref}>
      <div className="tim-container">
        <div className="tim-experience__grid">
          <div className="reveal-up">
            <p className="tim-eyebrow">Our Experience</p>
            <h2 className="tim-section-title">
              A proven track record across schools and our tech hub.
            </h2>
            <p className="tim-section-desc">
              We have successfully collaborated with leading institutions,
              playing key roles in their tech education initiatives. A recent
              milestone: our work with Rochester Schools contributed to their
              emergence as the best primary school in Lagos in recent
              rankings.
            </p>

            <div className="tim-schools">
              {SCHOOLS.map((school) => (
                <span key={school} className="tim-schools__chip">{school}</span>
              ))}
              <span className="tim-schools__chip tim-schools__chip--more">+ more</span>
            </div>

            <a
              className="tim-link"
              href="https://idootech.com.ng/youtube"
              target="_blank"
              rel="noopener noreferrer"
            >
              See some of our projects in action
              <ArrowIcon />
            </a>
          </div>

          <div className="tim-standout reveal-up reveal--delay-1">
            <p className="tim-standout__label">Standout student projects</p>
            <ul className="tim-standout__list">
              {STANDOUT_PROJECTS.map((project) => (
                <li key={project}>
                  <CheckIcon />
                  {project}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ VIDEOS ============ */
const VIDEOS = [
  { id: "WK3Kllsvkfs", title: "TIM Program in action", area: "v1" },
  { id: "SqH9rMp63yM", title: "IdooTech TIM Program highlights", area: "v2" },
  { id: "Xw2Lq03jAm8", title: "More from the TIM Program", area: "v4" },
  { id: "nyTxh55DhsA", title: "TIM Program short", area: "v3" },
];

function Videos() {
  const ref = useReveal(0.08);

  return (
    <section className="tim-videos" ref={ref}>
      <div className="tim-container">
        <p className="tim-eyebrow reveal-up">See It In Action</p>
        <h2 className="tim-section-title reveal-up reveal--delay-1">
          Watch our students build, code, and create.
        </h2>

        <div className="tim-videos__grid">
          {VIDEOS.map((video, i) => (
            <div
              key={video.id}
              className={`tim-video tim-video--${video.area} reveal-up reveal--delay-${(i % 4) + 1}`}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ PRICING ============ */
function Pricing() {
  const ref = useReveal(0.2);

  return (
    <section className="tim-pricing" ref={ref}>
      <div className="tim-container">
        <div className="tim-pricing__card reveal-up">
          <p className="tim-eyebrow tim-eyebrow--light">Pricing</p>
          <div className="tim-pricing__amount">
            <span className="tim-pricing__currency">&#8358;</span>
            <span className="tim-pricing__num">20,000</span>
            <span className="tim-pricing__period">/ child / term</span>
          </div>
          <p className="tim-pricing__desc">
            This fee covers all necessary materials and access to the program
            for the entire term.
          </p>
          <Link to="/contact" className="tim-btn tim-btn--light">
            Bring TIM to your school
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTASection() {
  const ref = useReveal(0.15);

  return (
    <section className="tim-cta" ref={ref}>
      <div className="tim-container">
        <div className="tim-cta__inner reveal-up">
          <h2 className="tim-cta__title">
            Every child deserves the skills that will shape the future.
          </h2>
          <p className="tim-cta__desc">
            Let&apos;s partner to empower the next generation of innovators
            through the IdooTech TIM Program.
          </p>
          <div className="tim-cta__actions">
            <a
              className="tim-btn tim-btn--primary"
              href="https://wa.me/2348169891512"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Start a conversation
            </a>
            <Link to="/contact" className="tim-btn tim-btn--outline">
              Send a message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ICONS ============ */
function GearIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.856.505 3.596 1.387 5.09L2 22l5.058-1.362a10.02 10.02 0 0 0 4.946 1.34h.001c5.526 0 10.004-4.478 10.004-10.004C22 6.478 17.53 2 12.004 2zm0 18.13a8.11 8.11 0 0 1-4.13-1.13l-.296-.176-3.005.807.803-2.93-.192-.301a8.12 8.12 0 0 1-1.253-4.396c0-4.485 3.65-8.135 8.135-8.135 4.484 0 8.135 3.65 8.135 8.135 0 4.485-3.65 8.126-8.197 8.126z" />
    </svg>
  );
}

function BrushIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
