const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
  {
    food: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: { type: Number, required: true },
    carbbohydrates: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
  },
  { timestamps: true }
);

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;
