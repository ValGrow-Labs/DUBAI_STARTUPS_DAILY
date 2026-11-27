import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

// Google Search Console verification & GA4 analytics hooks
const gscCode = import.meta.env.VITE_GSC_VERIFICATION;
if (gscCode && !document.querySelector('meta[name="google-site-verification"]')) {
  const meta = document.createElement("meta");
  meta.name = "google-site-verification";
  meta.content = gscCode;
  document.head.appendChild(meta);
}

const gaId = import.meta.env.VITE_GA_ID;
if (gaId && !document.querySelector(`script[src*="${gaId}"]`)) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, { send_page_view: true });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
