import express from 'express';
import ProductModel from '../dao/models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await ProductModel.find();
  res.render('home', { products });
});

export default router;
