import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductModel from './dao/models/product.model.js';
import { connectMongo } from './config/mongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket');

  socket.on('new-product', async (data) => {
    try {
      const newProduct = await ProductModel.create(data);
      io.emit('product-added', newProduct);
    } catch (error) {
      console.error('❌ Error al agregar producto:', error);
    }
  });

  socket.on('delete-product', async (productId) => {
    try {
      await ProductModel.findByIdAndDelete(productId);
      io.emit('product-deleted', productId);
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
    }
  });

  socket.on('update-product', async (data) => {
    try {
      const { id, ...updates } = data;
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
      io.emit('product-updated', updatedProduct);
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
    }
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectMongo();
    console.log('🗄️ Conectado a MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
