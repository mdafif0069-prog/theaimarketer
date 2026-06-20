import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-extrabold noor-text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">This page wandered off</h1>
      <p className="mt-2 max-w-md text-noor-muted">
        The page you're looking for doesn't exist. Let's get you back to the light.
      </p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
