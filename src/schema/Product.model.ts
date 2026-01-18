import mongoose, { Schema } from "mongoose";
import { ProductStatus, ProductCollection,   BirdAge, Gender } from "../libs/enums/product.enum";
// import mongoose from "mongoose";

const productSchema = new Schema({
  productStatus: {
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.PAUSE,
  },
  productCollection: {
    type: String,
    enum: ProductCollection,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productLeftCount: {
    type: Number,
    required: true,           // ma'lumotni kiritishini majburiy qiladi   
  },
  productAge: {
    type: String,
    enum: BirdAge,
  },
  productGender: {
    type: String,
    enum: Gender,
  
  },
  productDesc: {
    type: String,
              
  },
    productImages: {
    type: [String],
    default: []       // kiritilmaganda bo'sh arrayni hosil qilsin
  },
  productViews: {
    type: Number,
    default: 0,
  }


},
   {timestamps: true}   // updatedAt va createdAt ni olib beradi
);



productSchema.index(
    { productName: 1, productAge: 1, productGender: 1},
    {unique: true}
)
export default mongoose.model("Product",  productSchema);
