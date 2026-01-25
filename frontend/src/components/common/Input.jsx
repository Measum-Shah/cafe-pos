import React from "react";

const Input = ({ label, icon: Icon, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          {...props}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl
            bg-[var(--color-bg-light)] text-[var(--color-text-primary)] 
            border border-[var(--color-border)] 
            hover:border-[var(--color-text-secondary)]
            focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10
            transition-all placeholder:text-[var(--color-text-secondary)]/50
            ${className}
          `}
        />
      </div>
    </div>
  );
};

export default Input;