import mongoose from "mongoose";
const ProductSchema = mongoose.Schema({
  pname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Productdemos = mongoose.model("productlist", ProductSchema);
export default Productdemos;
