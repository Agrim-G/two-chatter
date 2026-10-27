// The id of a conversation is both user ids, sorted and joined. The same pair always gets the same id.
export const convIdFor = (a, b) => [a, b].sort().join('_');

const sameDay = (a, b) => a.toDateString() === b.toDateString();

export const formatTime = (d) =>
  d ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';

export function formatListTime(d) {
  if (!d) return '';
  const now = new Date();
  if (sameDay(d, now)) return formatTime(d);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function dayLabel(d) {
  const now = new Date();
  if (sameDay(d, now)) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
}

const MESSAGES = {
  'auth/invalid-email': 'That email address doesn’t look right.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/weak-password': 'Choose a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection and try again.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled in your Firebase project yet.',
  'permission-denied': 'Permission denied. Make sure the Firestore rules from the README are published.',
  unavailable: 'Can’t reach the server. Check your connection.',
};
export const friendlyError = (e) => MESSAGES[e?.code] || 'Something went wrong. Please try again.';
