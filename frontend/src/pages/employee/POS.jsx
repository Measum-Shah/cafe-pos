import React, { useEffect, useState } from "react";
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, 
  CreditCard, Banknote, RotateCcw, Receipt, 
  Layers, CheckCircle2
} from "lucide-react";

import PageWrapper from "../../components/layout/PageWrapper";
import { getProducts } from "../../api/product.api";
import { createSale } from "../../api/sales.api";
import { getCategories } from "../../api/category.api";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { Toaster, toast } from "react-hot-toast";

const POS = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  /* ---------------- FETCH DATA ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      const prods = Array.isArray(prodRes) ? prodRes : prodRes.products || [];
      const cats  = Array.isArray(catRes)  ? catRes  : catRes.categories || [];

      setProducts(prods);
      setFilteredProducts(prods);
      setCategories(cats);

    } catch (err) {
      toast.error("System sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ---------------- FILTERING ---------------- */

  useEffect(() => {
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter(
        p => p.category?._id === activeCategory
      );
    }

    if (search) {
      result = result.filter(
        p => p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [search, activeCategory, products]);

  /* ---------------- CART ---------------- */

  const addToCart = (product) => {
    const existing = cart.find(p => p._id === product._id);

    if (existing) {
      setCart(
        cart.map(p =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart.map(p => {
        if (p._id === id) {
          const q = p.quantity + delta;
          return q > 0 ? { ...p, quantity: q } : p;
        }
        return p;
      })
    );
  };

  const subtotal = cart.reduce(
    (sum, p) => sum + p.price * p.quantity, 0
  );

  const total = Math.max(0, subtotal - Number(discount || 0));

  /* ---------------- PAYMENT ---------------- */

  const handlePay = async () => {

    if (!cart.length)
      return toast.error("Cart is empty");

    const payload = {
      items: cart.map(p => ({
        product: p._id,
        quantity: p.quantity
      })),
      discount: Number(discount || 0),
      paymentMethod
    };

    try {
      const res = await createSale(payload);
      setCart([]);
      setDiscount(0);

      toast.success("Sale Completed");

      window.open(
        `http://localhost:5000/${res.sale.receiptPath}`,
        "_blank"
      );

    } catch {
      toast.error("Payment Failed");
    }
  };

  /* ====================================================== */

  return (
    <PageWrapper>

      <Toaster position="bottom-center" />

      <div className="flex h-[calc(100vh-140px)] gap-6">

        {/* ================= CATEGORIES ================= */}

        <aside className="w-24 flex flex-col gap-4 overflow-y-auto pr-2">

          <button
            onClick={() => setActiveCategory("all")}
            className={`min-h-[80px] rounded-2xl border flex flex-col items-center justify-center
            ${activeCategory === "all"
              ? "bg-[#d4af37] text-black"
              : "bg-[#1a1a1a] text-gray-500 border-[#2a2a2a]"
            }`}
          >
            <Layers size={22}/>
            <span className="text-[10px] mt-2 font-black">ALL</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`min-h-[80px] rounded-2xl border flex items-center justify-center text-xs font-black
              ${activeCategory === cat._id
                ? "bg-[#d4af37] text-black"
                : "bg-[#1a1a1a] text-gray-500 border-[#2a2a2a]"
              }`}
            >
              {cat.name}
            </button>
          ))}

        </aside>

        {/* ================= PRODUCTS ================= */}

        <div className="flex-1 flex flex-col">

          <Input
            icon={Search}
            placeholder="Search product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-6 bg-[#1a1a1a]"
          />

          {loading ? <Loader /> : (

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">

              {filteredProducts.map(p => (

                <div
                  key={p._id}
                  onClick={() => addToCart(p)}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden cursor-pointer hover:border-[#d4af37]"
                >

                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.image || "https://via.placeholder.com/300"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">

                    <h3 className="font-bold text-white mb-1">
                      {p.name}
                    </h3>

                    {/* 🔥 CATEGORY + SUBCATEGORY */}
                    <div className="flex flex-wrap gap-2">

                      {p.category?.name && (
                        <span className="bg-[#d4af37]/20 text-[#d4af37] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          {p.category.name}
                        </span>
                      )}

                      {p.subCategory && (
                        <span className="border border-gray-600 text-gray-400 text-[10px] px-2 py-0.5 rounded-full uppercase">
                          {p.subCategory}
                        </span>
                      )}

                    </div>

                    <p className="mt-3 font-black text-[#d4af37]">
                      Rs. {p.price}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= CART ================= */}

        <aside className="w-[380px] bg-[#121212] border border-[#2a2a2a] rounded-3xl flex flex-col">

          <div className="p-5 border-b border-[#2a2a2a] flex justify-between">

            <div className="flex items-center gap-2">
              <ShoppingCart size={18}/>
              <span className="font-black">CURRENT SALE</span>
            </div>

            <button onClick={() => setCart([])}>
              <RotateCcw size={18}/>
            </button>

          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {cart.map(p => (

              <div key={p._id} className="bg-[#1a1a1a] p-3 rounded-xl flex gap-3">

                <div className="flex-1">

                  <p className="font-bold">{p.name}</p>

                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    {p.category?.name}
                    {p.subCategory && ` • ${p.subCategory}`}
                  </div>

                  <div className="flex items-center gap-3 mt-2">

                    <button onClick={() => updateQuantity(p._id,-1)}><Minus size={14}/></button>
                    <span>{p.quantity}</span>
                    <button onClick={() => updateQuantity(p._id,1)}><Plus size={14}/></button>

                  </div>

                </div>

                <p className="font-black text-[#d4af37]">
                  Rs. {p.price * p.quantity}
                </p>

                <button onClick={() => setCart(cart.filter(i => i._id !== p._id))}>
                  <Trash2 size={16}/>
                </button>

              </div>

            ))}

          </div>

          <div className="p-6 border-t border-[#2a2a2a]">

            <div className="flex justify-between mb-4">
              <span>Total</span>
              <span className="text-2xl font-black text-[#d4af37]">Rs. {total}</span>
            </div>

            <Button
              className="w-full bg-[#d4af37] text-black"
              onClick={handlePay}
            >
              CONFIRM PAYMENT
            </Button>

          </div>

        </aside>

      </div>

    </PageWrapper>
  );
};

export default POS;
