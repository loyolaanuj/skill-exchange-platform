# SkillSwap Platform – Setup & Deployment Guide

## 🚀 Quick Start

### Step 1: Create a Firebase Project

1. Go to **[https://console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"**
3. Enter project name: `skillswap-platform` (or any name you prefer)
4. Enable/disable Google Analytics (optional for this project)
5. Click **"Create Project"** and wait for it to initialize

---

### Step 2: Set Up Firebase Authentication

1. In the Firebase Console sidebar, click **Authentication**
2. Click **"Get Started"**
3. Under **"Sign-in method"** tab, enable the following providers:
   - ✅ **Email/Password** → Enable → Save
   - ✅ **Google** → Enable → Enter your project's support email → Save

---

### Step 3: Set Up Firestore Database

1. In the sidebar, click **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll apply proper rules later)
4. Select a location closest to your users (e.g., `asia-south1` for India)
5. Click **"Done"**

---

### Step 4: (Optional) Enable Firebase Storage (for photo uploads)

1. In the sidebar, click **Storage**
2. Click **"Get Started"**
3. Select **"Start in test mode"**
4. Choose the same region as Firestore
5. Click **"Done"**

Then apply these storage rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

### Step 5: Get Your Firebase Configuration

1. In the Firebase Console, click the **gear icon ⚙️** → **"Project Settings"**
2. Under **"Your apps"**, click the **Web icon (`</>`)**
3. Register your app (give it any nickname)
4. Copy the `firebaseConfig` object shown

---

### Step 6: Add Your Firebase Config to the Project

Open the file **`firebase-config.js`** in your project and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Your actual API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

### Step 7: Apply Firestore Security Rules

1. In Firestore Console, click **"Rules"** tab
2. Replace any existing rules with the contents of the `firestore.rules` file in this project
3. Click **"Publish"**

---

### Step 8: Open the Application Locally

Simply open `index.html` in your browser — no build step required!

For the best experience, use a local HTTP server:

**Option A – VS Code Live Server:**
- Install the "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

**Option B – Python HTTP Server:**
```bash
python -m http.server 3000
# Then visit: http://localhost:3000
```

**Option C – Node.js serve:**
```bash
npx serve .
```

---

## 🌐 Deploy to Firebase Hosting (Optional)

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login and Initialize
```bash
firebase login
firebase init
```

When prompted:
- Select **"Hosting: Configure files for Firebase Hosting"**
- Choose your Firebase project
- Set public directory: **`.`** (just a dot — the current folder)
- Configure as single-page app: **No**
- Set up automatic builds: **No**

### Deploy
```bash
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 📁 Project File Structure

```
SKILL EXCHANGE PLATFORM 1/
│
├── index.html          # 🏠 Landing page (public)
├── login.html          # 🔑 Sign in page
├── signup.html         # 📝 Create account page
├── dashboard.html      # 🎛️ Main dashboard (auth required)
├── profile.html        # 👤 Edit profile page (auth required)
├── browse.html         # 🔍 Browse & discover users (auth required)
├── chat.html           # 💬 Real-time messaging (auth required)
│
├── styles.css          # 🎨 Global design system & styles
├── utils.js            # 🔧 Shared utilities & helpers
├── firebase-config.js  # 🔥 Firebase initialization
│
├── firestore.rules     # 🔒 Security rules for Firestore
└── SETUP.md            # 📖 This guide!
```

---

## ✅ Feature Checklist

| Feature | Status |
|---------|--------|
| Email/Password Authentication | ✅ |
| Google Sign-In | ✅ |
| Password Reset via Email | ✅ |
| User Profile (name, bio, location) | ✅ |
| Skills Offered (tag-chip input) | ✅ |
| Skills Wanted (tag-chip input) | ✅ |
| Profile Photo Upload | ✅ |
| Dashboard with Stats | ✅ |
| Send Skill Exchange Requests | ✅ |
| Accept / Decline Requests | ✅ |
| Cancel Pending Requests | ✅ |
| Browse All Users | ✅ |
| Search Users by Name / Skill | ✅ |
| Filter & Sort Users | ✅ |
| Smart Skill Matching Algorithm | ✅ |
| Match Score Percentage | ✅ |
| Real-Time Chat (Firestore) | ✅ |
| Chat Conversation List | ✅ |
| Message Timestamps | ✅ |
| Toast Notifications | ✅ |
| Notification Dot for Pending Requests | ✅ |
| Dark Theme UI | ✅ |
| Responsive Mobile Layout | ✅ |
| Firebase Security Rules | ✅ |
| Profile Completeness Indicator | ✅ |
| Password Change | ✅ |
| Account Deletion | ✅ |
| Rating Display | ✅ |

---

## 🛡️ Security Notes

- All Firestore reads/writes require authentication
- Users can only edit **their own** profile
- Requests can only be responded to by the **recipient**
- Chat messages can only be read by **participants**
- File uploads are limited to 5MB and must be images

---

## 🐛 Troubleshooting

**Firebase not initializing?**
→ Make sure you replaced ALL placeholder values in `firebase-config.js`

**"Permission denied" errors?**
→ Check that you published the Firestore rules from `firestore.rules`

**Google Sign-In popup blocked?**
→ Allow popups from `localhost` in your browser settings

**Photos not uploading?**
→ Enable Firebase Storage and apply the storage rules above

**Chat not showing messages?**
→ Make sure you have accepted a skill exchange request first (chats are created on acceptance)

---

## 📞 Support

This is a college project built with Firebase + Vanilla JS. For questions, refer to:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
