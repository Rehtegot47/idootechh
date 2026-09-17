import { useState } from 'react';
import SEO from '../SEO';
import Footer from '../Footer';
import { useCart } from './CartContext';
import './store.css';

const STATES = [
  {slug:'abia',name:'Abia'},{slug:'adamawa',name:'Adamawa'},{slug:'akwa-ibom',name:'Akwa Ibom'},
  {slug:'anova',name:'Anambra'},{slug:'bauchi',name:'Bauchi'},{slug:'bayelsa',name:'Bayelsa'},
  {slug:'benue',name:'Benue'},{slug:'borno',name:'Borno'},{slug:'cross-river',name:'Cross River'},
  {slug:'delta',name:'Delta'},{slug:'ebonyi',name:'Ebonyi'},{slug:'edo',name:'Edo'},
  {slug:'ekiti',name:'Ekiti'},{slug:'enyi',name:'Enugu'},{slug:'fct-abuja',name:'FCT Abuja'},
  {slug:'gombe',name:'Gombe'},{slug:'imo',name:'Imo'},{slug:'jigawa',name:'Jigawa'},
  {slug:'kaduna',name:'Kaduna'},{slug:'kano',name:'Kano'},{slug:'katsina',name:'Katsina'},
  {slug:'kebbi',name:'Kebbi'},{slug:'kogi',name:'Kogi'},{slug:'kwara',name:'Kwara'},
  {slug:'lagos',name:'Lagos'},{slug:'nasarawa',name:'Nasarawa'},{slug:'niger',name:'Niger'},
  {slug:'ogun',name:'Ogun'},{slug:'ondo',name:'Ondo'},{slug:'osun',name:'Osun'},
  {slug:'oyo',name:'Oyo'},{slug:'plateau',name:'Plateau'},{slug:'rivers',name:'Rivers'},
  {slug:'sokoto',name:'Sokoto'},{slug:'taraba',name:'Taraba'},{slug:'yobe',name:'Yobe'},
  {slug:'zamfara',name:'Zamfara'}
];

function getShippingFee(state) {
  const fees = {
    'abia':800,'adamawa':1200,'akwa-ibom':900,'anova':700,'bauchi':1100,'bayelsa':1000,'benue':900,
    'borno':1300,'cross-river':1100,'delta':1000,'ebonyi':900,'edo':900,'ekiti':800,'enyi':700,
    'fct-abuja':600,'gombe':1000,'imo':800,'jigawa':1100,'kaduna':1000,'kano':1200,'katsina':1100,
    'kebbi':1000,'kogi':900,'kwara':800,'lagos':500,'nasarawa':800,'niger':1000,'ogun':700,
    'ondo':800,'osun':700,'oyo':700,'plateau':1000,'rivers':900,'sokoto':1100,'taraba':1200,'yobe':1200,'zamfara':1100
  };
  return fees[state?.toLowerCase()] || 1000;
}

export default function CheckoutPage(){
  const { items, clear } = useCart();
  const [form,setForm]=useState({ customer_name:'', customer_email:'', customer_phone:'', shipping_address:'', shipping_state:'' });
  const [status,setStatus]=useState('idle');
  const subtotal = items.reduce((s,p)=>s+p.price*p.qty,0);

  const grandTotal = subtotal + getShippingFee(form.shipping_state);
  const shippingFee = getShippingFee(form.shipping_state);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!items.length) return;
    setStatus('sending');
    try{
      const res = await fetch('/api/orders', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, items: items.map(p=>({ product_id:p.id, qty:p.qty })), shipping_state: form.shipping_state, shipping_fee: shippingFee, subtotal, total: grandTotal })
      });
      const data = await res.json();
      if(res.ok){ setStatus('success'); clear(); } else { setStatus('error'); alert(data.error||'Failed'); }
    } catch{ setStatus('error'); }
  };

  if(status==='success') return <main className="st-page"><div className="st-container" style={{padding:'8rem 0',textAlign:'center'}}><h2>Order placed!</h2><p>Thank you! We will deliver to {form.shipping_address}.</p><a href="/store" className="st-btn st-btn--primary">Continue shopping</a></div><Footer/></main>;

  return (
    <main className="st-page">
      <SEO title="Checkout" path="/store/checkout"/>
      <section className="st-cart st-container">
        <h1 style={{color:'var(--idt-primary)'}}>Checkout</h1>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginTop:'1.5rem'}}>
          <div>
            <h2 style={{marginBottom:'1rem',color:'var(--idt-primary)'}}>Shipping Info</h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              <input required placeholder="Full name" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
              <input required type="email" placeholder="Email" value={form.customer_email} onChange={e=>setForm({...form,customer_email:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
              <input placeholder="Phone" value={form.customer_phone} onChange={e=>setForm({...form,customer_phone:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
              <textarea required placeholder="Shipping address" value={form.shipping_address} onChange={e=>setForm({...form,shipping_address:e.target.value})} rows="3" style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
              <select required value={form.shipping_state} onChange={e=>setForm({...form,shipping_state:e.target.value})} style={{padding:'0.75rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}>
                <option value="">Select your state</option>
                {STATES.map(s=><option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
                <button disabled={status==='sending'} className="st-btn st-btn--primary">{status==='sending'?'Placing...':'Place order'}</button>
            </form>
          </div>

          <div>
            <h2 style={{marginBottom:'1rem',color:'var(--idt-primary)'}}>Order Summary</h2>
            <div className="ad-card" style={{padding:'1.25rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid var(--idt-gray-border)'}}>
                <span>Subtotal ({items.length} items)</span><b>₦{subtotal.toLocaleString()}</b>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid var(--idt-gray-border)'}}>
                <span>Shipping ({form.shipping_state||'Select state...'})</span><b>₦{getShippingFee(form.shipping_state||'').toLocaleString()}</b>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'0.5rem 0',fontSize:'1.3rem',fontWeight:800,color:'var(--idt-primary)'}}>
                <span>Total</span><span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <div style={{marginTop:'1rem'}}>
              {items.map(p=>(
                <div key={p.id} style={{display:'flex',gap:'0.75rem',alignItems:'center',padding:'0.5rem 0',borderBottom:'1px solid var(--idt-gray-border)'}}>
                  {p.image && <img src={p.image} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:4}}/>}
                  <div style={{flex:1}}><b>{p.name}</b> x {p.qty} <span style={{color:'var(--idt-text-muted)'}}>₦{Number(p.price).toLocaleString()}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
