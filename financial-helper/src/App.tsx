import { useState, useEffect, useRef } from 'react'
import './App.css'
import { db } from './db'
import type { Person } from './models';
import { PersonService } from './personService';
import ProductDock from './components/ProductDock';
import PersonDock from './components/PersonDock';

function App() {
  const [loading, setLoading] = useState(true);
  const personService = new PersonService(db);
  const [persons, setPersons] = useState<Person[]>([]);
  const addUserRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setLoading(true);
    personService.getAllPersons()
      .then((arr) => setPersons(arr))
      .catch((err) => alert('DB hata:' + err))
      .finally(() => setLoading(false));
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

  return (
    <div>
      {/* Sol tarafta sabit Person menü */}
      <PersonDock />

      {/* Ana içerik: left sidebar genişliği kadar margin-left veriyoruz */}
      <div style={{ marginLeft: 260, padding: 20 }}>
        <h1>Basit Person Uygulaması</h1>

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

        <hr style={{ margin: '20px 0' }} />

        {/* Ürün dock bileşeni - sayfanın sol alt köşesinde (önden eklediğimiz) */}
        <ProductDock />
      </div>
    </div>
  );
}

export default App