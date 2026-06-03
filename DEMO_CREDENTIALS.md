# Demo Mode Credentials

**⚠️ For Testing Only - Not Visible in Production UI**

When running the system **without Supabase configured**, you can use these credentials to test the demo mode:

## Login Credentials

### Business Owner Account
- **Email/Username:** admin
- **Password:** password
- **Role:** Owner
- **Access:** Full system access

### Staff Account
- **Email/Username:** staff1
- **Password:** password
- **Role:** Staff
- **Access:** Standard operations

## Demo Mode Features

When Supabase is not configured, the system runs in demo mode with:

✅ **Available:**
- Full customer management
- Interaction logging
- ML-based recommendations
- Charts and analytics
- Report downloads (PDF & Excel)
- Process flow visualization
- All UI features

❌ **Not Available:**
- Real data persistence (data resets on refresh)
- User registration
- Multi-user support
- Groq AI insights (requires API key)
- Database storage

## How to Enable Full Features

1. **Configure Supabase** (see README.md)
   - Add `VITE_SUPABASE_URL` to .env
   - Add `VITE_SUPABASE_ANON_KEY` to .env
   - Run database schema

2. **Configure Groq AI** (see README.md)
   - Add `VITE_GROQ_API_KEY` to .env

3. **Restart the app**
   ```bash
   pnpm dev
   ```

## Production Note

These demo credentials are **not shown** in the production UI. Users must:
- Register a new account (with Supabase)
- Create their own credentials
- Use proper authentication

---

**File Location:** This file is for developer reference only.  
**Not included in UI:** Demo credentials removed from login page as requested.
