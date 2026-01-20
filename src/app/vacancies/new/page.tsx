'use client';

import VacancyForm from '@/components/VacancyForm';
import Link from 'next/link';

export default function NewVacancyPage() {
    return (
        <>
            <header className="page-header">
                <div>
                    <div className="breadcrumbs">
                        <Link href="/">Home</Link> &nbsp;›&nbsp;
                        <Link href="/vacancies">Vacancies</Link> &nbsp;›&nbsp;
                        <span style={{ color: 'var(--primary-purple)', fontWeight: 600 }}>Create New</span>
                    </div>
                    <h1 className="page-title">Create New Vacancy</h1>
                    <p className="page-subtitle">Fill in the detailed information below to publish a new job opening for the alliance network.</p>
                </div>
            </header>

            <VacancyForm />

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
