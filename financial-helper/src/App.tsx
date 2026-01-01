import { useState, useEffect } from 'react'
import './App.css'
import { db } from './db'
import type { Person } from './models';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    db.open()
      .then(() => db.createPersonRecord(name))
      .then(() => db.Persons.toArray())
      .then((arr) => setPeople(arr))
      .catch((err) => alert('DB hata:' + err))
      .finally(() => {
        form.reset();
        setLoading(false);
      });
  }

return (
  <div style={{ padding: 20 }}>
    <form onSubmit={handleAddUser}>
      <input type="text" name="name" placeholder="Name" />
      <button type="submit">Add User</button>
    </form>
    <h1>Basit Person Uygulaması (.then zinciri ile)</h1>
    {loading ? <div>Yükleniyor...</div> : (
      <ul>
        {people.map(p => <li key={p.id}>{p.id} — {p.name}</li>)}
      </ul>
    )}
  </div>
);
}

export default App
