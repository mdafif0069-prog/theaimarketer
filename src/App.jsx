import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { DeviceFrame } from './components/DeviceFrame.jsx';
import { MainLayout } from './components/MainLayout.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { useApp } from './context/AppContext.jsx';

const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Feed = lazy(() => import('./pages/Feed.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const AskAI = lazy(() => import('./pages/AskAI.jsx'));
const MyProfile = lazy(() => import('./pages/MyProfile.jsx'));
const ScholarProfile = lazy(() => import('./pages/ScholarProfile.jsx'));

function Loader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-emerald2" />
    </div>
  );
}

// Sends first-time users through onboarding; returning users to the feed.
function Root() {
  const { onboarded } = useApp();
  return onboarded ? <Navigate to="/feed" replace /> : <Onboarding />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <DeviceFrame>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/scholar/:id" element={<ScholarProfile />} />
            <Route element={<MainLayout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/search" element={<Search />} />
              <Route path="/ai" element={<AskAI />} />
              <Route path="/me" element={<MyProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </DeviceFrame>
    </ErrorBoundary>
  );
}
