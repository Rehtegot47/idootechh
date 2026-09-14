import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SEO from '../SEO';
import './admin.css';



function Login({ onLogin }){
  const [form,setForm]=useState({email:'',password:''});
  const [err,setErr]=useState('');
  const submit=async(e)=>{
    e.preventDefault();
    setErr('');
    try{
      const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||'Failed');
      localStorage.setItem('admin_token', d.token);
      onLogin();
    } catch(e){ setErr(e.message); }
  };
  return (
    <div className="ad-page"><div className="ad-container" style={{maxWidth:400}}>
      <h1 style={{color:'var(--idt-primary)'}}>Admin Login</h1>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem',marginTop:'1rem'}}>
        <input className="ad-input" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="ad-input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        {err && <p style={{color:'#d32f2f'}}>{err}</p>}
        <button className="ad-btn">Login</button>
      </form>
    </div></div>
  );
}

function api(path, opts={}){
  const token=localStorage.getItem('admin_token');
  return fetch(path,{...opts, headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts.headers||{})}});
}

function Products(){
  const [products,setProducts]=useState([]);
  const [categories,setCategories]=useState([]);
  const [form,setForm]=useState({category_id:'',slug:'',name:'',description:'',price:'',stock:'',image:''});
  const [uploading,setUploading]=useState(false);
  const load=()=>{
    api('/api/admin/products').then(r=>r.json()).then(d=>setProducts(d.products||[]));
    api('/api/admin/categories').then(r=>r.json()).then(d=>setCategories(d.categories||[]));
  };
  useEffect(()=>{load();},[]);
  const handleUpload=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setUploading(true);
    const fd=new FormData();
    fd.append('image',file);
    const token=localStorage.getItem('admin_token');
    try{
      const r=await fetch('/api/admin/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:fd});
      const d=await r.json();
      if(d.url) setForm(f=>({...f,image:d.url}));
    }catch(err){console.error(err);}
    setUploading(false);
  };
  const submit=async(e)=>{
    e.preventDefault();
    await api('/api/admin/products',{method:'POST',body:JSON.stringify({...form,category_id:Number(form.category_id),price:Number(form.price),stock:Number(form.stock)})});
    setForm({category_id:'',slug:'',name:'',description:'',price:'',stock:'',image:''});
    load();
  };
  const del=async(id)=>{ await api('/api/admin/products/'+id,{method:'DELETE'}); load(); };
  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={submit} className="ad-card" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
        <select className="ad-input" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} required>
          <option value="">Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="ad-input" placeholder="slug (e.g. arduino-kit)" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} required/>
        <input className="ad-input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className="ad-input" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required/>
        <input className="ad-input" placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} required/>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          <input className="ad-input" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} style={{flex:1}}/>
          <label className="ad-btn" style={{cursor:'pointer',whiteSpace:'nowrap'}}>
            {uploading ? 'Uploading...' : 'Upload'}
            <input type="file" accept="image/*" onChange={handleUpload} hidden/>
          </label>
        </div>
        {form.image && <div style={{gridColumn:'1 / -1'}}><img src={form.image} alt="Preview" style={{maxHeight:120,borderRadius:8}}/></div>}
        <textarea className="ad-input" style={{gridColumn:'1 / -1'}} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required rows="3"/>
        <button className="ad-btn ad-btn--accent" style={{gridColumn:'1 / -1'}}>Add product</button>
      </form>
      <div className="ad-card" style={{overflowX:'auto'}}>
        <table className="ad-table">
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>{products.map(p=><tr key={p.id}><td>{p.image && <img src={p.image} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:4}}/>}</td><td>{p.name}</td><td>{p.category_name}</td><td>₦{Number(p.price).toLocaleString()}</td><td>{p.stock}</td><td><button className="ad-btn" onClick={()=>del(p.id)}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function Orders(){
  const [orders,setOrders]=useState([]);
  const load=()=> api('/api/admin/orders').then(r=>r.json()).then(d=>setOrders(d.orders||[]));
  useEffect(()=>{load();},[]);
  const updateStatus=async(id,status)=>{ await api('/api/admin/orders/'+id,{method:'PATCH',body:JSON.stringify({status})}); load(); };
  return (
    <div>
      <h2>Orders</h2>
      {orders.map(o=> (
        <div key={o.id} className="ad-card">
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
            <div><b>#{o.id}</b> — {o.customer_name} ({o.customer_email})<br/>{o.shipping_address}<br/>Total: <b>₦{Number(o.total).toLocaleString()}</b></div>
            <div>
              <select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)} className="ad-input" style={{width:'auto'}}>
                <option>pending</option><option>paid</option><option>shipped</option><option>delivered</option><option>cancelled</option>
              </select>
              <div style={{fontSize:'0.85rem',color:'var(--idt-text-muted)'}}>{new Date(o.created_at).toLocaleString()}</div>
            </div>
          </div>
          <div style={{marginTop:'0.75rem'}}>{o.items?.map(it=><div key={it.id} style={{fontSize:'0.9rem'}}>{it.name} x {it.qty} @ ₦{Number(it.price).toLocaleString()}</div>)}</div>
        </div>
      ))}
      {!orders.length && <p>No orders yet.</p>}
    </div>
  );
}

function Messages(){
  const [messages,setMessages]=useState([]);
  useEffect(()=>{ api('/api/admin/messages').then(r=>r.json()).then(d=>setMessages(d.messages||[])); },[]);
  return (
    <div>
      <h2>Messages</h2>
      {messages.map(m=> (
        <div key={m.id} className="ad-card">
          <div style={{fontWeight:700,color:'var(--idt-primary)'}}>{m.name} — {m.email}</div>
          <div style={{fontSize:'0.9rem',color:'var(--idt-text-muted)'}}>{m.subject} — {new Date(m.created_at).toLocaleString()}</div>
          <p style={{whiteSpace:'pre-wrap',marginTop:'0.5rem'}}>{m.message}</p>
        </div>
      ))}
      {!messages.length && <p>No messages.</p>}
    </div>
  );
}

export default function AdminPage(){
  const [authed,setAuthed]=useState(()=>!!localStorage.getItem('admin_token'));
  const loc=useLocation();
  const logout=()=>{ localStorage.removeItem('admin_token'); setAuthed(false); };
  if(!authed) return <Login onLogin={()=>setAuthed(true)}/>;
  const tab = loc.pathname.split('/')[2] || 'products';
  return (
    <main className="ad-page">
      <SEO title="Admin" path="/admin"/>
      <div className="ad-container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'1rem'}}>
          <h1 style={{color:'var(--idt-primary)',margin:0}}>Admin</h1>
          <button className="ad-btn" onClick={logout}>Logout</button>
        </div>
        <nav className="ad-nav">
          <Link to="/admin/products" className={tab==='products'?'active':''}>Products</Link>
          <Link to="/admin/orders" className={tab==='orders'?'active':''}>Orders</Link>
          <Link to="/admin/messages" className={tab==='messages'?'active':''}>Messages</Link>
        </nav>
        <Routes>
          <Route path="products" element={<Products/>}/>
          <Route path="orders" element={<Orders/>}/>
          <Route path="messages" element={<Messages/>}/>
          <Route path="*" element={<Products/>}/>
        </Routes>
      </div>
    </main>
  );
}
