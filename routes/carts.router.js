import express from 'express';
import CartModel from '../dao/models/cart.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const carts = await CartModel.find().populate('products.product');
  res.json(carts);
});

export default router;
