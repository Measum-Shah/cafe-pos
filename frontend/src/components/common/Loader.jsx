import React from "react";

const Loader = ({ fullPage = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-[var(--color-primary)]/20 rounded-full"></div>
        {/* Spinning Part */}
        <div className="absolute inset-0 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <span className="text-xs font-medium text-[var(--color-text-secondary)] animate-pulse">Processing...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[var(--color-bg-main)]/80 backdrop-blur-sm z-[100] flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8 w-full">{loaderContent}</div>;
};

export default Loader;