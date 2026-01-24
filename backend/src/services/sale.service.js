import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

// Add a new sale/order
export const createSale = async ({ products, employee, paymentMethod = "cash" }) => {
  if (!products || products.length === 0) throw new Error("No products provided");

  let totalAmount = 0;

  // Prepare products array with price snapshot and calculate total
  const saleProducts = [];
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for product: ${product.name}`);

    // Reduce product stock
    product.stock -= item.quantity;
    await product.save();

    const price = product.price * item.quantity;
    totalAmount += price;

    saleProducts.push({ product: product._id, quantity: item.quantity, price: product.price });
  }

  const sale = await Sale.create({
    products: saleProducts,
    totalAmount,
    employee,
    paymentMethod
  });

  return sale;
};

// Get all sales (optional date range filter)
export const getSales = async (startDate = null, endDate = null) => {
  let filter = {};
  if (startDate && endDate) {
    filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  return await Sale.find(filter)
    .populate("employee", "name email")
    .populate("products.product", "name price");
};

// Get sale by ID
export const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate("employee", "name email")
    .populate("products.product", "name price");
  if (!sale) throw new Error("Sale not found");
  return sale;
};
