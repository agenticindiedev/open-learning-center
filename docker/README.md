# Docker Deployment Guide (API Only)

Web frontend is deployed on **Vercel**. This guide covers API deployment only.

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example env file
cp docker/env.production.example .env.production
```

Edit `.env.production` with your values:
- MongoDB connection string
- Clerk secret key
- Stripe keys

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

```bash
curl http://localhost:3010/api/docs
```

## CI/CD Setup (GitHub Actions)

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | Your EC2 public IP or hostname |
| `EC2_USER` | SSH username (usually `ubuntu` or `ec2-user`) |
| `EC2_SSH_KEY` | Private SSH key for EC2 access |

### EC2 Setup

1. Clone the repo to EC2:
   ```bash
   cd ~
   git clone https://github.com/shipshitdev/open-learning-center.git
   cd open-learning-center
   ```

2. Create env file:
   ```bash
   cp docker/env.production.example .env.production
   nano .env.production  # Fill in your values
   ```

3. Open port **3010** in EC2 Security Group

4. Push to main branch to trigger deployment!

## Commands

```bash
# View logs
docker logs olc-api -f

# Restart
docker compose -f docker/docker-compose.production.yml restart

# Stop
docker compose -f docker/docker-compose.production.yml down

# Rebuild
docker compose -f docker/docker-compose.production.yml up -d --build

# Status
docker compose -f docker/docker-compose.production.yml ps
```

## Adding a Domain (Optional)

Add nginx as a reverse proxy:

```nginx
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

Then add SSL:
```bash
sudo certbot --nginx -d api.classroom.yourdomain.com
```
