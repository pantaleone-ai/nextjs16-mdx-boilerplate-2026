import type { User } from "@/types";

export const USER: User = {
  firstName: process.env.NEXT_PUBLIC_USER_FIRST_NAME || "Your",
  lastName: process.env.NEXT_PUBLIC_USER_LAST_NAME || "Name",
  displayName: process.env.NEXT_PUBLIC_USER_DISPLAY_NAME || "Your Name",
  username: process.env.NEXT_PUBLIC_USER_USERNAME || "yourusername",
  gender: process.env.NEXT_PUBLIC_USER_GENDER || "male",
  pronouns: process.env.NEXT_PUBLIC_USER_PRONOUNS || "he/him",
  bio: process.env.NEXT_PUBLIC_USER_BIO || "Brief bio about yourself",
  flipSentences: [
    "Software Developer",
    "Full Stack Engineer",
    "Creative Problem Solver",
    "Tech Enthusiast",
  ],
  address: "Your Location",
  phoneNumber: process.env.NEXT_PUBLIC_USER_PHONE || "",
  email: process.env.NEXT_PUBLIC_USER_EMAIL || "your@email.com",
  website: process.env.NEXT_PUBLIC_USER_WEBSITE || "https://yourwebsite.com",
  jobTitle: process.env.NEXT_PUBLIC_USER_JOB_TITLE || "Software Developer",
  jobs: [
    {
      title: process.env.NEXT_PUBLIC_USER_JOB_TITLE || "Software Developer",
      company: process.env.NEXT_PUBLIC_USER_COMPANY || "Your Company",
      website: process.env.NEXT_PUBLIC_USER_COMPANY_WEBSITE || "https://yourcompany.com",
    },
  ],
  about: process.env.NEXT_PUBLIC_USER_ABOUT || `
Hello! I'm a passionate developer with expertise in modern web technologies.

I specialize in building scalable, performant applications using Next.js, TypeScript, and cutting-edge web technologies. My work focuses on creating exceptional user experiences and solving complex technical challenges.

Whether you're looking for a new portfolio site, a web application, or technical consulting, I'm here to help bring your ideas to life.
`,
  avatar: process.env.NEXT_PUBLIC_USER_AVATAR || "/images/avatar.jpg",
  ogImage: process.env.NEXT_PUBLIC_USER_OG_IMAGE || "/images/open-graph-image.png",
  namePronunciationUrl: "",
  timeZone: "America/New_York",
  keywords: (process.env.NEXT_PUBLIC_SEO_KEYWORDS || "portfolio,blog,developer,react,nextjs").split(","),
  dateCreated: "2024-01-01",
};