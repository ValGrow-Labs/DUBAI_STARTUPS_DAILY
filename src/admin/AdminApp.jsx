import { useEffect } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { ArrowUpRight, LogOut } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { useTheme } from "@/context/ThemeContext";
import { useSession } from "./useAdmin";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Editor from "./Editor";

const AdminBar = ({ onSignOut }) => {
  const { isDark, toggleTheme } = useTheme();
  const tab = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-[0.85rem] font-medium transition-colors ${isActive ? "bg-ink text-bg" : "text-body hover:text-ink hover:bg-ink/[0.06]"}`;
  return (
    <header className="sticky top-0 z-header border-b hairline bg-bg/80 backdrop-blur-xl">
      <div className="wrap flex h-16 items-center gap-4">
        <Link to="/admin" className="group flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="font-display text-[1rem] font-extrabold tracking-[-0.03em] text-ink">DSD</span>
          <span className="rounded-full bg-raised px-2 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.08em] text-muted">CMS</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 ml-4" aria-label="Admin">
          <NavLink to="/admin" end className={tab}>Stories</NavLink>
          <NavLink to="/admin/new" className={tab}>New story</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={toggleTheme} className="hidden sm:inline-flex h-9 items-center rounded-full px-3 text-[0.82rem] text-muted hover:bg-raised hover:text-ink">
            {isDark ? "Light" : "Dark"} mode
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-[0.82rem] font-semibold text-ink hover:bg-raised">
            View site <ArrowUpRight size={14} />
          </a>
          <button type="button" onClick={onSignOut} aria-label="Sign out" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.82rem] text-muted hover:bg-raised hover:text-ink">
            <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const AdminApp = () => {
  const { status, signIn, signOut } = useSession();

  useEffect(() => {
    document.title = "CMS · Dubai Startups Daily";
    return () => {
      document.title = "Dubai Startups Daily";
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bg">
        <LogoMark size={44} className="animate-pulse" />
      </div>
    );
  }
  if (status !== "in") return <Login onSignIn={signIn} />;

  return (
    <div className="min-h-[100dvh] bg-bg text-body" data-testid="admin-app">
      <AdminBar onSignOut={signOut} />
      <main className="page-in">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="new" element={<Editor key="new" />} />
          <Route path="edit/:slug" element={<Editor />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminApp;
