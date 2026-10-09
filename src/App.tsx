import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import { ThemeProvider } from "next-themes";
import ThemeMetadata from "./components/ThemeMetadata";
const Contact = lazy(() => import("./pages/Contact"));
const Impressum = lazy(() => import("./pages/legal/impressum"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/legal/privacy_policy"));
const TermsAndConditions = lazy(
  () => import("./pages/legal/terms_and_conditions"),
);

const basePath = import.meta.env.VITE_BASE_URL || "/";

const App = () => {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      storageKey="appsolves-theme"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeMetadata />
      <BrowserRouter>
        <Suspense
          fallback={
            <p className="route-loading" role="status">
              Loading page…
            </p>
          }
        >
          <Routes>
            <Route path={basePath} element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/privacy_policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms_and_conditions"
              element={<TermsAndConditions />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
