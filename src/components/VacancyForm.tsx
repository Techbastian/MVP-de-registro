'use client';

import { useState, useEffect } from 'react';
import {
    Briefcase,
    CloudUpload,
    ArrowRight,
    Building2,
    MapPin,
    Calendar,
    Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface VacancyFormProps {
    initialData?: any;
    id?: string;
}

export default function VacancyForm({ initialData, id }: VacancyFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        razonSocial: initialData?.razon_social || '',
        nit: initialData?.nit || '',
        nombreVacante: initialData?.nombre_vacante || '',
        descripcion: initialData?.descripcion || '',
        municipio: initialData?.municipio || '',
        numVacantes: initialData?.num_vacantes?.toString() || '',
        salario: initialData?.salario || '',
        fechaLimite: initialData?.fecha_limite || ''
    });

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                razonSocial: initialData.razon_social || '',
                nit: initialData.nit || '',
                nombreVacante: initialData.nombre_vacante || '',
                descripcion: initialData.descripcion || '',
                municipio: initialData.municipio || '',
                numVacantes: initialData.num_vacantes?.toString() || '',
                salario: initialData.salario || '',
                fechaLimite: initialData.fecha_limite || ''
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['razonSocial', 'nit', 'nombreVacante', 'municipio', 'numVacantes', 'salario', 'fechaLimite'];
        const missing = requiredFields.filter(f => !formData[f as keyof typeof formData]);

        if (missing.length > 0) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (id) {
                // Update mode
                let response;
                if (file) {
                    const data = new FormData();
                    Object.entries(formData).forEach(([key, value]) => {
                        data.append(key, value);
                    });
                    data.append('soporte', file);

                    response = await fetch(`/api/vacancies/${id}`, {
                        method: 'PATCH',
                        body: data,
                    });
                } else {
                    response = await fetch(`/api/vacancies/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razon_social: formData.razonSocial,
                            nit: formData.nit,
                            nombre_vacante: formData.nombreVacante,
                            descripcion: formData.descripcion,
                            municipio: formData.municipio,
                            num_vacantes: parseInt(formData.numVacantes, 10),
                            salario: formData.salario,
                            fecha_limite: formData.fechaLimite,
                        }),
                    });
                }

                if (response.ok) {
                    alert("Vacante actualizada exitosamente!");
                    router.push('/vacancies');
                } else {
                    const result = await response.json();
                    alert(`Error: ${result.error || 'Algo salió mal'}`);
                }
            } else {
                // Create mode
                const data = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    data.append(key, value);
                });
                if (file) data.append('soporte', file);

                const response = await fetch('/api/vacancies', {
                    method: 'POST',
                    body: data,
                });

                if (response.ok) {
                    alert("Vacante registrada exitosamente!");
                    router.push('/vacancies');
                } else {
                    const result = await response.json();
                    alert(`Error: ${result.error || 'Algo salió mal'}`);
                }
            }
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error al enviar el formulario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Form layout precisely as before, but wrapped in a component */}
            <div className="form-card">
                <h2 className="section-title"><Building2 size={20} /> Business Identity</h2>
                <div className="form-grid">
                    <div className="input-group">
                        <label>Business Name (Razón Social) *</label>
                        <input type="text" name="razonSocial" className="form-input" placeholder="e.g. Disruptia Technologies S.A.S" value={formData.razonSocial} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>NIT (Tax ID) *</label>
                        <input type="text" name="nit" className="form-input" placeholder="e.g. 900.123.456-7" value={formData.nit} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                </div>
            </div>

            <div className="form-card">
                <h2 className="section-title"><Briefcase size={20} /> Vacancy Details</h2>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Vacancy Name *</label>
                    <input type="text" name="nombreVacante" className="form-input" placeholder="e.g. Senior Frontend Developer" value={formData.nombreVacante} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Description & Requirements *</label>
                    <textarea name="descripcion" className="form-input" rows={6} placeholder="Describe the role..." style={{ resize: 'vertical' }} value={formData.descripcion} onChange={handleInputChange} disabled={isSubmitting}></textarea>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{formData.descripcion.length} / 2000 characters</div>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr' }}>
                    <div className="input-group">
                        <label>Municipality / City *</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" name="municipio" className="form-input" placeholder="e.g. Medellín" style={{ paddingLeft: '36px' }} value={formData.municipio} onChange={handleInputChange} disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Openings *</label>
                        <input type="number" name="numVacantes" className="form-input" placeholder="1" value={formData.numVacantes} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                    <div className="input-group">
                        <label>Monthly Salary *</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>$</span>
                            <input type="text" name="salario" className="form-input" placeholder="0.00" style={{ paddingLeft: '24px' }} value={formData.salario} onChange={handleInputChange} disabled={isSubmitting} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-grid">
                <div className="form-card">
                    <h2 className="section-title"><Calendar size={20} /> Timeline</h2>
                    <div className="input-group">
                        <label>Application Deadline *</label>
                        <input type="date" name="fechaLimite" className="form-input" value={formData.fechaLimite} onChange={handleInputChange} disabled={isSubmitting} />
                    </div>
                </div>
                <div className="form-card">
                    <h2 className="section-title"><Paperclip size={20} /> Documentation</h2>
                    <div className={`upload-area ${isDragging ? 'dragging' : ''}`} style={{ padding: '1.5rem', minHeight: 'auto' }} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => !isSubmitting && document.getElementById('soporte-upload')?.click()}>
                        <input type="file" id="soporte-upload" style={{ display: 'none' }} onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf" disabled={isSubmitting} />
                        <CloudUpload size={24} style={{ color: 'var(--primary-purple)' }} />
                        <p className="upload-text" style={{ fontSize: '0.9rem' }}>{file ? file.name : (id ? 'Update Alliance Support (Optional)' : 'Upload Alliance Support')}</p>
                        <p className="upload-subtext" style={{ fontSize: '0.75rem' }}>PDF only (Max 10MB)</p>
                    </div>
                </div>
            </div>

            <div className="submit-container">
                <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (id ? 'Update Vacancy' : 'Publish Vacancy')}
                    {!isSubmitting && <ArrowRight size={20} />}
                </button>
            </div>

            <style jsx>{`
                .upload-area.dragging {
                    border-color: var(--primary-purple);
                    background-color: var(--primary-light);
                }
            `}</style>
        </div>
    );
}
