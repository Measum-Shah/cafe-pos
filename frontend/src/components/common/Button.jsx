import React from "react";

const Button = ({ children, className, icon: Icon, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-md shadow-purple-500/10",
    secondary: "bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)]",
    danger: "bg-[var(--color-danger)] hover:opacity-90 text-white",
  };

  return (
    <button
      {...props}
      className={`
        flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl 
        font-medium transition-all active:scale-[0.98] 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-main)]
        ${variants[variant]} ${className}
      `}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;