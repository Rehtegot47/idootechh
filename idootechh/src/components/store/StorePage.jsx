import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../SEO';
import Footer from '../Footer';
import PageHero from '../PageHero';
import { useCart } from './CartContext';
import './store.css';

export default function StorePage(){
  const { category } = useParams();
  const [products,setProducts]=useState([]);
  const [categories,setCategories]=useState([]);
  const [search,setSearch]=useState('');
  const { add } = useCart();

  useEffect(()=>{
    fetch('/api/categories').then(r=>r.json()).then(d=>setCategories(d.categories||[])).catch(()=>{});
  },[]);

  useEffect(()=>{
    const qs = new URLSearchParams();
    if(category) qs.set('category',category);
    if(search) qs.set('search',search);
    fetch('/api/products?'+qs.toString()).then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>setProducts([]));
  },[category,search]);

  return (
    <main className="st-page">
      <SEO title="Store" description="Shop robotic kits, safety wear, software, laptops and more from IdooTech." path="/store"/>
      <PageHero eyebrow="Store" title="Everything you need to build." description="Robotic kits, safety wear, laptops, software and more — curated by IdooTech." image={{src:'/store-hero.jpg', alt:'IdooTech store'}} imageSide="right"/>
      <section className="st-hero">
        <div className="st-container">
          <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'0.75rem 1rem',borderRadius:999,border:'1px solid var(--idt-gray-border)',width:'100%',maxWidth:400,marginBottom:'1rem'}}/>
          <div className="st-filters">
            <Link to="/store" className={`st-chip ${!category?'active':''}`}>All</Link>
            {categories.map(c=> <Link key={c.slug} to={`/store/${c.slug}`} className={`st-chip ${category===c.slug?'active':''}`}>{c.name}</Link>)}
          </div>
          <div className="st-grid">
            {products.map(p=> (
              <div key={p.id} className="st-card">
                <div className="st-card__media"><img src={p.image || '/idoo1.jpg'} alt={p.name}/></div>
                <div className="st-card__body">
                  <span className="st-card__cat">{p.category_name}</span>
                  <h3 className="st-card__title">{p.name}</h3>
                  <p style={{fontSize:'0.9rem',color:'var(--idt-text-muted)',margin:0, flex:1}}>{p.description.slice(0,120)}</p>
                  <div className="st-card__price">₦{Number(p.price).toLocaleString()}</div>
                  <div className="st-card__actions">
                    <Link to={`/store/product/${p.slug}`} className="st-btn st-btn--ghost">View</Link>
                    <button className="st-btn st-btn--primary" onClick={()=>add(p,1)}>Add to cart</button>
                  </div>
                  <div style={{fontSize:'0.8rem',color: p.stock>0?'var(--idt-accent)':'#d32f2f'}}>{p.stock>0? `${p.stock} in stock`:'Out of stock'}</div>
                </div>
              </div>
            ))}
            {!products.length && <p>No products found.</p>}
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
