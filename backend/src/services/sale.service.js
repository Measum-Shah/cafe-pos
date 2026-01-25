import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Create a new sale and save receipt PDF
export const createSale = async ({
  items,
  employee,
  discount = 0,
  paymentMethod = "cash",
}) => {
  if (!items || items.length === 0) {
    throw new Error("No products provided");
  }

  let totalAmount = 0;
  const saleItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    saleItems.push({
      product: product._id,
      name: product.name,      // snapshot
      quantity: item.quantity,
      price: product.price,    // snapshot
    });
  }

  const finalAmount = Math.max(0, totalAmount - discount);

  const sale = await Sale.create({
    items: saleItems,
    totalAmount: finalAmount,
    discount,
    employee,
    paymentMethod,
  });

  // ---------- Generate PDF receipt ----------
  // Folder path
  const receiptsDir = path.join("uploads", "receipts");
  if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

  // Generate filename: YYYY-MM-DD-<N>.pdf
  const dateStr = new Date().toISOString().slice(0, 10); // e.g., 2026-01-25

  // Count existing receipts for today to increment
  const existingFiles = fs.readdirSync(receiptsDir)
    .filter(f => f.startsWith(dateStr) && f.endsWith(".pdf"));
  const nextNumber = existingFiles.length + 1;

  const filename = `${dateStr}-${nextNumber}.pdf`;
  const filePath = path.join(receiptsDir, filename);

  // Create PDF
  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("POS Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`);
  doc.text(`Employee ID: ${employee}`);
  doc.moveDown();

  doc.text("Items:");
  saleItems.forEach((item, idx) => {
    doc.text(
      `${idx + 1}. ${item.name} x ${item.quantity} @ ${item.price} = ${item.quantity * item.price}`
    );
  });
  doc.moveDown();
  doc.text(`Subtotal: ${totalAmount}`);
  doc.text(`Discount: ${discount}`);
  doc.text(`Total: ${finalAmount}`);

  doc.end();

  // Attach the PDF path to the sale object for reference (optional)
  sale.receiptPath = filePath;

  return sale;
};

// Get all sales (optional date filter)
export const getSales = async (params = {}) => {
  try {
    const { startDate, endDate } = params;
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const sales = await Sale.find(filter)
      .populate({ path: "employee", select: "name email", strictPopulate: false })
      .populate({ path: "items.product", select: "name price", strictPopulate: false })
      .sort({ createdAt: -1 });

    return sales.map((s) => ({
      _id: s._id,
      totalAmount: s.totalAmount,
      discount: s.discount,
      paymentMethod: s.paymentMethod,
      items: s.items.map((i) => ({
        name: i.name || i.product?.name || "Unknown",
        quantity: i.quantity,
        price: i.price || i.product?.price || 0,
      })),
      quantity: s.items.reduce((acc, i) => acc + i.quantity, 0),
      employeeName: s.employee?.name || "Unknown",
      createdAt: s.createdAt,
    }));
  } catch (err) {
    console.error("getSales ERROR:", err);
    throw new Error("Failed to fetch sales");
  }
};



// Get single sale by ID
export const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate("employee", "name email")
    .populate("items.product", "name price");

  if (!sale) {
    throw new Error("Sale not found");
  }

  return sale;
};
