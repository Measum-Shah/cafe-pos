import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-bg-light)]/50">
          <h3 className="font-bold text-lg text-[var(--color-text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[var(--color-bg-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-light)]/30 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;