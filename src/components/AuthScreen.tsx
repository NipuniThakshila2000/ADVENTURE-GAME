import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthUser, loginUser } from "../api/auth";

type Props = {
  onAuthenticated: (user: AuthUser) => void;
};

export default function AuthScreen({ onAuthenticated }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user = await loginUser({ email });
      onAuthenticated(user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <img className="hero-logo" src="/images/cms-redux-logo.png" alt="CMS Redux" />
        <p className="eyebrow">Member access</p>
        <h1>CMS Redux Trail</h1>
        <p>Sign in to keep your journey, quiz history, unlocked notes, and endings saved to your account.</p>
      </section>
      <section className="auth-card glass">
        <form className="auth-form" onSubmit={submit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="primary action" disabled={isSubmitting} type="submit">
            <LogIn size={18} />
            {isSubmitting ? "Please wait..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
