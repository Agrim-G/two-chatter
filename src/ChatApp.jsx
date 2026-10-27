import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { formatListTime, friendlyError } from './utils.js';
import { Avatar, Spinner } from './ui.jsx';
import ChatWindow from './ChatWindow.jsx';
import ProfileModal from './ProfileModal.jsx';

export default function ChatApp({ user }) {
  const [users, setUsers] = useState(null);
  const [convs, setConvs] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [tab, setTab] = useState('chats');
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const onError = (e) => setLoadError(friendlyError(e));
    const stopUsers = onSnapshot(collection(db, 'users'), (s) => setUsers(s.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
    const stopConvs = onSnapshot(q, (s) => setConvs(s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))), onError);
    return () => { stopUsers(); stopConvs(); };
  }, [user.uid]);

  const me = users?.find((u) => u.id === user.uid) || { id: user.uid, displayName: user.displayName || user.email, email: user.email };
  const term = search.trim().toLowerCase();
  const matches = (u) => !term || `${u.displayName} ${u.email}`.toLowerCase().includes(term);
  const people = (users || []).filter((u) => u.id !== user.uid && matches(u))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
  const chats = (convs || [])
    .map((c) => ({ ...c, other: users?.find((u) => u.id === c.participants.find((p) => p !== user.uid)) }))
    .filter((c) => c.other && matches(c.other))
    .sort((a, b) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
  const active = users?.find((u) => u.id === activeId);
  const loading = users === null || convs === null;

  return (
    <div className={'app' + (active ? ' chat-open' : '')}>
      <aside className="sidebar">
        <header className="side-head">
          <button className="me" onClick={() => setShowProfile(true)} title="Edit your profile">
            <Avatar user={me} size={38} />
            <span><strong>{me.displayName}</strong><small>Edit profile</small></span>
          </button>
          <button className="btn ghost small" onClick={() => signOut(auth)}>Sign out</button>
        </header>
        <div className="side-tools">
          <input type="search" placeholder="Search people and chats" aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="seg">
            <button className={tab === 'chats' ? 'on' : ''} onClick={() => setTab('chats')}>Chats</button>
            <button className={tab === 'people' ? 'on' : ''} onClick={() => setTab('people')}>People</button>
          </div>
        </div>
        {loadError && <p className="error banner" role="alert">{loadError}</p>}
        <div className="list">
          {loading && !loadError && <Spinner label="Loading…" />}
          {!loading && tab === 'chats' && chats.map((c) => (
            <button key={c.id} className={'row-item' + (c.other.id === activeId ? ' active' : '')} onClick={() => setActiveId(c.other.id)}>
              <Avatar user={c.other} />
              <span className="grow">
                <strong>{c.other.displayName}</strong>
                <small className="preview">{c.lastMessage?.senderId === user.uid ? 'You: ' : ''}{c.lastMessage?.text}</small>
              </span>
              <small className="when">{formatListTime(c.updatedAt?.toDate())}</small>
            </button>
          ))}
          {!loading && tab === 'chats' && chats.length === 0 && (
            <div className="empty">
              <p><strong>{term ? 'No matching chats' : 'No conversations yet'}</strong></p>
              <p className="muted">{term ? 'Try a different search.' : 'Pick someone from People to say hello.'}</p>
              {!term && <button className="btn small" onClick={() => setTab('people')}>Find people</button>}
            </div>
          )}
          {!loading && tab === 'people' && people.map((u) => (
            <button key={u.id} className={'row-item' + (u.id === activeId ? ' active' : '')} onClick={() => { setActiveId(u.id); setTab('chats'); setSearch(''); }}>
              <Avatar user={u} />
              <span className="grow"><strong>{u.displayName}</strong><small className="preview">{u.email}</small></span>
            </button>
          ))}
          {!loading && tab === 'people' && people.length === 0 && (
            <div className="empty">
              <p><strong>{term ? 'No one found' : 'No other users yet'}</strong></p>
              <p className="muted">{term ? 'Try a different search.' : 'Ask a friend to create an account, then they’ll appear here.'}</p>
            </div>
          )}
        </div>
      </aside>

      <main className="chat">
        {active
          ? <ChatWindow key={active.id} me={me} other={active} onBack={() => setActiveId(null)} />
          : <div className="center"><div className="empty"><p><strong>Select a conversation</strong></p><p className="muted">Choose a chat or start a new one from People.</p></div></div>}
      </main>

      {showProfile && <ProfileModal me={me} onClose={() => setShowProfile(false)} />}
    </div>
  );
}
