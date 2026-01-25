import React, { useEffect, useState } from "react";
import { 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  User as UserIcon, 
  Search, 
  ShieldAlert, 
  KeyRound,
  MoreVertical
} from "lucide-react"; 
import PageWrapper from "../../components/layout/PageWrapper";
import { getUsers, createUser } from "../../api/user.api";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = () => {
    setForm({ name: "", email: "", password: "", role: "employee" });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper 
      title="Staff Management" 
      actions={
        <Button onClick={openModal} icon={UserPlus}>Add New Staff</Button>
      }
    >
      {/* SEARCH AND FILTERS */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            icon={Search} 
            placeholder="Search staff by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[var(--color-bg-card)]"
          />
        </div>
        <div className="flex gap-2">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-2 rounded-xl flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--color-success)]" />
                <span className="text-xs font-bold uppercase tracking-tighter">Active System</span>
            </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border-2 border-dashed border-[var(--color-border)] rounded-3xl p-20 text-center">
          <UserIcon size={48} className="mx-auto mb-4 opacity-10" />
          <p className="text-[var(--color-text-secondary)]">No staff members found.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-light)]/50 border-b border-[var(--color-border)]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Member</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Role</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Access Level</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-[var(--color-bg-light)]/40 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--color-text-primary)]">{u.name}</span>
                        <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                          <Mail size={12} /> {u.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      u.role === 'admin' 
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                        {u.role === 'admin' ? <ShieldAlert size={14} className="text-[var(--color-danger)]" /> : <ShieldCheck size={14} className="text-[var(--color-success)]" />}
                        {u.role === 'admin' ? 'Full System Access' : 'POS Terminal Only'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[var(--color-bg-light)] rounded-lg transition-colors text-[var(--color-text-secondary)]">
                        <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD USER MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Register New Staff Member"
        footer={
            <>
                <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button onClick={handleSubmit} icon={UserPlus}>Create Account</Button>
            </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Jane Doe"
            value={form.name}
            onChange={handleChange}
            icon={UserIcon}
            required
          />
          <Input
            label="Work Email"
            name="email"
            placeholder="jane@cafepos.com"
            type="email"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
            required
          />
          <Input
            label="Temporary Password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={form.password}
            onChange={handleChange}
            icon={KeyRound}
            required
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Access Role</label>
            <div className="relative">
                <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full appearance-none p-3 rounded-xl bg-[var(--color-bg-light)] text-[var(--color-text-primary)] border border-[var(--color-border)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all"
                >
                <option value="admin">Administrator (Full Control)</option>
                <option value="employee">Employee (POS Access Only)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ShieldCheck size={18} className="text-[var(--color-text-secondary)]" />
                </div>
            </div>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default Users;