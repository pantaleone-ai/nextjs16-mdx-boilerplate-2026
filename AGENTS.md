# AI Agent Guidelines for Next.js Portfolio Boilerplate

This guide provides essential information for AI agents working with the Next.js Portfolio Boilerplate codebase - a customizable portfolio and blog platform.

## Project Overview

**Next.js Portfolio Boilerplate** is a modern, full-featured portfolio and blog platform built with Next.js 16. It serves as:

- Developer portfolio template
- Personal blog platform
- E-commerce enabled showcase site
- AI agent integrated platform

### Key Features

- **Clean & modern design** - Minimalist interface with smooth animations
- **Light/Dark themes** - Seamless theme switching with system preference support
- **SEO optimized** - JSON-LD schema, dynamic sitemaps, Open Graph tags
- **E-commerce ready** - Stripe integration for selling digital products
- **AI agent friendly** - MCP protocol and LLM-txt endpoint support

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + custom components
- **Package Manager**: npm
- **Language**: TypeScript
- **Deployment**: Vercel

## Project Structure

### Key Directories

```
app/                      # Next.js App Router pages
components/               # Shared UI components
hooks/                    # Custom React hooks
lib/                      # Utility libraries
styles/                   # Global styles
public/                   # Static assets
```

### Important Files

- `app/layout.tsx` - Root layout
- `app/page.tsx` - Homepage
- `components.json` - shadcn/ui configuration
- `styles/globals.css` - Global styles

## Development Guidelines

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev  # Runs on port 1408

# Build for production
npm run build
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Code formatting
- **File naming**: kebab-case for files, PascalCase for components

### Coding Guidelines

When writing code for this project, follow these principles:

**TypeScript & Documentation**

- Write type-safe TypeScript code with explicit types when necessary
- Add comments only when they clarify complex logic, function purpose, or non-obvious behavior
- Avoid obvious comments that merely restate the code
- Use descriptive variable and function names that make the code self-documenting
- Keep comments concise and focused on the "why" rather than the "what"

**Code Style**

- No emojis in code, comments, or commit messages
- Write clean, readable code that minimizes the need for extensive documentation
- Prefer self-explanatory code over commented code
- Use JSDoc for public APIs and exported functions when the signature alone isn't clear

**Best Practices**

- Follow SOLID principles and clean code practices
- Keep functions small and focused on a single responsibility
- Use meaningful names that reveal intent
- Write code that is easy to understand at first glance
- Avoid over-commenting; let the code speak for itself

### Styling Guidelines

- Use Tailwind CSS v4 syntax
- Follow existing color scheme (zinc-based)
- Support dark/light modes
- Use CSS variables for theme colors

## Configuration System

The boilerplate now includes an advanced, unified configuration system that makes customization incredibly easy. You have multiple ways to configure your site:

### 1. Interactive Configuration Wizard (Recommended)

Run the enhanced configuration wizard for a guided setup:

```bash
npm run configure
```

This interactive wizard will:
- **Collect site information** (name, description, URL)
- **Gather personal details** with smart defaults
- **Configure social media links**
- **Set up feature toggles** with dependency checking
- **Configure third-party integrations** (Stripe, PostHog, etc.)
- **Customize theme colors** from predefined palettes
- **Generate configuration files** automatically

**Benefits:**
- ✅ **30-minute setup** from fork to live site
- ✅ **Smart defaults** for all fields
- ✅ **Validation** prevents configuration errors
- ✅ **Dependency checking** ensures compatible features

### 2. JSON Configuration File

Edit `config/site-config.json` directly for programmatic configuration:

```json
{
  "site": {
    "name": "John Doe - Developer",
    "description": "Full-stack developer specializing in React and Node.js",
    "url": "https://johndoe.dev"
  },
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@johndoe.dev",
    "jobTitle": "Senior Software Engineer"
  },
  "features": {
    "blog": true,
    "shop": false,
    "projects": true
  }
}
```

### 3. Environment Variables (Legacy)

Use environment variables for simple overrides (see `env.template`):

```bash
NEXT_PUBLIC_SITE_NAME="My Portfolio"
NEXT_PUBLIC_USER_EMAIL="me@example.com"
NEXT_PUBLIC_ENABLE_SHOP=true
```

### Configuration Priority

1. **site-config.json** (highest priority)
2. **Environment variables** (.env.local)
3. **Default configuration** (lowest priority)

This allows you to override defaults with environment variables while keeping complex configuration in JSON.

### Configuration Schema

The configuration system is fully typed with Zod validation:

```typescript
interface SiteConfig {
  site: {
    name: string
    description: string
    url: string
    keywords: string[]
  }
  user: {
    firstName: string
    lastName: string
    email: string
    jobTitle: string
    // ... many more fields
  }
  features: {
    blog: boolean
    shop: boolean
    projects: boolean
    // ... feature toggles
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    // ... theme customization
  }
  integrations: {
    stripe?: { publishableKey: string }
    posthog?: { key: string }
    // ... third-party services
  }
}
```

### Legacy Setup Script

For backward compatibility, the original setup script is still available:

```bash
npm run setup  # Basic setup (legacy)
npm run configure  # Enhanced setup (recommended)
```

## Customization Guidelines

### Content Customization

1. **Personal Information**: Update `config/user.ts` or use environment variables
2. **About Page**: Edit `features/about/content/about.mdx`
3. **Projects**: Add project data in `features/projects/`
4. **Blog Posts**: Write MDX files in `features/blog/`
5. **Assets**: Replace placeholder images in `public/images/`

### Theme Customization

- Colors: Modify `styles/globals.css`
- Components: Customize in `components/ui/`
- Layout: Update in `app/layout.tsx`

## Deployment

### Vercel Deployment

- Automatic deployment from GitHub
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `.next`

### Build Commands

```bash
npm run build          # Production build
npm run start          # Start production server
npm run preview        # Build and preview locally
```

## Contributing

### Code Quality

- Run `npm run lint` before committing
- Use `npm run format:write` for code formatting
- Check types with `npm run check-types`

## AI Agent Capabilities

As an AI agent working with this boilerplate, you have powerful tools to help users customize their sites:

### Configuration Management

**Automated Setup**:
- Run `npm run configure` for interactive guided setup
- Generate complete configuration from user requirements
- Validate all settings and dependencies automatically

**Configuration Tools**:
- `config/site-config.ts` - Type-safe configuration schema
- `lib/config-loader.ts` - Load/save configuration from multiple sources
- `scripts/configure.ts` - Interactive setup wizard

### Content Management

**Smart Content Generation**:
- Generate personalized about pages, project descriptions
- Create SEO-optimized blog post templates
- Auto-generate social media previews and meta tags

**Migration Tools** (Future):
- Import content from WordPress, Medium, Notion
- Convert existing portfolios to this format
- Bulk import blog posts and project data

### Theme Customization

**Visual Customization**:
- Apply predefined color schemes (Professional, Creative, Minimal)
- Generate custom color palettes based on user preferences
- Ensure accessibility compliance (WCAG standards)

**Component Theming**:
- Customize shadcn/ui components with user brand colors
- Generate theme-aware variants for all components
- Maintain design system consistency

### Feature Management

**Smart Feature Toggle**:
- Enable/disable features based on user needs
- Resolve feature dependencies automatically
- Generate necessary API keys and configuration

**Integration Setup**:
- Configure Stripe for e-commerce
- Set up analytics (PostHog, Google Analytics)
- Enable email services (Resend)
- Configure social media integrations

### Development Workflow

**Code Generation**:
- Generate custom components based on user requirements
- Create API routes for new functionality
- Add database schemas for custom features

**Content Creation**:
- Write compelling copy for landing pages
- Generate project case studies
- Create blog post outlines and drafts

**SEO Optimization**:
- Generate meta tags and Open Graph data
- Create structured data (JSON-LD)
- Optimize content for search engines

### Best Practices for Agents

**Configuration First**:
1. Always start with `npm run configure` for new projects
2. Validate configuration before making changes
3. Use the type-safe configuration system

**Content Strategy**:
1. Generate personalized, authentic-sounding content
2. Focus on user benefits and achievements
3. Ensure content is mobile-friendly and accessible

**Technical Excellence**:
1. Follow the established code patterns and conventions
2. Use TypeScript for all new code
3. Maintain performance best practices

**User Experience**:
1. Provide clear next steps after each change
2. Explain technical decisions in simple terms
3. Offer multiple options when appropriate

### Common Agent Tasks

**Portfolio Setup**:
```bash
# Quick setup for developers
npm run configure  # Interactive setup
# Then customize content, add projects, configure integrations
```

**Blog Migration**:
- Import existing blog posts
- Set up RSS feeds and SEO
- Configure commenting system

**E-commerce Setup**:
- Configure Stripe integration
- Create product catalog structure
- Set up payment processing

**Theme Customization**:
- Choose from predefined themes
- Customize colors and fonts
- Generate branded components

### Boilerplate Usage

This boilerplate is designed to be forked and customized. When using:

1. Run `npm run configure` to set up the enhanced configuration system
2. Use AI agents to customize content, themes, and features
3. Add your personal content (projects, blog posts, images)
4. Configure integrations (analytics, payments, email)
5. Deploy to your preferred hosting platform

---

**Note**: This boilerplate includes comprehensive AI agent support for easy customization. The configuration system ensures consistent, validated setups while providing maximum flexibility for personalization.
