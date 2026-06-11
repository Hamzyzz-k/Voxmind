# VoxMind Deployment Guide

Complete guide for pushing to GitHub and deploying to Render + Vercel.

## Step 1: Push to GitHub

### Create GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click **New Repository** (top right)
3. Name it: `voxmind`
4. Add description: `Voice-controlled smart home assistant with AI`
5. Choose **Public** (for portfolio) or **Private** (for security)
6. **Do NOT** initialize with README (you already have one)
7. Click **Create repository**

### Push Your Code

In PowerShell, run these commands from the `voxmind` root directory:

```powershell
cd C:\Users\HAMZAH\voxmind

# Configure Git (first time only)
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: VoxMind voice-controlled smart home assistant"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/voxmind.git

# Rename branch to main (if on master)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Verify on GitHub

Visit `https://github.com/YOUR_USERNAME/voxmind` and verify all files are there.

---

## Step 2: Deploy Backend to Render

### Setup

1. Go to [render.com](https://render.com) and sign up (use GitHub for easier setup)
2. Click **Dashboard** → **New +** → **Web Service**
3. Select **Connect a repository** → Choose `voxmind`

### Configuration

In the Render dashboard, fill in:

| Field | Value |
|-------|-------|
| **Name** | `voxmind-api` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Region** | Select closest to you |
| **Plan** | Free tier (or paid if needed) |

### Environment Variables

Click **Advanced** → **Add Environment Variable**:

```
ANTHROPIC_API_KEY = (paste your Claude API key)
OPENAI_API_KEY = (paste your OpenAI API key)
ESP8266_IP = 192.168.1.100
```

### Deploy

Click **Create Web Service** and wait for deployment (2-3 minutes).

Your backend URL will be: `https://voxmind-api.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### Setup

1. Go to [vercel.com](https://vercel.com) and sign up (use GitHub)
2. Click **Add New...** → **Project**
3. Select the `voxmind` repository

### Configuration

1. **Framework Preset**: Select `Vite`
2. **Root Directory**: Change from `.` to `frontend`
3. **Build Command**: Keep as `npm run build`
4. **Output Directory**: Keep as `dist`

### Environment Variables

Add these environment variables:

```
VITE_API_URL = https://voxmind-api.onrender.com
```

### Deploy

Click **Deploy** and wait (1-2 minutes).

Your frontend URL will be: `https://voxmind.vercel.app` (or similar)

---

## Step 4: Update API Configuration

After getting your URLs, update your code:

### Frontend - Update API Base URL

In `frontend/src/main.jsx` or API client configuration:

```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';
```

### Backend - Update CORS

In `backend/main.py`, update CORS to allow your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://voxmind.vercel.app"  # Your Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

Push these changes:

```powershell
git add .
git commit -m "Update CORS and API configuration for production"
git push
```

Both services will auto-redeploy.

---

## Step 5: Testing

1. Visit your Vercel frontend URL
2. Test voice login functionality
3. Test smart home commands
4. Check browser console for any errors

## Troubleshooting

### Backend Not Starting
- Check Render logs: Dashboard → Select service → Logs
- Verify Python version: `python --version`
- Check requirements.txt is in backend folder

### Frontend Not Loading
- Check Vercel build logs: Click "Deployments" → View details
- Verify `frontend/package.json` exists
- Check `VITE_API_URL` environment variable is set

### CORS Errors
- Update `CORS_ORIGINS` in backend main.py
- Redeploy both services

### API Calls Failing
- Check your API keys are set in Render environment variables
- Verify `ESP8266_IP` is correct for IoT commands
- Test backend locally first with `uvicorn main:app --reload`

---

## Future Updates

To update your deployed apps after making code changes:

```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

Both Render and Vercel auto-deploy on push to main branch!

---

## Important Notes

⚠️ **Security**:
- Never commit `.env` file (already in .gitignore)
- Keep API keys private - use environment variables
- Render free tier has limitations - consider upgrade for production

⚠️ **Limits**:
- Free Render instances spin down after 15 minutes of inactivity
- Vercel free tier has monthly bandwidth limits
- Consider upgrades for production use

