# Docker Deployment Guide

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example env file
cp docker/env.production.example .env.production

# Also create for API if needed
cp docker/env.production.example apps/api/.env.production
```

Edit `.env.production` with your values:
- MongoDB connection string
- Clerk keys (secret + publishable)
- Stripe keys
- Your EC2 IP or domain

### 2. Deploy

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

Or manually:
```bash
docker compose -f docker/docker-compose.production.yml up -d --build
```

### 3. Verify

- Web: http://your-ip:3000
- API: http://your-ip:3010
- API Docs: http://your-ip:3010/api/docs

## Services

| Service | Port | Container Name |
|---------|------|----------------|
| Web (Next.js) | 3000 | olc-web |
| API (NestJS) | 3010 | olc-api |

## Commands

```bash
# View logs
docker compose -f docker/docker-compose.production.yml logs -f

# View specific service logs
docker logs olc-api -f
docker logs olc-web -f

# Restart services
docker compose -f docker/docker-compose.production.yml restart

# Stop services
docker compose -f docker/docker-compose.production.yml down

# Rebuild and restart
docker compose -f docker/docker-compose.production.yml up -d --build

# Check status
docker compose -f docker/docker-compose.production.yml ps
```

## CI/CD Setup (GitHub Actions)

Add these secrets to your GitHub repository:

### Required Secrets

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Your EC2 public IP or hostname |
| `EC2_USER` | SSH username (usually `ubuntu` or `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key for EC2 access |
| `NEXT_PUBLIC_API_URL` | Full API URL (e.g., `http://your-ip:3010`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `NEXT_PUBLIC_APP_URL` | Full web URL (e.g., `http://your-ip:3000`) |

### EC2 Setup

1. Clone the repo to EC2:
   ```bash
   cd ~
   git clone https://github.com/your-org/open-learning-center.git
   cd open-learning-center
   ```

2. Create env files:
   ```bash
   cp docker/env.production.example .env.production
   # Edit with your values
   nano .env.production
   ```

3. Open ports in EC2 Security Group:
   - Port 3000 (Web)
   - Port 3010 (API)

4. Push to main branch to trigger deployment!

## Adding a Domain (Optional)

When you have a domain, add nginx as a reverse proxy:

```nginx
# /etc/nginx/sites-available/open-learning-center
server {
    listen 80;
    server_name classroom.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.classroom.yourdomain.com;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then add SSL with certbot:
```bash
sudo certbot --nginx -d classroom.yourdomain.com -d api.classroom.yourdomain.com
```
