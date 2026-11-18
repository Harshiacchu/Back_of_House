import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../../hooks/useAuth.js';
import { useAuthProviders } from '../../../hooks/useAuthProviders.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';
import AuthDivider from '../components/AuthDivider.jsx';
import AuthShell from '../components/AuthShell.jsx';
import FormAlert from '../components/FormAlert.jsx';
import GoogleButton from '../components/GoogleButton.jsx';
import PasswordField from '../components/PasswordField.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import TextField from '../components/TextField.jsx';
import './LoginPage.css';

const GOOGLE_ERRORS = {
  google: 'Google sign-in didn’t finish. Try again, or use your email.',
  'google-unavailable': 'Google sign-in isn’t set up on this server yet. Use your email for now.',
};

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const { login } = useAuth();
  const { showGoogle } = useAuthProviders();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const next = location.state?.from?.pathname ?? '/restaurants';
  const [error, setError] = useState(GOOGLE_ERRORS[params.get('error')] ?? null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email')).trim();
    setBusy(true);
    setError(null);
    try {
      await login({ email, password: form.get('password') });
      navigate(next, { replace: true });
    } catch (err) {
      if (err.data?.verificationRequired) {
        navigate(`/verify?email=${encodeURIComponent(err.data.email)}`, { state: { next } });
        return;
      }
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Sign in."
      subtitle="Welcome back to Back of House."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {showGoogle && (
        <>
          <GoogleButton next={next} />
          <AuthDivider />
        </>
      )}
      <form className="login-page__form" onSubmit={handleSubmit}>
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <PasswordField autoComplete="current-password" />
        <SubmitButton busy={busy} busyLabel="Signing in…">
          Sign in
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

LoginPage.propTypes = {};
