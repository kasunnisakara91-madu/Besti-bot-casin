import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "General"
    },

    description: {
      type: String,
      default: ""
    },

    code: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Case ||
  mongoose.model("Case", CaseSchema);
