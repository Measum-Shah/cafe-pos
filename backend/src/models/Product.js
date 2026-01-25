import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subCategory: { type: String, default: "" },

    price: { type: Number, required: true },

    image: { type: String, default: "" },

    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
