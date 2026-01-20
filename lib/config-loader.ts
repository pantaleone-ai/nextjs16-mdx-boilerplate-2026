import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { SiteConfig, defaultConfig, mergeConfig, validateConfig } from '@/config/site-config'

// Configuration file paths
const CONFIG_FILE = 'site-config.json'
const CONFIG_DIR = 'config'
const CONFIG_PATH = join(process.cwd(), CONFIG_DIR, CONFIG_FILE)

/**
 * Load configuration from various sources in order of priority:
 * 1. site-config.json (highest priority)
 * 2. Environment variables
 * 3. Default configuration (lowest priority)
 */
export function loadConfig(): SiteConfig {
  let config = { ...defaultConfig }

  // Load from JSON file if it exists
  if (existsSync(CONFIG_PATH)) {
    try {
      const fileContent = readFileSync(CONFIG_PATH, 'utf-8')
      const jsonConfig = JSON.parse(fileContent)

      // Validate JSON config
      const validation = validateConfig(jsonConfig)
      if (validation.success) {
        config = mergeConfig(validation.data)
      } else {
        console.warn('Invalid configuration in site-config.json:', (validation as any).errors?.format?.() || 'Unknown validation error')
        // Continue with defaults
      }
    } catch (error) {
      console.warn('Failed to parse site-config.json:', error)
      // Continue with defaults
    }
  }

  // Override with environment variables
  config = applyEnvOverrides(config)

  // Validate final configuration
  const validation = validateConfig(config)
  if (!validation.success) {
    console.error('Invalid final configuration:', (validation as any).error?.format?.() || 'Unknown validation error')
    throw new Error('Configuration validation failed')
  }

  return config
}

/**
 * Apply environment variable overrides to configuration
 */
function applyEnvOverrides(config: SiteConfig): SiteConfig {
  const envConfig: Partial<SiteConfig> = {}

  // Site configuration
  if (process.env.NEXT_PUBLIC_SITE_NAME) {
    envConfig.site = {
      ...config.site,
      name: process.env.NEXT_PUBLIC_SITE_NAME,
    }
  }
  if (process.env.NEXT_PUBLIC_SITE_DESCRIPTION) {
    envConfig.site = {
      ...envConfig.site,
      ...config.site,
      description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    }
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    envConfig.site = {
      ...envConfig.site,
      ...config.site,
      url: process.env.NEXT_PUBLIC_BASE_URL,
    }
  }
  if (process.env.NEXT_PUBLIC_OG_IMAGE) {
    envConfig.site = {
      ...envConfig.site,
      ...config.site,
      ogImage: process.env.NEXT_PUBLIC_OG_IMAGE,
    }
  }
  if (process.env.NEXT_PUBLIC_SEO_KEYWORDS) {
    envConfig.site = {
      ...envConfig.site,
      ...config.site,
      keywords: process.env.NEXT_PUBLIC_SEO_KEYWORDS.split(','),
    }
  }

  // User information
  if (process.env.NEXT_PUBLIC_USER_FIRST_NAME || process.env.NEXT_PUBLIC_USER_LAST_NAME) {
    envConfig.user = {
      ...config.user,
      firstName: process.env.NEXT_PUBLIC_USER_FIRST_NAME || config.user.firstName,
      lastName: process.env.NEXT_PUBLIC_USER_LAST_NAME || config.user.lastName,
      displayName: process.env.NEXT_PUBLIC_USER_DISPLAY_NAME ||
        `${process.env.NEXT_PUBLIC_USER_FIRST_NAME || config.user.firstName} ${process.env.NEXT_PUBLIC_USER_LAST_NAME || config.user.lastName}`,
      username: process.env.NEXT_PUBLIC_USER_USERNAME ||
        `${(process.env.NEXT_PUBLIC_USER_FIRST_NAME || config.user.firstName).toLowerCase()}${(process.env.NEXT_PUBLIC_USER_LAST_NAME || config.user.lastName).toLowerCase()}`,
    }
  }

  // Continue with other environment variables...
  // Bio, email, job info, etc.
  if (process.env.NEXT_PUBLIC_USER_BIO) {
    envConfig.user = {
      ...envConfig.user,
      ...config.user,
      bio: process.env.NEXT_PUBLIC_USER_BIO,
    }
  }

  if (process.env.NEXT_PUBLIC_USER_EMAIL) {
    envConfig.user = {
      ...envConfig.user,
      ...config.user,
      email: process.env.NEXT_PUBLIC_USER_EMAIL,
    }
  }

  if (process.env.NEXT_PUBLIC_USER_JOB_TITLE) {
    envConfig.user = {
      ...envConfig.user,
      ...config.user,
      jobTitle: process.env.NEXT_PUBLIC_USER_JOB_TITLE,
    }
  }

  if (process.env.NEXT_PUBLIC_USER_COMPANY) {
    envConfig.user = {
      ...envConfig.user,
      ...config.user,
      company: process.env.NEXT_PUBLIC_USER_COMPANY,
    }
  }

  if (process.env.NEXT_PUBLIC_USER_ABOUT) {
    envConfig.user = {
      ...envConfig.user,
      ...config.user,
      about: process.env.NEXT_PUBLIC_USER_ABOUT,
    }
  }

  // Social links
  const socialLinks: Record<string, string> = {}
  if (process.env.NEXT_PUBLIC_SOCIAL_GITHUB) socialLinks.github = process.env.NEXT_PUBLIC_SOCIAL_GITHUB
  if (process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) socialLinks.linkedin = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN
  if (process.env.NEXT_PUBLIC_SOCIAL_TWITTER) socialLinks.twitter = process.env.NEXT_PUBLIC_SOCIAL_TWITTER
  if (process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) socialLinks.instagram = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM
  if (process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE) socialLinks.youtube = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE

  if (Object.keys(socialLinks).length > 0) {
    envConfig.socialLinks = socialLinks
  }

  // Feature toggles
  const features: Partial<SiteConfig['features']> = {}
  if (process.env.NEXT_PUBLIC_ENABLE_BLOG !== undefined) {
    features.blog = process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true'
  }
  if (process.env.NEXT_PUBLIC_ENABLE_SHOP !== undefined) {
    features.shop = process.env.NEXT_PUBLIC_ENABLE_SHOP === 'true'
  }
  if (process.env.NEXT_PUBLIC_ENABLE_PROJECTS !== undefined) {
    features.projects = process.env.NEXT_PUBLIC_ENABLE_PROJECTS === 'true'
  }
  if (process.env.NEXT_PUBLIC_ENABLE_CONTACT !== undefined) {
    features.contact = process.env.NEXT_PUBLIC_ENABLE_CONTACT === 'true'
  }

  if (Object.keys(features).length > 0) {
    envConfig.features = { ...config.features, ...features }
  }

  // Third-party integrations
  const integrations: Partial<SiteConfig['integrations']> = {}

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    integrations.stripe = {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }
  }

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    integrations.posthog = {
      key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    }
  }

  if (process.env.RESEND_API_KEY) {
    integrations.resend = {
      apiKey: process.env.RESEND_API_KEY,
    }
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    integrations.googleAnalytics = {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    }
  }

  if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    integrations.metaPixel = {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    }
  }

  if (process.env.INDEXNOW_API_KEY) {
    integrations.indexnow = {
      apiKey: process.env.INDEXNOW_API_KEY,
    }
  }

  if (Object.keys(integrations).length > 0) {
    envConfig.integrations = integrations
  }

  return mergeConfig(envConfig)
}

/**
 * Save configuration to JSON file
 */
export function saveConfig(config: SiteConfig): void {
  try {
    // Ensure config directory exists
    const { mkdirSync } = require('fs')
    mkdirSync(CONFIG_DIR, { recursive: true })

    // Save configuration
    const configString = JSON.stringify(config, null, 2)
    require('fs').writeFileSync(CONFIG_PATH, configString, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to save configuration: ${error}`)
  }
}

/**
 * Generate environment variables from configuration
 */
export function generateEnvFile(config: SiteConfig): string {
  const envLines: string[] = [
    '# Environment Variables for Next.js Portfolio Boilerplate',
    '# Generated from site-config.json - customize as needed',
    '',
    '# ============================================',
    '# Site Configuration',
    '# ============================================',
    '',
    `NEXT_PUBLIC_SITE_NAME="${config.site.name}"`,
    `NEXT_PUBLIC_SITE_DESCRIPTION="${config.site.description}"`,
    `NEXT_PUBLIC_BASE_URL="${config.site.url}"`,
    config.site.ogImage ? `NEXT_PUBLIC_OG_IMAGE="${config.site.ogImage}"` : '# NEXT_PUBLIC_OG_IMAGE="/images/open-graph-image.png"',
    `NEXT_PUBLIC_SEO_KEYWORDS="${config.site.keywords.join(',')}"`,
    '',
    '# ============================================',
    '# User Information',
    '# ============================================',
    '',
    `NEXT_PUBLIC_USER_FIRST_NAME="${config.user.firstName}"`,
    `NEXT_PUBLIC_USER_LAST_NAME="${config.user.lastName}"`,
    `NEXT_PUBLIC_USER_DISPLAY_NAME="${config.user.displayName || ''}"`,
    `NEXT_PUBLIC_USER_USERNAME="${config.user.username || ''}"`,
    `NEXT_PUBLIC_USER_GENDER="${config.user.gender}"`,
    `NEXT_PUBLIC_USER_PRONOUNS="${config.user.pronouns}"`,
    `NEXT_PUBLIC_USER_BIO="${config.user.bio}"`,
    `NEXT_PUBLIC_USER_EMAIL="${config.user.email}"`,
    config.user.phone ? `NEXT_PUBLIC_USER_PHONE="${config.user.phone}"` : '# NEXT_PUBLIC_USER_PHONE=""',
    config.user.website ? `NEXT_PUBLIC_USER_WEBSITE="${config.user.website}"` : '# NEXT_PUBLIC_USER_WEBSITE=""',
    `NEXT_PUBLIC_USER_JOB_TITLE="${config.user.jobTitle}"`,
    config.user.company ? `NEXT_PUBLIC_USER_COMPANY="${config.user.company}"` : '# NEXT_PUBLIC_USER_COMPANY=""',
    config.user.companyWebsite ? `NEXT_PUBLIC_USER_COMPANY_WEBSITE="${config.user.companyWebsite}"` : '# NEXT_PUBLIC_USER_COMPANY_WEBSITE=""',
    `NEXT_PUBLIC_USER_ABOUT="${config.user.about}"`,
    `NEXT_PUBLIC_USER_AVATAR="${config.user.avatar}"`,
    `NEXT_PUBLIC_USER_OG_IMAGE="${config.user.ogImage}"`,
    '',
    '# ============================================',
    '# Social Links',
    '# ============================================',
    '',
  ]

  // Add social links
  Object.entries(config.socialLinks).forEach(([platform, url]) => {
    const envKey = `NEXT_PUBLIC_SOCIAL_${platform.toUpperCase()}`
    envLines.push(`${envKey}="${url}"`)
  })

  envLines.push('', '# ============================================', '# Feature Toggles', '# ============================================', '')

  // Add feature toggles
  Object.entries(config.features).forEach(([feature, enabled]) => {
    const envKey = `NEXT_PUBLIC_ENABLE_${feature.toUpperCase()}`
    envLines.push(`${envKey}=${enabled}`)
  })

  envLines.push('', '# ============================================', '# Third-party Services', '# ============================================', '')

  // Add integrations
  if (config.integrations.stripe?.publishableKey) {
    envLines.push(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${config.integrations.stripe.publishableKey}"`)
    if (config.integrations.stripe.secretKey) {
      envLines.push(`STRIPE_SECRET_KEY="${config.integrations.stripe.secretKey}"`)
    }
    if (config.integrations.stripe.webhookSecret) {
      envLines.push(`STRIPE_WEBHOOK_SECRET="${config.integrations.stripe.webhookSecret}"`)
    }
  }

  if (config.integrations.posthog?.key) {
    envLines.push(`NEXT_PUBLIC_POSTHOG_KEY="${config.integrations.posthog.key}"`)
    if (config.integrations.posthog.host) {
      envLines.push(`NEXT_PUBLIC_POSTHOG_HOST="${config.integrations.posthog.host}"`)
    }
  }

  if (config.integrations.resend?.apiKey) {
    envLines.push(`RESEND_API_KEY="${config.integrations.resend.apiKey}"`)
  }

  if (config.integrations.googleAnalytics?.measurementId) {
    envLines.push(`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="${config.integrations.googleAnalytics.measurementId}"`)
  }

  if (config.integrations.metaPixel?.pixelId) {
    envLines.push(`NEXT_PUBLIC_META_PIXEL_ID="${config.integrations.metaPixel.pixelId}"`)
  }

  if (config.integrations.indexnow?.apiKey) {
    envLines.push(`INDEXNOW_API_KEY="${config.integrations.indexnow.apiKey}"`)
  }

  envLines.push('', '# ============================================', '# Additional API Keys', '# ============================================', '', '# Add any additional API keys or secrets here')

  return envLines.join('\n')
}

// Export singleton instance
export const siteConfig = loadConfig()
