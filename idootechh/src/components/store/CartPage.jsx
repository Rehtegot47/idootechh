import { Link } from 'react-router-dom';
import SEO from '../SEO';
import Footer from '../Footer';
import { useCart } from './CartContext';
import './store.css';

export default function CartPage(){
  const { items, remove, updateQty, total, clear } = useCart();
  return (
    <main className="st-page">
      <SEO title="Cart" path="/store/cart"/>
      <section className="st-cart st-container">
        <h1 style={{color:'var(--idt-primary)'}}>Your Cart</h1>
        {!items.length ? <p>Cart is empty. <Link to="/store">Go shopping</Link></p> : (
          <>
            {items.map(p=> (
              <div key={p.id} className="st-cart__item">
                <img src={p.image || '/idoo1.jpg'} alt={p.name}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:'var(--idt-primary)'}}>{p.name}</div>
                  <div>₦{Number(p.price).toLocaleString()} x <input type="number" min="1" value={p.qty} onChange={e=>updateQty(p.id, Number(e.target.value)||1)} style={{width:60,padding:'0.3rem',borderRadius:6,border:'1px solid var(--idt-gray-border)'}}/></div>
                </div>
                <button className="st-btn st-btn--ghost" onClick={()=>remove(p.id)}>Remove</button>
              </div>
            ))}
            <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
              <div style={{fontSize:'1.3rem',fontWeight:800,color:'var(--idt-primary)'}}>Total: ₦{total.toLocaleString()}</div>
              <div style={{display:'flex',gap:'1rem'}}>
                <button className="st-btn st-btn--ghost" onClick={clear}>Clear</button>
                <Link to="/store/checkout" className="st-btn st-btn--primary">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </section>
      <Footer/>
    </main>
  );
}
