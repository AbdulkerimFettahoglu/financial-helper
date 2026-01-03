import React, { useEffect, useState } from 'react';
import './PersonDock.css';
import type { Person } from '../models';
import { PersonService } from '../personService';
import { db } from '../db';
import PersonModal from './PersonModal';
import { useAppDispatch } from '../store';
import { setSelectedPerson } from '../store/selectedPersonSlice';

export default function PersonDock() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);

    const personService = new PersonService(db);
    const dispatch = useAppDispatch();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        personService.getAllPersons()
            .then(arr => { if (mounted) setPersons(arr); })
            .catch(err => console.error('Person yükleme hatası:', err))
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const refresh = () => {
        setLoading(true);
        personService.getAllPersons()
            .then(arr => setPersons(arr))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const openCreate = () => {
        setEditingPerson(null);
        setModalOpen(true);
    };

    const openEdit = (p: Person) => {
        setEditingPerson(p);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingPerson(null);
    };

    const handleSave = async (vals: { id?: number; name: string }) => {
        if (vals.id) {
            await personService.updatePersonPartial(vals.id, { name: vals.name });
        } else {
            await personService.createPersonRecord(vals.name);
        }
        refresh();
    };

    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Kişiyi silmek istediğinize emin misiniz?')) return;
        personService.deletePersonById(id)
            .then(() => refresh())
            .catch(err => alert('Silme hatası: ' + err));
    };

    const handleSelect = (p: Person) => {
        dispatch(setSelectedPerson(p));
    };

    // PersonModal içinden seçildiğinde (onSelect) çalışacak handler
    const handleSelectFromModal = (p: { id?: number; name: string }) => {
        dispatch(setSelectedPerson({ id: p.id, name: p.name } as Person));
    };

    return (
        <div className={`person-dock ${collapsed ? 'collapsed' : ''}`} aria-expanded={!collapsed}>
            <div className="person-header d-flex align-items-center justify-content-between px-3">
                <div className="fw-semibold">Persons</div>
                <button className="btn btn-sm btn-light" onClick={() => setCollapsed(c => !c)} aria-label="toggle">
                    {collapsed ? '▸' : '◂'}
                </button>
            </div>

            <div className="person-list p-3">
                <div className="d-grid gap-2">
                    <button className="btn btn-success rounded-pill" onClick={openCreate}>+ Yeni Kişi</button>

                    {loading ? (
                        <div className="text-muted small">Yükleniyor...</div>
                    ) : persons.length === 0 ? (
                        <div className="text-muted small">Kayıt yok</div>
                    ) : (
                        persons.map(p => (
                            <div key={p.id} className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-secondary rounded-pill flex-grow-1 text-truncate person-item"
                                    onClick={() => openEdit(p)}
                                    title={p.name}
                                >
                                    {p.name}
                                </button>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleSelect(p)} title="Seç">✓</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)} title="Sil">×</button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <PersonModal
                show={modalOpen}
                initial={editingPerson}
                onClose={closeModal}
                onSubmit={handleSave}
                onSelect={(p) => { handleSelectFromModal(p); closeModal(); }}
            />
        </div>
    );
}