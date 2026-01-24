import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true } // snapshot of product price
      }
    ],
    totalAmount: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, default: "cash" }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
