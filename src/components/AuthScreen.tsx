import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { ApiError, AuthUser, loginUser } from "../api/auth";

type Props = {
  onAuthenticated: (user: AuthUser) => void;
};

const joinUrl =
  "https://wowlifeworld.net/landing?from=https%3A%2F%2Fwowlifeworld.net%2Fplans%2F1973670%3Fbundle_token%3Df877d02dc91405c16000e38cd734fdc3%26utm_source%3Dmanual";

export default function AuthScreen({ onAuthenticated }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isMemberError, setIsMemberError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsMemberError(false);
    setIsSubmitting(true);
    try {
      const user = await loginUser({ email });
      onAuthenticated(user);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "member_not_found") {
        setIsMemberError(true);
      }
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
          {isMemberError ? (
            <div className="auth-error member-error">
              <p>Hi! It looks like you&rsquo;re not currently a member of WOWLife Deep Dives.</p>
              <p>
                No worries — you can join here:{" "}
                <a href={joinUrl} target="_blank" rel="noreferrer">
                  Link
                </a>
              </p>
              <p>
                If you&rsquo;re already a member, you may be using a different email address. Please try logging in with
                the same email you used to register on Mighty Networks, and everything should work smoothly.
              </p>
            </div>
          ) : (
            error && <p className="auth-error">{error}</p>
          )}
          <button className="primary action" disabled={isSubmitting} type="submit">
            <LogIn size={18} />
            {isSubmitting ? "Please wait..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
