import { z } from 'zod'

// Define the comprehensive site configuration schema
export const SiteConfigSchema = z.object({
  // Site metadata
  site: z.object({
    name: z.string().min(1, "Site name is required"),
    description: z.string().min(1, "Site description is required"),
    url: z.string().url("Invalid site URL"),
    keywords: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
  }),

  // User information
  user: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    displayName: z.string().optional(),
    username: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).default('male'),
    pronouns: z.string().default('he/him'),
    bio: z.string().default(''),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    website: z.union([z.string().url("Invalid website URL"), z.literal("")]).optional(),
    jobTitle: z.string().default(''),
    company: z.string().default(''),
    companyWebsite: z.union([z.string().url("Invalid company website URL"), z.literal("")]).optional(),
    address: z.string().default(''),
    about: z.string().default(''),
    avatar: z.string().default('/images/avatar.jpg'),
    ogImage: z.string().default('/images/open-graph-image.png'),
    namePronunciationUrl: z.string().optional(),
    timeZone: z.string().default('America/New_York'),
    dateCreated: z.string().default(() => new Date().toISOString().substring(0, 10)),
  }),

  // Social links
  socialLinks: z.record(z.string(), z.string().url()).default({}),

  // Feature toggles with dependencies
  features: z.object({
    blog: z.boolean().default(true),
    shop: z.boolean().default(false),
    projects: z.boolean().default(true),
    contact: z.boolean().default(true),
    education: z.boolean().default(false),
    experience: z.boolean().default(false),
  }),

  // Theme configuration
  theme: z.object({
    primaryColor: z.string().default('#3b82f6'),
    secondaryColor: z.string().default('#64748b'),
    accentColor: z.string().default('#f59e0b'),
    backgroundColor: z.string().default('#ffffff'),
    textColor: z.string().default('#1f2937'),
    fonts: z.object({
      heading: z.string().default('Inter'),
      body: z.string().default('Inter'),
    }),
    layout: z.object({
      maxWidth: z.string().default('1200px'),
      borderRadius: z.string().default('8px'),
      spacing: z.string().default('1rem'),
    }),
  }),

  // Third-party integrations
  integrations: z.object({
    stripe: z.object({
      publishableKey: z.string().optional(),
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
    }).optional(),
    posthog: z.object({
      key: z.string().optional(),
      host: z.string().optional(),
    }).optional(),
    resend: z.object({
      apiKey: z.string().optional(),
    }).optional(),
    googleAnalytics: z.object({
      measurementId: z.string().optional(),
    }).optional(),
    metaPixel: z.object({
      pixelId: z.string().optional(),
    }).optional(),
    indexnow: z.object({
      apiKey: z.string().optional(),
    }).optional(),
  }).default({}),

  // SEO configuration
  seo: z.object({
    titleTemplate: z.string().default('%s | {{siteName}}'),
    defaultTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    author: z.string().optional(),
    robots: z.string().default('index,follow'),
  }).default(() => ({
    titleTemplate: '%s | {{siteName}}',
    keywords: [],
    robots: 'index,follow',
  })),

  // Content configuration
  content: z.object({
    blog: z.object({
      postsPerPage: z.number().min(1).default(10),
      showAuthor: z.boolean().default(true),
      showDate: z.boolean().default(true),
      enableComments: z.boolean().default(false),
      enableRss: z.boolean().default(true),
    }).default(() => ({
      postsPerPage: 10,
      showAuthor: true,
      showDate: true,
      enableComments: false,
      enableRss: true,
    })),
    projects: z.object({
      maxItems: z.number().min(1).default(6),
      showTechStack: z.boolean().default(true),
      showLinks: z.boolean().default(true),
      enableFiltering: z.boolean().default(true),
    }).default(() => ({
      maxItems: 6,
      showTechStack: true,
      showLinks: true,
      enableFiltering: true,
    })),
    shop: z.object({
      currency: z.string().default('USD'),
      shipping: z.boolean().default(false),
      digitalProducts: z.boolean().default(true),
      physicalProducts: z.boolean().default(false),
    }).default(() => ({
      currency: 'USD',
      shipping: false,
      digitalProducts: true,
      physicalProducts: false,
    })),
  }).default(() => ({
    blog: {
      postsPerPage: 10,
      showAuthor: true,
      showDate: true,
      enableComments: false,
      enableRss: true,
    },
    projects: {
      maxItems: 6,
      showTechStack: true,
      showLinks: true,
      enableFiltering: true,
    },
    shop: {
      currency: 'USD',
      shipping: false,
      digitalProducts: true,
      physicalProducts: false,
    },
  })),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>

// Default configuration
export const defaultConfig: SiteConfig = {
  site: {
    name: "Your Portfolio",
    description: "A modern portfolio and blog showcasing my work and expertise",
    url: "http://localhost:3000",
    keywords: ["portfolio", "blog", "developer", "react", "nextjs"],
  },
  user: {
    firstName: "Your",
    lastName: "Name",
    email: "your@email.com",
    bio: "Brief bio about yourself",
    jobTitle: "Software Developer",
    company: "Your Company",
    about: "Hello! I'm a passionate developer with expertise in modern web technologies...",
    avatar: "/images/avatar.jpg",
    ogImage: "/images/open-graph-image.png",
    timeZone: "America/New_York",
    dateCreated: new Date().toISOString().substring(0, 10),
    gender: "male",
    pronouns: "he/him",
    address: "",
  },
  socialLinks: {},
  features: {
    blog: true,
    shop: false,
    projects: true,
    contact: true,
    education: false,
    experience: false,
  },
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    layout: {
      maxWidth: '1200px',
      borderRadius: '8px',
      spacing: '1rem',
    },
  },
  integrations: {},
  seo: {
    titleTemplate: '%s | {{siteName}}',
    keywords: [],
    robots: 'index,follow',
  },
  content: {
    blog: {
      postsPerPage: 10,
      showAuthor: true,
      showDate: true,
      enableComments: false,
      enableRss: true,
    },
    projects: {
      maxItems: 6,
      showTechStack: true,
      showLinks: true,
      enableFiltering: true,
    },
    shop: {
      currency: 'USD',
      shipping: false,
      digitalProducts: true,
      physicalProducts: false,
    },
  },
}

// Helper function to validate configuration
export function validateConfig(config: unknown): { success: true; data: SiteConfig } | { success: false; errors: z.ZodError } {
  const result = SiteConfigSchema.safeParse(config)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

// Helper function to merge user config with defaults
export function mergeConfig(userConfig: Partial<SiteConfig>): SiteConfig {
  return {
    ...defaultConfig,
    ...userConfig,
    site: { ...defaultConfig.site, ...userConfig.site },
    user: { ...defaultConfig.user, ...userConfig.user },
    socialLinks: { ...defaultConfig.socialLinks, ...userConfig.socialLinks },
    features: { ...defaultConfig.features, ...userConfig.features },
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    integrations: { ...defaultConfig.integrations, ...userConfig.integrations },
    seo: { ...defaultConfig.seo, ...userConfig.seo },
    content: { ...defaultConfig.content, ...userConfig.content },
  }
}
