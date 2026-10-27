# Chatterbox

A small real-time chat app. Two people can register, find each other and talk instantly. Built with React, Vite and Firebase (Authentication and Cloud Firestore). There is no server of your own to run.

If Firebase isn't configured, the app shows a setup screen instead of a chat, so it never pretends to work.

## 1. Set up Firebase (free)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**. Name it anything. You can turn Google Analytics off.
2. In the project, click the web icon (`</>`) to **register a web app**. Skip Firebase Hosting. Copy the `firebaseConfig` values it shows you.
3. Open **Build > Authentication > Get started > Sign-in method**, enable **Email/Password** and save.
4. Open **Build > Firestore Database > Create database**. Pick a location near your friends and start in **production mode**.
5. In Firestore, open the **Rules** tab, replace everything with the contents of `firestore.rules` from this project, and click **Publish**. These rules let people read and send messages only in conversations they belong to.

## 2. Run it locally

You need [Node.js](https://nodejs.org) 20.19 or newer.

```
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Open `.env` and fill in the four values from your Firebase config:

| `.env` name | `firebaseConfig` field |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

Then start it:

```
npm run dev
```

To check it works, open the app in two different browsers (or one normal and one private window), create two accounts and message each other.

## 3. Put it on GitHub

Create a repository and push this folder. The `.gitignore` keeps your `.env` file out of the repository. If you upload through the GitHub website instead, do not upload `.env` or `node_modules`.

## 4. Deploy

Both options need the same four environment variables from step 2.

**Netlify:** Add new site > Import an existing project > pick your repository. The build settings are filled in from `netlify.toml` (build command `npm run build`, publish directory `dist`). Before deploying, open **Site configuration > Environment variables** and add the four `VITE_FIREBASE_...` variables. Deploy.

**Vercel:** Add New > Project > import your repository. Vercel detects Vite automatically. Under **Environment Variables**, add the four `VITE_FIREBASE_...` variables, then click Deploy.

If you add or change variables after a deploy, trigger a new deploy so they take effect. If sign-in is ever blocked on your live site, add its domain under **Authentication > Settings > Authorized domains**.

## Good to know

- **Firebase keys are not passwords.** They are meant to be public in a web app. Your data is protected by the Firestore rules in `firestore.rules`, so always keep those published.
- **Visible info:** every signed-in user can see other users' display names and emails in the People list. That is how you find friends. Don't use this for anything sensitive.
- **Free limits:** Firebase's free Spark plan includes email/password sign-in and a daily Firestore allowance (around 50,000 reads and 20,000 writes per day, 1 GiB stored). That is plenty for a group of friends. Netlify and Vercel's free plans cover a small static site. Limits change, so check the current pricing pages. This project does not need any paid service.
- **Scope:** one-to-one text messages only. No notifications, no group chats, no file sharing.

## Project layout

```
src/firebase.js      reads your settings and connects to Firebase
src/App.jsx          decides what to show: setup notice, sign in or chat
src/Auth.jsx         register and sign in
src/ChatApp.jsx      sidebar: chats, people, search, profile, sign out
src/ChatWindow.jsx   messages and the message box
src/ProfileModal.jsx edit your display name
firestore.rules      security rules to publish in Firebase
```
