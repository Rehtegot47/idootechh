import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import contactRoute from './routes/contact.js';
import productsRoute from './routes/products.js';
import categoriesRoute from './routes/categories.js';
import ordersRoute from './routes/orders.js';
import adminRoute from './routes/admin.js';
import { testDb } from './db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const CLIENT_URL = process.env.CLIENT_URL || 'https://www.idootech.com.ng';

app.use(helmet());
app.use(cors({ origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({ windowMs: 60_000, max: 60 }));

app.get('/api/health', async (_req, res) => {
  try { await testDb(); res.json({ ok: true, db: true }); } catch (e) { res.status(500).json({ ok: false, db: false, error: e.message }); }
});

app.use('/api/contact', contactRoute);
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/admin', adminRoute);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal error' });
});

app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
