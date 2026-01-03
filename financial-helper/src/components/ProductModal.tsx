import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import type { Product } from '../models';

type FormValues = {
    id?: number;
    name: string;
    shortName: string;
    amountUnit: string;
    priceTl: number | '';
    priceTlMicro: string;
    priceDollar: number | '';
    priceDollarMicro: string;
};

export default function ProductModal({
    show,
    initial,
    onClose,
    onSubmit,
}: {
    show: boolean;
    initial?: Product | null;
    onClose: () => void;
    onSubmit: (values: FormValues) => Promise<void>;
}) {
    const emptyValues: FormValues = {
        name: '',
        shortName: '',
        amountUnit: '',
        priceTl: '',
        priceTlMicro: '0',
        priceDollar: '',
        priceDollarMicro: '0',
    };

    const [values, setValues] = useState<FormValues>(emptyValues);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initial) {
            const splitMicro = (microNum: number | undefined) => {
                if (microNum === undefined || microNum === null) return { major: '', micro: '0' };
                const s = String(microNum);
                if (s.length <= 6) {
                    return { major: 0, micro: s.padStart(6, '0') };
                }
                const major = s.slice(0, s.length - 6);
                const micro = s.slice(-6);
                return { major: Number(major), micro };
            };
            const tl = splitMicro((initial as any).priceTlMicro);
            const usd = splitMicro((initial as any).priceDollarMicro);
            setValues({
                id: initial.id,
                name: initial.name || '',
                shortName: (initial as any).shortName || '',
                amountUnit: (initial as any).amountUnit || '',
                priceTl: tl.major === '' ? '' : (tl.major as number),
                priceTlMicro: tl.micro || '0',
                priceDollar: usd.major === '' ? '' : (usd.major as number),
                priceDollarMicro: usd.micro || '0',
            });
        } else {
            setValues(emptyValues);
        }
    }, [initial, show]);

    const handleChange = (k: keyof FormValues, v: any) => {
        setValues(prev => ({ ...prev, [k]: v }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!values.name || !values.shortName || !values.amountUnit) {
            alert('Ad, kısa ad ve miktar birimi gerekli.');
            return;
        }
        if (values.priceTl === '' || values.priceDollar === '') {
            alert('Fiyat alanları boş bırakılamaz (0 için 0 girin).');
            return;
        }
        setSaving(true);
        try {
            await onSubmit(values);
            onClose();
        } catch (err) {
            console.error('Kaydetme hatası', err);
            alert('Kaydetme sırasında hata: ' + err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered size="sm">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{values.id ? 'Ürünü Güncelle' : 'Yeni Ürün'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2">
                        <Form.Label className="small">Ad</Form.Label>
                        <Form.Control value={values.name} onChange={e => handleChange('name', e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label className="small">Kısa Ad</Form.Label>
                        <Form.Control value={values.shortName} onChange={e => handleChange('shortName', e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label className="small">Miktar Birimi</Form.Label>
                        <Form.Control value={values.amountUnit} onChange={e => handleChange('amountUnit', e.target.value)} />
                    </Form.Group>

                    <Row className="g-2">
                        <Col>
                            <Form.Group className="mb-2">
                                <Form.Label className="small">Fiyat (TL) - Tam</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={values.priceTl === '' ? '' : values.priceTl}
                                    onChange={e => handleChange('priceTl', e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" style={{ width: 120 }}>
                            <Form.Group className="mb-2">
                                <Form.Label className="small">TL Mikro (6h)</Form.Label>
                                <Form.Control
                                    value={values.priceTlMicro}
                                    onChange={e => handleChange('priceTlMicro', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="g-2">
                        <Col>
                            <Form.Group className="mb-2">
                                <Form.Label className="small">Fiyat (USD) - Tam</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={values.priceDollar === '' ? '' : values.priceDollar}
                                    onChange={e => handleChange('priceDollar', e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" style={{ width: 120 }}>
                            <Form.Group className="mb-2">
                                <Form.Label className="small">USD Mikro (6h)</Form.Label>
                                <Form.Control
                                    value={values.priceDollarMicro}
                                    onChange={e => handleChange('priceDollarMicro', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={saving}>Kapat</Button>
                    <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}