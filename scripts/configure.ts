#!/usr/bin/env tsx

/**
 * Enhanced Configuration Wizard for Next.js Portfolio Boilerplate
 * Interactive setup with validation and smart defaults
 */

import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'
import { SiteConfig, defaultConfig } from '../config/site-config'
import { saveConfig, generateEnvFile } from '../lib/config-loader'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

function askYesNo(question: string, defaultValue: boolean = false): Promise<boolean> {
  return new Promise(async (resolve) => {
    const defaultText = defaultValue ? '[Y/n]' : '[y/N]'
    const answer = await ask(`${question} ${defaultText}: `)
    if (!answer) return resolve(defaultValue)
    resolve(['y', 'yes', 'true', '1'].includes(answer.toLowerCase()))
  })
}

function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function generateUsername(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}`
}

async function collectSiteInfo(): Promise<Partial<SiteConfig['site']>> {
  console.log('\n📄 Site Information')
  console.log('─'.repeat(30))

  const name = await ask('Site name (e.g., "John Doe - Developer"): ')
  const description = await ask('Site description: ')
  const url = await ask('Base URL (e.g., https://yourdomain.com): ')

  if (url && !validateUrl(url)) {
    console.log('⚠️  Invalid URL format. Using default localhost URL.')
  }

  return {
    name: name || defaultConfig.site.name,
    description: description || defaultConfig.site.description,
    url: (url && validateUrl(url)) ? url : defaultConfig.site.url,
    keywords: defaultConfig.site.keywords,
  }
}

async function collectUserInfo(): Promise<Partial<SiteConfig['user']>> {
  console.log('\n👤 Personal Information')
  console.log('─'.repeat(30))

  const firstName = await ask('First name: ')
  const lastName = await ask('Last name: ')
  const email = await ask('Email address: ')
  const bio = await ask('Short bio (optional): ')

  const jobTitle = await ask('Job title: ')
  const company = await ask('Company (optional): ')
  const website = await ask('Personal website (optional): ')

  // Generate smart defaults
  const username = generateUsername(firstName || 'Your', lastName || 'Name')
  const displayName = `${firstName || 'Your'} ${lastName || 'Name'}`

  // Generate about text
  const about = `Hello! I'm ${displayName}, ${bio || 'a passionate developer'}. I specialize in building modern web applications and love creating exceptional user experiences.`

  return {
    firstName: firstName || defaultConfig.user.firstName,
    lastName: lastName || defaultConfig.user.lastName,
    displayName,
    username,
    email: email || defaultConfig.user.email,
    bio: bio || defaultConfig.user.bio,
    jobTitle: jobTitle || defaultConfig.user.jobTitle,
    company: company || defaultConfig.user.company,
    website: website || undefined,
    about,
    avatar: defaultConfig.user.avatar,
    ogImage: defaultConfig.user.ogImage,
    gender: defaultConfig.user.gender,
    pronouns: defaultConfig.user.pronouns,
    timeZone: defaultConfig.user.timeZone,
    dateCreated: defaultConfig.user.dateCreated,
  }
}

async function collectSocialLinks(): Promise<Record<string, string>> {
  console.log('\n🔗 Social Media Links')
  console.log('─'.repeat(30))

  const socialLinks: Record<string, string> = {}

  const github = await ask('GitHub URL (optional): ')
  if (github) socialLinks.github = github

  const linkedin = await ask('LinkedIn URL (optional): ')
  if (linkedin) socialLinks.linkedin = linkedin

  const twitter = await ask('Twitter/X URL (optional): ')
  if (twitter) socialLinks.twitter = twitter

  const instagram = await ask('Instagram URL (optional): ')
  if (instagram) socialLinks.instagram = instagram

  const youtube = await ask('YouTube URL (optional): ')
  if (youtube) socialLinks.youtube = youtube

  return socialLinks
}

async function collectFeatures(): Promise<Partial<SiteConfig['features']>> {
  console.log('\n⚙️  Feature Configuration')
  console.log('─'.repeat(30))

  const features: Partial<SiteConfig['features']> = {}

  features.blog = await askYesNo('Enable blog feature', true)
  features.shop = await askYesNo('Enable e-commerce shop', false)
  features.projects = await askYesNo('Enable projects showcase', true)
  features.contact = await askYesNo('Enable contact form', true)
  features.education = await askYesNo('Enable education section', false)
  features.experience = await askYesNo('Enable experience section', false)

  return features
}

async function collectIntegrations(): Promise<Partial<SiteConfig['integrations']>> {
  console.log('\n🔧 Third-party Integrations')
  console.log('─'.repeat(30))

  const integrations: Partial<SiteConfig['integrations']> = {}

  // Stripe
  if (await askYesNo('Set up Stripe for payments', false)) {
    const publishableKey = await ask('Stripe Publishable Key: ')
    const secretKey = await ask('Stripe Secret Key: ')
    const webhookSecret = await ask('Stripe Webhook Secret: ')

    if (publishableKey && secretKey) {
      integrations.stripe = {
        publishableKey,
        secretKey,
        webhookSecret: webhookSecret || undefined,
      }
    }
  }

  // PostHog
  if (await askYesNo('Set up PostHog analytics', false)) {
    const key = await ask('PostHog API Key: ')
    const host = await ask('PostHog Host (optional): ')

    if (key) {
      integrations.posthog = {
        key,
        host: host || undefined,
      }
    }
  }

  // Resend
  if (await askYesNo('Set up Resend for emails', false)) {
    const apiKey = await ask('Resend API Key: ')

    if (apiKey) {
      integrations.resend = { apiKey }
    }
  }

  // Google Analytics
  if (await askYesNo('Set up Google Analytics', false)) {
    const measurementId = await ask('Google Analytics Measurement ID: ')

    if (measurementId) {
      integrations.googleAnalytics = { measurementId }
    }
  }

  return integrations
}

async function collectTheme(): Promise<Partial<SiteConfig['theme']>> {
  console.log('\n🎨 Theme Customization')
  console.log('─'.repeat(30))

  const useCustomTheme = await askYesNo('Customize theme colors', false)

  if (!useCustomTheme) {
    return defaultConfig.theme
  }

  console.log('Available color schemes:')
  console.log('1. Professional (Blue & Gray)')
  console.log('2. Creative (Purple & Orange)')
  console.log('3. Minimal (Black & White)')
  console.log('4. Custom (Enter your own)')

  const choice = await ask('Choose theme (1-4): ')

  let theme = { ...defaultConfig.theme }

  switch (choice) {
    case '1':
      // Professional - already default
      break
    case '2':
      // Creative
      theme.primaryColor = '#8b5cf6'
      theme.secondaryColor = '#f97316'
      theme.accentColor = '#ec4899'
      break
    case '3':
      // Minimal
      theme.primaryColor = '#000000'
      theme.secondaryColor = '#666666'
      theme.accentColor = '#ffffff'
      theme.backgroundColor = '#ffffff'
      theme.textColor = '#000000'
      break
    case '4':
      // Custom
      theme.primaryColor = await ask('Primary color (hex): ') || theme.primaryColor
      theme.secondaryColor = await ask('Secondary color (hex): ') || theme.secondaryColor
      theme.accentColor = await ask('Accent color (hex): ') || theme.accentColor
      break
    default:
      console.log('Using default professional theme.')
  }

  return theme
}

async function main() {
  console.log('🚀 Next.js Portfolio Boilerplate - Enhanced Configuration')
  console.log('═'.repeat(60))
  console.log('This wizard will help you configure your portfolio site.')
  console.log('You can skip any question to use smart defaults.\n')

  try {
    // Collect all configuration data
    const site = await collectSiteInfo()
    const user = await collectUserInfo()
    const socialLinks = await collectSocialLinks()
    const features = await collectFeatures()
    const integrations = await collectIntegrations()
    const theme = await collectTheme()

    // Build complete configuration
    const config: SiteConfig = {
      site: site as SiteConfig['site'],
      user: user as SiteConfig['user'],
      socialLinks,
      features: { ...defaultConfig.features, ...features },
      theme: { ...defaultConfig.theme, ...theme },
      integrations,
      seo: defaultConfig.seo,
      content: defaultConfig.content,
    }

    // Save configuration
    console.log('\n💾 Saving Configuration')
    console.log('─'.repeat(30))

    saveConfig(config)
    console.log('✅ Configuration saved to config/site-config.json')

    // Generate .env.local if it doesn't exist
    const envPath = path.join(process.cwd(), '.env.local')
    if (!fs.existsSync(envPath)) {
      const envContent = generateEnvFile(config)
      fs.writeFileSync(envPath, envContent, 'utf-8')
      console.log('✅ Environment file generated at .env.local')
    } else {
      console.log('ℹ️  .env.local already exists, skipping generation')
    }

    // Success message
    console.log('\n🎉 Configuration Complete!')
    console.log('─'.repeat(30))
    console.log(`Site: ${config.site.name}`)
    console.log(`URL: ${config.site.url}`)
    console.log(`User: ${config.user.displayName}`)
    console.log(`Features: ${Object.entries(config.features).filter(([, enabled]) => enabled).map(([key]) => key).join(', ')}`)

    console.log('\n📋 Next Steps:')
    console.log('1. Review config/site-config.json and customize as needed')
    console.log('2. Add your API keys to .env.local if you skipped them')
    console.log('3. Replace placeholder images in public/images/')
    console.log('4. Add your content (blog posts, projects, etc.)')
    console.log('5. Run "npm run dev" to start development')

  } catch (error) {
    console.error('❌ Configuration failed:', error)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { main as configure }
