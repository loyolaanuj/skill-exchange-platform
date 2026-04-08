// =============================================
// FIREBASE CONFIGURATION
// =============================================
// IMPORTANT: Replace these values with your own Firebase project credentials.
// Go to https://console.firebase.google.com → Your Project → Project Settings → Web App
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyB5Vfsfbja5gmZMzT_6C3xjWhLzzTFSvaQ",
  authDomain: "skill-exchange-platform-fa894.firebaseapp.com",
  projectId: "skill-exchange-platform-fa894",
  storageBucket: "skill-exchange-platform-fa894.firebasestorage.app",
  messagingSenderId: "747589059357",
  appId: "1:747589059357:web:3ef0dfff7d4bc2c4e8d7f4"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable Firestore offline persistence (multi-tab safe)
db.enableMultiTabIndexedDbPersistence().catch((err) => {
  if (err.code === 'failed-precondition') {
    // Fall back to single-tab persistence
    db.enablePersistence().catch(() => {});
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore offline persistence not supported in this browser');
  }
});
