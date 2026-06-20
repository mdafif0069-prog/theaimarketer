import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav.jsx';

// Layout for the primary tabs: a scrollable screen area above a fixed bottom nav.
export function MainLayout() {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
