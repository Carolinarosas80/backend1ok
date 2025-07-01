import express from 'express';
import ProductModel from '../dao/models/product.model.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener productos paginados
router.get('/paginated', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await ProductModel.paginate({}, { page, limit, sort: { price: -1 } });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos paginados' });
  }
});

export default router;
