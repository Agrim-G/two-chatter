import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { friendlyError } from './utils.js';
import { Logo } from './ui.jsx';

export default function Auth() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (signup && !name.trim()) return setError('Enter a display name.');
    setBusy(true);
    try {
      if (signup) {
        const displayName = name.trim().slice(0, 40);
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName });
        await setDoc(doc(db, 'users', cred.user.uid), { displayName, email: cred.user.email, createdAt: serverTimestamp() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <div className="welcome">
      <section className="welcome-art">
        <Logo />
        <h1>Say it in real time.</h1>
        <p>Create an account, find a friend and start talking. Messages show up the moment they’re sent.</p>
        <div className="demo" aria-hidden="true">
          <div className="bubble in">Are we still on for tonight?</div>
          <div className="bubble out">Yes! I’ll be there at 8.</div>
          <div className="bubble in">Perfect, see you then.</div>
        </div>
      </section>
      <section className="welcome-form">
        <form className="card" onSubmit={submit}>
          <div className="seg" role="tablist">
            <button type="button" role="tab" aria-selected={!signup} className={!signup ? 'on' : ''} onClick={() => { setMode('signin'); setError(''); }}>Sign in</button>
            <button type="button" role="tab" aria-selected={signup} className={signup ? 'on' : ''} onClick={() => { setMode('signup'); setError(''); }}>Create account</button>
          </div>
          {signup && (
            <label>Display name
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="nickname" placeholder="How friends will see you" />
            </label>
          )}
          <label>Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
          </label>
          <label>Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={signup ? 'new-password' : 'current-password'} placeholder="At least 6 characters" />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button>
        </form>
      </section>
    </div>
  );
}
