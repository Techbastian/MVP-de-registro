'use client';

import { useState, useEffect } from 'react';
import {
    Briefcase,
    Search,
    MapPin,
    Filter,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Building2,
    Calendar,
    DollarSign,
    RefreshCw,
    X,
    FileText,
    ExternalLink,
    Users
} from 'lucide-react';
import Link from 'next/link';

interface Vacancy {
    id: string;
    razon_social: string;
    nit: string;
    nombre_vacante: string;
    descripcion: string;
    municipio: string;
    num_vacantes: number;
    salario: string;
    fecha_limite: string;
    status: string;
    url_soporte?: string;
}

export default function VacanciesListPage() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

    const fetchVacancies = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/vacancies');
            const data = await res.json();
            if (res.ok) {
                setVacancies(data);
            }
        } catch (error) {
            console.error("Error fetching vacancies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVacancies();
    }, []);

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
        try {
            const res = await fetch(`/api/vacancies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setVacancies(vacancies.map(v => v.id === id ? { ...v, status: newStatus } : v));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
        setActiveMenu(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de que desea eliminar esta vacante?")) return;

        try {
            const res = await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVacancies(vacancies.filter(v => v.id !== id));
            }
        } catch (error) {
            console.error("Error deleting vacancy:", error);
        }
        setActiveMenu(null);
    };

    const filteredVacancies = vacancies.filter(v => {
        const matchesSearch = v.nombre_vacante.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.razon_social.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = cityFilter === '' || v.municipio === cityFilter;
        return matchesSearch && matchesCity;
    });

    const cities = Array.from(new Set(vacancies.map(v => v.municipio))).filter(Boolean);

    return (
        <>
            <header className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <div className="breadcrumbs">Dashboard &nbsp;›&nbsp; <span style={{ color: 'var(--primary-purple)', fontWeight: 600 }}>Vacancies</span></div>
                    <h1 className="page-title">Registered Vacancies</h1>
                    <div className="d-flex align-center gap-2" style={{ marginTop: '0.5rem' }}>
                        <span className="status-badge status-active">LIVE</span>
                        <p className="page-subtitle" style={{ margin: 0 }}>{vacancies.filter(v => v.status === 'Open').length} Active Vacancies open for applications</p>
                    </div>
                </div>
                <div className="header-actions">
                    <Link href="/vacancies/new" className="btn-primary" style={{ textDecoration: 'none' }}>
                        <Plus size={20} />
                        Create New Vacancy
                    </Link>
                </div>
            </header>

            {/* Filters */}
            <div className="form-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="d-flex gap-2 align-center" style={{ flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ flex: 2, minWidth: '300px' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Filter by vacancy name, company or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="btn-outline"
                        style={{ padding: '0.75rem', height: '42.5px' }}
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <button className="btn-outline" onClick={() => { setSearchTerm(''); setCityFilter(''); }}>
                        <RefreshCw size={18} />
                        Reset
                    </button>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando vacantes...</div>
            ) : (
                <div className="vacancies-grid">
                    {filteredVacancies.map((vacancy) => (
                        <div key={vacancy.id} className="vacancy-card">
                            <div className="card-header">
                                <div className="card-logo">
                                    <Building2 size={24} color="white" />
                                </div>
                                <div className="card-status">
                                    <span className={`status-badge ${vacancy.status === 'Open' ? 'status-active' : 'status-pending'}`}>
                                        {vacancy.status === 'Open' ? 'Active' : 'Closed'}
                                    </span>
                                </div>
                                <div className="card-actions-wrapper">
                                    <button
                                        className="icon-btn-small"
                                        onClick={() => setActiveMenu(activeMenu === vacancy.id ? null : vacancy.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenu === vacancy.id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => handleStatusToggle(vacancy.id, vacancy.status)}>
                                                {vacancy.status === 'Open' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                                {vacancy.status === 'Open' ? 'Close Vacancy' : 'Reopen Vacancy'}
                                            </button>
                                            <Link href={`/vacancies/${vacancy.id}/edit`} style={{ textDecoration: 'none', width: '100%' }}>
                                                <button style={{ padding: '0.75rem 1rem', width: '100%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)' }}>
                                                    <Edit2 size={14} />
                                                    Edit Details
                                                </button>
                                            </Link>
                                            <button onClick={() => handleDelete(vacancy.id)} style={{ color: 'var(--danger)' }}>
                                                <Trash2 size={14} />
                                                Delete Permanent
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="vacancy-title">{vacancy.nombre_vacante}</h3>
                                <p className="vacancy-company">{vacancy.razon_social}</p>

                                <div className="vacancy-meta">
                                    <div className="meta-item">
                                        <MapPin size={14} />
                                        {vacancy.municipio}
                                    </div>
                                    <div className="meta-item">
                                        <DollarSign size={14} />
                                        {vacancy.salario}
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        Deadline: {new Date(vacancy.fecha_limite).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <button className="btn-view-details" onClick={() => setSelectedVacancy(vacancy)}>
                                    View Details
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredVacancies.length === 0 && !isLoading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No se encontraron vacantes con los filtros seleccionados.
                </div>
            )}

            {/* Detail Overlay / Modal */}
            {selectedVacancy && (
                <div className="modal-overlay" onClick={() => setSelectedVacancy(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedVacancy(null)}>
                            <X size={24} />
                        </button>

                        <div className="modal-header-section">
                            <div className="card-logo" style={{ width: '64px', height: '64px' }}>
                                <Building2 size={32} color="white" />
                            </div>
                            <div>
                                <h2 className="vacancy-title" style={{ fontSize: '1.75rem' }}>{selectedVacancy.nombre_vacante}</h2>
                                <p className="vacancy-company" style={{ fontSize: '1.1rem' }}>{selectedVacancy.razon_social} • NIT {selectedVacancy.nit}</p>
                            </div>
                        </div>

                        <div className="modal-body-grid">
                            <div className="main-info">
                                <h3 className="section-subtitle">Descripción y Requisitos</h3>
                                <div className="description-text">
                                    {selectedVacancy.descripcion.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="side-info">
                                <h3 className="section-subtitle">Detalles Rápidos</h3>
                                <div className="vacancy-meta-extended">
                                    <div className="meta-row">
                                        <MapPin size={18} />
                                        <span><strong>Ubicación:</strong> {selectedVacancy.municipio}</span>
                                    </div>
                                    <div className="meta-row">
                                        <Users size={18} />
                                        <span><strong>Vacantes:</strong> {selectedVacancy.num_vacantes} disponibles</span>
                                    </div>
                                    <div className="meta-row">
                                        <DollarSign size={18} />
                                        <span><strong>Salario:</strong> {selectedVacancy.salario}</span>
                                    </div>
                                    <div className="meta-row">
                                        <Calendar size={18} />
                                        <span><strong>Límite:</strong> {new Date(selectedVacancy.fecha_limite).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <h3 className="section-subtitle" style={{ marginTop: '2rem' }}>Soporte de Alianza</h3>
                                {selectedVacancy.url_soporte ? (
                                    <div className="document-preview-card" onClick={() => window.open(selectedVacancy.url_soporte, '_blank')}>
                                        <div className="doc-icon">
                                            <FileText size={32} />
                                        </div>
                                        <div className="doc-info">
                                            <p className="doc-name">Soporte_Alianza.pdf</p>
                                            <p className="doc-action">Click para ver completo <ExternalLink size={12} /></p>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No se adjuntó soporte.</p>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Link href={`/vacancies/${selectedVacancy.id}/edit`} className="btn-outline" style={{ textDecoration: 'none' }}>
                                <Edit2 size={18} />
                                Editar Vacante
                            </Link>
                            <button className="btn-primary" onClick={() => setSelectedVacancy(null)}>
                                Cerrar Detalles
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .vacancies-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .vacancy-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    padding: 1.5rem;
                    transition: all 0.2s;
                    position: relative;
                }
                .vacancy-card:hover {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    transform: translateY(-4px);
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.25rem;
                    position: relative;
                }
                .card-logo {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card-actions-wrapper {
                    position: relative;
                }
                .icon-btn-small {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                }
                .icon-btn-small:hover {
                    background: #F3F4F6;
                }
                .dropdown-menu {
                    position: absolute;
                    right: 0;
                    top: 100%;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    z-index: 20;
                    width: 180px;
                    overflow: hidden;
                    margin-top: 4px;
                }
                .dropdown-menu button {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    text-align: left;
                    color: var(--text-main);
                }
                .dropdown-menu button:hover {
                    background: #F9FAFB;
                }
                .vacancy-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                    font-family: var(--font-heading);
                }
                .vacancy-company {
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    margin-bottom: 1.25rem;
                }
                .vacancy-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }
                .card-footer {
                    border-top: 1px solid var(--border-color);
                    padding-top: 1.25rem;
                }
                .btn-view-details {
                    width: 100%;
                    background: white;
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    padding: 0.75rem;
                    font-family: var(--font-heading);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-main);
                }
                .btn-view-details:hover {
                    border-color: var(--primary-purple);
                    color: var(--primary-purple);
                    background: var(--primary-light);
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }
                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    border-radius: 24px;
                    padding: 2.5rem;
                    position: relative;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: #F3F4F6;
                    border: none;
                    border-radius: 50%;
                    padding: 8px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                }
                .close-btn:hover {
                    background: #E5E7EB;
                    color: var(--text-main);
                }
                .modal-header-section {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    margin-bottom: 2.5rem;
                }
                .modal-body-grid {
                    display: grid;
                    grid-template-columns: 1.8fr 1fr;
                    gap: 2.5rem;
                }
                .section-subtitle {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-secondary);
                    margin-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 0.5rem;
                    font-family: var(--font-heading);
                    font-weight: 500;
                }
                .description-text {
                    color: #374151;
                    line-height: 1.6;
                }
                .description-text p {
                    margin-bottom: 1rem;
                }
                .vacancy-meta-extended {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .meta-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: #4B5563;
                }
                .meta-row svg {
                    color: var(--primary-purple);
                }
                /* Document Preview Box */
                .document-preview-card {
                    background: #F9FAFB;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .document-preview-card:hover {
                    border-color: var(--primary-purple);
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .doc-icon {
                    background: #FEE2E2;
                    color: #DC2626;
                    padding: 10px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .doc-name {
                    font-weight: 500;
                    font-family: var(--font-heading);
                    font-size: 0.95rem;
                    margin-bottom: 2px;
                }
                .doc-action {
                    font-size: 0.75rem;
                    color: var(--primary-purple);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .modal-footer {
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
            `}</style>
        </>
    );
}
