import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import ContentProvider from "@/context/ContentContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import SearchPage from "@/pages/SearchPage";
import AboutPage from "@/pages/AboutPage";
import SetupPage from "@/pages/SetupPage";
import EventsPage from "@/pages/EventsPage";
import JobsPage from "@/pages/JobsPage";

const NotFound = () => (
  <div className="wrap py-24 sm:py-32" data-testid="not-found-page">
    <p
      aria-hidden="true"
      className="font-display text-[8rem] sm:text-[13rem] font-extrabold leading-[0.8] tracking-[-0.07em] text-lime"
      style={{ fontVariationSettings: '"opsz" 40' }}
    >
      404
    </p>
    <h1 className="display mt-6 max-w-[18ch] text-[2.4rem] sm:text-[3.6rem] leading-[0.95]">This page didn’t make the cut.</h1>
    <p className="mt-4 max-w-[30rem] text-[1rem] leading-relaxed text-muted">
      The link may be broken or the story may have moved. Today’s reporting is on the home page.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/" data-testid="not-found-home-link" className="btn-lime">
        <ArrowLeft size={16} /> Back home
      </Link>
      <Link to="/search" className="btn-ghost">Search the archive</Link>
    </div>
  </div>
);

// Re-mounts on path change so each page plays its entrance.
const AnimatedRoutes = () => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-in">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/guides" element={<SetupPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const AdminApp = lazy(() => import("@/admin/AdminApp"));

const Site = () => (
  <ContentProvider>
    <div className="grain flex min-h-[100dvh] flex-col bg-bg text-body">
      <Header />
      <main id="main" className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  </ContentProvider>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<div className="min-h-[100dvh] bg-bg" />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<Site />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
