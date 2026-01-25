import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck, Terminal } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      const userRole = JSON.parse(localStorage.getItem("user"))?.role;
      if (userRole === "admin") navigate("/admin");
      else navigate("/pos");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-main)] text-[var(--color-text-primary)] font-sans select-none">
      
      {/* LEFT SIDE: Professional System Identity */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0a0f1d] border-r border-[var(--color-border)] flex-col justify-between p-16 relative overflow-hidden">
        
        {/* Subtle Geometric Pattern (Professional touch instead of glow) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-lg">
              <Terminal size={22} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              Digizone<span className="text-[var(--color-primary)]">.</span>
            </span>
          </div>
          
          <h1 className="text-5xl font-black leading-tight tracking-tight mb-6">
            Enterprise <br />
            <span className="text-[var(--color-text-secondary)]">Terminal Access.</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed max-w-sm">
            Professional grade point-of-sale infrastructure. Secure, fast, and unified.
          </p>
        </div>

        <div className="z-10 border-l-2 border-[var(--color-primary)] pl-6">
          <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-[0.3em] mb-2">Network Status</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              SYSTEM OPERATIONAL
            </div>
            <span className="text-[var(--color-border)]">|</span>
            <div className="text-xs font-semibold text-[var(--color-text-secondary)]">
              GOLDEN ICE-CREAM
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Clean Auth Interface */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-bg-main)]">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-1">System Login</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Authorization required for terminal entry.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wide">
              <Lock size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                label="Operator Identification"
                type="email"
                placeholder="operator@digizone.sys"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0f172a]/50"
              />
            </div>

            <div className="space-y-2">
              <Input
                label="Security Key"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0f172a]/50"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={18} />
                    Verifying...
                  </div>
                ) : (
                  "Initiate Session"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between items-center">
             <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                &copy; Digizone Systems 2026
             </div>
             <div className="flex gap-4">
                <ShieldCheck size={16} className="text-[var(--color-border)]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;