import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
import './RegisterPage.css';

export default function RegisterPage() {
  useDocumentTitle('Create account');
  const { register } = useAuth();
  const { showGoogle } = useAuthProviders();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      const { email } = await register({
        displayName: String(form.get('displayName')),
        email: String(form.get('email')),
        password: String(form.get('password')),
      });
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err.details) setFieldErrors(err.details);
      else setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create your account."
      subtitle="Keep a visit log, save your spots and run group picks."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      {error && <FormAlert>{error}</FormAlert>}
      {showGoogle && (
        <>
          <GoogleButton label="Sign up with Google" />
          <AuthDivider />
        </>
      )}
      <form className="register-page__form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          name="displayName"
          autoComplete="name"
          maxLength={60}
          required
          error={fieldErrors.displayName}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <PasswordField
          autoComplete="new-password"
          hint="At least 8 characters."
          error={fieldErrors.password}
        />
        <SubmitButton busy={busy} busyLabel="Creating account…">
          Continue
        </SubmitButton>
        <p className="register-page__note">We’ll email you a 6-digit code to confirm it’s you.</p>
      </form>
    </AuthShell>
  );
}
