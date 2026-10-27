import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { friendlyError } from './utils.js';
import { Avatar } from './ui.jsx';

export default function ProfileModal({ me, onClose }) {
  const [name, setName] = useState(me.displayName || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(e) {
    e.preventDefault();
    const displayName = name.trim().slice(0, 40);
    if (!displayName) return setError('Display name can’t be empty.');
    setBusy(true);
    setError('');
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', me.id), { displayName });
      onClose();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
        <Avatar user={me} size={64} />
        <h2>Your profile</h2>
        <p className="muted">{me.email}</p>
        <label>Display name
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
