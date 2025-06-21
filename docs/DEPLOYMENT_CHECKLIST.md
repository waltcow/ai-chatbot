# 🚂 Railway Deployment Checklist

## Before Deployment

### 1. Prerequisites
- [ ] Railway account created at [railway.app](https://railway.app)
- [ ] Railway CLI installed: `npm install -g @railway/cli`
- [ ] Logged into Railway: `railway login`
- [ ] xAI API key obtained from [console.x.ai](https://console.x.ai/)

### 2. Environment Setup
- [ ] Generate AUTH_SECRET: `openssl rand -base64 32`
- [ ] Have your xAI API key ready
- [ ] Review `.env.local` file (don't commit it to git!)

### 3. Project Configuration
- [ ] Dockerfile exists and is properly configured ✅
- [ ] `railway.json` configuration file created ✅
- [ ] `package.json` has correct build scripts ✅
- [ ] `.railwayignore` file created ✅

## Deployment Steps

### Quick Deployment (Recommended)
```bash
./deploy-railway.sh
```

### Manual Deployment
1. [ ] Initialize Railway project: `railway init`
2. [ ] Add PostgreSQL addon in Railway dashboard
3. [ ] Set environment variables in Railway dashboard:
   - `AUTH_SECRET`
   - `XAI_API_KEY`
   - `POSTGRES_URL` (auto-generated)
   - `NEXT_PUBLIC_APP_URL` (auto-generated)
4. [ ] Deploy: `railway up`

## Post-Deployment

### 1. Verify Deployment
- [ ] Check Railway dashboard for successful deployment
- [ ] Visit your app URL to confirm it's working
- [ ] Test chat functionality
- [ ] Verify database connection

### 2. Environment Variables to Set in Railway Dashboard
```
AUTH_SECRET=your-generated-secret
XAI_API_KEY=your-xai-api-key
POSTGRES_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
PORT=3000
```

### 3. Optional Configurations
- [ ] Add custom domain (if needed)
- [ ] Set up Redis addon (for enhanced performance)
- [ ] Configure monitoring and alerts
- [ ] Set up GitHub integration for auto-deploy

## Troubleshooting

### Common Issues
- **Build fails**: Check Railway logs, ensure all dependencies in package.json
- **Database connection error**: Verify PostgreSQL addon is running and POSTGRES_URL is set
- **API errors**: Check XAI_API_KEY is valid and properly set
- **Authentication issues**: Ensure AUTH_SECRET is generated and set

### Getting Help
- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Check Railway logs in dashboard for detailed error messages

## Railway Services to Add

1. **Web Service** (automatically created)
   - Uses your Dockerfile
   - Serves the Next.js application

2. **PostgreSQL Database**
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Automatically provides POSTGRES_URL

3. **Redis** (Optional)
   - For enhanced stream resumability
   - Click "Add Service" → "Database" → "Redis"

## Expected Costs

Railway pricing is usage-based:
- Free tier available for development
- Production apps typically $5-20/month depending on usage
- Database storage and compute included

## Security Notes

- Never commit `.env.local` or `.env` files to git
- Use Railway's environment variable system
- Railway provides automatic HTTPS
- Database connections are encrypted by default

---

**Ready to deploy? Run `./deploy-railway.sh` and follow the prompts!** 🚀
