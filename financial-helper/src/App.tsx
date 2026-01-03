import { useState, useEffect, useRef } from 'react'
import './App.css'
import { db } from './db'
import type { Person, Product } from './models';
import { PersonService } from './personService';
import { ProductService } from './procuctService';

function App() {
  const [loading, setLoading] = useState(true);
  const personService = new PersonService(db);
  const [persons, setPersons] = useState<Person[]>([]);
  const addUserRef = useRef(null);
  const productService = new ProductService(db);
  const [products, setProducts] = useState<Product[]>([]);
  const addProductRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    personService.getAllPersons()
      .then((arr) => setPersons(arr))
      .catch((err) => alert('DB hata:' + err))
      .finally(() => setLoading(false));
    productService.getAllProducts()
      .then((arr) => setProducts(arr))
      .catch((err) => alert('DB hata:' + err));
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = addUserRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const name = formData.get('personName') as string;
    if (!name) {
      alert('İsim gerekli');
      return;
    }
    const id = formData.get('personId') as string;
    if (id) {
      personService.updatePersonPartial(Number(id), { name })
        .then(() => personService.getAllPersons())
        .then((newPersons) => setPersons(newPersons))
        .catch((err) => alert('Person-Kayıt güncelleme hatası: ' + err));
      return;
    } else {
      personService.createPersonRecord(name)
        .then(() => personService.getAllPersons())
        .then((newPersons) => setPersons(newPersons))
        .catch((err) => alert('Person-Kayıt ekleme hatası: ' + err));
    }
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = addProductRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const name = formData.get('productName') as string;
    const shortName = formData.get('productShortName') as string;
    const amountUnit = formData.get('productAmountUnit') as string;
    const priceTl = Number(formData.get('productPriceTl'));
    const priceTlMicroTemp = Number(formData.get('productPriceTlMicro'));
    const priceDollar = Number(formData.get('productPriceDollar'));
    const priceDollarMicroTemp = Number(formData.get('productPriceDollarMicro'));
    if (!name || !shortName || !amountUnit || isNaN(priceTl) || isNaN(priceTlMicroTemp) || isNaN(priceDollar) || isNaN(priceDollarMicroTemp)) {
      alert('Ürün bilgileri eksik');
      return;
    }
    const paddedTlMicro = priceTlMicroTemp.toString().padEnd(6, '0');
    const paddedDollarMicro = priceDollarMicroTemp.toString().padEnd(6, '0');
    const priceTlMicro = Number(priceTl + "" + paddedTlMicro);
    const priceDollarMicro = Number(priceDollar + "" + paddedDollarMicro);
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
        .then((newProducts) => setProducts(newProducts))
        .catch((err) => alert('Ürün ekleme hatası: ' + err));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Basit Person Uygulaması (.then zinciri ile)</h1>
      <form ref={addUserRef} onSubmit={handleAddUser}>
        <input name="personId" type="text" placeholder="Id girin" />
        <input name="personName" type="text" placeholder="İsim girin" />
        <button type="submit">Ekle</button>
      </form>
      {loading ? <div>Yükleniyor...</div> : (
        <ul>
          {persons.map(p => <li key={p.id}>{p.id} — {p.name}</li>)}
        </ul>
      )}
      <h2>Ürünler</h2>
      <form ref={addProductRef} onSubmit={handleAddProduct}>
        <input name="productId" type="text" placeholder="Id girin" />
        <input name="productName" type="text" placeholder="Ürün adı" />
        <input name="productShortName" type="text" placeholder="Kısa isim" />
        <input name="productAmountUnit" type="text" placeholder="Miktar birimi" />
        <input name="productPriceTl" type="number" placeholder="Fiyat (TL)" />
        <input name="productPriceTlMicro" type="text" placeholder="Fiyat (Kuruş)" maxLength={6}/>
        <input name="productPriceDollar" type="number" placeholder="Fiyat (USD)" />
        <input name="productPriceDollarMicro" type="text" placeholder="Fiyat (Cent)" maxLength={6}/>
        <button type="submit">Ürün Ekle</button>
      </form>
      <ul>
        {products.map(p => <li key={p.id}>{p.id} — {p.name} — {p.shortName} — {p.amountUnit} — {p.priceTlMicro} TL / {p.priceDollarMicro} USD</li>)}
      </ul>

    </div>
  );
}

export default App
