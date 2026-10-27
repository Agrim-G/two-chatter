const TONES = ['#ece9ff', '#e2f0ff', '#e3f6ec', '#fff0dc', '#ffe7ee', '#eaeaf2'];
const INKS = ['#4a3fd1', '#1f63b8', '#22764a', '#9a5a0b', '#b8365a', '#4d4d63'];

export function Avatar({ user, size = 40 }) {
  const name = user?.displayName || user?.email || '?';
  const i = [...(user?.id || name)].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length;
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span className="avatar" style={{ width: size, height: size, background: TONES[i], color: INKS[i], fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export const Spinner = ({ label }) => (
  <div className="center" role="status">
    <span className="spinner" />
    {label && <p className="muted">{label}</p>}
  </div>
);

export const Logo = () => (
  <span className="logo">
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#5b4fe9" />
      <path d="M18 20h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H33l-9 8v-8h-6a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#fff" />
    </svg>
    Chatterbox
  </span>
);
