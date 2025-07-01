import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  thumbnail: String
});

// APLICÁS EL PLUGIN
productSchema.plugin(mongoosePaginate);

// USÁS mongoose.model
const ProductModel = mongoose.model('Product', productSchema);

// EXPORTÁS
export default ProductModel;
