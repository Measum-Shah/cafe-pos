import React from "react";
import Navbar from "./Navbar";

const PageWrapper = ({ children, title, actions }) => {
  return (
    <div className="flex h-screen w-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)] overflow-hidden font-sans">
      {/* Global Vertical Navbar (The 24-unit wide Icon Bar) */}
      <Navbar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col ml-24 overflow-hidden relative">
        
        {/* Subtle Brand Glow - Desktop Aesthetic */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

        {/* Top Header Bar - Gives it a "Window" feel */}
        {(title || actions) && (
          <header className="h-20 flex items-center justify-between px-8 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/50 backdrop-blur-md z-20">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {actions}
            </div>
          </header>
        )}

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <div className="p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default PageWrapper;