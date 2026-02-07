# Deploy Your Site to View on Phone

## Option 1: Vercel (Recommended - Easiest & Free)

### Steps:
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd c:\Users\23sar\venue-vibes-ui
   vercel
   ```

3. **Follow prompts:**
   - Login/Signup with GitHub, GitLab, or Email
   - Confirm project settings (just press Enter for defaults)
   - Wait for deployment (takes 1-2 minutes)

4. **Get URL:**
   - After deployment, you'll get a URL like: `https://venue-vibes-ui-xxx.vercel.app`
   - Open this URL on your phone!

### For Production URL:
```bash
vercel --prod
```

---

## Option 2: Netlify (Also Free & Easy)

### Steps:
1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy
   ```

4. **Follow prompts:**
   - Login/Signup
   - Create new site
   - Set publish directory to: `dist`
   - Get draft URL

5. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

---

## Option 3: Local Network (Test on Phone Immediately)

### Steps:
1. **Start dev server with network access**
   ```bash
   npm run dev -- --host
   ```

2. **Find your computer's IP address:**
   - Windows: Open Command Prompt and type `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

3. **Access on phone:**
   - Make sure phone is on same WiFi network
   - Open browser on phone
   - Go to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`

---

## Quick Deploy Commands

### Vercel (Fastest):
```bash
npm install -g vercel
vercel
```

### Local Network (Immediate):
```bash
npm run dev -- --host
```
Then access via `http://YOUR_IP:5173` on phone

---

## Recommended: Use Vercel
- Free forever
- Automatic HTTPS
- Fast global CDN
- Easy to update (just run `vercel` again)
- Get a shareable URL instantly
