# 🚀 Deployment Guide - Fitness 90-Day PWA Tracker

## Option 1: Vercel Deployment (Recommended) ⭐

Vercel is the recommended platform for Next.js PWAs with optimal performance and global CDN.

### Step 1: Login to Vercel

You have **3 authentication options**:

#### A. Login via Browser (Easiest)
```bash
cd /app/frontend
vercel login
```
Then follow the browser authentication flow with your:
- GitHub account
- GitLab account
- Bitbucket account
- Or email

#### B. Login with Token
```bash
# Get your token from: https://vercel.com/account/tokens
vercel login --token YOUR_VERCEL_TOKEN
```

#### C. Deploy via GitHub (Automated)
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Vercel will auto-deploy on every push

---

### Step 2: Deploy to Production

Once authenticated, deploy with:

```bash
cd /app/frontend

# First deployment (will ask configuration questions)
vercel

# Or deploy directly to production
vercel --prod
```

**Configuration Prompts** (first time):
- Setup and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- Project name? → **fitness-90-day-tracker** (or your choice)
- Directory? → **./** (current directory)
- Override settings? → **No** (Next.js auto-detected)

---

### Step 3: Access Your Deployed App

After deployment, Vercel will provide:
- 🌐 **Production URL**: https://fitness-90-day-tracker.vercel.app
- 📊 **Dashboard**: https://vercel.com/dashboard
- 🔍 **Analytics**: Built-in performance monitoring

---

## Option 2: Static Export Deployment

If you prefer other hosting platforms (Netlify, Cloudflare Pages, AWS S3, etc.):

### Step 1: Build for Static Export

```bash
cd /app/frontend

# Build the production version
npm run build

# The static files will be in .next/ directory
```

### Step 2: Deploy to Your Platform

**Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

**Cloudflare Pages**:
```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy .next
```

**AWS S3 + CloudFront**:
```bash
# Install AWS CLI
# Then sync to S3 bucket
aws s3 sync .next s3://your-bucket-name --acl public-read
```

---

## Option 3: Docker Deployment

For self-hosted or containerized deployments:

### Create Dockerfile

```dockerfile
# /app/frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
cd /app/frontend

# Build image
docker build -t fitness-tracker:latest .

# Run container
docker run -p 3000:3000 fitness-tracker:latest

# Or use docker-compose
docker-compose up -d
```

---

## Option 4: Manual Server Deployment

For VPS/dedicated servers (DigitalOcean, Linode, AWS EC2, etc.):

### Step 1: Prepare Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 2: Deploy Application

```bash
# Clone or upload your code
git clone your-repo-url /var/www/fitness-tracker
cd /var/www/fitness-tracker/frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "fitness-tracker" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 3: Configure Nginx (Optional)

```nginx
# /etc/nginx/sites-available/fitness-tracker
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/fitness-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables (if needed)

For this PWA, **no environment variables are required** since it works completely offline. However, for future features:

```bash
# .env.production (create if needed)
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Fitness 90-Day Tracker
```

In Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables for Production, Preview, Development

---

## Post-Deployment Checklist

### 1. Test PWA Installation
- [ ] Open deployed URL in Chrome
- [ ] Click install icon in address bar
- [ ] Verify app icon appears on home screen
- [ ] Launch app and test offline mode

### 2. Mobile Testing
- [ ] iOS Safari - Add to Home Screen
- [ ] Android Chrome - Install App
- [ ] Test all 5 tabs (Dashboard, Workout, Nutrition, History, Profile)
- [ ] Test onboarding wizard
- [ ] Verify data persists across sessions

### 3. Performance Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-deployed-url.com --view
```

**Target Scores**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 100 (all criteria)

### 4. Browser Testing
- [ ] Chrome Desktop
- [ ] Chrome Mobile
- [ ] Safari Desktop
- [ ] Safari iOS
- [ ] Firefox
- [ ] Edge

### 5. Offline Mode Verification
1. Load the app once
2. Open DevTools → Application → Service Workers
3. Check "Offline" mode
4. Refresh page
5. Verify app loads and all features work

---

## Troubleshooting

### Issue: Service Worker Not Registering

**Problem**: PWA doesn't install or offline mode doesn't work.

**Solution**:
1. Ensure you're using HTTPS (required for service workers)
2. Check browser console for service worker errors
3. Clear cache and reload: Chrome DevTools → Application → Clear Storage

### Issue: Build Fails

**Problem**: `npm run build` shows errors.

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules

# Reinstall dependencies
npm install

# Try build again
npm run build
```

### Issue: PWA Not Installing on iOS

**Problem**: "Add to Home Screen" option not showing.

**Solution**:
1. iOS requires HTTPS
2. Verify manifest.json is accessible
3. Check apple-touch-icon is present
4. Ensure display: "standalone" in manifest

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error reporting
- Performance insights

### Google Analytics (Optional)
```typescript
// Add to app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., fitness.yourdomain.com)
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

### Cloudflare (for other platforms)
1. Add site to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. Enable "Auto Minify" for CSS/JS/HTML

---

## Backup & Recovery

Since this PWA stores data locally in IndexedDB:

1. **User Data**: Stored client-side only
2. **No Server Backup**: Currently no cloud backup (Release 1)
3. **Future**: Supabase sync will enable cloud backup

**User Instructions**:
- Data is stored locally in browser
- Clearing browser data will delete app data
- Future updates will add cloud sync option

---

## Support & Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Security Patches
- Monitor GitHub Dependabot alerts
- Run `npm audit` regularly
- Update vulnerable packages promptly

---

## Quick Deploy Commands

**Vercel**:
```bash
cd /app/frontend && vercel --prod
```

**Netlify**:
```bash
cd /app/frontend && npm run build && netlify deploy --prod --dir=.next
```

**Docker**:
```bash
cd /app/frontend && docker build -t fitness-tracker . && docker run -p 3000:3000 fitness-tracker
```

---

## 🎉 You're Ready to Deploy!

Choose your preferred deployment method above and follow the steps. The application is fully tested and production-ready.

**Recommended**: Start with Vercel for the easiest deployment and best Next.js performance.

**Need Help?** Check the troubleshooting section or consult the platform-specific documentation.

---

**Good luck with your deployment! 🚀**
