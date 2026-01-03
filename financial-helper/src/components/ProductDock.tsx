import React, { useEffect, useState } from 'react';
import './ProductDock.css';
import type { Product } from '../models';
import { ProductService } from '../procuctService';
import { db } from '../db';
import ProductModal from './ProductModal';

export default function ProductDock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const productService = new ProductService(db);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    productService.getAllProducts()
      .then(arr => { if (mounted) setProducts(arr); })
      .catch(err => { console.error('Ürünleri alırken hata:', err); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  const toggle = () => setCollapsed(c => !c);

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const refreshProducts = () => {
    setLoading(true);
    productService.getAllProducts()
      .then(arr => setProducts(arr))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSaveFromModal = async (vals: {
    id?: number;
    name: string;
    shortName: string;
    amountUnit: string;
    priceTl: number | '';
    priceTlMicro: string;
    priceDollar: number | '';
    priceDollarMicro: string;
  }) => {
    const pad = (s: string) => s.toString().padEnd(6, '0').slice(0, 6);
    const priceTlMicro = Number(String(vals.priceTl === '' ? 0 : vals.priceTl) + pad(vals.priceTlMicro || '0'));
    const priceDollarMicro = Number(String(vals.priceDollar === '' ? 0 : vals.priceDollar) + pad(vals.priceDollarMicro || '0'));

    if (vals.id) {
      await productService.updateProductPartial(vals.id, {
        name: vals.name,
        shortName: vals.shortName,
        amountUnit: vals.amountUnit,
        priceTlMicro,
        priceDollarMicro
      });
    } else {
      await productService.createProductRecord({
        name: vals.name,
        shortName: vals.shortName,
        amountUnit: vals.amountUnit,
        priceTlMicro,
        priceDollarMicro
      });
    }
    refreshProducts();
  };

  return (
    <div className={`product-dock ${collapsed ? 'collapsed' : 'expanded'}`} aria-expanded={!collapsed}>
      <div className="product-box card shadow-sm">
        <div className="card-body p-2">
          {loading ? (
            <div className="text-center small text-muted">Yükleniyor...</div>
          ) : products.length === 0 ? (
            <div className="text-center small text-muted">Ürün yok</div>
          ) : (
            <div className="d-flex flex-column gap-2">
              <button type="button" className="btn btn-success rounded-pill product-item" onClick={openCreateModal}>
                + Yeni Ürün
              </button>

              {products.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className="btn btn-outline-secondary rounded-pill text-truncate product-item"
                  onClick={() => openEditModal(p)}
                >
                  {p.shortName ? p.shortName : p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="product-footer d-flex align-items-center justify-content-between px-3" onClick={toggle} role="button" aria-pressed={!collapsed}>
        <div className="fw-semibold">Products</div>
        <div className="caret">{collapsed ? '▴' : '▾'}</div>
      </div>

      <ProductModal
        show={modalOpen}
        initial={editingProduct}
        onClose={closeModal}
        onSubmit={handleSaveFromModal}
      />
    </div>
  );
}