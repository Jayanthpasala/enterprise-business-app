# Firebase Console Setup Guide

## Enable Authentication in Firebase Console

After deploying the code, you need to enable authentication methods in Firebase Console.

### Step 1: Enable Email/Password Authentication

1. Go to: https://console.firebase.google.com/project/gen-lang-client-0972837952/authentication
2. Click **"Get Started"** (if first time) or go to **"Sign-in method"** tab
3. Click on **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Click **"Save"**

### Step 2: Enable Google Sign-In

1. In the same **"Sign-in method"** tab
2. Click on **"Google"**
3. Toggle **"Enable"** to ON
4. Enter **Project support email**: `jayanthpasala10@gmail.com`
5. Click **"Save"**

### Step 3: Add Authorized Domain (for Dokploy deployment)

1. Go to **"Settings"** tab in Authentication
2. Under **"Authorized domains"**, you should see `localhost` already added
3. Click **"Add domain"**
4. Add your Dokploy domain: `kc-high-reports-cpgcus-eb4396-72-62-194-136.traefik.me`
5. Click **"Add"**

---

## Testing Authentication

### Local Testing (http://localhost:3001)

1. **Sign Up**: Create a new account with email/password
2. **Login**: Log in with the account you created
3. **Google Sign-In**: Click "Sign in with Google" button
4. **Logout**: Click the logout button in the dashboard
5. **Refresh**: Refresh the page while logged in - should stay logged in

### Production Testing (Dokploy URL)

After enabling authentication in Firebase Console and deploying:

1. Visit: http://kc-high-reports-cpgcus-eb4396-72-62-194-136.traefik.me/
2. You should see the Login screen
3. Try creating an account
4. Try Google Sign-In
5. Test logout functionality

---

## Troubleshooting

### "auth/unauthorized-domain" Error

If you see this error when trying to sign in:
- Make sure you added your Dokploy domain to **Authorized domains** in Firebase Console
- Wait 1-2 minutes for changes to propagate

### Google Sign-In Popup Blocked

- Make sure pop-ups are allowed for your domain
- Try using a different browser

### "auth/invalid-api-key" Error

- Make sure environment variables are set correctly in Dokploy
- Redeploy after setting environment variables

---

## Next Steps

1. ✅ Enable Email/Password authentication in Firebase Console
2. ✅ Enable Google Sign-In in Firebase Console
3. ✅ Add authorized domain for deployment
4. ✅ Push code to GitHub
5. ✅ Deploy to Dokploy
6. ✅ Test authentication on deployed app

Your app is now production-ready with full authentication! 🎉
