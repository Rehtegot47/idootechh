import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SEO from '../SEO';
import './admin.css';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      localStorage.setItem('admin_token', d.token);
      onLogin();
    } catch (e) { setErr(e.message); }
  };
  return (
    <div className="ad-page"><div className="ad-container" style={{ maxWidth: 400 }}>
      <h1 style={{ color: 'var(--idt-primary)' }}>Admin Login</h1>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input className="ad-input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="ad-input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        {err && <p style={{ color: '#d32f2f' }}>{err}</p>}
        <button className="ad-btn">Login</button>
      </form>
    </div></div>
  );
}

function api(path, opts = {}) {
  const token = localStorage.getItem('admin_token');
  return fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) } });
}

// ─── DASHBOARD ───
function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {}); }, []);
  if (!stats) return <p>Loading...</p>;
  const cards = [
    { label: 'Products', value: stats.productCount, color: '#4caf50' },
    { label: 'Categories', value: stats.categoryCount, color: '#2196f3' },
    { label: 'Orders', value: stats.orderCount, color: '#ff9800' },
    { label: 'Revenue', value: `₦${Number(stats.totalRevenue).toLocaleString()}`, color: '#9c27b0' },
    { label: 'Pending Orders', value: stats.pendingOrders, color: '#f44336' },
    { label: 'Messages', value: stats.messageCount, color: '#607d8b' },
    { label: 'Unread Messages', value: stats.unreadMessages, color: '#e91e63' },
  ];
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {cards.map(c => (
          <div key={c.label} className="ad-card" style={{ borderLeft: `4px solid ${c.color}`, padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--idt-text-muted)' }}>{c.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCTS ───
function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_id: '', slug: '', name: '', description: '', price: '', stock: '', image: '', video_url: '' });
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState('image');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const load = () => {
    api('/api/admin/products').then(r => r.json()).then(d => setProducts(d.products || []));
    api('/api/admin/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  };
  useEffect(() => { load(); }, []);
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const token = localStorage.getItem('admin_token');
    try {
      const r = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json();
      if (d.url) setForm(f => ({ ...f, image: d.url }));
    } catch (err) { console.error(err); }
    setUploading(false);
  };
  const getYouTubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ category_id: String(p.category_id), slug: p.slug, name: p.name, description: p.description, price: String(p.price), stock: String(p.stock), image: p.image || '', video_url: p.video_url || '' });
    setMediaType(p.video_url ? 'youtube' : 'image');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelEdit = () => { setEditId(null); setForm({ category_id: '', slug: '', name: '', description: '', price: '', stock: '', image: '', video_url: '' }); setMediaType('image'); };
  const submit = async (e) => {
    e.preventDefault();
    const body = { ...form, category_id: Number(form.category_id), price: Number(form.price), stock: Number(form.stock) };
    if (editId) {
      await api(`/api/admin/products/${editId}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await api('/api/admin/products', { method: 'POST', body: JSON.stringify(body) });
    }
    cancelEdit();
    load();
  };
  const del = async (id) => { if (confirm('Delete this product?')) { await api(`/api/admin/products/${id}`, { method: 'DELETE' }); load(); } };
  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category_name.toLowerCase().includes(search.toLowerCase()));
  const youtubeId = getYouTubeEmbed(form.video_url);
  return (
    <div>
      <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={submit} className="ad-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <select className="ad-input" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
          <option value="">Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="ad-input" placeholder="slug (e.g. arduino-kit)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
        <input className="ad-input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="ad-input" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input className="ad-input" placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--idt-text-muted)', marginBottom: '0.35rem', display: 'block' }}>Media</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button type="button" className={`ad-btn ${mediaType === 'image' ? 'ad-btn--accent' : ''}`} onClick={() => setMediaType('image')}>Image</button>
            <button type="button" className={`ad-btn ${mediaType === 'video' ? 'ad-btn--accent' : ''}`} onClick={() => setMediaType('video')}>Video File</button>
            <button type="button" className={`ad-btn ${mediaType === 'youtube' ? 'ad-btn--accent' : ''}`} onClick={() => setMediaType('youtube')}>YouTube URL</button>
          </div>
          {mediaType === 'image' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input className="ad-input" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={{ flex: 1 }} />
              <label className="ad-btn" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" onChange={handleUpload} hidden />
              </label>
            </div>
          )}
          {mediaType === 'video' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input className="ad-input" placeholder="Video URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={{ flex: 1 }} />
              <label className="ad-btn" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {uploading ? 'Uploading...' : 'Upload Video'}
                <input type="file" accept="video/*" onChange={handleUpload} hidden />
              </label>
            </div>
          )}
          {mediaType === 'youtube' && (
            <input className="ad-input" placeholder="https://youtube.com/watch?v=..." value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} />
          )}
        </div>

        {(form.image || youtubeId) && (
          <div style={{ gridColumn: '1 / -1' }}>
            {mediaType === 'youtube' && youtubeId ? (
              <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${youtubeId}`} style={{ borderRadius: 8, border: 'none' }} allowFullScreen title="Preview" />
            ) : form.image && form.image.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={form.image} controls style={{ maxHeight: 150, borderRadius: 8 }} />
            ) : form.image ? (
              <img src={form.image} alt="Preview" style={{ maxHeight: 120, borderRadius: 8 }} />
            ) : null}
          </div>
        )}

        <textarea className="ad-input" style={{ gridColumn: '1 / -1' }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows="3" />
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
          <button className="ad-btn ad-btn--accent" style={{ flex: 1 }}>{editId ? 'Update product' : 'Add product'}</button>
          {editId && <button type="button" className="ad-btn" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <h2 style={{ marginTop: '2rem' }}>Products ({filtered.length})</h2>
      <input className="ad-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400, marginBottom: '1rem' }} />
      <div className="ad-card" style={{ overflowX: 'auto' }}>
        <table className="ad-table">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>{filtered.map(p => <tr key={p.id}>
            <td>{p.image && <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />}</td>
            <td>{p.name}</td>
            <td>{p.category_name}</td>
            <td>₦{Number(p.price).toLocaleString()}</td>
            <td>{p.stock}</td>
            <td style={{ display: 'flex', gap: '0.35rem' }}>
              <button className="ad-btn" onClick={() => startEdit(p)}>Edit</button>
              <button className="ad-btn" style={{ color: '#d32f2f' }} onClick={() => del(p.id)}>Delete</button>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ORDERS ───
function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const load = () => api('/api/admin/orders').then(r => r.json()).then(d => setOrders(d.orders || []));
  useEffect(() => { load(); }, []);
  const updateStatus = async (id, status) => { await api(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); load(); };
  const viewDetails = async (id) => {
    const r = await api(`/api/admin/orders/${id}`);
    const d = await r.json();
    setViewOrder(d.order);
  };
  const del = async (id) => { if (confirm('Delete this order?')) { await api(`/api/admin/orders/${id}`, { method: 'DELETE' }); load(); } };
  const statusColor = (s) => ({ pending: '#ff9800', paid: '#2196f3', shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336' }[s] || '#666');

  if (viewOrder) return (
    <div>
      <button className="ad-btn" onClick={() => setViewOrder(null)} style={{ marginBottom: '1rem' }}>&larr; Back to orders</button>
      <div className="ad-card">
        <h2>Order #{viewOrder.id}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div><b>Customer:</b><br />{viewOrder.customer_name}<br />{viewOrder.customer_email}<br />{viewOrder.customer_phone || 'N/A'}</div>
          <div><b>Shipping:</b><br />{viewOrder.shipping_address}</div>
          <div><b>Status:</b> <span style={{ color: statusColor(viewOrder.status), fontWeight: 700 }}>{viewOrder.status}</span></div>
          <div><b>Total:</b> ₦{Number(viewOrder.total).toLocaleString()}</div>
          <div><b>Date:</b> {new Date(viewOrder.created_at).toLocaleString()}</div>
        </div>
        <h3 style={{ marginTop: '1.5rem' }}>Items</h3>
        {viewOrder.items?.map(it => (
          <div key={it.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--idt-gray-border)' }}>
            {it.image && <img src={it.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />}
            <div style={{ flex: 1 }}><b>{it.name}</b><br />Qty: {it.qty} x ₦{Number(it.price).toLocaleString()}</div>
            <div style={{ fontWeight: 700 }}>₦{Number(it.price * it.qty).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2>Orders ({orders.length})</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map(o => (
        <div key={o.id} className="ad-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <b style={{ color: 'var(--idt-primary)' }}>#{o.id}</b> — {o.customer_name} ({o.customer_email})<br />
              {o.shipping_address}<br />
              Total: <b>₦{Number(o.total).toLocaleString()}</b>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="ad-input" style={{ width: 'auto' }}>
                <option>pending</option><option>paid</option><option>shipped</option><option>delivered</option><option>cancelled</option>
              </select>
              <button className="ad-btn" onClick={() => viewDetails(o.id)}>View</button>
              <button className="ad-btn" style={{ color: '#d32f2f' }} onClick={() => del(o.id)}>Delete</button>
              <span style={{ fontSize: '0.8rem', color: 'var(--idt-text-muted)' }}>{new Date(o.created_at).toLocaleString()}</span>
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--idt-text-muted)' }}>
            {o.items?.map(it => <span key={it.id}>{it.name} x {it.qty} &nbsp;</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MESSAGES ───
function Messages() {
  const [messages, setMessages] = useState([]);
  const load = () => api('/api/admin/messages').then(r => r.json()).then(d => setMessages(d.messages || []));
  useEffect(() => { load(); }, []);
  const markRead = async (id) => { await api(`/api/admin/messages/${id}/read`, { method: 'PATCH' }); load(); };
  const markUnread = async (id) => { await api(`/api/admin/messages/${id}/unread`, { method: 'PATCH' }); load(); };
  const del = async (id) => { if (confirm('Delete this message?')) { await api(`/api/admin/messages/${id}`, { method: 'DELETE' }); load(); } };
  return (
    <div>
      <h2>Messages ({messages.length})</h2>
      {messages.length === 0 && <p>No messages.</p>}
      {messages.map(m => (
        <div key={m.id} className="ad-card" style={{ borderLeft: m.is_read ? 'none' : '4px solid var(--idt-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--idt-primary)' }}>{m.name} — {m.email}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--idt-text-muted)' }}>{m.subject} — {new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {!m.is_read ? (
                <button className="ad-btn" onClick={() => markRead(m.id)}>Mark read</button>
              ) : (
                <button className="ad-btn" onClick={() => markUnread(m.id)}>Mark unread</button>
              )}
              <button className="ad-btn" style={{ color: '#d32f2f' }} onClick={() => del(m.id)}>Delete</button>
            </div>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{m.message}</p>
        </div>
      ))}
    </div>
  );
}

// ─── CATEGORIES ───
function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ slug: '', name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const load = () => api('/api/admin/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api(`/api/admin/categories/${editId}`, { method: 'PUT', body: JSON.stringify(form) });
    } else {
      await api('/api/admin/categories', { method: 'POST', body: JSON.stringify(form) });
    }
    setForm({ slug: '', name: '', description: '' });
    setEditId(null);
    load();
  };
  const startEdit = (c) => { setEditId(c.id); setForm({ slug: c.slug, name: c.name, description: c.description || '' }); };
  const cancelEdit = () => { setEditId(null); setForm({ slug: '', name: '', description: '' }); };
  const del = async (id) => {
    if (!confirm('Delete this category?')) return;
    const r = await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
    const d = await r.json();
    if (!r.ok) alert(d.error);
    load();
  };
  return (
    <div>
      <h2>{editId ? 'Edit Category' : 'Add Category'}</h2>
      <form onSubmit={submit} className="ad-card" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <input className="ad-input" placeholder="slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required style={{ flex: 1, minWidth: 120 }} />
        <input className="ad-input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ flex: 1, minWidth: 120 }} />
        <input className="ad-input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ flex: 2, minWidth: 200 }} />
        <button className="ad-btn ad-btn--accent">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" className="ad-btn" onClick={cancelEdit}>Cancel</button>}
      </form>
      <div className="ad-card" style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table className="ad-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Products</th><th></th></tr></thead>
          <tbody>{categories.map(c => <tr key={c.id}>
            <td style={{ fontWeight: 600 }}>{c.name}</td>
            <td>{c.slug}</td>
            <td>{c.description || '—'}</td>
            <td>{c.product_count}</td>
            <td style={{ display: 'flex', gap: '0.35rem' }}>
              <button className="ad-btn" onClick={() => startEdit(c)}>Edit</button>
              <button className="ad-btn" style={{ color: '#d32f2f' }} onClick={() => del(c.id)}>Delete</button>
            </td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('admin_token'));
  const loc = useLocation();
  const logout = () => { localStorage.removeItem('admin_token'); setAuthed(false); };
  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  const tab = loc.pathname.split('/')[2] || 'dashboard';
  return (
    <main className="ad-page">
      <SEO title="Admin" path="/admin" />
      <div className="ad-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ color: 'var(--idt-primary)', margin: 0 }}>Admin</h1>
          <button className="ad-btn" onClick={logout}>Logout</button>
        </div>
        <nav className="ad-nav">
          <Link to="/admin/dashboard" className={tab === 'dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/admin/products" className={tab === 'products' ? 'active' : ''}>Products</Link>
          <Link to="/admin/categories" className={tab === 'categories' ? 'active' : ''}>Categories</Link>
          <Link to="/admin/orders" className={tab === 'orders' ? 'active' : ''}>Orders</Link>
          <Link to="/admin/messages" className={tab === 'messages' ? 'active' : ''}>Messages</Link>
        </nav>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </main>
  );
}
