import { missingKeys } from './firebase.js';
import { Logo } from './ui.jsx';

export default function SetupNotice() {
  return (
    <div className="center page">
      <div className="card setup">
        <Logo />
        <h1>Firebase isn’t set up yet</h1>
        <p className="muted">Chatterbox needs a free Firebase project for accounts and messages. Until it’s connected, chat is switched off.</p>
        <p>These settings are missing:</p>
        <ul className="keys">{missingKeys.map((k) => <li key={k}><code>{k}</code></li>)}</ul>
        <ol>
          <li>Follow the Firebase steps in the README.</li>
          <li>Copy <code>.env.example</code> to <code>.env</code> and fill in the values (or add them as environment variables on Netlify or Vercel).</li>
          <li>Restart the dev server, or redeploy the site.</li>
        </ol>
      </div>
    </div>
  );
}
