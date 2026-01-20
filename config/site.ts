export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Your Portfolio",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "A modern portfolio and blog showcasing my work and expertise",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/images/open-graph-image.png",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  keywords: (process.env.NEXT_PUBLIC_SEO_KEYWORDS || "portfolio,blog,developer,react,nextjs").split(","),
  links: {
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "https://twitter.com/yourusername",
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "https://github.com/yourusername",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/in/yourusername",
  },
};

export type SiteConfig = typeof siteConfig;