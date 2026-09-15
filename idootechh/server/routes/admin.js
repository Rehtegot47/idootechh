import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';
import { authMiddleware, signToken } from '../auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../public/store');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedImage = /jpeg|jpg|png|gif|webp/;
    const allowedVideo = /mp4|webm|ogg|mov/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const isImage = allowedImage.test(ext) && allowedImage.test(file.mimetype.replace('image/', ''));
    const isVideo = allowedVideo.test(ext) && (file.mimetype.startsWith('video/') || file.mimetype === 'application/octet-stream');
    cb(null, isImage || isVideo);
  }
});

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

// Upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid type' });
  res.json({ url: `/store/${req.file.filename}` });
});

// Dashboard stats
router.get('/stats', async (_req, res) => {
  try {
    const [[{ productCount }]] = await pool.query('SELECT COUNT(*) as productCount FROM products');
    const [[{ categoryCount }]] = await pool.query('SELECT COUNT(*) as categoryCount FROM categories');
    const [[{ orderCount }]] = await pool.query('SELECT COUNT(*) as orderCount FROM orders');
    const [[{ totalRevenue }]] = await pool.query("SELECT COALESCE(SUM(total),0) as totalRevenue FROM orders WHERE status IN ('paid','shipped','delivered')");
    const [[{ pendingOrders }]] = await pool.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE status='pending'");
    const [[{ messageCount }]] = await pool.query('SELECT COUNT(*) as messageCount FROM messages');
    const [[{ unreadMessages }]] = await pool.query('SELECT COUNT(*) as unreadMessages FROM messages WHERE is_read=0');
    res.json({ productCount, categoryCount, orderCount, totalRevenue, pendingOrders, messageCount, unreadMessages });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── PRODUCTS ───
router.get('/products', async (_req, res) => {
  const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.created_at DESC');
  res.json({ products: rows });
});

router.get('/products/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json({ product: rows[0] });
});

router.post('/products', async (req, res) => {
  const { category_id, slug, name, description, price, stock, image, video_url } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO products (category_id,slug,name,description,price,stock,image,video_url) VALUES (?,?,?,?,?,?,?,?)', [category_id, slug, name, description, price, stock || 0, image || null, video_url || null]);
    res.json({ id: r.insertId });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/products/:id', async (req, res) => {
  const { category_id, slug, name, description, price, stock, image, video_url } = req.body;
  try {
    await pool.query('UPDATE products SET category_id=?,slug=?,name=?,description=?,price=?,stock=?,image=?,video_url=? WHERE id=?', [category_id, slug, name, description, price, stock, image, video_url, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

// ─── CATEGORIES ───
router.get('/categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT c.*, (SELECT COUNT(*) FROM products WHERE category_id=c.id) as product_count FROM categories c ORDER BY c.name');
  res.json({ categories: rows });
});

router.post('/categories', async (req, res) => {
  const { slug, name, description } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO categories (slug,name,description) VALUES (?,?,?)', [slug, name, description || null]);
    res.json({ id: r.insertId });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/categories/:id', async (req, res) => {
  const { slug, name, description } = req.body;
  try {
    await pool.query('UPDATE categories SET slug=?,name=?,description=? WHERE id=?', [slug, name, description || null, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/categories/:id', async (req, res) => {
  const [[{ cnt }]] = await pool.query('SELECT COUNT(*) as cnt FROM products WHERE category_id=?', [req.params.id]);
  if (cnt > 0) return res.status(400).json({ error: `Cannot delete: ${cnt} products still use this category` });
  await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

// ─── ORDERS ───
router.get('/orders', async (_req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  for (const o of orders) {
    const [items] = await pool.query('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?', [o.id]);
    o.items = items;
  }
  res.json({ orders });
});

router.get('/orders/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const [items] = await pool.query('SELECT oi.*, p.name, p.image, p.slug FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?', [req.params.id]);
  res.json({ order: { ...rows[0], items } });
});

router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ ok: true });
});

router.delete('/orders/:id', async (req, res) => {
  await pool.query('DELETE FROM order_items WHERE order_id=?', [req.params.id]);
  await pool.query('DELETE FROM orders WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

// ─── MESSAGES ───
router.get('/messages', async (req, res) => {
  const limit = Math.min(parseInt(String(req.query.limit || 50), 10) || 50, 100);
  const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT ?', [limit]);
  res.json({ messages: rows });
});

router.patch('/messages/:id/read', async (req, res) => {
  await pool.query('UPDATE messages SET is_read=1 WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

router.patch('/messages/:id/unread', async (req, res) => {
  await pool.query('UPDATE messages SET is_read=0 WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

router.delete('/messages/:id', async (req, res) => {
  await pool.query('DELETE FROM messages WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
