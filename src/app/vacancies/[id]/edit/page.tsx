'use client';

import { useState, useEffect } from 'react';
import VacancyForm from '@/components/VacancyForm';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditVacancyPage() {
    const { id } = useParams();
    const [vacancy, setVacancy] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                // We'll need a GET endpoint for a single vacancy or just fetch all and find
                // Better to add GET to [id]/route.ts
                const res = await fetch(`/api/vacancies`);
                const data = await res.json();
                const found = data.find((v: any) => v.id === id);
                setVacancy(found);
            } catch (error) {
                console.error("Error fetching vacancy:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchVacancy();
    }, [id]);

    if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando datos de la vacante...</div>;
    if (!vacancy) return <div style={{ padding: '3rem', textAlign: 'center' }}>Vacante no encontrada.</div>;

    return (
        <>
            <header className="page-header">
                <div>
                    <div className="breadcrumbs">
                        <Link href="/">Home</Link> &nbsp;›&nbsp;
                        <Link href="/vacancies">Vacancies</Link> &nbsp;›&nbsp;
                        <span style={{ color: 'var(--primary-purple)', fontWeight: 600 }}>Edit Vacancy</span>
                    </div>
                    <h1 className="page-title">Edit Vacancy: {vacancy.nombre_vacante}</h1>
                    <p className="page-subtitle">Update the information for this job opening.</p>
                </div>
            </header>

            <VacancyForm initialData={vacancy} id={id as string} />

            <style jsx>{`
                .breadcrumbs a {
                    text-decoration: none;
                    color: var(--text-secondary);
                }
                .breadcrumbs a:hover {
                    color: var(--primary-purple);
                }
            `}</style>
        </>
    );
}
