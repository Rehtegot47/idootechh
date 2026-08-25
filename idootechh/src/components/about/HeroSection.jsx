import PageHero from "../PageHero";

export default function HeroSection() {
  return (
    <PageHero
      eyebrow="About IdooTech"
      title="Innovating Every Day."
      description="We are a team of engineers, educators, and business experts building intelligent systems, software platforms, and future-ready learning programs that turn ideas into solutions that make lives smarter, simpler, and more connected."
      image={{ src: "/idoo2.jpg", alt: "A young learner using a laptop, representing IdooTech's engineers and educators at work" }}
      badge="Building the future together"
      actions={[
        { to: "/services", label: "Explore our services", variant: "primary" },
        { to: "/contact", label: "Get in touch", variant: "ghost" },
      ]}
    />
  );
}
