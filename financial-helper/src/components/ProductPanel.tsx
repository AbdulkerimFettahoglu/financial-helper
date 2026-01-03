import React, { useEffect, useRef, useState } from 'react';
import { db } from '../db';
import type { Product } from '../models';
import { ProductService } from '../procuctService'; // projendeki mevcut yolu korudum

export default function ProductPanel() {
    const productService = new ProductService(db);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const addProductRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        productService.getAllProducts()
            .then((arr) => { if (mounted) setProducts(arr); })
            .catch((err) => alert('DB hata:' + err))
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const form = addProductRef.current;
        if (!form) return;
        const formData = new FormData(form);
        const name = (formData.get('productName') as string) || '';
        const shortName = (formData.get('productShortName') as string) || '';
        const amountUnit = (formData.get('productAmountUnit') as string) || '';
        const priceTl = Number(formData.get('productPriceTl'));
        const priceTlMicroTemp = (formData.get('productPriceTlMicro') as string) || '0';
        const priceDollar = Number(formData.get('productPriceDollar'));
        const priceDollarMicroTemp = (formData.get('productPriceDollarMicro') as string) || '0';

        if (!name || !shortName || !amountUnit || isNaN(priceTl) || isNaN(priceDollar)) {
            alert('Ürün bilgileri eksik veya hatalı');
            return;
        }

        const paddedTlMicro = priceTlMicroTemp.toString().padEnd(6, '0').slice(0, 6);
        const paddedDollarMicro = priceDollarMicroTemp.toString().padEnd(6, '0').slice(0, 6);
        const priceTlMicro = Number(String(priceTl) + paddedTlMicro);
        const priceDollarMicro = Number(String(priceDollar) + paddedDollarMicro);

        const id = formData.get('productId') as string;
        if (id) {
            productService.updateProductPartial(Number(id), { name, shortName, amountUnit, priceTlMicro, priceDollarMicro })
                .then(() => productService.getAllProducts())
                .then((newProducts) => setProducts(newProducts))
                .catch((err) => alert('Ürün güncelleme hatası: ' + err));
            return;
        } else {
            productService.createProductRecord({ name, shortName, amountUnit, priceTlMicro, priceDollarMicro })
                .then(() => productService.getAllProducts())
                .then((newProducts) => {
                    setProducts(newProducts);
                    // temizle form alanları
                    if (addProductRef.current) (addProductRef.current as HTMLFormElement).reset();
                })
                .catch((err) => alert('Ürün ekleme hatası: ' + err));
        }
    };

    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Ürünü silmek istediğinize emin misiniz?')) return;
        productService.getProductById(id)
            .then((product) => productService.replaceProductRecord(product as Product))
            .then(() => productService.getAllProducts())
            .then((arr) => setProducts(arr))
            .catch(err => alert('Ürün silme hatası: ' + err));
    };

    return (
        <div>
            <h2>Ürünler</h2>
            <form ref={addProductRef} onSubmit={handleAddProduct}>
                <input name="productId" type="text" placeholder="Id girin (güncelleme için)" />
                <input name="productName" type="text" placeholder="Ürün adı" />
                <input name="productShortName" type="text" placeholder="Kısa isim" />
                <input name="productAmountUnit" type="text" placeholder="Miktar birimi" />
                <input name="productPriceTl" type="number" placeholder="Fiyat (TL)" />
                <input name="productPriceTlMicro" type="text" placeholder="Fiyat (Kuruş) 6 hane" maxLength={6} />
                <input name="productPriceDollar" type="number" placeholder="Fiyat (USD)" />
                <input name="productPriceDollarMicro" type="text" placeholder="Fiyat (Cent) 6 hane" maxLength={6} />
                <button type="submit">Ürün Ekle / Güncelle</button>
            </form>

            {loading ? <div>Ürünler yükleniyor...</div> : (
                <ul>
                    {products.map(p => (
                        <li key={p.id}>
                            {p.id} — {p.name} — {p.shortName} — {p.amountUnit} — {p.priceTlMicro} TL / {p.priceDollarMicro} USD
                            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(p.id)}>Sil</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}