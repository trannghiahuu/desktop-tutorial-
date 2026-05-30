/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GeometryWorkspace from './components/GeometryWorkspace';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'workspace'>('home');

  return (
    <div className="min-h-screen font-sans">
      {currentView === 'home' ? (
        <LandingPage onStartTool={() => setCurrentView('workspace')} />
      ) : (
        <GeometryWorkspace onBackToHome={() => setCurrentView('home')} />
      )}
    </div>
  );
}

