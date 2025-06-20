# Self-Hosting Guide

This guide helps you deploy the AI Chatbot without Vercel dependencies, using your own infrastructure.

## Changes Made for Self-Hosting

This version has been modified to remove all Vercel-specific services:

- ❌ **Vercel Postgres** → ✅ **Standard PostgreSQL**
- ❌ **Vercel Blob Storage** → ✅ **Local File Storage**  
- ❌ **Vercel Functions Geolocation** → ✅ **Header-based Geolocation**
- ❌ **Vercel Analytics** → ✅ **Removed**
- ❌ **Vercel OpenTelemetry** → ✅ **Disabled**
- ❌ **Vercel KV** → ✅ **Standard Redis**

## Quick Start with Docker

1. **Clone and prepare:**
   ```bash
   git clone <your-repo>
   cd ai-chatbot
   cp .env.docker .env.local
   ```

2. **Configure environment:**
   Edit `.env.local` with your actual values:
   ```bash
   # Required
   AUTH_SECRET=your_generated_secret
   XAI_API_KEY=your_xai_api_key
   
   # Database (using Docker Compose defaults)
   POSTGRES_URL=postgresql://chatbot_user:your_secure_password@postgres:5432/chatbot
   REDIS_URL=redis://redis:6379
   POSTGRES_PASSWORD=your_secure_password
   
   # Optional
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database:**
   ```bash
   docker-compose exec app npm run db:migrate
   ```

The application will be available at http://localhost:3000

## Manual Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis server (optional, for stream resumability)

### Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and API credentials
   ```

3. **Set up database:**
   ```bash
   pnpm run db:migrate
   ```

4. **Build and start:**
   ```bash
   pnpm run build
   pnpm start
   ```

## Environment Variables

### Required
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `XAI_API_KEY`: Get from https://console.x.ai/
- `POSTGRES_URL`: PostgreSQL connection string

### Optional
- `REDIS_URL`: Redis connection string (enables stream resumability)
- `NEXT_PUBLIC_APP_URL`: Your app's public URL (default: http://localhost:3000)

## File Storage

Files are now stored locally in `public/uploads/`. Make sure this directory is:
- Writable by the application
- Included in your backup strategy
- Properly served by your reverse proxy if needed

## Geolocation

The app now uses request headers for geolocation instead of Vercel Functions:
- `cf-ipcountry`, `cf-ipcity`, `cf-iplat`, `cf-iplon` (Cloudflare)
- `x-forwarded-for`, `x-real-ip` (general reverse proxy headers)

Configure your reverse proxy (nginx, Cloudflare, etc.) to pass these headers if you want location-based features.

## Production Considerations

1. **Database**: Use a managed PostgreSQL service or set up proper backups
2. **Redis**: Optional but recommended for better stream handling
3. **File Storage**: Consider using object storage (S3, MinIO) for scalability
4. **Reverse Proxy**: Use nginx or similar for SSL termination and static file serving
5. **Monitoring**: Set up your own monitoring since Vercel Analytics is removed

## Docker Deployment Options

### Option 1: Docker Compose (Recommended for development)
```bash
docker-compose up -d
```

### Option 2: Standalone Docker
```bash
docker build -t ai-chatbot .
docker run -p 3000:3000 --env-file .env.local ai-chatbot
```

### Option 3: Production with external services
Use the Docker image with your existing PostgreSQL and Redis instances by updating the connection strings in your environment variables.

## Troubleshooting

### Common Issues

1. **Database connection errors**: Verify POSTGRES_URL format and network connectivity
2. **File upload issues**: Check `public/uploads/` directory permissions
3. **Missing geolocation**: Configure reverse proxy headers or accept limited location features
4. **Stream resumability**: Redis connection optional but improves user experience

### Logs
```bash
# Docker Compose
docker-compose logs app

# Standalone Docker
docker logs <container-id>
```

## Migration from Vercel

If migrating from a Vercel deployment:

1. **Export data**: Download your database and any stored files
2. **Update DNS**: Point your domain to your new hosting
3. **Environment**: Update connection strings to point to your new services
4. **Test**: Verify all functionality works with your new setup

## Support

This self-hosted version maintains all original functionality while removing Vercel dependencies. The core AI features, authentication, and chat functionality remain unchanged.