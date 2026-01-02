import { useState, useEffect, useRef } from 'react'
import './App.css'
import { db } from './db'
import type { Person } from './models';
import { PersonService } from './personService';

function App() {
  const personService = new PersonService(db);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const addUserRef = useRef(null);

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
    </div>
  );
}

export default App
