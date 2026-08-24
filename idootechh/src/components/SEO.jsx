import { Helmet } from "react-helmet-async";

const SITE_NAME = "IdooTech";

export default function SEO({ title, description, path }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || "We build intelligent systems, SaaS platforms, and future-ready learning programs turning bold ideas into real solutions for businesses, schools, and communities.";
  const url = `https://www.idootech.com.ng${path || "/"}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content="https://www.idootech.com.ng/IdooTechLogo1.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content="https://www.idootech.com.ng/IdooTechLogo1.png" />
    </Helmet>
  );
}
