# Deployment Guide - CRM System

Complete guide to deploying your Intelligent CRM System to production.

## Pre-Deployment Checklist

- [ ] Supabase project created and database schema deployed
- [ ] Groq API key obtained
- [ ] Environment variables configured
- [ ] Application builds without errors (`pnpm build`)
- [ ] All features tested locally

## Option 1: Vercel (Recommended)

Vercel offers free hosting with automatic deployments.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GROQ_API_KEY`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

Your app will be live at `https://your-project.vercel.app`

## Option 2: Netlify

### Steps:

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   pnpm build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add the same variables as above

## Option 3: Traditional Web Hosting

For shared hosting (cPanel, etc.):

1. **Build the app**
   ```bash
   pnpm build
   ```

2. **Upload files**
   - Upload contents of `dist/` folder to `public_html/` or `www/`

3. **Configure .htaccess** (Apache)
   Create `.htaccess` in your web root:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Environment Variables**
   - Create `_env.js` in root:
   ```javascript
   window.env = {
     VITE_SUPABASE_URL: 'your-url',
     VITE_SUPABASE_ANON_KEY: 'your-key',
     VITE_GROQ_API_KEY: 'your-key'
   };
   ```
   - Reference in `index.html` before other scripts

## Post-Deployment

### 1. Test Authentication
- Try registering a new user
- Try logging in
- Verify profile creation

### 2. Test Core Features
- Add a customer
- Log an interaction
- Generate a report
- Check AI recommendations (if Groq configured)

### 3. Performance Check
- Test on mobile device
- Test on slow connection
- Check load times

### 4. Security Verification
- Ensure HTTPS is enabled
- Test RLS policies in Supabase
- Verify API keys are not exposed

## Domain Configuration

### Custom Domain on Vercel:

1. Go to Vercel dashboard > Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate

### Custom Domain on Netlify:

1. Go to Domain settings
2. Add custom domain
3. Follow DNS instructions
4. Enable HTTPS

## Monitoring

### Supabase Dashboard
- Monitor database usage
- Check auth metrics
- View API logs

### Error Tracking
Consider adding:
- Sentry for error tracking
- Google Analytics for usage

## Backup Strategy

### Database Backups (Supabase):
- Automatic daily backups on paid tier
- Manual exports: SQL Editor > Export

### Code Backups:
- Keep Git repository updated
- Tag releases: `git tag v1.0.0`

## Scaling Considerations

### Free Tier Limits:

**Supabase Free:**
- 500MB database
- 2GB bandwidth/month
- 50MB file storage

**Groq Free:**
- 30 requests/minute
- Good for small SMEs

### When to Upgrade:

- More than 100 customers
- Heavy AI usage
- Need real-time features
- Multiple users

## Troubleshooting

### Build Fails:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Environment Variables Not Working:
- Ensure they start with `VITE_`
- Rebuild after changing variables
- Check for typos

### Supabase Connection Issues:
- Verify project URL is correct
- Check anon key is public key (not service key)
- Ensure RLS policies allow access

### Groq AI Not Working:
- Verify API key is valid
- Check quota hasn't been exceeded
- Test with Postman first

## Production Checklist

- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Database backups scheduled
- [ ] Error monitoring setup
- [ ] Performance tested
- [ ] Mobile tested
- [ ] Security audit completed
- [ ] User documentation created
- [ ] Support contact configured

## Maintenance

### Regular Tasks:

**Weekly:**
- Check error logs
- Review usage metrics
- Monitor performance

**Monthly:**
- Database cleanup
- Update dependencies
- Security updates

**Quarterly:**
- Full backup verification
- Performance optimization
- Feature planning

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Groq Docs: https://console.groq.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

## Cost Estimate

### Free Tier (Suitable for most SMEs):
- Hosting: $0 (Vercel/Netlify)
- Database: $0 (Supabase free tier)
- AI: $0 (Groq free tier)

### Paid Tier (For growing businesses):
- Hosting: $20/month (Vercel Pro)
- Database: $25/month (Supabase Pro)
- AI: Groq remains free or minimal cost

**Total: $0-$45/month depending on scale**

---

Last Updated: 2026-06-02  
Southern Delta University Final Year Project
