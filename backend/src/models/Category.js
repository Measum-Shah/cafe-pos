import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null // null for main category, ObjectId for subcategory
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", categorySchema);
