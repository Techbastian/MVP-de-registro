'use client';

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen font-body transition-colors duration-200" style={{ margin: '-2rem -3rem', padding: '2rem 3rem' }}>
            {/* Main Content */}
            <main className="layout-container max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-text-light dark:text-white text-3xl md:text-4xl font-extrabold font-display tracking-tight leading-tight">
                            Bienvenido, Admin 👋
                        </h1>
                        <p className="text-[#796189] dark:text-[#aea0b8] text-base font-normal">
                            Tu panel de control para la gestión estratégica de talento.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#796189] dark:text-[#aea0b8] bg-white dark:bg-[#1a151f] px-4 py-2 rounded-lg border border-[#f3f0f4] dark:border-[#382e42] shadow-sm">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        <span>Oct 24, 2023</span>
                    </div>
                </div>

                {/* Bento Box Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card 1 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#B799E2] to-[#9271c4] dark:from-[#690dab] dark:to-[#4a097a] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined" style={{ fontSize: '140px', color: 'white' }}>groups</span>
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="material-symbols-outlined">person_search</span>
                                <p className="text-sm font-semibold uppercase tracking-wider font-body">Candidatos</p>
                            </div>
                            <div>
                                <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">1,240</p>
                                <p className="text-white/80 text-sm mt-1 font-medium">Registrados esta semana</p>
                            </div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#A16ECF] to-[#8046b5] dark:from-[#560a8c] dark:to-[#3b0761] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined" style={{ fontSize: '140px', color: 'white' }}>work</span>
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="material-symbols-outlined">campaign</span>
                                <p className="text-sm font-semibold uppercase tracking-wider font-body">Vacantes</p>
                            </div>
                            <div>
                                <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">85</p>
                                <p className="text-white/80 text-sm mt-1 font-medium">Activas actualmente</p>
                            </div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#9C61A8] to-[#7a4685] dark:from-[#3e085c] dark:to-[#2a053d] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined" style={{ fontSize: '140px', color: 'white' }}>domain</span>
                        </div>
                        <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="material-symbols-outlined">handshake</span>
                                <p className="text-sm font-semibold uppercase tracking-wider font-body">Aliados</p>
                            </div>
                            <div>
                                <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">42</p>
                                <p className="text-white/80 text-sm mt-1 font-medium">Empresas conectadas</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Actions Section */}
                <section className="mb-10">
                    <h2 className="text-text-light dark:text-white text-xl font-bold font-display tracking-tight mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Action 1: Register Talent */}
                        <Link href="/applicants/new" className="group flex items-center justify-between p-6 bg-white dark:bg-[#1a151f] rounded-xl border border-[#e5deeb] dark:border-[#382e42] shadow-card hover:border-primary hover:shadow-soft transition-all duration-200 no-underline text-left">
                            <div className="flex items-center gap-5">
                                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                                    <span className="material-symbols-outlined text-3xl">person_add</span>
                                </div>
                                <div>
                                    <h3 className="text-text-light dark:text-white text-lg font-bold font-display">Registrar Talento</h3>
                                    <p className="text-[#796189] dark:text-[#aea0b8] text-sm mt-1">Añade nuevos perfiles a la base de datos</p>
                                </div>
                            </div>
                            <div className="size-10 rounded-full bg-[#fbfaf9] dark:bg-[#261f2e] flex items-center justify-center text-[#796189] group-hover:translate-x-1 transition-transform">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </Link>
                        {/* Action 2: Manage Vacancies */}
                        <Link href="/vacancies" className="group flex items-center justify-between p-6 bg-white dark:bg-[#1a151f] rounded-xl border border-[#e5deeb] dark:border-[#382e42] shadow-card hover:border-primary-medium hover:shadow-soft transition-all duration-200 no-underline text-left">
                            <div className="flex items-center gap-5">
                                <div className="size-14 rounded-full bg-[#fbfaf9] dark:bg-[#261f2e] flex items-center justify-center text-[#645c6e] dark:text-[#a09aa6] group-hover:bg-primary-medium group-hover:text-white transition-colors duration-200">
                                    <span className="material-symbols-outlined text-3xl">edit_document</span>
                                </div>
                                <div>
                                    <h3 className="text-text-light dark:text-white text-lg font-bold font-display">Gestionar Vacantes</h3>
                                    <p className="text-[#796189] dark:text-[#aea0b8] text-sm mt-1">Revisa y edita las ofertas activas</p>
                                </div>
                            </div>
                            <div className="size-10 rounded-full bg-[#fbfaf9] dark:bg-[#261f2e] flex items-center justify-center text-[#796189] group-hover:translate-x-1 transition-transform">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Recent Activity Table */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-text-light dark:text-white text-xl font-bold font-display tracking-tight">Actividad Reciente</h2>
                        <a className="text-primary text-sm font-semibold hover:underline" href="#">Ver todo</a>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-[#f3f0f4] dark:border-[#382e42] bg-white dark:bg-[#1a151f] shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#fbfaf9] dark:bg-[#261f2e] text-[#645c6e] dark:text-[#a09aa6] uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4" scope="col">Usuario</th>
                                        <th className="px-6 py-4" scope="col">Acción</th>
                                        <th className="px-6 py-4" scope="col">Fecha</th>
                                        <th className="px-6 py-4 text-right" scope="col">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f3f0f4] dark:divide-[#382e42]">
                                    <tr className="hover:bg-gray-50 dark:hover:bg-[#201926] transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-light dark:text-white flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">JP</div>
                                            Juan Perez
                                        </td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Aplicó a "Desarrollador Senior"</td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Hace 2 horas</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Nuevo</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-[#201926] transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-light dark:text-white flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs">MT</div>
                                            Maria Torres
                                        </td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Actualizó su perfil</td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Hace 5 horas</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-gray-700/30 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/30">Revisado</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 dark:hover:bg-[#201926] transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-light dark:text-white flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 flex items-center justify-center font-bold text-xs">TC</div>
                                            Tech Corp
                                        </td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Publicó nueva vacante</td>
                                        <td className="px-6 py-4 text-[#645c6e] dark:text-[#a09aa6]">Ayer</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10">Activo</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
