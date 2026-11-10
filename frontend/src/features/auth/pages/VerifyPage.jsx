import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { resendCode } from '../../../api/auth.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useAuthProviders } from '../../../hooks/useAuthProviders.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import AuthShell from '../components/AuthShell.jsx';
import CodeInput from '../components/CodeInput.jsx';
import FormAlert from '../components/FormAlert.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import './VerifyPage.css';

const COOLDOWN_S = 60;

export default function VerifyPage() {
  useDocumentTitle('Verify your email');
  const { verifyEmail } = useAuth();
  const { codesInConsole } = useAuthProviders();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';

  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_S);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  if (!email) return <Navigate to="/register" replace />;

  async function submit(value) {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      await verifyEmail(email, value);
      navigate(location.state?.next ?? '/restaurants', { replace: true });
    } catch (err) {
      setError(err.message);
      setCode('');
      setBusy(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    try {
      await resendCode(email);
      setNotice('A new code is on its way.');
      setCooldown(COOLDOWN_S);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthShell
      title="Check your email."
      subtitle={
        <>
          Enter the 6-digit code we sent to <strong className="verify-page__email">{email}</strong>.
        </>
      }
      footer={
        <>
          Wrong address? <Link to="/register">Start over</Link>
        </>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {notice && <FormAlert tone="info">{notice}</FormAlert>}
      {codesInConsole && (
        <FormAlert tone="info">
          Email delivery isn’t set up on this server yet, so the code is printed in the terminal
          running the backend.
        </FormAlert>
      )}

      <form
        className="verify-page__form"
        onSubmit={(e) => {
          e.preventDefault();
          submit(code);
        }}
      >
        <CodeInput
          value={code}
          onChange={setCode}
          onComplete={submit}
          disabled={busy}
          invalid={Boolean(error)}
        />
        <SubmitButton busy={busy} busyLabel="Verifying…">
          Verify and continue
        </SubmitButton>
      </form>

      <p className="verify-page__resend">
        Didn’t get it? Check spam, or{' '}
        <button
          type="button"
          className="verify-page__resend-button"
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `resend in ${cooldown}s` : 'send a new code'}
        </button>
      </p>
    </AuthShell>
  );
}
