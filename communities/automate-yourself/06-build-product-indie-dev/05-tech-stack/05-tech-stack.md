# Tech Stack Selection and Setup

## Learning Objective

Choose and set up your complete tech stack for indie development, including AI coding tools, development environment, and deployment strategy.

## Main Content

Your tech stack determines how fast you can build, how much you'll pay, and how much you'll maintain. Choose wrong and you'll waste months. Choose right and you'll ship in weeks.

**The Indie Dev Stack Philosophy:**

**Simple beats complex.** You're one person. You don't need microservices. You need something that works and ships fast.

**Managed beats self-hosted.** Your time is worth more than server costs. Use managed services until you're making money.

**AI-accelerated beats manual.** In 2026, AI coding tools are mandatory. If you're not using them, you're 10x slower than everyone else.

**Cost matters.** Free tiers are your friend. Don't pay for infrastructure until you're making revenue.

**Tech Stack Selection Framework:**

**Step 1: Choose Your Language**

**JavaScript/TypeScript (Node.js)**:
- Pros: One language for frontend and backend, huge ecosystem, AI tools excel at it
- Cons: Can be slow, package management chaos
- Best for: Full-stack web apps, most indie devs
- AI support: Excellent (Cursor Composer, Claude 4.5, Codex 5.2 work best with JS/TS)

**Python**:
- Pros: Simple syntax, great for AI/ML features, fast development
- Cons: Slower runtime, less frontend options
- Best for: Data-heavy apps, AI features, backend APIs
- AI support: Excellent

**Go**:
- Pros: Fast, simple, great for APIs
- Cons: Less ecosystem, steeper learning curve
- Best for: High-performance backends, microservices (but you don't need this)
- AI support: Good

**Rust**:
- Pros: Fastest, safest
- Cons: Hardest to learn, overkill for most indie apps
- Best for: Performance-critical systems (you probably don't need this)
- AI support: Good

**Recommendation**: Start with TypeScript/Node.js. AI tools work best with it. You can build full-stack with one language. Ecosystem is massive.

**Step 2: Choose Your Frontend**

**Next.js (React)**:
- Pros: Full-stack framework, great AI support, Vercel deployment, built-in optimizations
- Cons: Can be complex for simple apps
- Best for: Most web apps, SEO matters, full-stack apps
- AI support: Excellent

**Remix (React)**:
- Pros: Great data loading, simpler than Next.js for some use cases
- Cons: Smaller ecosystem
- Best for: Data-heavy apps, forms
- AI support: Good

**SvelteKit**:
- Pros: Fast, simple, smaller bundle sizes
- Cons: Smaller ecosystem, less AI tool support
- Best for: Simple apps, performance matters
- AI support: Good

**Vue/Nuxt**:
- Pros: Easy to learn, good ecosystem
- Cons: Less popular than React, less AI support
- Best for: If you already know Vue
- AI support: Good

**Plain React + Vite**:
- Pros: Simple, fast dev server
- Cons: More setup, no built-in backend
- Best for: Simple frontends, separate backend
- AI support: Excellent

**Recommendation**: Next.js. It's the default for indie devs in 2026. AI tools know it best. Deployment is one click. You get full-stack in one framework.

**Step 3: Choose Your Backend**

**If using Next.js**: Use Next.js API routes. No separate backend needed.

**If separate backend needed**:

**Node.js + Express/Fastify**:
- Pros: Same language as frontend, simple, huge ecosystem
- Cons: Can be slow for CPU-intensive tasks
- Best for: Most APIs, real-time features
- AI support: Excellent

**Python + FastAPI**:
- Pros: Fast development, great for AI features, type hints
- Cons: Separate language, slower runtime
- Best for: AI-heavy apps, data processing
- AI support: Excellent

**Backend-as-a-Service (BaaS)**:
- **Supabase**: PostgreSQL database + auth + storage + real-time. Free tier generous.
- **Firebase**: Google's BaaS. More features, more complex.
- **Appwrite**: Open-source alternative.
- Best for: Most indie apps. Skip building backend from scratch.

**Recommendation**: Use Supabase or Next.js API routes. Don't build a separate backend unless you have a specific reason.

**Step 4: Choose Your Database**

**PostgreSQL**:
- Pros: Relational, ACID compliant, powerful queries, free tiers available
- Cons: Requires understanding SQL, schema design
- Best for: Most apps, relational data, complex queries
- Managed options: Supabase (free tier), Neon (free tier), Railway (paid)

**MongoDB**:
- Pros: Flexible schema, easy to start, good for rapid iteration
- Cons: No joins, can get messy, less AI tool support
- Best for: Document-heavy apps, rapid prototyping
- Managed options: MongoDB Atlas (free tier)

**SQLite**:
- Pros: Zero setup, file-based, perfect for simple apps
- Cons: Single connection, not for high concurrency
- Best for: Simple apps, local-first, embedded apps
- Managed options: Turso (SQLite in cloud)

**Recommendation**: PostgreSQL via Supabase. Free tier is generous. You get database + auth + storage. AI tools understand SQL well.

**Step 5: Choose Your Hosting**

**Frontend Hosting**:

**Vercel**:
- Pros: Free tier, one-click Next.js deployment, great DX, fast CDN
- Cons: Can get expensive at scale
- Best for: Next.js apps, most indie devs
- Cost: Free for hobby, $20/month pro

**Netlify**:
- Pros: Free tier, good for static sites, forms support
- Cons: Less optimized for Next.js
- Best for: Static sites, JAMstack
- Cost: Free for hobby, $19/month pro

**Backend Hosting**:

**Railway**:
- Pros: Simple, good free tier, supports any stack
- Cons: Can get expensive
- Best for: Node.js/Python backends, Docker apps
- Cost: $5/month + usage

**Render**:
- Pros: Free tier, simple, good docs
- Cons: Slower cold starts on free tier
- Best for: Simple backends, APIs
- Cost: Free tier available, $7/month for web services

**Fly.io**:
- Pros: Global deployment, good for edge computing
- Cons: More complex setup
- Best for: Global apps, edge functions
- Cost: Pay as you go

**Recommendation**: Vercel for frontend (if Next.js) or Netlify (if static). Railway or Render for separate backends. Start free, pay when you're making money.

**Step 6: Set Up AI Coding Tools**

**Cursor Composer 1** (Primary Editor):
- What it is: AI-powered code editor with Composer feature for multi-file editing
- Setup: Download from cursor.sh, install, sign up for account
- Cost: $20/month (worth it)
- Best for: Full-stack development, code generation, refactoring, multi-file changes
- Workflow: Use Composer for complex changes across files. Write comments, AI generates code. Ask questions, get answers.
- Key feature: Composer understands your entire codebase and can make coordinated changes across multiple files

**Claude 4.5** (Code Assistant):
- What it is: Anthropic's latest AI model, excellent for code
- Setup: Use web interface at claude.ai or API
- Cost: $20/month (Claude Pro) or API pricing
- Best for: Complex code generation, architecture decisions, debugging, code review
- Workflow: Paste code, describe what you want, get complete solutions. Great for explaining complex concepts.
- Key feature: Best reasoning and code quality. Understands context deeply.

**Codex 5.2** (Code Generation):
- What it is: Advanced code generation model
- Setup: Use via API or integrated tools
- Cost: Pay-per-use API pricing
- Best for: Fast code generation, boilerplate, repetitive tasks
- Workflow: Provide context and requirements, get generated code. Fast and efficient.
- Key feature: Optimized specifically for code generation tasks

**Recommendation**: Use Cursor Composer 1 as your primary editor for daily development. Use Claude 4.5 for complex problems, architecture decisions, and code review. Use Codex 5.2 for rapid code generation and boilerplate creation.

**Cursor Composer 1 Setup Steps**:

1. Download Cursor from cursor.sh
2. Install and open
3. Sign up for Cursor account
4. Install extensions: ESLint, Prettier, GitLens
5. Configure settings:
   - Enable Composer feature
   - Set up AI suggestions
   - Configure keyboard shortcuts (Cmd/Ctrl+K for Composer)
6. Create `.cursorrules` file in project root (optional, for project-specific rules)
7. Test Composer: Open Composer panel, describe a multi-file change, verify it works

**Claude 4.5 Setup**:

1. Sign up at claude.ai
2. Upgrade to Claude Pro ($20/month) for best performance
3. Bookmark the interface for quick access
4. For API access: Get API key from console.anthropic.com
5. Test: Paste some code, ask for improvements

**Codex 5.2 Setup**:

1. Access via API or integrated development tools
2. Get API credentials if using directly
3. Test: Provide a function signature, get implementation

**AI Coding Workflow**:

**Code Generation** (Cursor Composer or Codex 5.2):
- Open Cursor Composer or use Codex 5.2
- Write a comment describing what you want
- AI generates code across multiple files if needed
- Review and edit
- Test

**Complex Problems** (Claude 4.5):
- Paste code and error message to Claude 4.5
- Describe the problem in detail
- Claude provides solution with explanation
- Apply fix
- Test

**Refactoring** (Cursor Composer):
- Select code or open Composer
- Describe refactoring goal
- Composer makes changes across related files
- Review changes
- Test

**Multi-File Changes** (Cursor Composer):
- Open Composer panel
- Describe change that affects multiple files
- Composer understands relationships and updates all files
- Review changes
- Test

**Architecture Decisions** (Claude 4.5):
- Describe your problem and constraints
- Ask Claude for architecture recommendations
- Get detailed explanation with trade-offs
- Implement based on recommendations

**Documentation** (Claude 4.5 or Cursor):
- Select function or paste code
- Ask to add JSDoc or documentation
- Review and edit

**Step 7: Development Environment Setup**

**Required Tools**:

**Node.js** (if using JavaScript/TypeScript):
- Install from nodejs.org
- Use LTS version (20.x or 22.x)
- Verify: `node --version`

**Package Manager**:
- **pnpm**: Fast, disk-efficient (recommended)
- **bun**: Fastest, all-in-one runtime
- **npm**: Default, works fine
- Install: `npm install -g pnpm` or `curl -fsSL https://bun.sh/install | bash`

**Git**:
- Install from git-scm.com
- Configure: `git config --global user.name "Your Name"`
- Configure: `git config --global user.email "your@email.com"`

**VS Code or Cursor**:
- Download and install
- Install essential extensions: ESLint, Prettier, GitLens

**Environment Variables**:
- Create `.env` file in project root
- Add to `.gitignore`
- Use `dotenv` package to load
- Never commit secrets

**Project Structure** (Next.js example):

```
my-app/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (routes)/       # Pages
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Utilities
├── public/            # Static files
├── .env.local         # Environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

**Step 8: Architecture Decisions**

**Monolith vs Microservices**:
- **Monolith**: One codebase, one deployment. Use this.
- **Microservices**: Multiple services, complex. Don't use this.
- **Why**: You're one person. Monolith is simpler, faster, cheaper.

**Full-Stack Framework vs Separate**:
- **Full-Stack (Next.js)**: Frontend + backend in one. Use this.
- **Separate**: Frontend and backend separate. Only if you have a reason.
- **Why**: Less code, one deployment, simpler.

**API Design**:
- **REST**: Simple, standard. Use this.
- **GraphQL**: Complex, overkill for most apps. Don't use this.
- **Why**: REST is simpler. AI tools understand it better.

**Authentication**:
- **Supabase Auth**: Managed, free tier. Use this.
- **NextAuth.js**: If using Next.js without Supabase. Good option.
- **Custom**: Don't build this. Use a library.
- **Why**: Auth is hard. Use managed services.

**File Structure**:
- Keep it flat. Don't over-organize.
- Group by feature, not by type (after you have 10+ files).
- Use Next.js conventions if using Next.js.

**Step 9: Deployment Strategy**

**Frontend Deployment** (Next.js on Vercel):

1. Push code to GitHub
2. Connect Vercel to GitHub repo
3. Vercel auto-detects Next.js
4. Deploys automatically on push
5. Get URL: `your-app.vercel.app`

**Backend Deployment** (Node.js on Railway):

1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repo
4. Railway auto-detects Node.js
5. Add environment variables
6. Deploys automatically

**Database Setup** (Supabase):

1. Create account on supabase.com
2. Create new project
3. Get connection string
4. Add to environment variables
5. Use Supabase client in code

**Environment Variables**:

- Local: `.env.local` (gitignored)
- Vercel: Add in dashboard → Settings → Environment Variables
- Railway: Add in project → Variables
- Never commit secrets

**CI/CD**:

- Vercel: Automatic on push to main
- Railway: Automatic on push to main
- GitHub Actions: For custom workflows (tests, linting)

**Step 10: Modern Development Workflow**

**Daily Workflow**:

1. **Plan**: Write what you want to build (in comments or issues)
2. **Generate**: Use Cursor to generate code
3. **Review**: Read the code, understand it
4. **Test**: Write tests (AI can help)
5. **Commit**: Small, frequent commits
6. **Deploy**: Push to main, auto-deploys
7. **Iterate**: Get feedback, repeat

**AI-Assisted Development**:

**Code Generation** (Codex 5.2 or Cursor Composer):
- Write: `// Create a function that validates email addresses`
- Codex or Composer generates function
- Review and test

**Testing** (Claude 4.5 or Cursor Composer):
- Ask: "Write comprehensive tests for this function"
- Claude or Composer generates tests with edge cases
- Run tests
- Fix if needed

**Debugging** (Claude 4.5):
- Paste error and code: "This error occurs when..."
- Claude analyzes and suggests fix with explanation
- Apply and test

**Refactoring** (Cursor Composer):
- Select code or open Composer: "Refactor this to be more readable"
- Composer refactors across related files
- Review changes
- Test

**Multi-File Features** (Cursor Composer):
- Open Composer: "Add user authentication with login, signup, and protected routes"
- Composer creates files, updates existing ones, maintains consistency
- Review all changes
- Test

**Documentation** (Claude 4.5):
- Select function: "Add comprehensive JSDoc comments"
- Claude adds detailed documentation
- Review

**Common Mistakes**:

**Over-engineering**: Building microservices, complex architecture. Don't. Start simple.

**Not using AI tools**: Coding manually in 2026. Don't. You're 10x slower. Use Cursor Composer, Claude 4.5, and Codex 5.2.

**Wrong stack choice**: Choosing trendy tech over practical. Don't. Choose what works.

**Not testing**: Shipping without tests. Don't. Write tests. AI makes this easy.

**Ignoring costs**: Using expensive services before revenue. Don't. Start free.

**Recommended Stack for Most Indie Devs**:

- **Frontend**: Next.js
- **Backend**: Next.js API routes (or Supabase)
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Hosting**: Vercel (frontend), Railway/Render (if separate backend)
- **AI Tools**: Cursor Composer 1 + Claude 4.5 + Codex 5.2
- **Package Manager**: pnpm or bun
- **Language**: TypeScript

This stack:
- Works for 90% of indie apps
- Has excellent AI tool support
- Free tiers available
- Simple to deploy
- One language (TypeScript) for everything

**Cost Breakdown** (Starting):

- Cursor Composer: $20/month
- Claude 4.5 Pro: $20/month
- Codex 5.2: Pay-per-use (typically $5-10/month for indie dev)
- Vercel: Free (hobby)
- Supabase: Free tier
- Railway: $5/month (if needed)
- **Total**: $50-60/month

Once you're making money, upgrade as needed.

## Key Takeaways

- Choose TypeScript/Next.js for most indie apps. AI tools work best with it.
- Use Supabase for database + auth. Free tier is generous.
- Deploy on Vercel. One-click deployment, free tier.
- Use Cursor Composer 1 as your editor. Use Claude 4.5 for complex problems. Use Codex 5.2 for fast generation. $50/month is worth 10x speed boost.
- Start with monolith. Don't over-engineer.
- Use managed services. Your time is worth more than server costs.
- Write tests. AI makes this easy.
- Start free. Pay when you're making money.

## Next Steps

Now that you have your tech stack, let's set up your project structure and AI documentation. The next module covers the `.agent/` folder and how to use it effectively.

## Action Items

- Choose your tech stack (recommended: Next.js + Supabase + Vercel)
- Install Cursor Composer 1 and set it up
- Sign up for Claude 4.5 Pro
- Set up Codex 5.2 access
- Install Node.js and package manager (pnpm or bun)
- Create a test Next.js project
- Deploy it to Vercel
- Set up Supabase account and create a test project
- Configure environment variables
- Test the full stack locally

