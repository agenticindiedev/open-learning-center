# Open Learning Center

Full-stack monorepo workspace for learning communities and educational content.

## Structure

- `apps/api/` - NestJS backend
- `apps/frontend/` - NextJS apps
- `apps/mobile/` - React Native + Expo
- `packages/` - Shared packages
- `communities/` - Learning community content

## Communities

This repository contains two comprehensive learning communities:

### 1. Automate Yourself

Complete financial freedom journey (distribution → products → money). All classes are organized under the `communities/automate-yourself/` folder with 16 focused classes covering:

- **Getting Started** (4 modules) - Foundation, philosophy, disclaimers, scope, and AI setup
- **Build Distribution** (23 modules) - Content creation and affiliate marketing
- **Build Products** (55 modules) - Indie dev, SaaS, ecommerce, freelancing, agencies
- **Grow Money** (40 modules) - Personal finance, crypto, DeFi, trading, real estate
- **Summary Review** (1 module) - Complete journey review

**Total**: 123+ modules with 30+ hands-on projects

See `communities/automate-yourself/README.md` for full details.

### 2. Create Good AI Content

Specialized course for creating high-converting ads using AI. Located in `communities/create-good-AI-content/` folder.

**What it teaches:**
- AI models for images and videos (DALL-E, Midjourney, Sora, Veo, Runway)
- Prompt engineering for ads
- Image-to-video workflow
- Conversion optimization
- Complete ad campaign projects

See `communities/create-good-AI-content/README.md` for full details.

## Getting Started

```bash
bun install
```

## Development

```bash
# Backend
bun run dev:api

# Frontend
bun run dev:frontend

# Mobile
bun run dev:mobile
```

## Environment Setup

Copy `.env.example` to `.env` in the root directory and configure the following variables:

- **API** (`apps/api/`): MongoDB connection, Clerk keys, Stripe keys
- **Frontend** (`apps/frontend/`): Clerk public keys, API endpoints
- **Mobile** (`apps/mobile/`): Clerk keys, API endpoints

See `.env.example` for required environment variables.

## Documentation

- `.agent/README.md` - AI agent documentation and guidelines
- `REMOTE_WORK_SETUP.md` - Guide for remote development setup (tmux + Terminus + Tailscale)
