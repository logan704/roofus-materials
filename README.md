# Roofus Materials Portal — Hosting Guide

## What You Have

This is a complete React web app for Roofus Construction's material ordering system.
It's currently running inside Claude's artifact sandbox. This guide moves it to a
real hosted environment where Sheri, Brandon, and your whole team can access it.

---

## Step 1: Create Your Database (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project** — name it `roofus-materials`
3. Pick a strong database password (save this somewhere)
4. Wait ~2 minutes for it to provision
5. Go to **SQL Editor** (left sidebar)
6. Copy the contents of `supabase-migration.sql` and paste it in
7. Click **Run** — you should see "Success"
8. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 2: Set Up the Code (10 minutes)

You need Node.js installed. If you don't have it: [nodejs.org](https://nodejs.org)

```bash
# Unzip the project (or clone from GitHub)
cd roofus-hosted

# Create your .env file
cp .env.example .env

# Edit .env and paste your Supabase URL and key
# Use any text editor — Notepad, VS Code, whatever

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser. You should see the login screen.

## Step 3: Deploy to the Internet (10 minutes)

### Option A: Vercel (Easiest, Free)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR-USERNAME/roofus-materials.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Import Project** → select your repo
4. Add environment variables:
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy**
6. You get a URL like `roofus-materials.vercel.app`
7. Optional: Add your custom domain `materials.roofusconstruction.com`

### Option B: DigitalOcean ($5/month)

If you want more control, spin up a $5/month droplet and use Nginx + PM2.
But Vercel is simpler for this.

## Step 4: Making Changes Without Losing Data

**This is the key thing.** Your database (Supabase) and your code (Vercel) are
completely separate. When you push code changes, your data stays untouched.

### Workflow for making changes:

1. Open the code in Claude Code or any editor
2. Make your changes to `src/App.jsx`
3. Test locally: `npm run dev`
4. Push to GitHub: `git add . && git commit -m "description" && git push`
5. Vercel auto-deploys in ~30 seconds
6. Zero downtime, zero data loss

### If you want ME to make changes:

1. Share the current `src/App.jsx` file with me
2. Tell me what you want changed
3. I'll give you the updated file
4. You replace it, push to GitHub, done

### What WILL break your data:

- Deleting your Supabase project
- Changing the storage key names in `src/storage.js` (don't touch this file)
- Resetting the database

### What WON'T break your data:

- Any UI changes
- Adding new features
- Changing colors, layout, reports
- Adding new pages or components
- Deploying new code
- Restarting the server

## Step 5: Custom Domain (Optional)

In Vercel dashboard → your project → Settings → Domains

Add `materials.roofusconstruction.com` (or whatever you want).

Then in your domain registrar (GoDaddy, Cloudflare, etc.), add a CNAME record:
- Name: `materials`
- Value: `cname.vercel-dns.com`

Takes 5-30 minutes to propagate.

---

## File Structure

```
roofus-hosted/
├── index.html              ← HTML entry point
├── package.json            ← Dependencies
├── vite.config.js          ← Build tool config
├── .env.example            ← Environment variables template
├── supabase-migration.sql  ← Database setup (run once)
├── src/
│   ├── main.jsx            ← React entry point
│   ├── App.jsx             ← THE ENTIRE APP (this is what you edit)
│   └── storage.js          ← Database adapter (don't edit unless changing backends)
```

## Cost

| Service | Cost |
|---------|------|
| Supabase (free tier) | $0/month |
| Vercel (free tier) | $0/month |
| Custom domain | ~$12/year |
| **Total** | **$0-1/month** |

Free tiers support thousands of users and millions of database rows.
You won't need to pay until you're doing serious volume.

## If Something Breaks

1. Check Vercel dashboard for deploy errors
2. Check Supabase dashboard for database status
3. Check browser console (F12) for JavaScript errors
4. Come back to Claude with the error message

Your data is always safe in Supabase regardless of code issues.
