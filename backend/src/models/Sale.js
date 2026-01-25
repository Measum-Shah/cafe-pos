import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true }, // snapshot of product name
        quantity: { type: Number, required: true },
        price: { type: Number, required: true } // snapshot of product price
      }
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // discount applied to sale
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, default: "cash" }, // optional, default cash
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
