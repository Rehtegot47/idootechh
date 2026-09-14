import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../SEO';
import Footer from '../Footer';
import { useCart } from './CartContext';
import './store.css';

export default function ProductPage(){
  const { slug } = useParams();
  const [product,setProduct]=useState(null);
  const [qty,setQty]=useState(1);
  const { add } = useCart();

  useEffect(()=>{ fetch('/api/products/'+slug).then(r=>r.json()).then(d=>setProduct(d.product)).catch(()=>{}); },[slug]);
  if(!product) return <div className="st-container" style={{padding:'8rem 0'}}><p>Loading...</p></div>;
  return (
    <main className="st-page">
      <SEO title={product.name} path={`/store/product/${slug}`} description={product.description}/>
      <section className="st-product st-container">
        <div className="st-product__media"><img src={product.image || '/idoo1.jpg'} alt={product.name}/></div>
        <div>
          <p style={{color:'var(--idt-accent)',fontWeight:700,textTransform:'uppercase',fontSize:'0.8rem'}}>{product.category_name}</p>
          <h1 style={{color:'var(--idt-primary)'}}>{product.name}</h1>
          <p style={{fontSize:'1.2rem',fontWeight:800,color:'var(--idt-primary)'}}>₦{Number(product.price).toLocaleString()}</p>
          <p style={{color:'var(--idt-text-muted)',lineHeight:1.7}}>{product.description}</p>
          <p style={{fontSize:'0.9rem'}}>{product.stock>0? `${product.stock} in stock` : 'Out of stock'}</p>
          <div style={{display:'flex',gap:'1rem',alignItems:'center',marginTop:'1.5rem'}}>
            <input type="number" min="1" max={product.stock} value={qty} onChange={e=>setQty(Number(e.target.value)||1)} style={{width:80,padding:'0.6rem',borderRadius:8,border:'1px solid var(--idt-gray-border)'}}/>
            <button className="st-btn st-btn--primary" disabled={product.stock<=0} onClick={()=>add(product,qty)}>Add to cart</button>
            <Link to="/store/cart" className="st-btn st-btn--ghost">Go to cart</Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
