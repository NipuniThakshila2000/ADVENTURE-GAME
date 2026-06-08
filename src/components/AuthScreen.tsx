import { LogIn, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { AuthUser, loginUser, registerUser } from "../api/auth";

type Props = {
  onAuthenticated: (user: AuthUser) => void;
};

export default function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user =
        mode === "login"
          ? await loginUser({ email, password })
          : await registerUser({ name, email, password });
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
        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")} type="button">
            <LogIn size={16} /> Sign In
          </button>
          <button className={mode === "register" ? "selected" : ""} onClick={() => setMode("register")} type="button">
            <UserPlus size={16} /> Register
          </button>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
            </label>
          )}
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="primary action" disabled={isSubmitting} type="submit">
            {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isSubmitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}
