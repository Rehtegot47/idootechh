import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware, signToken } from '../auth.js';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@idootech.com.ng';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'info@idootech132';
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ email });
  res.json({ token });
});

// Protected routes below
router.use(authMiddleware);

router.get('/messages', async (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit || 50),10)||50,100);
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT ?', [limit]);
  res.json({ messages: rows });
});

router.get('/orders', async (_req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  for (const o of orders) {
    const [items] = await pool.query('SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?', [o.id]);
    o.items = items;
  }
  res.json({ orders });
});

router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ ok: true });
});

router.post('/products', async (req, res) => {
  const { category_id, slug, name, description, price, stock, image } = req.body;
  const [r] = await pool.query('INSERT INTO products (category_id,slug,name,description,price,stock,image) VALUES (?,?,?,?,?,?,?)', [category_id,slug,name,description,price,stock||0,image||null]);
  res.json({ id: r.insertId });
});

router.put('/products/:id', async (req, res) => {
  const { category_id, slug, name, description, price, stock, image } = req.body;
  await pool.query('UPDATE products SET category_id=?,slug=?,name=?,description=?,price=?,stock=?,image=? WHERE id=?', [category_id,slug,name,description,price,stock,image,req.params.id]);
  res.json({ ok: true });
});

router.delete('/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

router.get('/products', async (_req, res) => {
  const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.created_at DESC');
  res.json({ products: rows });
});

router.post('/categories', async (req, res) => {
  const { slug, name, description } = req.body;
  const [r] = await pool.query('INSERT INTO categories (slug,name,description) VALUES (?,?,?)', [slug,name,description||null]);
  res.json({ id: r.insertId });
});

router.get('/categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  res.json({ categories: rows });
});

export default router;
