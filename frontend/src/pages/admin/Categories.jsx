import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  Layers, 
  Search, 
  FolderOpen, 
  MoreHorizontal,
  AlertCircle
} from "lucide-react"; 
import PageWrapper from "../../components/layout/PageWrapper";
import { getCategories, createCategory, deleteCategory } from "../../api/category.api";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      // Adjust based on your API response structure
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = () => {
    setForm({ name: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name: form.name });
      fetchCategories();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error creating category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? All linked products will lose their category tag.")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter categories for the search bar UX
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper 
      title="Categories" 
      actions={
        <Button onClick={openModal} icon={Plus}>
          New Category
        </Button>
      }
    >
      {/* 1. TOP STATS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Input 
            icon={Search} 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[var(--color-bg-card)] border-[var(--color-border)]"
          />
        </div>
        <div className="bg-[var(--color-bg-card)] px-6 py-2 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
          <Layers size={18} className="text-[var(--color-primary)]" />
          <span className="text-sm font-bold">{categories.length} Total</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border-2 border-dashed border-[var(--color-border)] rounded-3xl p-16 text-center">
          <FolderOpen size={48} className="mx-auto mb-4 text-[var(--color-text-secondary)] opacity-20" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No Categories Found</h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first category."}
          </p>
          {!searchTerm && <Button onClick={openModal} variant="secondary" icon={Plus}>Create Category</Button>}
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-light)]/50 border-b border-[var(--color-border)]">
                <th className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                  Category Name
                </th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                  ID / Reference
                </th>
                <th className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="hover:bg-[var(--color-bg-light)]/40 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-[var(--color-text-primary)] text-lg tracking-tight">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-[10px] bg-[var(--color-bg-light)] px-2 py-1 rounded text-[var(--color-text-secondary)] font-mono uppercase">
                      {cat._id.slice(-6)}
                    </code>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        className="p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-light)] rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. MODAL: ADD CATEGORY */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Create New Category"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button onClick={handleSubmit} icon={Layers}>Save Category</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-blue-400 shrink-0" size={20} />
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Categories help organize your menu. Once created, you can assign this category to your products in the Inventory tab.
            </p>
          </div>
          
          <Input
            label="Category Name"
            name="name"
            placeholder="e.g. Desserts, Coffee, Merchandise"
            value={form.name}
            onChange={handleChange}
            icon={Layers}
            required
            autoFocus
          />
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Categories;