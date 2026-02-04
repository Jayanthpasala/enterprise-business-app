# Environment Variables Setup for Dokploy

## Add These Environment Variables in Dokploy:

Go to your Dokploy project settings → Environment Variables and add:

```
VITE_FIREBASE_API_KEY=AIzaSyAlOICqCg9hdlIX-yKHTSH2skWfqAqSnXM
VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0972837952.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://gen-lang-client-0972837952-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=gen-lang-client-0972837952
VITE_FIREBASE_STORAGE_BUCKET=gen-lang-client-0972837952.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=683423213216
VITE_FIREBASE_APP_ID=1:683423213216:web:0dc223491b8d95fb2d4bc5
VITE_FIREBASE_MEASUREMENT_ID=G-HDLCS4MDKN
VITE_GEMINI_API_KEY=AIzaSyDQXxHbxV5nKtYSXgwyJNchwwefMwQ8HBM
```

## Why This Fixes the Issue:

✅ **Secure**: API keys are not exposed in your code
✅ **Flexible**: Different keys for dev/production
✅ **Proper**: Vite reads `VITE_` prefixed env vars at build time

## After Adding Environment Variables:

1. Save the environment variables in Dokploy
2. Trigger a new deployment (or push the updated code)
3. Dokploy will rebuild with the correct Firebase credentials

Your app will work perfectly! 🚀
