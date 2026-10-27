import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isConfigured } from './firebase.js';
import SetupNotice from './SetupNotice.jsx';
import Auth from './Auth.jsx';
import ChatApp from './ChatApp.jsx';
import { Spinner } from './ui.jsx';

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = signed out

  useEffect(() => {
    if (!isConfigured) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!isConfigured) return <SetupNotice />;
  if (user === undefined) return <Spinner label="Loading…" />;
  return user ? <ChatApp user={user} /> : <Auth />;
}
