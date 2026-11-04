'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardShell({ user, children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close mobile drawer when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-w-0 w-full">
      {/* Sidebar - Desktop Sticky + Mobile Slide Drawer */}
      <DashboardSidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden pb-16 md:pb-0">
        <DashboardHeader
          user={user}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          mobileSidebarOpen={mobileSidebarOpen}
        />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
