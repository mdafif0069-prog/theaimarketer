import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Layout } from './components/Layout.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { AskProvider } from './context/AskContext.jsx';
import { RequireAuth, RequireProfile } from './components/guards.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Browse = lazy(() => import('./pages/Browse.jsx'));
const Detail = lazy(() => import('./pages/Detail.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Player = lazy(() => import('./pages/Player.jsx'));
const Profiles = lazy(() => import('./pages/Profiles.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Plans = lazy(() => import('./pages/Plans.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-noor-gold" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AskProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public marketing landing (no app chrome) */}
            <Route path="/welcome" element={<Landing />} />

            {/* Auth + profile selection (no app chrome) */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/profiles"
              element={
                <RequireAuth>
                  <Profiles />
                </RequireAuth>
              }
            />

            {/* Full-screen player */}
            <Route
              path="/watch/:slug"
              element={
                <RequireProfile>
                  <Player />
                </RequireProfile>
              }
            />

            {/* Main app shell */}
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <RequireProfile>
                    <Home />
                  </RequireProfile>
                }
              />
              <Route
                path="/browse"
                element={
                  <RequireProfile>
                    <Browse />
                  </RequireProfile>
                }
              />
              <Route
                path="/browse/:category"
                element={
                  <RequireProfile>
                    <Browse />
                  </RequireProfile>
                }
              />
              <Route
                path="/title/:slug"
                element={
                  <RequireProfile>
                    <Detail />
                  </RequireProfile>
                }
              />
              <Route
                path="/search"
                element={
                  <RequireProfile>
                    <Search />
                  </RequireProfile>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireProfile>
                    <Settings />
                  </RequireProfile>
                }
              />
              <Route path="/plans" element={<Plans />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </AskProvider>
    </ErrorBoundary>
  );
}
