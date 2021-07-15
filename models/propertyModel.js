import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
  {
    createorId: { type: mongoose.Types.ObjectId, required: true },
    creatorName: { type: String, required: true },
    creatorMobile: { type: Number, required: true },
    identity: { type: String, required: true },
    purpose: { type: String, required: true },
    propType: { type: String, required: true },
    available: String,
    bedrooms: Number,
    balconies: Number,
    floorNo: Number,
    totalFloors: Number,
    bathrooms: Number,
    kitchens: Number,
    area: Number,
    location: String,
    furnished: String,
    rentDetails: {
      rent: Number,
      securityDeposit: Number,
      maintenance: Number,
    },
    saleDetaails: {
      expectedPrice: Number,
      pricePerSqFt: Number,
    },
    photos: [],
  },
  { timestamps: true }
);

export default mongoose.model("Properties", propertySchema);
