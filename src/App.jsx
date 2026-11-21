import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import SearchPage from "@/pages/SearchPage";
import AboutPage from "@/pages/AboutPage";

const NotFound = () => (
  <div className="max-w-3xl mx-auto px-6 py-24 text-center" data-testid="not-found-page">
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold dark:text-goldlight">Error 404</p>
    <h1 className="font-headline font-black text-5xl mt-3 text-ink dark:text-white">Page not found</h1>
    <p className="mt-4 text-slate-600 dark:text-slate-400">The story you are looking for has moved, or never made print.</p>
    <Link
      to="/"
      data-testid="not-found-home-link"
      className="mt-8 inline-flex items-center gap-2 border border-ink dark:border-white/20 px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-ink dark:text-white hover:bg-ink hover:text-gold dark:hover:bg-gold dark:hover:text-ink transition-colors duration-200"
    >
      Back to the front page
    </Link>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-ivory dark:bg-navy-950 text-ink dark:text-slate-100 font-body flex flex-col selection:bg-gold selection:text-ink transition-colors duration-250">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
