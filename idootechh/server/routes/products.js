import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Public: list products with category
router.get('/', async (req, res) => {
  const category = String(req.query.category || '').trim();
  const search = String(req.query.search || '').trim();
  let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE 1=1`;
  const params = [];
  if (category) { sql += ' AND c.slug=?'; params.push(category); }
  if (search) { sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`,`%${search}%`); }
  sql += ' ORDER BY p.featured DESC, p.created_at DESC';
  try {
    const [rows] = await pool.query(sql, params);
    res.json({ products: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE p.slug=?', [slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ product: rows[0] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
