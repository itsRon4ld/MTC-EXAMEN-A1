'use client';

import React from 'react';
import { BottomNav } from './BottomNav';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-shell">
      {children}
      <BottomNav />
    </div>
  );
};
