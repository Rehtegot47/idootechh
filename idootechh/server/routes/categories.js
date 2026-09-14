import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({ categories: rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
