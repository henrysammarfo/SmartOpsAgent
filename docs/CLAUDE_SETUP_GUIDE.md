# SmartOpsAgent - Local Setup with Claude

## YOUR WORKFLOW:

1. **Download YOUR_API_KEYS.md from v0** (has your real API keys)
2. **Create GitHub repo from v0**
3. **Clone the repo locally**
4. **Move YOUR_API_KEYS.md into the cloned repo**
5. **Use Claude prompts below** (Claude reads YOUR_API_KEYS.md and sets up everything)

---

## Step 1: Setup Environment Variables (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
I have a file called YOUR_API_KEYS.md in my project root with all my API keys.

Please:
1. Read YOUR_API_KEYS.md
2. Create .env.local in the root with the frontend environment variables
3. Create backend/.env with the backend environment variables
4. Use the EXACT values from YOUR_API_KEYS.md

IMPORTANT RULES:
- Do NOT add any comments mentioning AI, Claude, or v0
- Do NOT modify YOUR_API_KEYS.md
- Just create the .env files with the correct values

After creating the files, confirm they're set up correctly.
\`\`\`

---

## Step 2: Install Dependencies (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
Now install all dependencies for SmartOpsAgent.

Please:
1. Run npm install in the root directory
2. Run npm install in the backend directory
3. Check for any dependency conflicts or errors
4. Verify all packages installed successfully

Tell me if there are any issues.
\`\`\`

---

## Step 3: Setup Database (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
I need to run the Supabase database migrations.

Please:
1. Read scripts/001_create_tables.sql
2. Read scripts/002_add_alerts_table.sql
3. Tell me the exact steps to run them in Supabase SQL Editor
4. Verify the SQL is correct before I run it

Do NOT modify the SQL files.
\`\`\`

---

## Step 4: Start the Application (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
Start both the backend and frontend servers.

Please:
1. Start the backend with: cd backend && npm run dev
2. Start the frontend with: npm run dev
3. Check if both servers start without errors
4. Verify the backend is on http://localhost:3001
5. Verify the frontend is on http://localhost:3000

Tell me if there are any startup errors.
\`\`\`

---

## Step 5: Test the Application (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
Create a testing checklist for SmartOpsAgent.

Test:
1. Backend health check (http://localhost:3001/health)
2. Frontend loads (http://localhost:3000)
3. Sign up flow
4. Onboarding flow
5. Dashboard displays data
6. All pages work
7. WebSocket connection
8. Discord/Slack notifications

Guide me through testing each feature.
\`\`\`

---

## Step 6: Clean Up for GitHub (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
Before I push to GitHub, clean up the codebase.

Please:
1. Remove unnecessary console.log statements
2. Remove TODO/FIXME comments
3. Remove any AI-related comments
4. Verify no .cursorrules or AI instruction files exist
5. Make sure code looks professionally written

CRITICAL: No traces of AI assistance should remain.
\`\`\`

---

## Step 7: Deploy to Production (AUTOMATED)

**Copy this prompt to Claude:**

\`\`\`
Deploy SmartOpsAgent to production.

Please:
1. Guide me through deploying backend to Railway/Render
2. Guide me through deploying frontend to Vercel
3. Help me set up environment variables in both platforms
4. Update CORS settings for production
5. Test the live deployment

Provide step-by-step deployment instructions.
\`\`\`

---

## Important Notes:

- **YOUR_API_KEYS.md is in .gitignore** - It will never be pushed to GitHub
- **Keep YOUR_API_KEYS.md safe** - You need it to set up on other machines
- **Claude does everything** - You just copy prompts and run commands
- **No AI traces** - Code looks professionally written

---

**Ready? Download YOUR_API_KEYS.md from v0, then start with Step 1!**
