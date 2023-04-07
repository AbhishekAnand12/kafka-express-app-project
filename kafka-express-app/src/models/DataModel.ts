import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  country: {
    type: String,
  },
  gender: {
    type: String,
  },
  eyeColor: {
    type: String,
  },
  favoriteFruit: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  company: {
    title: { type: String },
    email: { type: String },
    phone: { type: String },
    location: {
      country: { type: String },
      address: { type: String },
    },
  },
});

export default mongoose.model("DataModel", DataSchema);
