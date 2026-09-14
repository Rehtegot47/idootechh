import { useState } from 'react';
import SEO from '../SEO';
import Footer from '../Footer';
import { useCart } from './CartContext';
import './store.css';

export default function CheckoutPage(){
  const { items, total, clear } = useCart();
  const [form,setForm]=useState({ customer_name:'', customer_email:'', customer_phone:'', shipping_address:'' });
  const [status,setStatus]=useState('idle');

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!items.length) return;
    setStatus('sending');
    try{
      const res = await fetch('/api/orders', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, items: items.map(p=>({ product_id:p.id, qty:p.qty })) })
      });
      const data = await res.json();
      if(res.ok){ setStatus('success'); clear(); } else { setStatus('error'); alert(data.error||'Failed'); }
    } catch{ setStatus('error'); }
  };

  if(status==='success') return <main className="st-page"><div className="st-container" style={{padding:'8rem 0',textAlign:'center'}}><h2>Order placed!</h2><p>We will contact you shortly.</p><a href="/store" className="st-btn st-btn--primary">Continue shopping</a></div><Footer/></main>;

  return (
    <main className="st-page">
      <SEO title="Checkout" path="/store/checkout"/>
      <section className="st-cart st-container">
        <h1 style={{color:'var(--idt-primary)'}}>Checkout</h1>
        <p>Total: <b>₦{total.toLocaleString()}</b> for {items.length} items</p>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem',maxWidth:600,marginTop:'1.5rem'}}>
          <input required placeholder="Full name" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
          <input required type="email" placeholder="Email" value={form.customer_email} onChange={e=>setForm({...form,customer_email:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
          <input placeholder="Phone" value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
          <textarea required placeholder="Shipping address" value={form.shipping_address} onChange={e=>setForm({...form,shipping_address:e.target.value})} rows="3" style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
          <button disabled={status==='sending'} className="st-btn st-btn--primary">{status==='sending'?'Placing...':'Place order'}</button>
        </form>
      </section>
      <Footer/>
    </main>
  );
}
