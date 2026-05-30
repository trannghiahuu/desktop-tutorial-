/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GeometryWorkspace from './components/GeometryWorkspace';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'workspace'>('home');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const handleBackToHome = (section?: string) => {
    if (section) {
      setScrollTarget(section);
    }
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen font-sans">
      {currentView === 'home' ? (
        <LandingPage 
          onStartTool={() => setCurrentView('workspace')} 
          scrollTarget={scrollTarget}
          onClearScrollTarget={() => setScrollTarget(null)}
        />
      ) : (
        <GeometryWorkspace onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}

