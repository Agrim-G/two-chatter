import { useEffect, useRef, useState } from 'react';
import { collection, doc, limitToLast, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase.js';
import { convIdFor, dayLabel, formatTime, friendlyError } from './utils.js';
import { Avatar, Spinner } from './ui.jsx';

export default function ChatWindow({ me, other, onBack }) {
  const convId = convIdFor(me.id, other.id);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'conversations', convId, 'messages'), orderBy('createdAt'), limitToLast(300));
    return onSnapshot(
      q,
      (s) => { setError(''); setMessages(s.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))); },
      (e) => { setMessages([]); setError(friendlyError(e)); },
    );
  }, [convId]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setText('');
    setError('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, 'conversations', convId, 'messages')), { text: body, senderId: me.id, createdAt: serverTimestamp() });
      batch.set(
        doc(db, 'conversations', convId),
        { participants: [me.id, other.id].sort(), lastMessage: { text: body, senderId: me.id }, updatedAt: serverTimestamp() },
        { merge: true },
      );
      await batch.commit();
    } catch (e) {
      setText(body); // give the text back so nothing is lost
      setError(friendlyError(e));
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function onChange(e) {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  }

  let lastDay = '';
  return (
    <>
      <header className="chat-head">
        <button className="back" onClick={onBack} aria-label="Back to conversations">‹</button>
        <Avatar user={other} size={40} />
        <span><strong>{other.displayName}</strong><small className="muted">{other.email}</small></span>
      </header>

      <div className="messages">
        {messages === null && <Spinner label="Loading messages…" />}
        {messages?.length === 0 && !error && (
          <div className="center"><div className="empty"><p><strong>No messages yet</strong></p><p className="muted">Say hello to {other.displayName}.</p></div></div>
        )}
        {messages?.map((m) => {
          const d = m.createdAt?.toDate();
          const day = d ? d.toDateString() : lastDay;
          const showDay = day !== lastDay;
          lastDay = day;
          const mine = m.senderId === me.id;
          return (
            <div key={m.id} className="msg-wrap">
              {showDay && d && <div className="day">{dayLabel(d)}</div>}
              <div className={'bubble ' + (mine ? 'out' : 'in')}>
                <span className="text">{m.text}</span>
                <time>{formatTime(d)}</time>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {error && <p className="error banner" role="alert">{error}</p>}
      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea ref={inputRef} rows={1} value={text} onChange={onChange} onKeyDown={onKeyDown} placeholder={`Message ${other.displayName}`} aria-label="Message" maxLength={2000} />
        <button className="btn" disabled={!text.trim()}>Send</button>
      </form>
    </>
  );
}
