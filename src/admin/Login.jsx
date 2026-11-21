import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { LogoMark } from "@/components/Logo";

const Login = ({ onSignIn }) => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return setError("Enter the admin password.");
    setBusy(true);
    setError("");
    try {
      const { token } = await api.login(password);
      onSignIn(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2 bg-bg">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-lime p-12 text-onlime">
        <div aria-hidden="true" className="absolute -right-32 -bottom-32 h-[34rem] w-[34rem] rounded-full border-[4rem] border-onlime/[0.06]" />
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="11" fill="rgb(var(--onlime))" />
            <g fill="rgb(var(--lime))">
              <rect x="9" y="22" width="5.5" height="10" rx="1.2" />
              <rect x="16.5" y="16" width="5.5" height="16" rx="1.2" />
              <path d="M24 32V15.5L26.75 7l2.75 8.5V32z" />
            </g>
          </svg>
          <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.03em]">Dubai Startups Daily</span>
        </div>
        <div className="relative">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-onlime/70">Newsroom CMS</p>
          <p className="mt-4 max-w-[14ch] font-display text-[4rem] font-extrabold leading-[0.92] tracking-[-0.04em]">
            Write it. Publish it. Done.
          </p>
        </div>
        <p className="relative text-[0.85rem] text-onlime/70">Stories you publish here go live on the site straight away.</p>
      </div>

      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link to="/" className="inline-flex items-center gap-1.5 self-start text-[0.85rem] text-muted hover:text-ink transition-colors">
          <ArrowLeft size={15} /> Back to site
        </Link>
        <div className="m-auto w-full max-w-sm py-12">
          <LogoMark size={44} className="lg:hidden" />
          <h1 className="display mt-6 lg:mt-0 text-[2.4rem] leading-none">Sign in</h1>
          <p className="mt-2 text-[0.95rem] text-muted">Enter the admin password to manage stories.</p>

          <form onSubmit={submit} className="mt-8" noValidate>
            <label htmlFor="pw" className="text-[0.85rem] font-semibold text-ink">Password</label>
            <div className="relative mt-2">
              <input
                id="pw"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                aria-invalid={!!error}
                aria-describedby={error ? "pw-err" : undefined}
                className="field pr-12"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-muted hover:text-ink"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p id="pw-err" role="alert" className="mt-2.5 text-[0.85rem] font-medium text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-lime mt-6 w-full group disabled:opacity-60">
              {busy ? "Signing in…" : "Sign in"}
              {!busy && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
