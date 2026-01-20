
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Download,
    Bell,
    Pencil,
    FileText,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Loader2,
    Plus,
    UserPlus
} from 'lucide-react';

interface Applicant {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    celular?: string;
    url_hv?: string;
    fecha_registro: string;
    status?: string;
    role?: string;
    experiencia?: any[];
}

export default function RecordsPage() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/applicants');
            if (response.ok) {
                const data = await response.json();
                setApplicants(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch applicants');
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string, surname?: string) => {
        const n = name ? name.charAt(0) : '';
        const s = surname ? surname.charAt(0) : '';
        return `${n}${s}`.toUpperCase() || '?';
    };

    const filteredApplicants = applicants.filter(app => {
        const searchLow = searchTerm.toLowerCase();
        const nombre = (app.nombre || '').toLowerCase();
        const apellido = (app.apellido || '').toLowerCase();
        const documento = (app.documento || '').toLowerCase();

        return nombre.includes(searchLow) ||
            apellido.includes(searchLow) ||
            documento.includes(searchLow);
    });

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Talent Records</h1>
                    <p className="page-subtitle">
                        {loading ? 'Updating pipeline...' : `Viewing ${filteredApplicants.length} registered candidates in the pipeline`}
                    </p>
                </div>
                <div className="header-actions">
                    <Link href="/applicants/new" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem' }}>
                        <UserPlus size={18} />
                        Registrar Nuevo
                    </Link>
                    <button className="icon-btn">
                        <Bell size={20} />
                    </button>
                    <button className="icon-btn" style={{ border: 'none', padding: 0 }}>
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=E5E7EB&color=6B7280"
                            className="avatar"
                            style={{ width: 40, height: 40 }}
                            alt="User"
                        />
                    </button>
                </div>
            </header>

            {/* Controls */}
            <div className="controls-bar">
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, document ID, or expertise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-outline">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button className="btn-outline" onClick={fetchApplicants}>
                        <Download size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <div className="tab-pill active">
                    All Candidates <span className="tab-count">{filteredApplicants.length}</span>
                </div>
            </div>

            {/* List */}
            <div className="records-list">
                <div className="list-header">
                    <div>Candidate Name</div>
                    <div>Document ID</div>
                    <div>Registration Date</div>
                    <div>Status</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                        <p>Loading talent records...</p>
                    </div>
                ) : filteredApplicants.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No candidates found in the database.</p>
                    </div>
                ) : (
                    filteredApplicants.map(applicant => (
                        <div
                            key={applicant.id}
                            className={`candidate-item ${expandedId === applicant.id ? 'expanded' : ''}`}
                        >
                            <div className="candidate-row" onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)}>
                                <div className="candidate-info">
                                    <div className="initials-avatar">
                                        {getInitials(applicant.nombre, applicant.apellido)}
                                    </div>
                                    <div className="candidate-name">
                                        <h4>{applicant.nombre} {applicant.apellido}</h4>
                                        <span>{applicant.role || 'New Applicant'}</span>
                                    </div>
                                </div>
                                <div style={{ fontFamily: 'monospace', color: '#4B5563' }}>{applicant.documento || 'N/A'}</div>
                                <div>{applicant.fecha_registro || 'N/A'}</div>
                                <div>
                                    <span className={`status-badge status-${(applicant.status || 'pending').toLowerCase()}`}>
                                        {applicant.status || 'Active'}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {expandedId === applicant.id ? (
                                        <div className="d-flex align-center gap-2" style={{ justifyContent: 'flex-end' }}>
                                            <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                <Pencil size={14} /> Edit
                                            </button>
                                            {applicant.url_hv && (
                                                <a
                                                    href={applicant.url_hv}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', boxShadow: 'none', textDecoration: 'none' }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <FileText size={14} /> Open CV
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="action-link">View Details</span>
                                    )}
                                </div>
                            </div>

                            {expandedId === applicant.id && (
                                <div className="expanded-content">
                                    <div className="expanded-grid">
                                        <div className="summary-card">
                                            <h5 style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                                Candidate Summary
                                            </h5>

                                            <div className="summary-details">
                                                <div className="detail-group">
                                                    <h6 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Celular</h6>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{applicant.celular || 'N/A'}</p>
                                                </div>
                                                <div className="detail-group">
                                                    <h6 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Status</h6>
                                                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{applicant.status || 'Active'}</p>
                                                </div>
                                            </div>

                                            {/* Detailed Work Experience */}
                                            {applicant.experiencia && applicant.experiencia.length > 0 ? (
                                                <div className="experience-list-detailed" style={{ marginTop: '1.5rem', borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
                                                    <h6 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase' }}>Historial Profesional</h6>
                                                    {applicant.experiencia.map((exp: any, idx: number) => (
                                                        <div key={idx} style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.cargo}</span>
                                                                <span className="step-pill" style={{ fontSize: '0.65rem' }}>{exp.tipo}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.8rem', color: 'var(--primary-purple)', fontWeight: 500, marginBottom: '0.5rem' }}>{exp.empresa}</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                                {exp.fechaInicio} - {exp.actualmente ? 'Actualidad' : exp.fechaFin}
                                                            </p>
                                                            {exp.descripcion && (
                                                                <p style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: '1.4', fontStyle: 'italic' }}>
                                                                    "{exp.descripcion}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="internal-note">
                                                    No additional work experience provided.
                                                </div>
                                            )}
                                        </div>

                                        <div className="cv-card">
                                            <div className="cv-preview-content">
                                                <FileText size={48} color="var(--primary-purple)" />
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Curriculum Vitae</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Link to Google Drive</p>
                                                </div>
                                                {applicant.url_hv && (
                                                    <a href={applicant.url_hv} target="_blank" rel="noopener noreferrer" className="action-link" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>
                                                        View in Drive
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
