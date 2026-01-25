import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Package, Search, Image as ImageIcon, DollarSign, Layers } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category: "", subCategory: "", image: "" });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) { console.error(err); setProducts([]); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        price: product.price,
        category: product.category?._id || "",
        subCategory: product.subCategory || "",
        image: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setForm({ name: "", price: "", category: "", subCategory: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      editingProduct ? await updateProduct(editingProduct._id, payload) : await createProduct(payload);
      fetchProducts();
      closeModal();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete this product?")) {
      try { await deleteProduct(id); fetchProducts(); } catch (err) { console.error(err); }
    }
  };

  return (
    <PageWrapper 
      title="Inventory Management" 
      actions={<Button onClick={() => openModal()} icon={Plus}>Add New Product</Button>}
    >
      {/* STATS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Input icon={Search} placeholder="Search by name, category, or SKU..." className="bg-[var(--color-bg-card)]" />
        </div>
        <div className="flex gap-4">
          <div className="bg-[var(--color-bg-card)] px-6 py-2 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
             <Package size={18} className="text-[var(--color-primary)]" />
             <span className="text-sm font-bold">{products.length} Products</span>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border-2 border-dashed border-[var(--color-border)] rounded-3xl p-20 text-center">
          <Package size={64} className="mx-auto mb-4 opacity-10" />
          <p className="text-[var(--color-text-secondary)]">Your inventory is empty.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-bg-light)]/50 border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Preview</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-[var(--color-bg-light)]/40 transition-all group">
                  <td className="px-6 py-4 w-32">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--color-bg-light)] border border-[var(--color-border)] shadow-inner">
                      {p.image ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
                          <ImageIcon size={24} opacity={0.3} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[var(--color-text-primary)] font-bold text-lg">{p.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                          {p.category?.name || "Uncategorized"}
                        </span>
                        {p.subCategory && (
                          <span className="text-[var(--color-text-secondary)] text-xs font-medium">
                            • {p.subCategory}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xl font-black text-[var(--color-success)]">Rs {p.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(p)} className="p-2 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] rounded-lg transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-500/10 hover:text-[var(--color-danger)] rounded-lg transition-colors">
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

      {/* MODAL: ADD / EDIT PRODUCT */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProduct ? "Update Product Details" : "Add New Product to Catalog"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>Discard</Button>
            <Button onClick={handleSubmit}>{editingProduct ? "Update Changes" : "Save Product"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input label="Full Product Name" name="name" value={form.name} onChange={handleChange} icon={Package} required />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full bg-[var(--color-bg-light)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl p-2.5 focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>

          <Input label="Price (USD)" name="price" type="number" value={form.price} onChange={handleChange} icon={DollarSign} required />
          
          <Input label="Sub Category" name="subCategory" value={form.subCategory} onChange={handleChange} icon={Layers} />
          
          <Input label="Image URL" name="image" value={form.image} onChange={handleChange} icon={ImageIcon} />

          {form.image && (
            <div className="md:col-span-2 p-2 bg-[var(--color-bg-light)] rounded-2xl border border-[var(--color-border)]">
              <p className="text-[10px] uppercase font-bold text-[var(--color-text-secondary)] mb-2 px-1">Live Preview</p>
              <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
            </div>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Products;