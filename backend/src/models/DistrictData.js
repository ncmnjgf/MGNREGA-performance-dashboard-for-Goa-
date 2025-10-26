import mongoose from "mongoose";

const districtDataSchema = new mongoose.Schema({
  district: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  person_days: { type: Number, default: 0 },
  households: { type: Number, default: 0 },
  funds_spent: { type: Number, default: 0 },
  raw: { type: Object }, // store original API response
  fetched_at: { type: Date, default: Date.now },
});

export default mongoose.model("DistrictData", districtDataSchema);
