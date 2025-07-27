# Deployment Guide - Vehicle PDF Generator

This guide covers various deployment options for the Vehicle PDF Generator application.

## Quick Deployment Options

### 1. Netlify (Recommended for beginners)

**One-click deployment:**
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Your app is live instantly!

**Git-based deployment:**
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on every push

### 2. Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Your app is deployed!

**Or use the web interface:**
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Vite settings
4. Deploy with one click

### 3. GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repository settings

## Advanced Deployment Options

### 4. AWS S3 + CloudFront

**Setup S3 bucket:**
```bash
# Install AWS CLI
aws configure

# Create bucket
aws s3 mb s3://your-vehicle-app-bucket

# Enable static website hosting
aws s3 website s3://your-vehicle-app-bucket --index-document index.html --error-document index.html

# Upload files
npm run build
aws s3 sync dist/ s3://your-vehicle-app-bucket --delete
```

**CloudFront distribution:**
1. Create CloudFront distribution
2. Set origin to your S3 bucket
3. Configure custom error pages for SPA routing
4. Enable compression

### 5. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Configure firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# Deploy
npm run build
firebase deploy
```

### 6. Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /assets {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Deploy:**
```bash
docker build -t vehicle-pdf-generator .
docker run -p 80:80 vehicle-pdf-generator
```

## Environment Configuration

### Production Build Optimization

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['@react-pdf/renderer'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
})
```

### Asset Optimization

1. **Compress background images:**
```bash
# Using imagemagick
convert vehicle-template.png -quality 85 -strip vehicle-template.jpg

# Using online tools
# - TinyPNG
# - ImageOptim
# - Squoosh
```

2. **Enable gzip compression** (server configuration):

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## Custom Domain Setup

### 1. DNS Configuration

Add these DNS records:
```
Type: A
Name: @
Value: [Your hosting provider's IP]

Type: CNAME
Name: www
Value: your-domain.com
```

### 2. SSL Certificate

Most hosting providers offer free SSL:
- **Netlify**: Automatic Let's Encrypt
- **Vercel**: Automatic SSL
- **Cloudflare**: Free SSL proxy
- **AWS**: Use Certificate Manager

### 3. Redirect Configuration

**Netlify (_redirects file):**
```
# Redirect www to non-www
https://www.yourdomain.com/* https://yourdomain.com/:splat 301!

# SPA fallback
/*    /index.html   200
```

## Performance Monitoring

### 1. Analytics Setup

**Google Analytics 4:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Performance Monitoring

**Web Vitals:**
```bash
npm install web-vitals
```

```typescript
// src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Troubleshooting Deployment Issues

### Common Problems

1. **404 errors on refresh:**
   - Configure SPA fallback routing
   - Ensure server returns index.html for all routes

2. **Assets not loading:**
   - Check base URL in vite.config.ts
   - Verify asset paths are relative

3. **PDF generation fails:**
   - Ensure @react-pdf/renderer is included in build
   - Check for missing fonts or images

4. **Large bundle size:**
   - Implement code splitting
   - Use dynamic imports for heavy components
   - Optimize images and assets

### Debug Commands

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Test production build locally
npm run build
npm run preview

# Check for broken links
npx broken-link-checker http://localhost:4173
```

## Scaling Considerations

### 1. CDN Setup

Use a CDN for better global performance:
- **Cloudflare**: Free tier available
- **AWS CloudFront**: Pay-as-you-go
- **Azure CDN**: Integrated with other Azure services

### 2. Database Integration

For production use with multiple users:

```typescript
// Example API integration
const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000/api';

export class VehicleService {
  static async getAllVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${API_BASE}/vehicles`);
    return response.json();
  }

  static async createVehicle(data: VehicleFormData): Promise<Vehicle> {
    const response = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

### 3. Authentication

Implement user authentication:
```typescript
// Example with Auth0
import { useAuth0 } from '@auth0/auth0-react';

const VehicleDashboard = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  
  if (!isAuthenticated) {
    return <button onClick={loginWithRedirect}>Log In</button>;
  }
  
  // Render dashboard
};
```

## Maintenance

### 1. Automated Updates

**GitHub Actions (.github/workflows/deploy.yml):**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npm run test
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 2. Monitoring

Set up monitoring for:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Google PageSpeed Insights)

### 3. Backup Strategy

For applications with user data:
- Regular database backups
- Version control for code
- Asset backup (images, templates)

---

Choose the deployment method that best fits your needs and technical expertise. For most users, Netlify or Vercel provide the easiest deployment experience with excellent performance and features.