import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { Person } from '../models';

type FormValues = {
    id?: number;
    name: string;
};

export default function PersonModal({
    show,
    initial,
    onClose,
    onSubmit,
    onSelect
}: {
    show: boolean;
    initial?: Person | null;
    onClose: () => void;
    onSubmit: (values: FormValues) => Promise<void>;
    onSelect?: (p: { id?: number; name: string }) => void;
}) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) {
            setName(initial.name || '');
        } else {
            setName('');
        }
    }, [initial, show]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!name.trim()) {
            alert('İsim gerekli');
            return;
        }
        setSaving(true);
        try {
            await onSubmit({ id: initial?.id, name: name.trim() });
            onClose();
        } catch (err) {
            console.error('Person kaydetme hatası', err);
            alert('Kaydetme sırasında hata: ' + String(err));
        } finally {
            setSaving(false);
        }
    };

    const handleSelectClick = () => {
        if (!name.trim()) return;
        if (onSelect) {
            onSelect({ id: initial?.id, name: name.trim() });
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{initial ? 'Kişiyi Güncelle' : 'Yeni Kişi'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2">
                        <Form.Label className="small">İsim</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="İsim girin"
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => { handleSelectClick(); onClose(); }} disabled={!name.trim()}>
                        Kişiyi Seç
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={saving}>Kapat</Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}