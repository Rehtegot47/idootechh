import dotenv from 'dotenv';
dotenv.config();

let pool;
let isSqlite = false;

if (process.env.DB_DRIVER === 'sqlite') {
  const Database = (await import('better-sqlite3')).default;
  const db = new Database(process.env.SQLITE_FILE || 'idootech.db');

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // Seed default categories
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (catCount.c === 0) {
    const ins = db.prepare('INSERT INTO categories (slug, name, description) VALUES (?, ?, ?)');
    ins.run('robotics-kits', 'Robotics Kits', 'Arduino, Raspberry Pi, and microcontroller kits');
    ins.run('safety-wear', 'Safety Wear', 'ESD mats, gloves, goggles, and protective gear');
    ins.run('software', 'Software', 'Development tools, licenses, and subscriptions');
    ins.run('laptops', 'Laptops', 'Programming and engineering laptops');
    ins.run('components', 'Components', 'Sensors, modules, resistors, and electronic parts');
  }

  // Wrap better-sqlite3 in a mysql2/promise-like interface
  pool = {
    async query(sql, params = []) {
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        // Handle JOINs with ? placeholders — replace ? with positional params
        let idx = 0;
        const replaced = sql.replace(/\?/g, () => {
          const val = params[idx++];
          if (val === undefined || val === null) return 'NULL';
          if (typeof val === 'number') return String(val);
          return `'${String(val).replace(/'/g, "''")}'`;
        });
        const rows = db.prepare(replaced).all();
        return [rows];
      }
      if (trimmed.startsWith('INSERT')) {
        let idx = 0;
        const replaced = sql.replace(/\?/g, () => {
          const val = params[idx++];
          if (val === undefined || val === null) return 'NULL';
          if (typeof val === 'number') return String(val);
          return `'${String(val).replace(/'/g, "''")}'`;
        });
        const info = db.prepare(replaced).run();
        return [{ insertId: info.lastInsertRowid }];
      }
      let idx = 0;
      const replaced = sql.replace(/\?/g, () => {
        const val = params[idx++];
        if (val === undefined || val === null) return 'NULL';
        if (typeof val === 'number') return String(val);
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      const info = db.prepare(replaced).run();
      return [{ affectedRows: info.changes }];
    }
  };
  isSqlite = true;
  console.log('Using SQLite database');
} else {
  const mysql = await import('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'idootech_db',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log('Using MySQL database');
}

export { pool, isSqlite };

export async function testDb() {
  if (isSqlite) {
    const [rows] = await pool.query('SELECT 1 as ok');
    return rows[0].ok === 1;
  }
  const [rows] = await pool.query('SELECT 1 as ok');
  return rows[0].ok === 1;
}
